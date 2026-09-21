import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Mail,
  CreditCard,
  Truck,
  Save,
  Eye,
  EyeOff,
  ShieldCheck,
} from "lucide-react";

export const Route = createFileRoute("/admin/settings")({
  component: AdminSettings,
});

type SmtpSettings = {
  host: string;
  port: number;
  username: string;
  password: string;
  from_email: string;
  from_name: string;
  secure: boolean;
};

type RazorpaySettings = {
  key_id: string;
  key_secret: string;
  webhook_secret: string;
  mode: "test" | "live";
};

type ShippingSettings = {
  provider: string;
  api_key: string;
  api_secret: string;
  pickup_pincode: string;
  default_weight_g: number;
  enabled: boolean;
  free_shipping_threshold?: number;
  standard_shipping_fee?: number;
  default_courier?: string;
};

function AdminSettings() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["app_settings"],
    queryFn: async () => {
      let serverSettings: Record<string, unknown> = {};
      try {
        const res = await fetch("/api/admin/settings");
        if (res.ok) {
          const sData = await res.json();
          if (sData.ok && sData.settings) {
            serverSettings = sData.settings as Record<string, unknown>;
          }
        }
      } catch (err) {
        console.warn("Could not load from /api/admin/settings:", err);
      }

      try {
        const { data: dbData } = await supabase
          .from("app_settings")
          .select("key, value");
        for (const r of dbData ?? []) {
          if (!serverSettings[r.key]) serverSettings[r.key] = r.value;
        }
      } catch (err) {
        console.warn("Could not load from app_settings:", err);
      }

      return serverSettings;
    },
  });

  if (isLoading) {
    return <div className="text-primary/70">Loading settings…</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-serif text-2xl text-primary">Settings</h2>
        <p className="text-sm text-primary/60">
          Configure real Razorpay payments, SMTP email delivery, and DTDC
          courier dispatch. Values are stored securely server-side and never
          exposed to customers.
        </p>
      </div>

      <RazorpayCard
        initial={data?.razorpay as RazorpaySettings | undefined}
        onSaved={() => qc.invalidateQueries({ queryKey: ["app_settings"] })}
      />
      <SmtpCard
        initial={data?.smtp as SmtpSettings | undefined}
        onSaved={() => qc.invalidateQueries({ queryKey: ["app_settings"] })}
      />
      <ShippingCard
        initial={data?.shipping as ShippingSettings | undefined}
        onSaved={() => qc.invalidateQueries({ queryKey: ["app_settings"] })}
      />
    </div>
  );
}

function Section({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-primary/10 bg-card p-6">
      <div className="mb-5 flex items-start gap-3">
        <div className="rounded-md bg-primary/5 p-2 text-primary">
          <Icon size={20} />
        </div>
        <div>
          <h3 className="font-serif text-xl text-primary">{title}</h3>
          <p className="text-sm text-primary/60">{description}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium uppercase tracking-wider text-primary/70">
        {label}
      </span>
      {children}
      {hint ? (
        <span className="mt-1 block text-xs text-primary/50">{hint}</span>
      ) : null}
    </label>
  );
}

const inputCls =
  "w-full rounded-md border border-primary/15 bg-background px-3 py-2 text-sm text-primary focus:border-accent focus:outline-none";

function SecretInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={inputCls + " pr-10"}
        autoComplete="off"
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-primary/50 hover:text-primary"
        aria-label={show ? "Hide" : "Show"}
      >
        {show ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
}

async function saveSetting(key: string, value: unknown) {
  // 1. Save to server API
  const res = await fetch("/api/admin/settings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key, value }),
  });
  if (!res.ok) {
    const d = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(d.error || "Failed to save settings");
  }

  // 2. Mirror to Supabase if possible
  try {
    const { data: userRes } = await supabase.auth.getUser();
    await supabase
      .from("app_settings")
      .upsert(
        { key, value, updated_by: userRes?.user?.id ?? null },
        { onConflict: "key" },
      );
  } catch (err) {
    console.warn("Could not mirror to Supabase app_settings:", err);
  }
}

function SaveBtn({ saving }: { saving: boolean }) {
  return (
    <button
      type="submit"
      disabled={saving}
      className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
    >
      <Save size={16} /> {saving ? "Saving…" : "Save changes"}
    </button>
  );
}

function RazorpayCard({
  initial,
  onSaved,
}: {
  initial?: RazorpaySettings;
  onSaved: () => void;
}) {
  const [s, setS] = useState<RazorpaySettings>({
    key_id: "",
    key_secret: "",
    webhook_secret: "",
    mode: "test",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initial) setS((prev) => ({ ...prev, ...initial }));
  }, [initial]);

  return (
    <Section
      icon={CreditCard}
      title="Razorpay Payments"
      description="Connect your real Razorpay account to accept live UPI, Cards, Netbanking, and Wallets."
    >
      <div className="mb-4 rounded-md bg-accent/10 p-3 text-xs text-accent-foreground flex items-center gap-2">
        <ShieldCheck size={16} className="text-accent shrink-0" />
        <span>
          <strong>Live & Test Mode:</strong> When <strong>Live</strong> is
          selected, real customer payments will be processed using your Live Key
          ID & Secret. Key Secrets are securely stored server-side and never
          exposed to the browser.
        </span>
      </div>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setSaving(true);
          try {
            await saveSetting("razorpay", s);
            toast.success("Razorpay settings saved successfully");
            onSaved();
          } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : "Failed to save");
          } finally {
            setSaving(false);
          }
        }}
        className="grid gap-4 sm:grid-cols-2"
      >
        <Field label="Payment Mode">
          <select
            className={inputCls}
            value={s.mode}
            onChange={(e) =>
              setS({ ...s, mode: e.target.value as "test" | "live" })
            }
          >
            <option value="test">Test Mode (rzp_test_...)</option>
            <option value="live">Live Mode (Real Customer Payments)</option>
          </select>
        </Field>

        <Field label="Key ID" hint="Starts with rzp_test_ or rzp_live_">
          <input
            className={inputCls}
            value={s.key_id}
            onChange={(e) => setS({ ...s, key_id: e.target.value })}
            placeholder="rzp_live_XXXXXXXXXXXXXX"
          />
        </Field>

        <Field
          label="Key Secret"
          hint="Secret key from Razorpay Dashboard (never sent to client)"
        >
          <SecretInput
            value={s.key_secret}
            onChange={(v) => setS({ ...s, key_secret: v })}
            placeholder="••••••••"
          />
        </Field>

        <Field
          label="Webhook Secret"
          hint="Optional secret configured in Razorpay Webhooks"
        >
          <SecretInput
            value={s.webhook_secret}
            onChange={(v) => setS({ ...s, webhook_secret: v })}
            placeholder="••••••••"
          />
        </Field>

        <div className="sm:col-span-2">
          <SaveBtn saving={saving} />
        </div>
      </form>
    </Section>
  );
}

function SmtpCard({
  initial,
  onSaved,
}: {
  initial?: SmtpSettings;
  onSaved: () => void;
}) {
  const [s, setS] = useState<SmtpSettings>({
    host: "",
    port: 587,
    username: "",
    password: "",
    from_email: "",
    from_name: "ChocoVibes",
    secure: false,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initial) setS((prev) => ({ ...prev, ...initial }));
  }, [initial]);

  return (
    <Section
      icon={Mail}
      title="SMTP Email Notifications"
      description="Sends automated Order Confirmation, Payment Received, DTDC Shipment Tracking, and Delivery emails."
    >
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setSaving(true);
          try {
            await saveSetting("smtp", s);
            toast.success("SMTP email settings saved");
            onSaved();
          } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : "Failed to save");
          } finally {
            setSaving(false);
          }
        }}
        className="grid gap-4 sm:grid-cols-2"
      >
        <Field label="SMTP Host">
          <input
            className={inputCls}
            value={s.host}
            onChange={(e) => setS({ ...s, host: e.target.value })}
            placeholder="smtp.gmail.com or smtp.zoho.in"
          />
        </Field>
        <Field label="Port">
          <input
            type="number"
            className={inputCls}
            value={s.port}
            onChange={(e) => setS({ ...s, port: Number(e.target.value) })}
            placeholder="587"
          />
        </Field>
        <Field label="Username / Email">
          <input
            className={inputCls}
            value={s.username}
            onChange={(e) => setS({ ...s, username: e.target.value })}
            placeholder="orders@chocovibes.in"
          />
        </Field>
        <Field label="Password / App Password">
          <SecretInput
            value={s.password}
            onChange={(v) => setS({ ...s, password: v })}
            placeholder="••••••••"
          />
        </Field>
        <Field label="From Email Address">
          <input
            className={inputCls}
            value={s.from_email}
            onChange={(e) => setS({ ...s, from_email: e.target.value })}
            placeholder="orders@chocovibes.in"
          />
        </Field>
        <Field label="From Sender Name">
          <input
            className={inputCls}
            value={s.from_name}
            onChange={(e) => setS({ ...s, from_name: e.target.value })}
            placeholder="ChocoVibes"
          />
        </Field>
        <label className="flex items-center gap-2 text-sm text-primary/80 sm:col-span-2">
          <input
            type="checkbox"
            checked={s.secure}
            onChange={(e) => setS({ ...s, secure: e.target.checked })}
          />
          Use SSL (Port 465) / Check for direct TLS connection
        </label>
        <div className="sm:col-span-2">
          <SaveBtn saving={saving} />
        </div>
      </form>
    </Section>
  );
}

function ShippingCard({
  initial,
  onSaved,
}: {
  initial?: ShippingSettings;
  onSaved: () => void;
}) {
  const [s, setS] = useState<ShippingSettings>({
    provider: "dtdc",
    api_key: "",
    api_secret: "",
    pickup_pincode: "395009",
    default_weight_g: 300,
    enabled: true,
    free_shipping_threshold: 999,
    standard_shipping_fee: 99,
    default_courier: "DTDC",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initial) setS((prev) => ({ ...prev, ...initial }));
  }, [initial]);

  return (
    <Section
      icon={Truck}
      title="Shipping & DTDC Courier Settings"
      description="Configure DTDC as the default courier, free shipping rules, and tracking parameters."
    >
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setSaving(true);
          try {
            await saveSetting("shipping", s);
            toast.success("Shipping settings saved");
            onSaved();
          } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : "Failed to save");
          } finally {
            setSaving(false);
          }
        }}
        className="grid gap-4 sm:grid-cols-2"
      >
        <Field label="Default Courier Partner">
          <select
            className={inputCls}
            value={s.default_courier || "DTDC"}
            onChange={(e) => setS({ ...s, default_courier: e.target.value })}
          >
            <option value="DTDC">DTDC (Default)</option>
            <option value="Delhivery">Delhivery</option>
            <option value="Blue Dart">Blue Dart</option>
            <option value="India Post">India Post</option>
            <option value="XpressBees">XpressBees</option>
            <option value="Shiprocket">Shiprocket</option>
          </select>
        </Field>

        <Field label="Pickup Warehouse Pincode">
          <input
            className={inputCls}
            value={s.pickup_pincode}
            onChange={(e) => setS({ ...s, pickup_pincode: e.target.value })}
            placeholder="395009"
          />
        </Field>

        <Field label="Free Shipping Threshold (₹)">
          <input
            type="number"
            className={inputCls}
            value={s.free_shipping_threshold || 999}
            onChange={(e) =>
              setS({ ...s, free_shipping_threshold: Number(e.target.value) })
            }
          />
        </Field>

        <Field label="Standard Shipping Fee (₹)">
          <input
            type="number"
            className={inputCls}
            value={s.standard_shipping_fee || 99}
            onChange={(e) =>
              setS({ ...s, standard_shipping_fee: Number(e.target.value) })
            }
          />
        </Field>

        <div className="sm:col-span-2">
          <SaveBtn saving={saving} />
        </div>
      </form>
    </Section>
  );
}
