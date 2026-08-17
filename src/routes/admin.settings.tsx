import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Mail, CreditCard, Truck, Save, Eye, EyeOff } from "lucide-react";

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
};

function AdminSettings() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["app_settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("app_settings").select("key, value");
      if (error) throw error;
      const map: Record<string, any> = {};
      for (const r of data ?? []) map[r.key] = r.value;
      return map;
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
          Configure SMTP email, Razorpay payments, and shipping integration. Values are stored securely and only accessible to admins.
        </p>
      </div>

      <SmtpCard initial={data?.smtp} onSaved={() => qc.invalidateQueries({ queryKey: ["app_settings"] })} />
      <RazorpayCard initial={data?.razorpay} onSaved={() => qc.invalidateQueries({ queryKey: ["app_settings"] })} />
      <ShippingCard initial={data?.shipping} onSaved={() => qc.invalidateQueries({ queryKey: ["app_settings"] })} />
    </div>
  );
}

function Section({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: any;
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
      {hint ? <span className="mt-1 block text-xs text-primary/50">{hint}</span> : null}
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

async function saveSetting(key: string, value: any) {
  const { data: userRes } = await supabase.auth.getUser();
  const { error } = await supabase
    .from("app_settings")
    .upsert({ key, value, updated_by: userRes.user?.id ?? null }, { onConflict: "key" });
  if (error) throw error;
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

function SmtpCard({ initial, onSaved }: { initial?: SmtpSettings; onSaved: () => void }) {
  const [s, setS] = useState<SmtpSettings>({
    host: "",
    port: 587,
    username: "",
    password: "",
    from_email: "",
    from_name: "ChocoVibes",
    secure: true,
  });
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    if (initial) setS({ ...s, ...initial });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial]);

  return (
    <Section
      icon={Mail}
      title="SMTP Email"
      description="Used to send order confirmations, Corporate & B2B replies, and transactional emails."
    >
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setSaving(true);
          try {
            await saveSetting("smtp", s);
            toast.success("SMTP settings saved");
            onSaved();
          } catch (err: any) {
            toast.error(err.message ?? "Failed to save");
          } finally {
            setSaving(false);
          }
        }}
        className="grid gap-4 sm:grid-cols-2"
      >
        <Field label="SMTP Host">
          <input className={inputCls} value={s.host} onChange={(e) => setS({ ...s, host: e.target.value })} placeholder="smtp.gmail.com" />
        </Field>
        <Field label="Port">
          <input type="number" className={inputCls} value={s.port} onChange={(e) => setS({ ...s, port: Number(e.target.value) })} placeholder="587" />
        </Field>
        <Field label="Username">
          <input className={inputCls} value={s.username} onChange={(e) => setS({ ...s, username: e.target.value })} placeholder="chocovibes52@gmail.com" />
        </Field>
        <Field label="Password / App Password">
          <SecretInput value={s.password} onChange={(v) => setS({ ...s, password: v })} placeholder="••••••••" />
        </Field>
        <Field label="From Email">
          <input className={inputCls} value={s.from_email} onChange={(e) => setS({ ...s, from_email: e.target.value })} placeholder="chocovibes52@gmail.com" />
        </Field>
        <Field label="From Name">
          <input className={inputCls} value={s.from_name} onChange={(e) => setS({ ...s, from_name: e.target.value })} />
        </Field>
        <label className="flex items-center gap-2 text-sm text-primary/80 sm:col-span-2">
          <input type="checkbox" checked={s.secure} onChange={(e) => setS({ ...s, secure: e.target.checked })} />
          Use TLS/SSL (recommended)
        </label>
        <div className="sm:col-span-2">
          <SaveBtn saving={saving} />
        </div>
      </form>
    </Section>
  );
}

function RazorpayCard({ initial, onSaved }: { initial?: RazorpaySettings; onSaved: () => void }) {
  const [s, setS] = useState<RazorpaySettings>({
    key_id: "",
    key_secret: "",
    webhook_secret: "",
    mode: "test",
  });
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    if (initial) setS({ ...s, ...initial });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial]);

  return (
    <Section
      icon={CreditCard}
      title="Razorpay Payments"
      description="Add your Razorpay API keys to accept online payments at checkout."
    >
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setSaving(true);
          try {
            await saveSetting("razorpay", s);
            toast.success("Razorpay settings saved");
            onSaved();
          } catch (err: any) {
            toast.error(err.message ?? "Failed to save");
          } finally {
            setSaving(false);
          }
        }}
        className="grid gap-4 sm:grid-cols-2"
      >
        <Field label="Mode">
          <select
            className={inputCls}
            value={s.mode}
            onChange={(e) => setS({ ...s, mode: e.target.value as "test" | "live" })}
          >
            <option value="test">Test</option>
            <option value="live">Live</option>
          </select>
        </Field>
        <Field label="Key ID" hint="Starts with rzp_test_ or rzp_live_">
          <input className={inputCls} value={s.key_id} onChange={(e) => setS({ ...s, key_id: e.target.value })} placeholder="rzp_test_XXXXXXXXXX" />
        </Field>
        <Field label="Key Secret">
          <SecretInput value={s.key_secret} onChange={(v) => setS({ ...s, key_secret: v })} placeholder="••••••••" />
        </Field>
        <Field label="Webhook Secret" hint="Optional — used to verify Razorpay webhooks">
          <SecretInput value={s.webhook_secret} onChange={(v) => setS({ ...s, webhook_secret: v })} placeholder="••••••••" />
        </Field>
        <div className="sm:col-span-2">
          <SaveBtn saving={saving} />
        </div>
      </form>
    </Section>
  );
}

function ShippingCard({ initial, onSaved }: { initial?: ShippingSettings; onSaved: () => void }) {
  const [s, setS] = useState<ShippingSettings>({
    provider: "shiprocket",
    api_key: "",
    api_secret: "",
    pickup_pincode: "395009",
    default_weight_g: 300,
    enabled: false,
  });
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    if (initial) setS({ ...s, ...initial });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial]);

  return (
    <Section
      icon={Truck}
      title="Shipping Integration"
      description="Connect a shipping provider to generate labels and track orders."
    >
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setSaving(true);
          try {
            await saveSetting("shipping", s);
            toast.success("Shipping settings saved");
            onSaved();
          } catch (err: any) {
            toast.error(err.message ?? "Failed to save");
          } finally {
            setSaving(false);
          }
        }}
        className="grid gap-4 sm:grid-cols-2"
      >
        <Field label="Provider">
          <select
            className={inputCls}
            value={s.provider}
            onChange={(e) => setS({ ...s, provider: e.target.value })}
          >
            <option value="shiprocket">Shiprocket</option>
            <option value="delhivery">Delhivery</option>
            <option value="bluedart">Blue Dart</option>
            <option value="dtdc">DTDC</option>
            <option value="manual">Manual / Self-ship</option>
          </select>
        </Field>
        <Field label="Pickup Pincode">
          <input className={inputCls} value={s.pickup_pincode} onChange={(e) => setS({ ...s, pickup_pincode: e.target.value })} placeholder="395009" />
        </Field>
        <Field label="API Key / Email">
          <input className={inputCls} value={s.api_key} onChange={(e) => setS({ ...s, api_key: e.target.value })} placeholder="account@example.com" />
        </Field>
        <Field label="API Secret / Password">
          <SecretInput value={s.api_secret} onChange={(v) => setS({ ...s, api_secret: v })} placeholder="••••••••" />
        </Field>
        <Field label="Default Package Weight (grams)">
          <input
            type="number"
            className={inputCls}
            value={s.default_weight_g}
            onChange={(e) => setS({ ...s, default_weight_g: Number(e.target.value) })}
          />
        </Field>
        <label className="flex items-center gap-2 text-sm text-primary/80 sm:col-span-2">
          <input type="checkbox" checked={s.enabled} onChange={(e) => setS({ ...s, enabled: e.target.checked })} />
          Enable shipping integration
        </label>
        <div className="sm:col-span-2">
          <SaveBtn saving={saving} />
        </div>
      </form>
    </Section>
  );
}
