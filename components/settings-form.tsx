"use client";

import { useRef, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { upsertUserSettings } from "@/lib/actions";
import { LIFE_AREA_PALETTE } from "@/lib/palette";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SettingsForm({
  displayName,
  accentColor,
}: {
  displayName: string | null;
  accentColor: string | null;
}) {
  const t = useTranslations("settings");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [color, setColor] = useState<string | null>(accentColor);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!formRef.current) return;
    setPending(true);
    const formData = new FormData(formRef.current);
    formData.set("accent_color", color ?? "");
    await upsertUserSettings(formData);
    setPending(false);
    router.refresh();
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="flex flex-col gap-6 rounded-xl border border-border bg-card p-6 shadow-sm"
    >
      <div className="space-y-1.5">
        <Label htmlFor="display_name">{t("displayName")}</Label>
        <Input
          id="display_name"
          name="display_name"
          defaultValue={displayName ?? ""}
          placeholder={t("displayNamePlaceholder")}
        />
      </div>

      <div className="space-y-2">
        <Label>{t("accentColor")}</Label>
        <div className="flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={() => setColor(null)}
            aria-pressed={color === null}
            title={t("accentDefault")}
            className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-[10px] font-semibold transition-transform hover:scale-105 ${
              color === null ? "border-foreground" : "border-transparent"
            }`}
            style={{
              background:
                "linear-gradient(135deg, #E1552F, #FF7A54)",
              color: "#fff",
              boxShadow: "0 0 0 1px var(--border) inset",
            }}
          />
          {LIFE_AREA_PALETTE.map((swatch) => (
            <button
              key={swatch}
              type="button"
              onClick={() => setColor(swatch)}
              aria-pressed={color === swatch}
              className={`h-9 w-9 rounded-full border-2 transition-transform hover:scale-105 ${
                color === swatch ? "border-foreground" : "border-transparent"
              }`}
              style={{
                background: swatch,
                boxShadow: "0 0 0 1px var(--border) inset",
              }}
            />
          ))}
        </div>
      </div>

      <div>
        <Button type="submit" disabled={pending}>
          {tCommon("save")}
        </Button>
      </div>
    </form>
  );
}
