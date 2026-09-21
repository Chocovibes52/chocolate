import nodemailer from "nodemailer";
import { getStoredSettings, type Order, updateOrder } from "./db";

function getTransport() {
  const settings = getStoredSettings();
  const smtp = settings.smtp;

  if (!smtp || !smtp.host || !smtp.username || !smtp.password) {
    return null;
  }

  return nodemailer.createTransport({
    host: smtp.host,
    port: Number(smtp.port) || 587,
    secure: Boolean(smtp.secure),
    auth: {
      user: smtp.username,
      pass: smtp.password,
    },
  });
}

function getSender() {
  const settings = getStoredSettings();
  const smtp = settings.smtp || {};
  const name = smtp.from_name || "ChocoVibes";
  const email = smtp.from_email || "orders@chocovibes.in";
  return `"${name}" <${email}>`;
}

export async function sendOrderConfirmationEmail(
  order: Order,
  baseUrl = "http://localhost:3000",
): Promise<boolean> {
  if (order.confirmation_email_sent) {
    console.log(
      `[email] Confirmation email already sent for order ${order.order_number}`,
    );
    return true;
  }

  const transport = getTransport();
  const orderUrl = `${baseUrl}/order/${order.id}`;

  const itemsHtml = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #f0e6dd; font-size: 14px; color: #2e1e17;">
          <strong>${item.product_name}</strong> × ${item.quantity}
        </td>
        <td style="padding: 10px 0; border-bottom: 1px solid #f0e6dd; text-align: right; font-size: 14px; color: #2e1e17;">
          ₹${Number(item.line_total).toLocaleString("en-IN")}
        </td>
      </tr>
    `,
    )
    .join("");

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #fcf9f6; margin: 0; padding: 24px; color: #2e1e17; }
          .container { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #eddcd0; overflow: hidden; }
          .header { background: #3d2314; padding: 28px 32px; text-align: center; }
          .header h1 { margin: 0; color: #f7ede2; font-family: 'Playfair Display', Georgia, serif; font-size: 26px; letter-spacing: 0.05em; }
          .body { padding: 32px; }
          .badge { display: inline-block; background: #e8f5e9; color: #2e7d32; font-size: 12px; font-weight: 600; padding: 4px 10px; border-radius: 999px; text-transform: uppercase; }
          .btn { display: inline-block; background: #3d2314; color: #ffffff !important; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 500; font-size: 14px; margin-top: 24px; }
          .footer { background: #fdfaf7; padding: 20px 32px; text-align: center; font-size: 12px; color: #8c766b; border-top: 1px solid #f0e6dd; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>ChocoVibes</h1>
          </div>
          <div class="body">
            <span class="badge">Payment: ${order.payment_status}</span>
            <h2 style="margin: 12px 0 6px; font-size: 20px; color: #3d2314;">Order Confirmed!</h2>
            <p style="margin: 0 0 20px; font-size: 14px; color: #5a463c;">
              Hello ${order.customer_name},<br/>
              Your payment has been received and your order has been confirmed.
            </p>

            <div style="background: #faf6f2; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
              <div style="font-size: 12px; text-transform: uppercase; color: #8c766b; letter-spacing: 0.05em;">Order Number</div>
              <div style="font-size: 18px; font-weight: 700; color: #3d2314; font-family: monospace;">#${order.order_number}</div>
            </div>

            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <thead>
                <tr>
                  <th style="text-align: left; padding-bottom: 8px; border-bottom: 2px solid #eddcd0; font-size: 12px; text-transform: uppercase; color: #8c766b;">Items</th>
                  <th style="text-align: right; padding-bottom: 8px; border-bottom: 2px solid #eddcd0; font-size: 12px; text-transform: uppercase; color: #8c766b;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>

            <div style="text-align: right; font-size: 14px; margin-bottom: 24px;">
              <div style="margin-bottom: 6px; color: #5a463c;">Subtotal: ₹${Number(order.subtotal).toLocaleString("en-IN")}</div>
              <div style="margin-bottom: 6px; color: #5a463c;">Shipping: ₹${Number(order.shipping).toLocaleString("en-IN")}</div>
              <div style="font-size: 18px; font-weight: 700; color: #3d2314;">Total: ₹${Number(order.total).toLocaleString("en-IN")}</div>
            </div>

            <div style="border-top: 1px solid #f0e6dd; padding-top: 20px; font-size: 13px; color: #5a463c;">
              <strong>Delivery Address:</strong><br/>
              ${order.customer_name}<br/>
              ${order.address}<br/>
              ${order.city}, ${order.state} — ${order.pincode}<br/>
              Phone: ${order.customer_phone}
            </div>

            <div style="text-align: center;">
              <a href="${orderUrl}" class="btn">View My Order</a>
            </div>
          </div>
          <div class="footer">
            Thank you for choosing ChocoVibes. Handcrafted with passion.
          </div>
        </div>
      </body>
    </html>
  `;

  if (!transport) {
    console.log(
      `[email] (Simulated - SMTP not configured) Order Confirmation sent to ${order.customer_email} for #${order.order_number}`,
    );
    updateOrder(order.id, { confirmation_email_sent: true });
    return true;
  }

  try {
    await transport.sendMail({
      from: getSender(),
      to: order.customer_email,
      subject: `ChocoVibes Order #${order.order_number} Confirmed`,
      html,
    });
    updateOrder(order.id, { confirmation_email_sent: true });
    console.log(
      `[email] Confirmation email sent successfully to ${order.customer_email}`,
    );
    return true;
  } catch (err) {
    console.error("[email] Failed to send confirmation email:", err);
    return false;
  }
}

export async function sendShippingEmail(
  order: Order,
  baseUrl = "http://localhost:3000",
): Promise<boolean> {
  if (order.shipped_email_sent) {
    console.log(
      `[email] Shipping email already sent for order ${order.order_number}`,
    );
    return true;
  }

  const transport = getTransport();
  const courier = order.courier || "DTDC";
  const trackingId = order.tracking_id || "N/A";
  const trackingUrl =
    order.tracking_url ||
    (courier.toUpperCase().includes("DTDC") && trackingId !== "N/A"
      ? `https://www.dtdc.in/tracking/shipment-tracking.asp`
      : `${baseUrl}/order/${order.id}`);

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #fcf9f6; margin: 0; padding: 24px; color: #2e1e17; }
          .container { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #eddcd0; overflow: hidden; }
          .header { background: #3d2314; padding: 28px 32px; text-align: center; }
          .header h1 { margin: 0; color: #f7ede2; font-family: 'Playfair Display', Georgia, serif; font-size: 26px; }
          .body { padding: 32px; }
          .btn { display: inline-block; background: #c58f5e; color: #ffffff !important; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; margin-top: 24px; }
          .card { background: #faf6f2; border: 1px solid #eddcd0; border-radius: 8px; padding: 18px; margin: 20px 0; }
          .footer { background: #fdfaf7; padding: 20px 32px; text-align: center; font-size: 12px; color: #8c766b; border-top: 1px solid #f0e6dd; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>ChocoVibes</h1>
          </div>
          <div class="body">
            <h2 style="margin: 0 0 10px; font-size: 22px; color: #3d2314;">Your Order Has Shipped!</h2>
            <p style="margin: 0 0 20px; font-size: 14px; color: #5a463c;">
              Great news ${order.customer_name}! Your ChocoVibes artisanal chocolate order is on its way.
            </p>

            <div class="card">
              <div style="font-size: 12px; text-transform: uppercase; color: #8c766b;">Courier Partner</div>
              <div style="font-size: 18px; font-weight: 700; color: #3d2314; margin-bottom: 12px;">${courier}</div>

              <div style="font-size: 12px; text-transform: uppercase; color: #8c766b;">Tracking ID / AWB</div>
              <div style="font-size: 16px; font-family: monospace; font-weight: 600; color: #3d2314;">${trackingId}</div>
            </div>

            <div style="text-align: center;">
              <a href="${trackingUrl}" target="_blank" class="btn">Track Shipment</a>
            </div>

            <div style="margin-top: 30px; font-size: 13px; color: #8c766b; border-top: 1px solid #f0e6dd; padding-top: 16px;">
              Order: #${order.order_number} · Total: ₹${Number(order.total).toLocaleString("en-IN")}<br/>
              Delivering to: ${order.city}, ${order.state} (${order.pincode})
            </div>
          </div>
          <div class="footer">
            ChocoVibes — Freshly packed & shipped with temperature-controlled care.
          </div>
        </div>
      </body>
    </html>
  `;

  if (!transport) {
    console.log(
      `[email] (Simulated - SMTP not configured) Shipping Email sent to ${order.customer_email} for #${order.order_number}`,
    );
    updateOrder(order.id, { shipped_email_sent: true });
    return true;
  }

  try {
    await transport.sendMail({
      from: getSender(),
      to: order.customer_email,
      subject: `Your ChocoVibes Order #${order.order_number} Has Shipped`,
      html,
    });
    updateOrder(order.id, { shipped_email_sent: true });
    console.log(
      `[email] Shipping email sent successfully to ${order.customer_email}`,
    );
    return true;
  } catch (err) {
    console.error("[email] Failed to send shipping email:", err);
    return false;
  }
}

export async function sendDeliveryEmail(
  order: Order,
  baseUrl = "http://localhost:3000",
): Promise<boolean> {
  if (order.delivery_email_sent) {
    return true;
  }

  const transport = getTransport();
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #fcf9f6; padding: 24px; color: #2e1e17; }
          .container { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #eddcd0; overflow: hidden; }
          .header { background: #3d2314; padding: 28px 32px; text-align: center; }
          .header h1 { margin: 0; color: #f7ede2; font-family: 'Playfair Display', Georgia, serif; }
          .body { padding: 32px; text-align: center; }
          .btn { display: inline-block; background: #3d2314; color: #ffffff !important; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 500; font-size: 14px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>ChocoVibes</h1>
          </div>
          <div class="body">
            <h2 style="color: #3d2314; margin-top: 0;">Your Order Was Delivered!</h2>
            <p style="font-size: 15px; color: #5a463c;">
              Hello ${order.customer_name},<br/>
              Your ChocoVibes order #${order.order_number} has been safely delivered. We hope every bite brings you pure bliss!
            </p>
            <p style="font-size: 13px; color: #8c766b;">
              For best flavor, store our artisanal chocolates in a cool, dry place between 15°C - 20°C.
            </p>
            <a href="${baseUrl}/order/${order.id}" class="btn">View Order Details</a>
          </div>
        </div>
      </body>
    </html>
  `;

  if (!transport) {
    console.log(
      `[email] (Simulated - SMTP not configured) Delivery Email sent to ${order.customer_email} for #${order.order_number}`,
    );
    updateOrder(order.id, { delivery_email_sent: true });
    return true;
  }

  try {
    await transport.sendMail({
      from: getSender(),
      to: order.customer_email,
      subject: `Your ChocoVibes Order #${order.order_number} Was Delivered`,
      html,
    });
    updateOrder(order.id, { delivery_email_sent: true });
    return true;
  } catch (err) {
    console.error("[email] Failed to send delivery email:", err);
    return false;
  }
}
