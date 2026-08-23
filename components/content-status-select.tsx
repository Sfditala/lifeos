"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { updateContentStatus } from "@/lib/actions";

const STATUSES = ["idea", "draft", "scheduled", "published"];

export function ContentStatusSelect({
  itemId,
  status,
}: {
  itemId: string;
  status: string;
}) {
  const [isPending, startTransition] = useTransition();
  const t = useTranslations("status");

  return (
    <select
      defaultValue={status}
      disabled={isPending}
      onChange={(event) => {
        startTransition(() => {
          updateContentStatus(itemId, event.target.value);
        });
      }}
      className="rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {t(s)}
        </option>
      ))}
    </select>
  );
}
