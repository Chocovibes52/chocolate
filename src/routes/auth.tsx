import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { LogIn, UserPlus } from "lucide-react";
import { createLovableAuth } from "@lovable.dev/cloud-auth-js";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign In / Register — ChocoVibes" },
      {
        name: "description",
        content:
          "Sign in to track orders, save favourites, and check out faster.",
      },
      { property: "og:title", content: "Sign In / Register — ChocoVibes" },
    ],
  }),
  component: AuthPage,
});

type OAuthOptions = {
  redirect_uri?: string;
  extraParams?: Record<string, string>;
};

interface LovableAuthClient {
  signInWithOAuth: (
    provider: string,
    opts?: OAuthOptions,
  ) => Promise<{
    redirected?: boolean;
    error?: unknown;
    tokens?: { access_token: string; refresh_token: string };
  }>;
}

const lovableAuth = createLovableAuth() as unknown as LovableAuthClient;
const lovable = {
  auth: {
    signInWithOAuth: async (provider: string, opts?: OAuthOptions) => {
      const result = await lovableAuth.signInWithOAuth(provider, {
        redirect_uri: opts?.redirect_uri,
        extraParams: { ...opts?.extraParams },
      });
      if (result.redirected) return result;
      if (result.error) return result;
      try {
        if (result.tokens) {
          await supabase.auth.setSession(result.tokens);
        }
      } catch (e) {
        return { error: e instanceof Error ? e : new Error(String(e)) };
      }
      return result;
    },
  },
};

async function routeForUser(userId: string): Promise<"/admin" | "/account"> {
  const { data } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  return data ? "/admin" : "/account";
}

function AuthPage() {
  const nav = useNavigate();
  const { user } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!user) return;
    routeForUser(user.id).then((to) => nav({ to }));
  }, [user, nav]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { full_name: name },
          },
        });
        if (error) throw error;
        toast.success(
          "Account created. Check your email if confirmation is required.",
        );
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success("Welcome back.");
        const to = data.user ? await routeForUser(data.user.id) : "/account";
        nav({ to });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  async function google() {
    setBusy(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result.error) {
        // Fallback to standard supabase oauth if lovable proxy not configured
        const { error: sbErr } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: { redirectTo: window.location.origin },
        });
        if (sbErr) toast.error(sbErr.message);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Google sign-in failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="container-luxe py-24 max-w-md">
      <div className="text-center">
        <div className="eyebrow">Account</div>
        <h1 className="mt-3 font-display text-5xl text-primary">
          {mode === "signin" ? "Welcome back." : "Join ChocoVibes."}
        </h1>
        <p className="mt-3 text-muted-foreground text-sm">
          {mode === "signin"
            ? "Sign in to track your orders and manage your wishlist."
            : "Create an account to check out faster and save favourites."}
        </p>
      </div>

      <button
        onClick={google}
        disabled={busy}
        className="btn-outline-cocoa w-full mt-8"
      >
        Continue with Google
      </button>

      <div className="mt-6 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
        <div className="flex-1 h-px bg-border" />
        or
        <div className="flex-1 h-px bg-border" />
      </div>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        {mode === "signup" && (
          <label className="block">
            <span className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
              Full name
            </span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-2 w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
            />
          </label>
        )}
        <label className="block">
          <span className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
            Email
          </span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-2 w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
          />
        </label>
        <label className="block">
          <span className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
            Password
          </span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="mt-2 w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
          />
        </label>
        <button type="submit" disabled={busy} className="btn-cocoa w-full">
          {mode === "signin" ? (
            <>
              <LogIn size={14} /> Sign in
            </>
          ) : (
            <>
              <UserPlus size={14} /> Create account
            </>
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        {mode === "signin"
          ? "New to ChocoVibes? "
          : "Already have an account? "}
        <button
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="text-accent hover:underline"
        >
          {mode === "signin" ? "Create an account" : "Sign in"}
        </button>
      </p>

      <p className="mt-4 text-center text-xs text-muted-foreground">
        <Link to="/" className="hover:text-primary">
          Continue browsing
        </Link>
      </p>
    </main>
  );
}
