import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

export type OrderStatus =
  | "Payment Pending"
  | "Confirmed"
  | "Processing"
  | "Packed"
  | "Shipped"
  | "Out for Delivery"
  | "Delivered"
  | "Cancelled"
  | "Refunded";

export type PaymentStatus = "Pending" | "Paid" | "Failed" | "Refunded";

export type OrderItem = {
  id: string;
  order_id: string;
  product_slug: string;
  product_name: string;
  unit_price: number;
  quantity: number;
  line_total: number;
};

export type Order = {
  id: string;
  order_number: string; // CV-YYYY-XXXXXX e.g. CV-2026-000001
  user_id: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  subtotal: number;
  shipping: number;
  total: number;
  payment_method: string;
  payment_status: PaymentStatus;
  status: OrderStatus;
  notes: string | null;

  // Razorpay
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
  razorpay_payment_method?: string;
  payment_date?: string;

  // Shipping
  courier: string; // "DTDC" by default
  tracking_id: string;
  tracking_url: string;
  shipped_at?: string;
  delivered_at?: string;

  // Email flags
  confirmation_email_sent?: boolean;
  shipped_email_sent?: boolean;
  delivery_email_sent?: boolean;

  items: OrderItem[];
  created_at: string;
  updated_at: string;
};

const DATA_DIR = path.resolve(process.cwd(), "data");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");
const SETTINGS_FILE = path.join(DATA_DIR, "settings.json");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// ---------------- Settings ----------------
export function getStoredSettings(): Record<string, unknown> {
  ensureDataDir();
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      const raw = fs.readFileSync(SETTINGS_FILE, "utf-8");
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error("[db] Error reading settings:", err);
  }
  return {
    razorpay: {
      mode: "test",
      key_id: process.env.RAZORPAY_KEY_ID || "",
      key_secret: process.env.RAZORPAY_KEY_SECRET || "",
      webhook_secret: process.env.RAZORPAY_WEBHOOK_SECRET || "",
    },
    smtp: {
      host: process.env.SMTP_HOST || "",
      port: Number(process.env.SMTP_PORT) || 587,
      username: process.env.SMTP_USER || "",
      password: process.env.SMTP_PASSWORD || "",
      from_email: process.env.SMTP_FROM_EMAIL || "orders@chocovibes.in",
      from_name: process.env.SMTP_FROM_NAME || "ChocoVibes",
      secure: false,
    },
    shipping: {
      free_shipping_threshold: 999,
      standard_shipping_fee: 99,
      default_courier: "DTDC",
    },
  };
}

export function saveStoredSettings(
  key: string,
  value: unknown,
): Record<string, unknown> {
  ensureDataDir();
  const current = getStoredSettings();
  current[key] = value;
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(current, null, 2), "utf-8");
  return current;
}

// ---------------- Orders ----------------
export function getAllOrders(): Order[] {
  ensureDataDir();
  try {
    if (fs.existsSync(ORDERS_FILE)) {
      const raw = fs.readFileSync(ORDERS_FILE, "utf-8");
      const list = JSON.parse(raw);
      if (Array.isArray(list)) {
        return list.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        );
      }
    }
  } catch (err) {
    console.error("[db] Error reading orders:", err);
  }
  return [];
}

export function getOrderById(idOrNumber: string): Order | null {
  const orders = getAllOrders();
  const normalized = idOrNumber.trim().toLowerCase();
  return (
    orders.find(
      (o) =>
        o.id.toLowerCase() === normalized ||
        o.order_number.toLowerCase() === normalized ||
        o.razorpay_order_id?.toLowerCase() === normalized,
    ) ?? null
  );
}

export function getUserOrders(userIdOrEmail: string): Order[] {
  const orders = getAllOrders();
  const norm = userIdOrEmail.trim().toLowerCase();
  return orders.filter(
    (o) =>
      (o.user_id && o.user_id.toLowerCase() === norm) ||
      o.customer_email.toLowerCase() === norm,
  );
}

function writeOrders(orders: Order[]) {
  ensureDataDir();
  const tmpFile = `${ORDERS_FILE}.tmp.${Date.now()}`;
  fs.writeFileSync(tmpFile, JSON.stringify(orders, null, 2), "utf-8");
  fs.renameSync(tmpFile, ORDERS_FILE);
}

export function generateOrderNumber(): string {
  const year = new Date().getFullYear();
  const orders = getAllOrders();
  const yearPrefix = `CV-${year}-`;
  const thisYearOrders = orders.filter((o) =>
    o.order_number?.startsWith(yearPrefix),
  );
  const maxSeq = thisYearOrders.reduce((max, o) => {
    const num = parseInt(o.order_number.replace(yearPrefix, ""), 10);
    return isNaN(num) ? max : Math.max(max, num);
  }, 0);
  const nextSeq = String(maxSeq + 1).padStart(6, "0");
  return `${yearPrefix}${nextSeq}`;
}

export function createOrder(
  data: Omit<Order, "id" | "order_number" | "created_at" | "updated_at"> & {
    id?: string;
    order_number?: string;
  },
): Order {
  const orders = getAllOrders();
  const now = new Date().toISOString();
  const id = data.id || crypto.randomUUID();
  const order_number = data.order_number || generateOrderNumber();

  const newOrder: Order = {
    ...data,
    id,
    order_number,
    courier: data.courier || "DTDC",
    tracking_id: data.tracking_id || "",
    tracking_url: data.tracking_url || "",
    created_at: now,
    updated_at: now,
  };

  orders.unshift(newOrder);
  writeOrders(orders);
  return newOrder;
}

export function updateOrder(
  idOrNumber: string,
  patch: Partial<Order>,
): Order | null {
  const orders = getAllOrders();
  const idx = orders.findIndex(
    (o) =>
      o.id === idOrNumber ||
      o.order_number === idOrNumber ||
      o.razorpay_order_id === idOrNumber,
  );

  if (idx === -1) return null;

  const current = orders[idx];
  const updated: Order = {
    ...current,
    ...patch,
    updated_at: new Date().toISOString(),
  };

  orders[idx] = updated;
  writeOrders(orders);
  return updated;
}
