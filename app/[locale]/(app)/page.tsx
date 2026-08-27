import { getTranslations, getLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { TaskCheckbox } from "@/components/task-checkbox";
import { QuickAddTask } from "@/components/quick-add-task";
import { GoalsDashboard } from "@/components/goals-dashboard";
import { AreaCardGrid } from "@/components/area-card-grid";
import { Badge } from "@/components/ui/badge";
import { computeGoalProgress } from "@/lib/goals";

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export default async function HomePage() {
  const supabase = await createClient();
  const today = todayIso();

  const in72h = new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString();
  const nowIso = new Date().toISOString();

  const [
    { data: todayTasks },
    { data: overdueTasks },
    { data: goals },
    { data: allTasks },
    { data: areas },
    { data: upcomingMeetings },
    { data: allProjects },
  ] = await Promise.all([
    supabase
      .from("tasks")
      .select("id, title, priority, status, due_date")
      .is("deleted_at", null)
      .eq("due_date", today)
      .neq("status", "done")
      .order("priority", { ascending: false }),
    supabase
      .from("tasks")
      .select("id, title, priority, status, due_date")
      .is("deleted_at", null)
      .lt("due_date", today)
      .neq("status", "done")
      .order("due_date", { ascending: true }),
    supabase
      .from("goals")
      .select(
        "id, title, description, status, target_date, period_type, parent_goal_id, life_area_id, period_start, period_end",
      )
      .is("deleted_at", null)
      .order("created_at", { ascending: true }),
    supabase
      .from("tasks")
      .select("life_area_id, status, due_date")
      .is("deleted_at", null),
    supabase
      .from("life_areas")
      .select("id, name, color")
      .is("deleted_at", null)
      .order("sort_order", { ascending: true }),
    supabase
      .from("meetings")
      .select("id, title, starts_at, location")
      .is("deleted_at", null)
      .gte("starts_at", nowIso)
      .lte("starts_at", in72h)
      .order("starts_at", { ascending: true }),
    supabase
      .from("projects")
      .select("life_area_id, status")
      .is("deleted_at", null),
  ]);

  const progressMap = computeGoalProgress(goals ?? [], allTasks ?? []);
  const progress = Object.fromEntries(progressMap);

  const activeProjectsByArea = new Map<string, number>();
  for (const p of allProjects ?? []) {
    if (p.status !== "active") continue;
    activeProjectsByArea.set(
      p.life_area_id,
      (activeProjectsByArea.get(p.life_area_id) ?? 0) + 1,
    );
  }
  const overdueByArea = new Map<string, number>();
  for (const task of allTasks ?? []) {
    if (task.status === "done" || !task.due_date || task.due_date >= today) continue;
    overdueByArea.set(
      task.life_area_id,
      (overdueByArea.get(task.life_area_id) ?? 0) + 1,
    );
  }
  const areaCards = (areas ?? []).map((area) => ({
    id: area.id,
    name: area.name,
    color: area.color,
    activeProjects: activeProjectsByArea.get(area.id) ?? 0,
    overdueTasks: overdueByArea.get(area.id) ?? 0,
  }));

  const { data: recurringTx } = await supabase
    .from("transactions")
    .select("id, amount, category, note, occurred_at, finance_accounts(currency)")
    .is("deleted_at", null)
    .eq("is_recurring", true)
    .order("occurred_at", { ascending: false });

  const in5Days = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);
  const seenCategory = new Set<string>();
  const dueRecurring = (recurringTx ?? [])
    .filter((tx) => {
      const key = tx.category ?? tx.note ?? tx.id;
      if (seenCategory.has(key)) return false;
      seenCategory.add(key);
      const next = new Date(tx.occurred_at);
      next.setMonth(next.getMonth() + 1);
      const nextIso = next.toISOString().slice(0, 10);
      return nextIso >= today && nextIso <= in5Days;
    })
    .map((tx) => {
      const next = new Date(tx.occurred_at);
      next.setMonth(next.getMonth() + 1);
      return {
        id: tx.id,
        label: tx.note || tx.category || "—",
        amount: Number(tx.amount),
        currency: tx.finance_accounts?.[0]?.currency ?? "",
        dueDate: next.toISOString().slice(0, 10),
      };
    });

  const t = await getTranslations("home");
  const tMeetings = await getTranslations("meetings");
  const tFinance = await getTranslations("finance");
  const locale = await getLocale();
  const nuLocale = locale === "ar" ? "ar-u-nu-latn" : "en";
  const numberFormatter = new Intl.NumberFormat(nuLocale);
  const meetingTimeFormatter = new Intl.DateTimeFormat(nuLocale, {
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="flex flex-1 flex-col gap-8 p-4 sm:p-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          {t("welcome")}
        </h1>
      </div>

      <GoalsDashboard
        goals={goals ?? []}
        progress={progress}
        lifeAreas={areas ?? []}
      />

      {areaCards.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-semibold text-foreground">
            {t("lifeAreas")}
          </h2>
          <AreaCardGrid areas={areaCards} />
        </section>
      )}

      <div className="flex flex-col gap-6 border-t border-border pt-8">
        <QuickAddTask areas={areas ?? []} />

        {dueRecurring.length > 0 && (
          <section>
            <h2 className="mb-3 text-sm font-semibold text-foreground">
              {tFinance("recurringDue")}
            </h2>
            <ul className="flex flex-wrap gap-2">
              {dueRecurring.map((tx) => (
                <li key={tx.id}>
                  <Badge variant="outline">
                    {tx.label} · {numberFormatter.format(tx.amount)} {tx.currency} ·{" "}
                    {tx.dueDate}
                  </Badge>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          <section>
            <h2 className="mb-3 text-sm font-semibold text-foreground">
              {t("today")}
            </h2>
            {todayTasks && todayTasks.length > 0 ? (
              <ul className="divide-y divide-border rounded-lg border border-border bg-card shadow-sm">
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

          {overdueTasks && overdueTasks.length > 0 && (
            <section>
              <h2 className="mb-3 text-sm font-semibold text-destructive">
                {t("overdue")}
              </h2>
              <ul className="divide-y divide-border rounded-lg border border-border bg-card shadow-sm">
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
              {tMeetings("upcoming")}
            </h2>
            {upcomingMeetings && upcomingMeetings.length > 0 ? (
              <ul className="divide-y divide-border rounded-lg border border-border bg-card shadow-sm">
                {upcomingMeetings.map((meeting) => (
                  <li
                    key={meeting.id}
                    className="flex items-center justify-between px-4 py-3"
                  >
                    <span className="text-sm text-foreground">
                      {meeting.title}
                      {meeting.location && (
                        <span className="text-muted-foreground"> · {meeting.location}</span>
                      )}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {meetingTimeFormatter.format(new Date(meeting.starts_at))}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                {tMeetings("noUpcoming")}
              </p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
