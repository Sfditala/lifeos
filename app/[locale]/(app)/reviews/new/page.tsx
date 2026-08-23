import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { ReviewForm } from "@/components/review-form";

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function daysAgoIso(days: number) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

export default async function NewReviewPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type: rawType } = await searchParams;
  const type = rawType === "weekly" ? "weekly" : "daily";
  const today = todayIso();
  const periodStart = type === "weekly" ? daysAgoIso(6) : today;
  const periodEnd = today;

  const supabase = await createClient();
  const t = await getTranslations("reviews");

  let completedToday: { id: string; title: string }[] = [];
  let overdueTasks: { id: string; title: string; due_date: string | null }[] = [];

  if (type === "daily") {
    const [{ data: completed }, { data: overdue }] = await Promise.all([
      supabase
        .from("tasks")
        .select("id, title")
        .eq("status", "done")
        .gte("completed_at", `${today}T00:00:00`)
        .lte("completed_at", `${today}T23:59:59`),
      supabase
        .from("tasks")
        .select("id, title, due_date")
        .lt("due_date", today)
        .neq("status", "done"),
    ]);
    completedToday = completed ?? [];
    overdueTasks = overdue ?? [];
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6">
      <h1 className="text-2xl font-semibold text-foreground">
        {type === "daily" ? t("newDaily") : t("newWeekly")}
      </h1>

      {type === "daily" && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <h2 className="mb-2 text-sm font-semibold text-foreground">
              {t("completedToday")}
            </h2>
            {completedToday.length > 0 ? (
              <ul className="divide-y divide-border rounded-lg border border-border text-sm">
                {completedToday.map((task) => (
                  <li key={task.id} className="px-3 py-2 text-foreground">
                    {task.title}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">—</p>
            )}
          </div>
          <div>
            <h2 className="mb-2 text-sm font-semibold text-destructive">
              {t("overdueToday")}
            </h2>
            {overdueTasks.length > 0 ? (
              <ul className="divide-y divide-border rounded-lg border border-border text-sm">
                {overdueTasks.map((task) => (
                  <li key={task.id} className="px-3 py-2 text-foreground">
                    {task.title}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">—</p>
            )}
          </div>
        </div>
      )}

      <ReviewForm type={type} periodStart={periodStart} periodEnd={periodEnd} />
    </div>
  );
}
