"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { Checkbox } from "@/components/ui/checkbox";
import { toggleHabitToday, deleteHabit } from "@/lib/actions";
import { AddHabitDialog } from "@/components/add-habit-dialog";
import { RowMenu } from "@/components/row-menu";

export function HabitRow({
  name,
  frequency,
  doneToday,
  streak,
  habitId,
}: {
  name: string;
  frequency: string;
  doneToday: boolean;
  streak: number;
  habitId: string;
}) {
  const [isPending, startTransition] = useTransition();
  const t = useTranslations("habits");
  const tCommon = useTranslations("common");

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
      <RowMenu
        deleteTitle={tCommon("confirmDeleteTitle")}
        deleteImpact={tCommon("deleteSimpleImpact")}
        onDelete={() => deleteHabit(habitId)}
        renderEdit={(open, onOpenChange) => (
          <AddHabitDialog
            initial={{ id: habitId, name, frequency }}
            open={open}
            onOpenChange={onOpenChange}
          />
        )}
      />
    </li>
  );
}
