import crypto from "node:crypto";

import { supabaseAdmin } from "@/integrations/supabase/client.server";

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

export type PaymentStatus =
  | "Pending"
  | "Paid"
  | "Failed"
  | "Refunded";

export type ShippingSettings = {
  free_shipping_threshold: number;
  standard_shipping_fee: number;
  default_courier: string;
};

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
  order_number: string;
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

  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
  razorpay_payment_method?: string;
  payment_date?: string;

  courier: string;
  tracking_id: string;
  tracking_url: string;

  shipped_at?: string;
  delivered_at?: string;

  confirmation_email_sent?: boolean;
  shipped_email_sent?: boolean;
  delivery_email_sent?: boolean;

  items: OrderItem[];

  created_at: string;
  updated_at: string;
};

type OrderRow = Record<string, any>;
type SettingsRecord = Record<string, any>;

const DEFAULT_SETTINGS: SettingsRecord = {
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

function isRecord(value: unknown): value is Record<string, any> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseJsonValue(value: unknown): unknown {
  if (typeof value !== "string") {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

function normalizeSettings(rows: Array<{ key: string; value: unknown }>): SettingsRecord {
  const raw: SettingsRecord = {};

  for (const row of rows) {
    raw[row.key] = parseJsonValue(row.value);
  }

  const razorpay = isRecord(raw.razorpay) ? raw.razorpay : {};
  const smtp = isRecord(raw.smtp) ? raw.smtp : {};
  const shipping = isRecord(raw.shipping) ? raw.shipping : {};

  return {
    ...DEFAULT_SETTINGS,

    razorpay: {
      ...DEFAULT_SETTINGS.razorpay,
      ...razorpay,
      mode: razorpay.mode === "live" ? "live" : "test",
      key_id:
        String(
          razorpay.key_id ?? process.env.RAZORPAY_KEY_ID ?? "",
        ).trim(),
      key_secret:
        String(
          razorpay.key_secret ?? process.env.RAZORPAY_KEY_SECRET ?? "",
        ).trim(),
      webhook_secret:
        String(
          razorpay.webhook_secret ??
            process.env.RAZORPAY_WEBHOOK_SECRET ??
            "",
        ).trim(),
    },

    smtp: {
      ...DEFAULT_SETTINGS.smtp,
      ...smtp,
      host: String(smtp.host ?? process.env.SMTP_HOST ?? "").trim(),
      port: Number(smtp.port) || 587,
      username: String(smtp.username ?? process.env.SMTP_USER ?? "").trim(),
      password: String(smtp.password ?? process.env.SMTP_PASSWORD ?? "").trim(),
      from_email: String(
        smtp.from_email ??
          process.env.SMTP_FROM_EMAIL ??
          "orders@chocovibes.in",
      ).trim(),
      from_name: String(
        smtp.from_name ?? process.env.SMTP_FROM_NAME ?? "ChocoVibes",
      ).trim(),
      secure: Boolean(smtp.secure),
    },

    shipping: {
      ...DEFAULT_SETTINGS.shipping,
      ...shipping,
    },
  };
}

function mapOrder(row: OrderRow): Order {
  const rawItems = Array.isArray(row.order_items) ? row.order_items : [];

  const items: OrderItem[] = rawItems.map((item: any) => ({
    id: String(item.id ?? ""),
    order_id: String(item.order_id ?? row.id ?? ""),
    product_slug: String(item.product_slug ?? ""),
    product_name: String(item.product_name ?? ""),
    unit_price: Number(item.unit_price ?? 0),
    quantity: Math.max(1, Number(item.quantity ?? 1)),
    line_total: Number(item.line_total ?? 0),
  }));

  return {
    id: String(row.id ?? ""),
    order_number: String(row.order_number ?? ""),
    user_id: row.user_id ?? null,

    customer_name: String(row.customer_name ?? ""),
    customer_email: String(row.customer_email ?? ""),
    customer_phone: String(row.customer_phone ?? ""),

    address: String(row.address ?? ""),
    city: String(row.city ?? ""),
    state: String(row.state ?? ""),
    pincode: String(row.pincode ?? ""),

    subtotal: Number(row.subtotal ?? 0),
    shipping: Number(row.shipping ?? 0),
    total: Number(row.total ?? 0),

    payment_method: String(row.payment_method ?? ""),
    payment_status: row.payment_status || "Pending",
    status: row.status || "Payment Pending",

    notes: row.notes ?? null,

    razorpay_order_id: row.razorpay_order_id ?? undefined,
    razorpay_payment_id: row.razorpay_payment_id ?? undefined,
    razorpay_signature: row.razorpay_signature ?? undefined,
    razorpay_payment_method: row.razorpay_payment_method ?? undefined,
    payment_date: row.payment_date ?? undefined,

    courier: String(row.courier ?? "DTDC"),
    tracking_id: String(row.tracking_id ?? ""),
    tracking_url: String(row.tracking_url ?? ""),

    shipped_at: row.shipped_at ?? undefined,
    delivered_at: row.delivered_at ?? undefined,

    confirmation_email_sent: Boolean(row.confirmation_email_sent),
    shipped_email_sent: Boolean(row.shipped_email_sent),
    delivery_email_sent: Boolean(row.delivery_email_sent),

    items,

    created_at: String(row.created_at ?? ""),
    updated_at: String(row.updated_at ?? ""),
  };
}

/* =========================================================
   SETTINGS
========================================================= */

export async function getStoredSettings(): Promise<SettingsRecord> {
  try {
    const { data, error } = await supabaseAdmin
      .from("app_settings")
      .select("key,value");

    if (error) {
      throw error;
    }

    return normalizeSettings(data || []);
  } catch (error) {
    console.error("[db] Error reading settings:", error);
    return normalizeSettings([]);
  }
}

export async function saveStoredSettings(
  key: string,
  value: unknown,
): Promise<SettingsRecord> {
  const { error } = await supabaseAdmin
    .from("app_settings")
    .upsert(
      {
        key,
        value: value as any,
        updated_at: new Date().toISOString(),
        updated_by: null,
      },
      {
        onConflict: "key",
      },
    );

  if (error) {
    console.error("[db] Error saving settings:", error);
    throw error;
  }

  return await getStoredSettings();
}

/**
 * Returns validated shipping settings from Supabase.
 * The values below are only fallbacks when the admin has not saved a value.
 */
export async function getShippingSettings(): Promise<ShippingSettings> {
  const settings = await getStoredSettings();
  const shipping = isRecord(settings.shipping) ? settings.shipping : {};

  const threshold = Number(shipping.free_shipping_threshold);
  const fee = Number(shipping.standard_shipping_fee);
  const courier = String(shipping.default_courier || "DTDC").trim();

  return {
    free_shipping_threshold:
      Number.isFinite(threshold) && threshold >= 0 ? threshold : 999,

    standard_shipping_fee:
      Number.isFinite(fee) && fee >= 0 ? fee : 99,

    default_courier: courier || "DTDC",
  };
}

/**
 * Single server-side shipping calculation used by checkout.
 * This keeps the amount shown to the customer and the amount sent to Razorpay
 * based on the same validated settings.
 */
export function calculateShippingFee(
  subtotal: number,
  settings: ShippingSettings,
): number {
  const safeSubtotal = Number.isFinite(Number(subtotal))
    ? Math.max(0, Number(subtotal))
    : 0;

  if (
    safeSubtotal >= settings.free_shipping_threshold
  ) {
    return 0;
  }

  return settings.standard_shipping_fee;
}

/* =========================================================
   ORDERS
========================================================= */

export async function getAllOrders(): Promise<Order[]> {
  const { data, error } = await supabaseAdmin
    .from("orders")
    .select("*, order_items(*)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[db] Error reading orders:", error);
    throw error;
  }

  return (data || []).map((row) => mapOrder(row as OrderRow));
}

export async function getOrderById(
  idOrNumber: string,
): Promise<Order | null> {
  const value = idOrNumber.trim();

  if (!value) {
    return null;
  }

  const isUuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      value,
    );

  // UUID lookup
  if (isUuid) {
    const { data, error } = await supabaseAdmin
      .from("orders")
      .select("*, order_items(*)")
      .eq("id", value)
      .maybeSingle();

    if (error) {
      console.error("[db] UUID lookup error:", error);
    }

    if (data) {
      return mapOrder(data as OrderRow);
    }
  }

  // Order number lookup
  const { data: orderNumberData, error: orderNumberError } =
    await supabaseAdmin
      .from("orders")
      .select("*, order_items(*)")
      .eq("order_number", value)
      .maybeSingle();

  if (orderNumberError) {
    console.error(
      "[db] Order number lookup error:",
      orderNumberError,
    );
  }

  if (orderNumberData) {
    return mapOrder(orderNumberData as OrderRow);
  }

  // Razorpay order ID lookup
  const { data: razorpayData, error: razorpayError } =
    await supabaseAdmin
      .from("orders")
      .select("*, order_items(*)")
      .eq("razorpay_order_id", value)
      .maybeSingle();

  if (razorpayError) {
    console.error(
      "[db] Razorpay order lookup error:",
      razorpayError,
    );
  }

  if (razorpayData) {
    return mapOrder(razorpayData as OrderRow);
  }

  return null;
}

export async function getUserOrders(
  userIdOrEmail: string,
): Promise<Order[]> {
  const value = userIdOrEmail.trim();

  if (!value) {
    return [];
  }

  const isUuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      value,
    );

  // Only query UUID column when the supplied value is actually a UUID.
  if (isUuid) {
    const { data: byUserId, error: userError } = await supabaseAdmin
      .from("orders")
      .select("*, order_items(*)")
      .eq("user_id", value)
      .order("created_at", { ascending: false });

    if (userError) {
      console.error(
        "[db] User order lookup error:",
        userError,
      );
    }

    if (byUserId && byUserId.length > 0) {
      return byUserId.map((row) => mapOrder(row as OrderRow));
    }
  }

  // Email lookup. ilike avoids case-sensitivity issues.
  const { data: byEmail, error: emailError } = await supabaseAdmin
    .from("orders")
    .select("*, order_items(*)")
    .ilike("customer_email", value)
    .order("created_at", { ascending: false });

  if (emailError) {
    console.error(
      "[db] Email order lookup error:",
      emailError,
    );
    throw emailError;
  }

  return (byEmail || []).map((row) => mapOrder(row as OrderRow));
}

export async function generateOrderNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `CV-${year}-`;

  const { data, error } = await supabaseAdmin
    .from("orders")
    .select("order_number")
    .like("order_number", `${prefix}%`);

  if (error) {
    console.error(
      "[db] Error generating order number:",
      error,
    );
    throw error;
  }

  let maxSequence = 0;

  for (const row of data || []) {
    const current = String(row.order_number || "");

    if (!current.startsWith(prefix)) {
      continue;
    }

    const sequence = Number(current.slice(prefix.length));

    if (Number.isFinite(sequence)) {
      maxSequence = Math.max(maxSequence, sequence);
    }
  }

  return `${prefix}${String(maxSequence + 1).padStart(6, "0")}`;
}

export async function createOrder(
  data: Omit<
    Order,
    "id" | "order_number" | "created_at" | "updated_at"
  > & {
    id?: string;
    order_number?: string;
  },
): Promise<Order> {
  const id =
    data.id && /^[0-9a-f-]{36}$/i.test(data.id)
      ? data.id
      : crypto.randomUUID();

  const order_number =
    data.order_number || (await generateOrderNumber());

  const now = new Date().toISOString();
  const items = Array.isArray(data.items) ? data.items : [];

  const orderRow = {
    id,
    order_number,

    user_id: data.user_id ?? null,

    customer_name: data.customer_name,
    customer_email: data.customer_email,
    customer_phone: data.customer_phone,

    address: data.address,
    city: data.city,
    state: data.state,
    pincode: data.pincode,

    subtotal: Number(data.subtotal) || 0,
    shipping: Number(data.shipping) || 0,
    total: Number(data.total) || 0,

    payment_method: data.payment_method,
    payment_status: data.payment_status,
    status: data.status,

    notes: data.notes ?? null,

    razorpay_order_id: data.razorpay_order_id ?? null,
    razorpay_payment_id: data.razorpay_payment_id ?? null,
    razorpay_signature: data.razorpay_signature ?? null,
    razorpay_payment_method: data.razorpay_payment_method ?? null,
    payment_date: data.payment_date ?? null,

    courier: data.courier || "DTDC",
    tracking_id: data.tracking_id || "",
    tracking_url: data.tracking_url || "",

    shipped_at: data.shipped_at ?? null,
    delivered_at: data.delivered_at ?? null,

    confirmation_email_sent: Boolean(data.confirmation_email_sent),
    shipped_email_sent: Boolean(data.shipped_email_sent),
    delivery_email_sent: Boolean(data.delivery_email_sent),

    created_at: now,
    updated_at: now,
  };

  const { error: orderError } = await supabaseAdmin
    .from("orders")
    .insert(orderRow);

  if (orderError) {
    console.error("[db] Error creating order:", orderError);
    throw orderError;
  }

  if (items.length > 0) {
    // Never trust the incoming item.id here. Supabase order_items.id is UUID.
    // Generate a fresh UUID for every database row.
    const itemRows = items.map((item) => ({
      id: crypto.randomUUID(),
      order_id: id,
      product_slug: item.product_slug,
      product_name: item.product_name,
      unit_price: Number(item.unit_price) || 0,
      quantity: Math.max(1, Number(item.quantity) || 1),
      line_total: Number(item.line_total) || 0,
    }));

    const { error: itemError } = await supabaseAdmin
      .from("order_items")
      .insert(itemRows);

    if (itemError) {
      console.error(
        "[db] Error creating order items:",
        itemError,
      );

      // Best-effort rollback so a failed item insert does not leave a dangling order.
      const { error: rollbackError } = await supabaseAdmin
        .from("orders")
        .delete()
        .eq("id", id);

      if (rollbackError) {
        console.error(
          "[db] Rollback failed after item insert error:",
          rollbackError,
        );
      }

      throw itemError;
    }
  }

  const created = await getOrderById(id);

  if (!created) {
    throw new Error(
      "Order was created but could not be loaded",
    );
  }

  return created;
}

export async function updateOrder(
  idOrNumber: string,
  patch: Partial<Order>,
): Promise<Order | null> {
  const existing = await getOrderById(idOrNumber);

  if (!existing) {
    return null;
  }

  const updateData: Record<string, any> = {
    ...patch,
    updated_at: new Date().toISOString(),
  };

  // These values are not allowed to modify an existing order through this helper.
  delete updateData.items;
  delete updateData.id;
  delete updateData.order_number;
  delete updateData.created_at;

  const { error } = await supabaseAdmin
    .from("orders")
    .update(updateData)
    .eq("id", existing.id);

  if (error) {
    console.error("[db] Error updating order:", error);
    throw error;
  }

  return await getOrderById(existing.id);
}
