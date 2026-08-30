"use client";

import { useTransition } from "react";
import { useTranslations, useLocale } from "next-intl";
import { toggleHabitLog, deleteHabit } from "@/lib/actions";
import { AddHabitDialog } from "@/components/add-habit-dialog";
import { RowMenu } from "@/components/row-menu";

type WeekCell = { weekStart: string; done: boolean; isCurrent: boolean; isFuture: boolean };
type Habit = {
  id: string;
  name: string;
  category: string | null;
  weeks: WeekCell[];
};

export function HabitWeeklyTable({ habits }: { habits: Habit[] }) {
  const [isPending, startTransition] = useTransition();
  const t = useTranslations("habits");
  const tCommon = useTranslations("common");
  const locale = useLocale();

  const dateFormatter = new Intl.DateTimeFormat(
    locale === "ar" ? "ar-u-nu-latn" : "en",
    { month: "short", day: "numeric" },
  );

  if (habits.length === 0) return null;
  const weekStarts = habits[0].weeks.map((w) => w.weekStart);

  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-card shadow-sm">
      <table className="w-full min-w-[560px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="p-3 text-start font-medium text-foreground">
              {t("weeklyHabitsTitle")}
            </th>
            {weekStarts.map((weekStart) => (
              <th
                key={weekStart}
                className="p-2 text-center text-xs font-medium text-muted-foreground"
              >
                {dateFormatter.format(new Date(weekStart))}
              </th>
            ))}
            <th className="p-2" />
          </tr>
        </thead>
        <tbody>
          {habits.map((habit) => (
            <tr key={habit.id} className="border-b border-border last:border-0">
              <td className="p-3">
                <div className="flex items-center gap-2">
                  <span className="text-foreground">{habit.name}</span>
                  {habit.category && (
                    <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
                      {t(`category_${habit.category}` as "category_health")}
                    </span>
                  )}
                </div>
              </td>
              {habit.weeks.map((week) => (
                <td key={week.weekStart} className="p-2 text-center">
                  <button
                    type="button"
                    disabled={isPending || week.isFuture}
                    onClick={() =>
                      startTransition(() => {
                        toggleHabitLog(habit.id, week.weekStart, !week.done);
                      })
                    }
                    className={`mx-auto flex h-7 w-7 items-center justify-center rounded-md border transition-colors disabled:cursor-not-allowed ${
                      week.done
                        ? "border-transparent bg-emerald-500/80 text-white"
                        : week.isCurrent
                          ? "border-primary text-primary"
                          : "border-border text-muted-foreground"
                    }`}
                  />
                </td>
              ))}
              <td className="p-2">
                <RowMenu
                  deleteTitle={tCommon("confirmDeleteTitle")}
                  deleteImpact={tCommon("deleteSimpleImpact")}
                  onDelete={() => deleteHabit(habit.id)}
                  renderEdit={(open, onOpenChange) => (
                    <AddHabitDialog
                      initial={{
                        id: habit.id,
                        name: habit.name,
                        frequency: "weekly",
                        custom_days: null,
                        category: habit.category,
                      }}
                      open={open}
                      onOpenChange={onOpenChange}
                    />
                  )}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
