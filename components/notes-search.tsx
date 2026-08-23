"use client";

import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";

export function NotesSearch({ defaultValue }: { defaultValue: string }) {
  const t = useTranslations("notes");
  const router = useRouter();
  const pathname = usePathname();

  return (
    <input
      defaultValue={defaultValue}
      placeholder={t("search")}
      onChange={(event) => {
        const q = event.target.value;
        router.replace(q ? `${pathname}?q=${encodeURIComponent(q)}` : pathname);
      }}
      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-ring sm:max-w-xs"
    />
  );
}
