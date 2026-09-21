import crypto from "node:crypto";
import Razorpay from "razorpay";
import { getStoredSettings, type Order, updateOrder, getOrderById } from "./db";
import { sendOrderConfirmationEmail } from "./email";

export function getRazorpayClient(): {
  client: Razorpay | null;
  keyId: string;
  keySecret: string;
  webhookSecret: string;
  mode: "test" | "live";
  error?: string;
} {
  const settings = getStoredSettings();
  const rzp = settings.razorpay || {};
  const mode = (rzp.mode === "live" ? "live" : "test") as "test" | "live";
  const keyId = (rzp.key_id || process.env.RAZORPAY_KEY_ID || "").trim();
  const keySecret = (
    rzp.key_secret ||
    process.env.RAZORPAY_KEY_SECRET ||
    ""
  ).trim();
  const webhookSecret = (
    rzp.webhook_secret ||
    process.env.RAZORPAY_WEBHOOK_SECRET ||
    ""
  ).trim();

  if (!keyId || !keySecret) {
    return {
      client: null,
      keyId,
      keySecret,
      webhookSecret,
      mode,
      error:
        "Razorpay credentials (Key ID and Key Secret) are not configured in Admin Settings.",
    };
  }

  try {
    const client = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
    return { client, keyId, keySecret, webhookSecret, mode };
  } catch (err) {
    return {
      client: null,
      keyId,
      keySecret,
      webhookSecret,
      mode,
      error:
        err instanceof Error
          ? err.message
          : "Failed to initialize Razorpay client",
    };
  }
}

export async function createRazorpayOrder(params: {
  amountInRupees: number;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}): Promise<{
  success: boolean;
  razorpayOrderId?: string;
  amountInPaise?: number;
  currency?: string;
  keyId?: string;
  error?: string;
}> {
  const { client, keyId, error } = getRazorpayClient();
  if (!client) {
    return { success: false, error: error || "Razorpay is not configured" };
  }

  const amountInPaise = Math.round(params.amountInRupees * 100);

  try {
    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: params.orderNumber,
      notes: {
        order_number: params.orderNumber,
        customer_name: params.customerName,
        customer_email: params.customerEmail,
        customer_phone: params.customerPhone,
      },
    };

    const rzpOrder = await client.orders.create(options);
    return {
      success: true,
      razorpayOrderId: rzpOrder.id,
      amountInPaise: Number(rzpOrder.amount),
      currency: rzpOrder.currency,
      keyId,
    };
  } catch (err: unknown) {
    console.error("[razorpay] Error creating Razorpay order:", err);
    const errObj = err as {
      error?: { description?: string };
      message?: string;
    };
    return {
      success: false,
      error:
        errObj?.error?.description ||
        errObj?.message ||
        "Failed to create Razorpay payment order",
    };
  }
}

export async function verifyRazorpayPayment(params: {
  orderId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  baseUrl?: string;
}): Promise<{
  success: boolean;
  order?: Order;
  error?: string;
}> {
  const { client, keySecret, error } = getRazorpayClient();
  if (!keySecret) {
    return { success: false, error: error || "Razorpay key secret not found" };
  }

  // 1. Verify HMAC-SHA256 signature
  const body = `${params.razorpayOrderId}|${params.razorpayPaymentId}`;
  const expectedSignature = crypto
    .createHmac("sha256", keySecret)
    .update(body)
    .digest("hex");

  const signatureValid = expectedSignature === params.razorpaySignature;
  if (!signatureValid) {
    console.error(
      "[razorpay] Signature verification failed for order",
      params.orderId,
    );
    updateOrder(params.orderId, { payment_status: "Failed" });
    return { success: false, error: "Payment verification signature mismatch" };
  }

  // 2. Fetch payment details from Razorpay to verify capture status and payment method
  let paymentMethod = "Razorpay";
  if (client) {
    try {
      const payment = (await client.payments.fetch(
        params.razorpayPaymentId,
      )) as { status?: string; method?: string };
      if (payment.status !== "captured" && payment.status !== "authorized") {
        updateOrder(params.orderId, { payment_status: "Failed" });
        return {
          success: false,
          error: `Payment status is ${payment.status}, not captured.`,
        };
      }
      paymentMethod = payment.method
        ? payment.method.toUpperCase()
        : "Razorpay";
    } catch (fetchErr) {
      console.warn(
        "[razorpay] Could not fetch payment details from API:",
        fetchErr,
      );
    }
  }

  // 3. Update order
  const order = getOrderById(params.orderId);
  if (!order) {
    return { success: false, error: "Order not found" };
  }

  const updated = updateOrder(params.orderId, {
    payment_status: "Paid",
    status: "Confirmed",
    razorpay_payment_id: params.razorpayPaymentId,
    razorpay_signature: params.razorpaySignature,
    razorpay_payment_method: paymentMethod,
    payment_date: new Date().toISOString(),
  });

  // 4. Send Confirmation Email if not sent yet
  if (updated && !updated.confirmation_email_sent) {
    sendOrderConfirmationEmail(updated, params.baseUrl).catch((e) =>
      console.error("[razorpay] Email error:", e),
    );
  }

  return { success: true, order: updated ?? order };
}

export async function checkPaymentStatusFromRazorpay(
  orderIdOrNumber: string,
  baseUrl?: string,
): Promise<{
  payment_status: "Pending" | "Paid" | "Failed" | "Refunded";
  status: Order["status"];
  message: string;
  order?: Order;
}> {
  const order = getOrderById(orderIdOrNumber);
  if (!order) {
    return {
      payment_status: "Pending",
      status: "Payment Pending",
      message: "Order not found",
    };
  }

  if (order.payment_status === "Paid") {
    return {
      payment_status: "Paid",
      status: order.status,
      message: "Order is already paid.",
      order,
    };
  }

  if (!order.razorpay_order_id) {
    return {
      payment_status: order.payment_status,
      status: order.status,
      message: "No Razorpay order ID associated with this order.",
      order,
    };
  }

  const { client, error } = getRazorpayClient();
  if (!client) {
    return {
      payment_status: order.payment_status,
      status: order.status,
      message: error || "Razorpay client not configured.",
      order,
    };
  }

  try {
    const paymentsResult = (await client.orders.fetchPayments(
      order.razorpay_order_id,
    )) as { items?: RazorpayPaymentItem[] };
    const payments: RazorpayPaymentItem[] = paymentsResult.items || [];

    const capturedPayment = payments.find((p) => p.status === "captured");
    if (capturedPayment) {
      const updated = updateOrder(order.id, {
        payment_status: "Paid",
        status: order.status === "Payment Pending" ? "Confirmed" : order.status,
        razorpay_payment_id: capturedPayment.id,
        razorpay_payment_method: (
          capturedPayment.method || "Razorpay"
        ).toUpperCase(),
        payment_date: new Date(capturedPayment.created_at * 1000).toISOString(),
      });

      if (updated && !updated.confirmation_email_sent) {
        sendOrderConfirmationEmail(updated, baseUrl).catch((e) =>
          console.error("[razorpay] Email error on check:", e),
        );
      }

      return {
        payment_status: "Paid",
        status: updated?.status ?? "Confirmed",
        message: `Payment confirmed via Razorpay! Payment ID: ${capturedPayment.id}`,
        order: updated ?? order,
      };
    }

    const allFailed =
      payments.length > 0 && payments.every((p) => p.status === "failed");
    if (allFailed) {
      const updated = updateOrder(order.id, { payment_status: "Failed" });
      return {
        payment_status: "Failed",
        status: order.status,
        message: "Payment attempt failed on Razorpay.",
        order: updated ?? order,
      };
    }

    return {
      payment_status: "Pending",
      status: order.status,
      message: "Payment is still pending on Razorpay.",
      order,
    };
  } catch (err: unknown) {
    console.error("[razorpay] Error fetching payments for order:", err);
    return {
      payment_status: order.payment_status,
      status: order.status,
      message:
        err instanceof Error
          ? err.message
          : "Failed to verify payment with Razorpay.",
      order,
    };
  }
}

export async function handleRazorpayWebhook(
  rawBody: string,
  signature: string | null,
  baseUrl?: string,
): Promise<{ handled: boolean; message: string }> {
  const { webhookSecret } = getRazorpayClient();

  if (webhookSecret && signature) {
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBody)
      .digest("hex");

    if (expectedSignature !== signature) {
      return { handled: false, message: "Invalid webhook signature" };
    }
  }

  let event: RazorpayWebhookEvent;
  try {
    event = JSON.parse(rawBody) as RazorpayWebhookEvent;
  } catch {
    return { handled: false, message: "Invalid JSON" };
  }

  const eventName = event.event;
  console.log(`[razorpay webhook] Received event: ${eventName}`);

  if (eventName === "payment.captured" || eventName === "order.paid") {
    const payment = event.payload?.payment?.entity;
    const rzpOrderId = payment?.order_id || event.payload?.order?.entity?.id;

    if (rzpOrderId) {
      const order = getOrderById(rzpOrderId);
      if (order && order.payment_status !== "Paid") {
        const updated = updateOrder(order.id, {
          payment_status: "Paid",
          status:
            order.status === "Payment Pending" ? "Confirmed" : order.status,
          razorpay_payment_id: payment?.id,
          razorpay_payment_method: (
            payment?.method || "Razorpay"
          ).toUpperCase(),
          payment_date: new Date().toISOString(),
        });

        if (updated && !updated.confirmation_email_sent) {
          sendOrderConfirmationEmail(updated, baseUrl).catch((e) =>
            console.error("[webhook] Email send error:", e),
          );
        }
      }
    }
  }

  return { handled: true, message: "Processed" };
}
