"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const t = useTranslations("login");
  const tApp = useTranslations("app");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setLoading(false);

    if (signInError) {
      setError(t("error"));
      return;
    }

    setSent(true);
  }

  return (
    <div className="flex flex-1 items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-4 rounded-lg border border-border bg-card p-6">
        <h1 className="text-xl font-semibold text-foreground">
          {tApp("name")}
        </h1>
        <p className="text-sm text-muted-foreground">{t("title")}</p>

        {sent ? (
          <p className="text-sm text-foreground">{t("checkEmail")}</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="email" className="text-sm text-muted-foreground">
                {t("email")}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground outline-none focus:border-ring"
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-primary px-4 py-2 text-primary-foreground transition-opacity disabled:opacity-50"
            >
              {loading ? t("loading") : t("submit")}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
