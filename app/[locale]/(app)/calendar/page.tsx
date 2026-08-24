import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { CalendarMonth } from "@/components/calendar-month";

export type CalendarItem = {
  type: "task" | "goal" | "content" | "meeting";
  label: string;
  color: string;
};

function parseMonthParam(month?: string) {
  const now = new Date();
  if (month && /^\d{4}-\d{2}$/.test(month)) {
    const [y, m] = month.split("-").map(Number);
    return { year: y, month: m };
  }
  return { year: now.getFullYear(), month: now.getMonth() + 1 };
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const { month: monthParam } = await searchParams;
  const { year, month } = parseMonthParam(monthParam);

  const start = `${year}-${pad(month)}-01`;
  const lastDay = new Date(year, month, 0).getDate();
  const end = `${year}-${pad(month)}-${pad(lastDay)}`;
  const startTs = `${start}T00:00:00`;
  const endTs = `${end}T23:59:59`;

  const supabase = await createClient();
  const [{ data: tasks }, { data: goals }, { data: content }, { data: meetings }] =
    await Promise.all([
      supabase
        .from("tasks")
        .select("title, due_date, life_areas(color)")
        .is("deleted_at", null)
        .gte("due_date", start)
        .lte("due_date", end),
      supabase
        .from("goals")
        .select("title, target_date, life_areas(color)")
        .is("deleted_at", null)
        .gte("target_date", start)
        .lte("target_date", end),
      supabase
        .from("content_items")
        .select("title, scheduled_date, life_areas(color)")
        .is("deleted_at", null)
        .gte("scheduled_date", start)
        .lte("scheduled_date", end),
      supabase
        .from("meetings")
        .select("title, starts_at, life_areas(color)")
        .is("deleted_at", null)
        .gte("starts_at", startTs)
        .lte("starts_at", endTs),
    ]);

  const t = await getTranslations("calendar");

  const itemsByDate = new Map<string, CalendarItem[]>();

  function addItem(
    date: string | null,
    type: CalendarItem["type"],
    label: string,
    color: string | null | undefined,
  ) {
    if (!date) return;
    if (!itemsByDate.has(date)) itemsByDate.set(date, []);
    itemsByDate
      .get(date)!
      .push({ type, label, color: color ?? "var(--muted-foreground)" });
  }

  for (const task of tasks ?? []) {
    addItem(task.due_date, "task", task.title, task.life_areas?.[0]?.color);
  }
  for (const goal of goals ?? []) {
    addItem(goal.target_date, "goal", goal.title, goal.life_areas?.[0]?.color);
  }
  for (const item of content ?? []) {
    addItem(
      item.scheduled_date,
      "content",
      item.title,
      item.life_areas?.[0]?.color,
    );
  }
  for (const meeting of meetings ?? []) {
    addItem(
      meeting.starts_at.slice(0, 10),
      "meeting",
      meeting.title,
      meeting.life_areas?.[0]?.color,
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 sm:p-6">
      <h1 className="text-2xl font-semibold text-foreground">{t("title")}</h1>
      <CalendarMonth
        year={year}
        month={month}
        itemsByDate={Object.fromEntries(itemsByDate)}
        labels={{
          task: t("task"),
          goal: t("goal"),
          content: t("content"),
          meeting: t("meeting"),
          empty: t("empty"),
        }}
      />
    </div>
  );
}
