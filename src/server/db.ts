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

const DEFAULT_SETTINGS: Record<string, any> = {
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
    from_email:
      process.env.SMTP_FROM_EMAIL || "orders@chocovibes.in",
    from_name: process.env.SMTP_FROM_NAME || "ChocoVibes",
    secure: false,
  },

  shipping: {
    free_shipping_threshold: 999,
    standard_shipping_fee: 99,
    default_courier: "DTDC",
  },
};

function mapOrder(row: OrderRow): Order {
  const rawItems = Array.isArray(row.order_items)
    ? row.order_items
    : [];

  const items: OrderItem[] = rawItems.map((item: any) => ({
    id: item.id,
    order_id: item.order_id,
    product_slug: item.product_slug,
    product_name: item.product_name,
    unit_price: Number(item.unit_price ?? 0),
    quantity: Number(item.quantity ?? 1),
    line_total: Number(item.line_total ?? 0),
  }));

  return {
    id: row.id,
    order_number: row.order_number || "",
    user_id: row.user_id ?? null,

    customer_name: row.customer_name || "",
    customer_email: row.customer_email || "",
    customer_phone: row.customer_phone || "",

    address: row.address || "",
    city: row.city || "",
    state: row.state || "",
    pincode: row.pincode || "",

    subtotal: Number(row.subtotal ?? 0),
    shipping: Number(row.shipping ?? 0),
    total: Number(row.total ?? 0),

    payment_method: row.payment_method || "",
    payment_status: row.payment_status || "Pending",
    status: row.status || "Payment Pending",

    notes: row.notes ?? null,

    razorpay_order_id:
      row.razorpay_order_id ?? undefined,

    razorpay_payment_id:
      row.razorpay_payment_id ?? undefined,

    razorpay_signature:
      row.razorpay_signature ?? undefined,

    razorpay_payment_method:
      row.razorpay_payment_method ?? undefined,

    payment_date:
      row.payment_date ?? undefined,

    courier: row.courier || "DTDC",
    tracking_id: row.tracking_id || "",
    tracking_url: row.tracking_url || "",

    shipped_at:
      row.shipped_at ?? undefined,

    delivered_at:
      row.delivered_at ?? undefined,

    confirmation_email_sent:
      Boolean(row.confirmation_email_sent),

    shipped_email_sent:
      Boolean(row.shipped_email_sent),

    delivery_email_sent:
      Boolean(row.delivery_email_sent),

    items,

    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

/* =========================================================
   SETTINGS
========================================================= */

export async function getStoredSettings(): Promise<
  Record<string, any>
> {
  try {
    const { data, error } = await supabaseAdmin
      .from("app_settings")
      .select("key,value");

    if (error) {
      throw error;
    }

    const settings: Record<string, any> = {
      ...DEFAULT_SETTINGS,
    };

    for (const row of data || []) {
      settings[row.key] = row.value;
    }

    const razorpay =
      (settings.razorpay || {}) as Record<string, any>;

    settings.razorpay = {
      mode: razorpay.mode || "test",

      key_id:
        razorpay.key_id ||
        process.env.RAZORPAY_KEY_ID ||
        "",

      key_secret:
        razorpay.key_secret ||
        process.env.RAZORPAY_KEY_SECRET ||
        "",

      webhook_secret:
        razorpay.webhook_secret ||
        process.env.RAZORPAY_WEBHOOK_SECRET ||
        "",
    };

    return settings;
  } catch (error) {
    console.error(
      "[db] Error reading settings:",
      error,
    );

    return DEFAULT_SETTINGS;
  }
}

export async function saveStoredSettings(
  key: string,
  value: unknown,
): Promise<Record<string, any>> {
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
    console.error(
      "[db] Error saving settings:",
      error,
    );

    throw error;
  }

  return getStoredSettings();
}

/* =========================================================
   ORDERS
========================================================= */

export async function getAllOrders(): Promise<Order[]> {
  const { data, error } = await supabaseAdmin
    .from("orders")
    .select("*, order_items(*)")
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error(
      "[db] Error reading orders:",
      error,
    );

    throw error;
  }

  return (data || []).map((row) =>
    mapOrder(row as OrderRow),
  );
}

export async function getOrderById(
  idOrNumber: string,
): Promise<Order | null> {
  const value = idOrNumber.trim();

  if (!value) {
    return null;
  }

  // UUID lookup
  const isUuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      value,
    );

  if (isUuid) {
    const { data, error } = await supabaseAdmin
      .from("orders")
      .select("*, order_items(*)")
      .eq("id", value)
      .maybeSingle();

    if (error) {
      console.error(
        "[db] UUID lookup error:",
        error,
      );
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
    return mapOrder(
      orderNumberData as OrderRow,
    );
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
    return mapOrder(
      razorpayData as OrderRow,
    );
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

  const { data: byUserId, error: userError } =
    await supabaseAdmin
      .from("orders")
      .select("*, order_items(*)")
      .eq("user_id", value)
      .order("created_at", {
        ascending: false,
      });

  if (userError) {
    console.error(
      "[db] User order lookup error:",
      userError,
    );
  }

  if (byUserId && byUserId.length > 0) {
    return byUserId.map((row) =>
      mapOrder(row as OrderRow),
    );
  }

  const { data: byEmail, error: emailError } =
    await supabaseAdmin
      .from("orders")
      .select("*, order_items(*)")
      .eq("customer_email", value)
      .order("created_at", {
        ascending: false,
      });

  if (emailError) {
    console.error(
      "[db] Email order lookup error:",
      emailError,
    );

    throw emailError;
  }

  return (byEmail || []).map((row) =>
    mapOrder(row as OrderRow),
  );
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
    const current = String(
      row.order_number || "",
    );

    if (!current.startsWith(prefix)) {
      continue;
    }

    const sequence = Number(
      current.slice(prefix.length),
    );

    if (Number.isFinite(sequence)) {
      maxSequence = Math.max(
        maxSequence,
        sequence,
      );
    }
  }

  return `${prefix}${String(
    maxSequence + 1,
  ).padStart(6, "0")}`;
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
    data.id || crypto.randomUUID();

  const order_number =
    data.order_number ||
    (await generateOrderNumber());

  const now =
    new Date().toISOString();

  const items = Array.isArray(data.items)
    ? data.items
    : [];

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

    subtotal: data.subtotal,
    shipping: data.shipping,
    total: data.total,

    payment_method: data.payment_method,
    payment_status: data.payment_status,
    status: data.status,

    notes: data.notes ?? null,

    razorpay_order_id:
      data.razorpay_order_id ?? null,

    razorpay_payment_id:
      data.razorpay_payment_id ?? null,

    razorpay_signature:
      data.razorpay_signature ?? null,

    razorpay_payment_method:
      data.razorpay_payment_method ?? null,

    payment_date:
      data.payment_date ?? null,

    courier:
      data.courier || "DTDC",

    tracking_id:
      data.tracking_id || "",

    tracking_url:
      data.tracking_url || "",

    shipped_at:
      data.shipped_at ?? null,

    delivered_at:
      data.delivered_at ?? null,

    confirmation_email_sent:
      Boolean(
        data.confirmation_email_sent,
      ),

    shipped_email_sent:
      Boolean(
        data.shipped_email_sent,
      ),

    delivery_email_sent:
      Boolean(
        data.delivery_email_sent,
      ),

    created_at: now,
    updated_at: now,
  };

  const { error: orderError } =
    await supabaseAdmin
      .from("orders")
      .insert(orderRow);

  if (orderError) {
    console.error(
      "[db] Error creating order:",
      orderError,
    );

    throw orderError;
  }

  if (items.length > 0) {
    const itemRows = items.map(
  (item) => ({
    id: crypto.randomUUID(),

    order_id: id,

        product_slug:
          item.product_slug,

        product_name:
          item.product_name,

        unit_price:
          item.unit_price,

        quantity:
          item.quantity,

        line_total:
          item.line_total,
      }),
    );

    const { error: itemError } =
      await supabaseAdmin
        .from("order_items")
        .insert(itemRows);

    if (itemError) {
      console.error(
        "[db] Error creating order items:",
        itemError,
      );

      // Roll back order if item insert failed
      await supabaseAdmin
        .from("orders")
        .delete()
        .eq("id", id);

      throw itemError;
    }
  }

  const created =
    await getOrderById(id);

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
  const existing =
    await getOrderById(idOrNumber);

  if (!existing) {
    return null;
  }

  const updateData: Record<string, any> = {
    ...patch,
    updated_at:
      new Date().toISOString(),
  };

  // These are not order-table update fields
  delete updateData.items;
  delete updateData.id;
  delete updateData.order_number;
  delete updateData.created_at;

  const { error } =
    await supabaseAdmin
      .from("orders")
      .update(updateData)
      .eq("id", existing.id);

  if (error) {
    console.error(
      "[db] Error updating order:",
      error,
    );

    throw error;
  }

  return getOrderById(existing.id);
}