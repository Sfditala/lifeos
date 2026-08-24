"use client";

import { useTransition } from "react";
import { useTranslations, useLocale } from "next-intl";
import { toggleHabitLog, deleteHabit } from "@/lib/actions";
import { AddHabitDialog } from "@/components/add-habit-dialog";
import { RowMenu } from "@/components/row-menu";

type DayCell = { date: string; done: boolean; isFuture: boolean; isToday: boolean };

export function HabitWeekRow({
  habitId,
  name,
  frequency,
  days,
  streak,
}: {
  habitId: string;
  name: string;
  frequency: string;
  days: DayCell[];
  streak: number;
}) {
  const [isPending, startTransition] = useTransition();
  const t = useTranslations("habits");
  const tCommon = useTranslations("common");
  const locale = useLocale();

  const dayFormatter = new Intl.DateTimeFormat(
    locale === "ar" ? "ar-u-nu-latn" : "en",
    { weekday: "narrow" },
  );

  const doneCount = days.filter((d) => d.done).length;
  const percent = Math.round((doneCount / days.length) * 100);

  return (
    <li className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center">
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <span className="truncate text-sm text-foreground">{name}</span>
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
      </div>

      <div className="flex items-center gap-1">
        {days.map((day) => {
          const cellClass = day.isFuture
            ? "border-border text-muted-foreground"
            : day.done
              ? "border-transparent bg-emerald-500/80 text-white"
              : day.isToday
                ? "border-border text-muted-foreground"
                : "border-transparent bg-red-500/70 text-white";
          return (
            <button
              key={day.date}
              type="button"
              disabled={isPending || day.isFuture}
              onClick={() =>
                startTransition(() => {
                  toggleHabitLog(habitId, day.date, !day.done);
                })
              }
              className={`flex h-8 w-8 flex-col items-center justify-center rounded-md border text-[10px] leading-none transition-colors disabled:cursor-not-allowed ${cellClass}`}
              title={day.date}
            >
              {dayFormatter.format(new Date(day.date))}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-2 sm:w-40">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary"
            style={{ width: `${percent}%` }}
          />
        </div>
        <span className="whitespace-nowrap text-xs text-muted-foreground">
          {doneCount}/{days.length} · {streak} {t("streak")}
        </span>
      </div>
    </li>
  );
}
