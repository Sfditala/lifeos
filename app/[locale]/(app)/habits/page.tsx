import { Repeat } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { HabitWeekRow } from "@/components/habit-week-row";
import { HabitWeeklyTable } from "@/components/habit-weekly-table";
import { AddHabitDialog } from "@/components/add-habit-dialog";
import { EmptyState } from "@/components/empty-state";
import { HABIT_CATEGORIES, isApplicableDay } from "@/lib/habits";

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function toIso(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

// Week runs Saturday -> Friday, matching the calendar page's convention.
function weekStartFor(date: Date) {
  const jsDay = date.getDay();
  const sinceSaturday = (jsDay + 1) % 7;
  const saturday = new Date(date);
  saturday.setDate(date.getDate() - sinceSaturday);
  return saturday;
}

function currentWeekDates() {
  const saturday = weekStartFor(new Date());
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(saturday);
    d.setDate(saturday.getDate() + i);
    return toIso(d);
  });
}

function lastNWeekStarts(n: number) {
  const thisWeekStart = weekStartFor(new Date());
  return Array.from({ length: n }, (_, i) => {
    const d = new Date(thisWeekStart);
    d.setDate(thisWeekStart.getDate() - (n - 1 - i) * 7);
    return toIso(d);
  });
}

function computeStreak(
  logDates: Set<string>,
  frequency: string,
  customDays: number[] | null,
) {
  let streak = 0;
  const cursor = new Date();
  while (true) {
    const iso = toIso(cursor);
    if (!isApplicableDay(cursor.getDay(), frequency, customDays)) {
      cursor.setDate(cursor.getDate() - 1);
      continue;
    }
    if (logDates.has(iso)) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

export default async function HabitsPage() {
  const supabase = await createClient();
  const today = todayIso();
  const weekDates = currentWeekDates();
  const weekStarts = lastNWeekStarts(6);
  const thisWeekStart = weekStarts[weekStarts.length - 1];

  const { data: habits } = await supabase
    .from("habits")
    .select("id, name, frequency, custom_days, category")
    .eq("active", true)
    .is("deleted_at", null)
    .order("created_at", { ascending: true });

  const habitIds = (habits ?? []).map((h) => h.id);
  const { data: logs } =
    habitIds.length > 0
      ? await supabase
          .from("habit_logs")
          .select("habit_id, log_date")
          .in("habit_id", habitIds)
          .eq("done", true)
          .order("log_date", { ascending: false })
          .limit(2000)
      : { data: [] };

  const logsByHabit = new Map<string, Set<string>>();
  for (const log of logs ?? []) {
    if (!logsByHabit.has(log.habit_id)) logsByHabit.set(log.habit_id, new Set());
    logsByHabit.get(log.habit_id)!.add(log.log_date);
  }

  const t = await getTranslations("habits");

  const dailyHabits = (habits ?? []).filter((h) => h.frequency !== "weekly");
  const weeklyHabits = (habits ?? []).filter((h) => h.frequency === "weekly");

  const dailyByCategory = new Map<string, typeof dailyHabits>();
  for (const habit of dailyHabits) {
    const key = habit.category ?? "__none";
    if (!dailyByCategory.has(key)) dailyByCategory.set(key, []);
    dailyByCategory.get(key)!.push(habit);
  }
  const categoryOrder = [...HABIT_CATEGORIES, "__none"];
  const orderedCategories = categoryOrder.filter((c) => dailyByCategory.has(c));

  const weeklyRows = weeklyHabits.map((habit) => {
    const dates = logsByHabit.get(habit.id) ?? new Set<string>();
    return {
      id: habit.id,
      name: habit.name,
      category: habit.category,
      weeks: weekStarts.map((weekStart) => ({
        weekStart,
        done: dates.has(weekStart),
        isCurrent: weekStart === thisWeekStart,
        isFuture: weekStart > thisWeekStart,
      })),
    };
  });

  return (
    <div className="flex flex-1 flex-col gap-8 p-4 sm:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">
          {t("title")}
        </h1>
        <AddHabitDialog />
      </div>

      {habits && habits.length > 0 ? (
        <>
          {orderedCategories.map((categoryKey) => (
            <div key={categoryKey} className="flex flex-col gap-3">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {categoryKey === "__none"
                  ? t("uncategorized")
                  : t(`category_${categoryKey}` as "category_health")}
              </h2>
              <ul className="divide-y divide-border rounded-lg border border-border bg-card shadow-sm">
                {dailyByCategory.get(categoryKey)!.map((habit) => {
                  const dates = logsByHabit.get(habit.id) ?? new Set<string>();
                  const days = weekDates.map((date) => ({
                    date,
                    done: dates.has(date),
                    isFuture: date > today,
                    isToday: date === today,
                    applicable: isApplicableDay(
                      new Date(date).getDay(),
                      habit.frequency,
                      habit.custom_days,
                    ),
                  }));
                  return (
                    <HabitWeekRow
                      key={habit.id}
                      habitId={habit.id}
                      name={habit.name}
                      frequency={habit.frequency}
                      customDays={habit.custom_days}
                      category={habit.category}
                      days={days}
                      streak={computeStreak(dates, habit.frequency, habit.custom_days)}
                    />
                  );
                })}
              </ul>
            </div>
          ))}

          {weeklyRows.length > 0 && (
            <div className="flex flex-col gap-3">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {t("weeklyHabitsTitle")}
              </h2>
              <HabitWeeklyTable habits={weeklyRows} />
            </div>
          )}
        </>
      ) : (
        <EmptyState
          icon={Repeat}
          message={t("empty")}
          action={<AddHabitDialog />}
        />
      )}
    </div>
  );
}
