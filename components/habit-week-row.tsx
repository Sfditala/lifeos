"use client";

import { useTransition } from "react";
import { useTranslations, useLocale } from "next-intl";
import { toggleHabitLog, deleteHabit } from "@/lib/actions";
import { AddHabitDialog } from "@/components/add-habit-dialog";
import { RowMenu } from "@/components/row-menu";

type DayCell = {
  date: string;
  done: boolean;
  isFuture: boolean;
  isToday: boolean;
  applicable: boolean;
};

export function HabitWeekRow({
  habitId,
  name,
  frequency,
  customDays,
  category,
  days,
  streak,
}: {
  habitId: string;
  name: string;
  frequency: string;
  customDays: number[] | null;
  category: string | null;
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

  const applicableDays = days.filter((d) => d.applicable);
  const doneCount = applicableDays.filter((d) => d.done).length;
  const percent =
    applicableDays.length > 0
      ? Math.round((doneCount / applicableDays.length) * 100)
      : 0;

  return (
    <li className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center">
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <span className="truncate text-sm text-foreground">{name}</span>
        {category && (
          <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
            {t(`category_${category}` as "category_health")}
          </span>
        )}
        <RowMenu
          deleteTitle={tCommon("confirmDeleteTitle")}
          deleteImpact={tCommon("deleteSimpleImpact")}
          onDelete={() => deleteHabit(habitId)}
          renderEdit={(open, onOpenChange) => (
            <AddHabitDialog
              initial={{
                id: habitId,
                name,
                frequency,
                custom_days: customDays,
                category,
              }}
              open={open}
              onOpenChange={onOpenChange}
            />
          )}
        />
      </div>

      <div className="flex items-center gap-1">
        {days.map((day) => {
          const cellClass = !day.applicable
            ? "border-dashed border-border text-muted-foreground/40"
            : day.isFuture
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
              disabled={isPending || day.isFuture || !day.applicable}
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
          {doneCount}/{applicableDays.length} · {streak} {t("streak")}
        </span>
      </div>
    </li>
  );
}
