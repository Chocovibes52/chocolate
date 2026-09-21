import {
  getAllOrders,
  getOrderById,
  getUserOrders,
  createOrder,
  updateOrder,
  getStoredSettings,
  saveStoredSettings,
  type Order,
  type OrderItem,
} from "./db";
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
  checkPaymentStatusFromRazorpay,
  handleRazorpayWebhook,
} from "./razorpay";
import {
  sendOrderConfirmationEmail,
  sendShippingEmail,
  sendDeliveryEmail,
} from "./email";

// In-memory catalog fallback if Supabase products fetch encounters network error
const fallbackCatalog: Record<
  string,
  { name: string; price: number; in_stock: boolean }
> = {
  "cacao-noir-original": {
    name: "ChocoVibes Original",
    price: 299,
    in_stock: true,
  },
  "almond-sea-salt": { name: "Almond & Sea Salt", price: 349, in_stock: true },
  "hazelnut-cocoa-nib": {
    name: "Hazelnut & Cocoa Nib",
    price: 379,
    in_stock: true,
  },
  "pistachio-rose": { name: "Pistachio & Rose", price: 399, in_stock: true },
  "chocovibes-photo-chocolate": {
    name: "ChocoVibes Photo Chocolate",
    price: 20,
    in_stock: true,
  },
  "chocovibes-sugar-free-energy-bar": {
    name: "ChocoVibes Energy Bar (Sugar Free)",
    price: 60,
    in_stock: true,
  },
  "chocovibes-premium-handmade-bars": {
    name: "ChocoVibes Premium Handmade Bars",
    price: 40,
    in_stock: true,
  },
  "chocovibes-name-customized-chocolate": {
    name: "ChocoVibes Name Customized Chocolate",
    price: 200,
    in_stock: true,
  },
  "chocovibes-corporate-gift-box": {
    name: "ChocoVibes Corporate Gift Box",
    price: 200,
    in_stock: true,
  },
  "chocovibes-kids-return-gift": {
    name: "ChocoVibes Kids Return Gift",
    price: 150,
    in_stock: true,
  },
  "the-noir-signature": {
    name: "The Noir Signature Box",
    price: 2199,
    in_stock: true,
  },
  "grand-reserve-hamper": {
    name: "Grand Reserve Hamper",
    price: 3999,
    in_stock: true,
  },
  "petit-noir-tin": {
    name: "Petit Noir Truffle Tin",
    price: 1199,
    in_stock: true,
  },
  "chocovibes-nutella-chocolate": {
    name: "ChocoVibes Nutella Chocolate",
    price: 1200,
    in_stock: true,
  },
};

async function getLiveProductInfo(
  slug: string,
): Promise<{ name: string; price: number; in_stock: boolean } | null> {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  if (supabaseUrl && supabaseKey) {
    try {
      const res = await fetch(
        `${supabaseUrl}/rest/v1/products?slug=eq.${encodeURIComponent(slug)}&select=*`,
        {
          headers: { apikey: supabaseKey },
        },
      );
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const item = data[0];
          const price =
            item.sale_price != null
              ? Number(item.sale_price)
              : Number(item.price);
          return {
            name: item.name,
            price,
            in_stock: Boolean(item.in_stock !== false),
          };
        }
      }
    } catch (err) {
      console.warn("[api] Error querying Supabase for product:", err);
    }
  }

  return fallbackCatalog[slug] ?? null;
}

export async function handleApiRequest(
  request: Request,
  url: URL,
): Promise<Response | null> {
  const pathname = url.pathname;
  const method = request.method.toUpperCase();
  const origin = url.origin;

  // JSON helper
  const json = (data: unknown, status = 200) =>
    new Response(JSON.stringify(data), {
      status,
      headers: {
        "content-type": "application/json; charset=utf-8",
        "access-control-allow-origin": "*",
        "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
        "access-control-allow-headers": "Content-Type, Authorization",
      },
    });

  if (method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "access-control-allow-origin": "*",
        "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
        "access-control-allow-headers": "Content-Type, Authorization",
      },
    });
  }

  // 1. POST /api/razorpay/create-order
  if (pathname === "/api/razorpay/create-order" && method === "POST") {
    try {
      const body = await request.json();
      const { items, customer, payment_method } = body;

      if (!items || !Array.isArray(items) || items.length === 0) {
        return json({ ok: false, error: "Cart is empty" }, 400);
      }

      if (
        !customer ||
        !customer.name ||
        !customer.email ||
        !customer.phone ||
        !customer.address
      ) {
        return json(
          { ok: false, error: "Missing required shipping information" },
          400,
        );
      }

      // OUT OF STOCK CHECK & SERVER-SIDE PRICE COMPUTATION
      let subtotal = 0;
      const orderItems: OrderItem[] = [];

      for (const item of items) {
        const prod = await getLiveProductInfo(item.product_slug);
        if (!prod) {
          return json(
            {
              ok: false,
              error: `Product "${item.product_slug}" not found in catalog.`,
            },
            400,
          );
        }

        if (!prod.in_stock) {
          return json(
            {
              ok: false,
              error: `Sorry, "${prod.name}" is currently out of stock. Please remove it from your cart to proceed.`,
            },
            400,
          );
        }

        const qty = Math.max(1, parseInt(item.quantity, 10) || 1);
        const lineTotal = prod.price * qty;
        subtotal += lineTotal;

        orderItems.push({
          id: `item_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          order_id: "",
          product_slug: item.product_slug,
          product_name: prod.name,
          unit_price: prod.price,
          quantity: qty,
          line_total: lineTotal,
        });
      }

      if (payment_method && payment_method !== "Razorpay") {
        return json(
          {
            ok: false,
            error:
              "Only online prepaid payment via Razorpay is accepted. Cash on Delivery is not available.",
          },
          400,
        );
      }

      // Shipping calculation
      const settings = getStoredSettings();
      const shippingSettings = settings.shipping || {};
      const threshold = Number(shippingSettings.free_shipping_threshold) || 999;
      const shippingFee =
        subtotal >= threshold
          ? 0
          : Number(shippingSettings.standard_shipping_fee) || 99;
      const total = subtotal + shippingFee;

      // Online Razorpay order creation
      const created = createOrder({
        user_id: customer.user_id || null,
        customer_name: customer.name.trim(),
        customer_email: customer.email.trim(),
        customer_phone: customer.phone.trim(),
        address: customer.address.trim(),
        city: customer.city.trim(),
        state: customer.state.trim(),
        pincode: customer.pincode.trim(),
        subtotal,
        shipping: shippingFee,
        total,
        payment_method: "Razorpay",
        payment_status: "Pending",
        status: "Payment Pending",
        notes: customer.notes || null,
        courier: "DTDC",
        tracking_id: "",
        tracking_url: "",
        items: orderItems,
      });

      // Update order_id on items
      created.items.forEach((i) => (i.order_id = created.id));

      const rzpResult = await createRazorpayOrder({
        amountInRupees: total,
        orderNumber: created.order_number,
        customerName: created.customer_name,
        customerEmail: created.customer_email,
        customerPhone: created.customer_phone,
      });

      if (!rzpResult.success || !rzpResult.razorpayOrderId) {
        // If Razorpay creation fails, mark order as Failed
        updateOrder(created.id, {
          payment_status: "Failed",
          status: "Cancelled",
        });
        return json(
          {
            ok: false,
            error:
              rzpResult.error || "Failed to initialize payment with Razorpay",
          },
          400,
        );
      }

      const razorpayOrderId = rzpResult.razorpayOrderId;
      const amountInPaise = rzpResult.amountInPaise;
      const currency = rzpResult.currency;
      const keyId = rzpResult.keyId;

      updateOrder(created.id, { razorpay_order_id: razorpayOrderId });

      return json({
        ok: true,
        orderId: created.id,
        orderNumber: created.order_number,
        razorpayOrderId,
        amountInPaise,
        currency,
        keyId,
        total,
        isRazorpay: true,
      });
    } catch (err: unknown) {
      console.error("[api] create-order error:", err);
      return json(
        {
          ok: false,
          error:
            err instanceof Error ? err.message : "Failed to process checkout",
        },
        500,
      );
    }
  }

  // 2. POST /api/razorpay/verify-payment
  if (pathname === "/api/razorpay/verify-payment" && method === "POST") {
    try {
      const body = (await request.json()) as {
        orderId?: string;
        razorpayOrderId?: string;
        razorpayPaymentId?: string;
        razorpaySignature?: string;
      };
      const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } =
        body;

      if (
        !orderId ||
        !razorpayOrderId ||
        !razorpayPaymentId ||
        !razorpaySignature
      ) {
        return json(
          {
            ok: false,
            error: "Missing required payment verification parameters",
          },
          400,
        );
      }

      const result = await verifyRazorpayPayment({
        orderId,
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
        baseUrl: origin,
      });

      if (!result.success) {
        return json(
          { ok: false, error: result.error || "Payment was not completed." },
          400,
        );
      }

      return json({ ok: true, order: result.order });
    } catch (err: unknown) {
      console.error("[api] verify-payment error:", err);
      return json(
        {
          ok: false,
          error:
            err instanceof Error ? err.message : "Payment verification failed",
        },
        500,
      );
    }
  }

  // 3. POST /api/orders/check-payment-status
  if (pathname === "/api/orders/check-payment-status" && method === "POST") {
    try {
      const body = (await request.json()) as { orderId?: string };
      const { orderId } = body;
      if (!orderId) {
        return json({ ok: false, error: "Missing orderId" }, 400);
      }

      const result = await checkPaymentStatusFromRazorpay(orderId, origin);
      return json({ ok: true, ...result });
    } catch (err: unknown) {
      return json(
        {
          ok: false,
          error: err instanceof Error ? err.message : "Check failed",
        },
        500,
      );
    }
  }

  // 4. POST /api/orders/shipping
  if (pathname === "/api/orders/shipping" && method === "POST") {
    try {
      const body = await request.json();
      const {
        orderId,
        courier,
        trackingId,
        trackingUrl,
        status,
        markAsShipped,
        markAsDelivered,
      } = body;

      const order = getOrderById(orderId);
      if (!order) {
        return json({ ok: false, error: "Order not found" }, 404);
      }

      const patch: Partial<Order> = {};
      if (courier !== undefined) patch.courier = courier || "DTDC";
      if (trackingId !== undefined) patch.tracking_id = trackingId.trim();

      // If courier is DTDC and trackingUrl is empty, generate standard DTDC tracking link
      let effectiveUrl = trackingUrl?.trim() || "";
      if (
        !effectiveUrl &&
        (patch.courier || order.courier).toUpperCase().includes("DTDC") &&
        (patch.tracking_id || order.tracking_id)
      ) {
        effectiveUrl = `https://www.dtdc.in/tracking/shipment-tracking.asp`;
      }
      patch.tracking_url = effectiveUrl;

      if (status) patch.status = status;

      if (markAsShipped) {
        patch.status = "Shipped";
        patch.shipped_at = new Date().toISOString();
      }

      if (markAsDelivered) {
        patch.status = "Delivered";
        patch.delivered_at = new Date().toISOString();
      }

      const updated = updateOrder(orderId, patch);

      // Trigger shipping email if newly marked as shipped
      if (markAsShipped && updated && !updated.shipped_email_sent) {
        sendShippingEmail(updated, origin).catch((e) =>
          console.error("[api] Shipping email error:", e),
        );
      }

      // Trigger delivery email if newly marked as delivered
      if (markAsDelivered && updated && !updated.delivery_email_sent) {
        sendDeliveryEmail(updated, origin).catch((e) =>
          console.error("[api] Delivery email error:", e),
        );
      }

      return json({ ok: true, order: updated });
    } catch (err: unknown) {
      return json(
        {
          ok: false,
          error:
            err instanceof Error ? err.message : "Failed to update shipping",
        },
        500,
      );
    }
  }

  // 5. GET /api/orders
  if (pathname === "/api/orders" && method === "GET") {
    const orders = getAllOrders();
    return json({ ok: true, orders });
  }

  // 6. GET /api/orders/:id
  if (pathname.startsWith("/api/orders/") && method === "GET") {
    const id = pathname.replace("/api/orders/", "");
    const order = getOrderById(id);
    if (!order) {
      return json({ ok: false, error: "Order not found" }, 404);
    }
    return json({ ok: true, order });
  }

  // 7. GET /api/user/orders
  if (pathname === "/api/user/orders" && method === "GET") {
    const userIdOrEmail = url.searchParams.get("user") || "";
    const orders = getUserOrders(userIdOrEmail);
    return json({ ok: true, orders });
  }

  // 7.5 POST/GET /api/orders/track (Secure lookup requiring Order Number + Customer Email)
  if (
    pathname === "/api/orders/track" &&
    (method === "POST" || method === "GET")
  ) {
    try {
      let orderNumber = "";
      let email = "";
      if (method === "GET") {
        orderNumber = (url.searchParams.get("orderNumber") || "").trim();
        email = (url.searchParams.get("email") || "").trim();
      } else {
        const body = (await request.json()) as {
          orderNumber?: string;
          email?: string;
        };
        orderNumber = (body.orderNumber || "").trim();
        email = (body.email || "").trim();
      }

      if (!orderNumber || !email) {
        return json(
          {
            ok: false,
            error: "Please enter both your Order Number and Email Address.",
          },
          400,
        );
      }

      const order = getOrderById(orderNumber);
      if (!order) {
        return json(
          {
            ok: false,
            error:
              "No order found matching this order number and email. Please check your details.",
          },
          404,
        );
      }

      // Security check: email must strictly match customer_email
      if (order.customer_email.trim().toLowerCase() !== email.toLowerCase()) {
        return json(
          {
            ok: false,
            error:
              "The email address does not match this order. Please verify your details.",
          },
          403,
        );
      }

      return json({ ok: true, order });
    } catch (err: unknown) {
      return json(
        {
          ok: false,
          error: err instanceof Error ? err.message : "Failed to track order",
        },
        500,
      );
    }
  }

  // 8. GET /api/admin/settings
  if (pathname === "/api/admin/settings" && method === "GET") {
    const settings = getStoredSettings();
    const rzp = (settings.razorpay || {}) as Record<string, unknown>;
    const smtp = (settings.smtp || {}) as Record<string, unknown>;
    // Mask sensitive secrets for UI display
    const safeSettings = {
      ...settings,
      razorpay: {
        mode: (rzp.mode as string) || "test",
        key_id: (rzp.key_id as string) || "",
        key_secret: rzp.key_secret ? "••••••••" : "",
        webhook_secret: rzp.webhook_secret ? "••••••••" : "",
        has_secret: Boolean(rzp.key_secret),
      },
      smtp: {
        host: (smtp.host as string) || "",
        port: (smtp.port as number) || 587,
        username: (smtp.username as string) || "",
        password: smtp.password ? "••••••••" : "",
        from_email: (smtp.from_email as string) || "",
        from_name: (smtp.from_name as string) || "",
        secure: Boolean(smtp.secure),
        has_password: Boolean(smtp.password),
      },
    };
    return json({ ok: true, settings: safeSettings });
  }

  // 9. POST /api/admin/settings
  if (pathname === "/api/admin/settings" && method === "POST") {
    try {
      const body = (await request.json()) as {
        key?: string;
        value?: Record<string, unknown>;
      };
      const { key, value } = body;
      if (!key) return json({ ok: false, error: "Missing key" }, 400);

      // Merge secrets so "••••••••" doesn't overwrite real secrets
      const current = getStoredSettings();
      let mergedValue: unknown = value;
      const currRzp = (current.razorpay || {}) as Record<string, unknown>;
      const currSmtp = (current.smtp || {}) as Record<string, unknown>;

      if (key === "razorpay" && value) {
        mergedValue = {
          mode: value.mode || "test",
          key_id: value.key_id || "",
          key_secret:
            value.key_secret && value.key_secret !== "••••••••"
              ? value.key_secret
              : currRzp.key_secret || "",
          webhook_secret:
            value.webhook_secret && value.webhook_secret !== "••••••••"
              ? value.webhook_secret
              : currRzp.webhook_secret || "",
        };
      } else if (key === "smtp" && value) {
        mergedValue = {
          host: value.host || "",
          port: Number(value.port) || 587,
          username: value.username || "",
          password:
            value.password && value.password !== "••••••••"
              ? value.password
              : currSmtp.password || "",
          from_email: value.from_email || "",
          from_name: value.from_name || "",
          secure: Boolean(value.secure),
        };
      }

      saveStoredSettings(key, mergedValue);
      return json({ ok: true, message: "Settings saved" });
    } catch (err: unknown) {
      return json(
        {
          ok: false,
          error: err instanceof Error ? err.message : "Save failed",
        },
        500,
      );
    }
  }

  // 10. POST /api/razorpay/webhook
  if (pathname === "/api/razorpay/webhook" && method === "POST") {
    try {
      const raw = await request.text();
      const sig = request.headers.get("x-razorpay-signature");
      const res = await handleRazorpayWebhook(raw, sig, origin);
      return json(res);
    } catch (err: unknown) {
      return json(
        {
          handled: false,
          error: err instanceof Error ? err.message : "Webhook error",
        },
        400,
      );
    }
  }

  return null;
}
