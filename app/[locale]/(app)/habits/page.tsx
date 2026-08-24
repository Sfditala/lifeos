import { Repeat } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { HabitRow } from "@/components/habit-row";
import { AddHabitDialog } from "@/components/add-habit-dialog";
import { EmptyState } from "@/components/empty-state";

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function computeStreak(logDates: Set<string>) {
  let streak = 0;
  const cursor = new Date();
  while (true) {
    const iso = cursor.toISOString().slice(0, 10);
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

  const { data: habits } = await supabase
    .from("habits")
    .select("id, name, frequency")
    .eq("active", true)
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

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 sm:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">
          {t("title")}
        </h1>
        <AddHabitDialog />
      </div>

      {habits && habits.length > 0 ? (
        <ul className="divide-y divide-border rounded-lg border border-border">
          {habits.map((habit) => {
            const dates = logsByHabit.get(habit.id) ?? new Set<string>();
            return (
              <HabitRow
                key={habit.id}
                habitId={habit.id}
                name={habit.name}
                doneToday={dates.has(today)}
                streak={computeStreak(dates)}
              />
            );
          })}
        </ul>
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
