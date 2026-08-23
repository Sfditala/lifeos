import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { TaskCheckbox } from "@/components/task-checkbox";
import { QuickAddTask } from "@/components/quick-add-task";

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export default async function HomePage() {
  const supabase = await createClient();
  const today = todayIso();

  const [
    { data: todayTasks },
    { data: overdueTasks },
    { data: upcomingGoals },
    { data: areas },
  ] = await Promise.all([
    supabase
      .from("tasks")
      .select("id, title, priority, status, due_date")
      .eq("due_date", today)
      .neq("status", "done")
      .order("priority", { ascending: false }),
    supabase
      .from("tasks")
      .select("id, title, priority, status, due_date")
      .lt("due_date", today)
      .neq("status", "done")
      .order("due_date", { ascending: true }),
    supabase
      .from("goals")
      .select("id, title, target_date")
      .eq("status", "active")
      .gte("target_date", today)
      .order("target_date", { ascending: true })
      .limit(3),
    supabase
      .from("life_areas")
      .select("id, name")
      .order("sort_order", { ascending: true }),
  ]);

  const t = await getTranslations("home");

  return (
    <div className="flex flex-1 flex-col gap-8 p-4 sm:p-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          {t("welcome")}
        </h1>
      </div>

      <QuickAddTask areas={areas ?? []} />

      {overdueTasks && overdueTasks.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-semibold text-destructive">
            {t("overdue")}
          </h2>
          <ul className="divide-y divide-border rounded-lg border border-border">
            {overdueTasks.map((task) => (
              <li
                key={task.id}
                className="flex items-center gap-3 px-4 py-3"
              >
                <TaskCheckbox taskId={task.id} done={task.status === "done"} />
                <span className="flex-1 text-sm text-foreground">
                  {task.title}
                </span>
                <span className="text-xs text-muted-foreground">
                  {task.due_date}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <h2 className="mb-3 text-sm font-semibold text-foreground">
          {t("today")}
        </h2>
        {todayTasks && todayTasks.length > 0 ? (
          <ul className="divide-y divide-border rounded-lg border border-border">
            {todayTasks.map((task) => (
              <li
                key={task.id}
                className="flex items-center gap-3 px-4 py-3"
              >
                <TaskCheckbox taskId={task.id} done={task.status === "done"} />
                <span className="flex-1 text-sm text-foreground">
                  {task.title}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">{t("noTasksToday")}</p>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold text-foreground">
          {t("upcoming")}
        </h2>
        {upcomingGoals && upcomingGoals.length > 0 ? (
          <ul className="divide-y divide-border rounded-lg border border-border">
            {upcomingGoals.map((goal) => (
              <li
                key={goal.id}
                className="flex items-center justify-between px-4 py-3"
              >
                <span className="text-sm text-foreground">{goal.title}</span>
                <span className="text-xs text-muted-foreground">
                  {goal.target_date}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">{t("noUpcoming")}</p>
        )}
      </section>
    </div>
  );
}
