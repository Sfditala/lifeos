"use client";

import { useLocale, useTranslations } from "next-intl";
import { Languages } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("nav");
  const nextLocale = locale === "ar" ? "en" : "ar";

  return (
    <Link
      href={pathname}
      locale={nextLocale}
      aria-label={t("language")}
      title={t("language")}
      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:text-foreground"
    >
      <Languages className="h-4 w-4" />
    </Link>
  );
}
