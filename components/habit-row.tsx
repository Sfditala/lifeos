"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { Checkbox } from "@/components/ui/checkbox";
import { toggleHabitToday } from "@/lib/actions";

export function HabitRow({
  name,
  doneToday,
  streak,
  habitId,
}: {
  name: string;
  doneToday: boolean;
  streak: number;
  habitId: string;
}) {
  const [isPending, startTransition] = useTransition();
  const t = useTranslations("habits");

  return (
    <li className="flex items-center gap-3 px-4 py-3">
      <Checkbox
        checked={doneToday}
        disabled={isPending}
        onCheckedChange={(checked) => {
          startTransition(() => {
            toggleHabitToday(habitId, checked === true);
          });
        }}
      />
      <span className="flex-1 text-sm text-foreground">{name}</span>
      <span className="text-xs text-muted-foreground">
        {streak} {t("days")} · {t("streak")}
      </span>
    </li>
  );
}
