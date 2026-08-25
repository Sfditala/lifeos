import { getTranslations, getLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { TaskCheckbox } from "@/components/task-checkbox";
import { QuickAddTask } from "@/components/quick-add-task";
import { Badge } from "@/components/ui/badge";

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
    { data: upcomingGoals },
    { data: areas },
    { data: upcomingMeetings },
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
      .select("id, title, target_date")
      .is("deleted_at", null)
      .eq("status", "active")
      .gte("target_date", today)
      .order("target_date", { ascending: true })
      .limit(3),
    supabase
      .from("life_areas")
      .select("id, name")
      .is("deleted_at", null)
      .order("sort_order", { ascending: true }),
    supabase
      .from("meetings")
      .select("id, title, starts_at, location")
      .is("deleted_at", null)
      .gte("starts_at", nowIso)
      .lte("starts_at", in72h)
      .order("starts_at", { ascending: true }),
  ]);

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

      <section>
        <h2 className="mb-3 text-sm font-semibold text-foreground">
          {tMeetings("upcoming")}
        </h2>
        {upcomingMeetings && upcomingMeetings.length > 0 ? (
          <ul className="divide-y divide-border rounded-lg border border-border">
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
  );
}
