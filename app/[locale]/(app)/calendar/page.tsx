import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";

type CalendarItem = {
  date: string;
  type: "task" | "goal" | "content";
  label: string;
};

export default async function CalendarPage() {
  const supabase = await createClient();

  const [{ data: tasks }, { data: goals }, { data: content }] =
    await Promise.all([
      supabase
        .from("tasks")
        .select("title, due_date")
        .not("due_date", "is", null),
      supabase
        .from("goals")
        .select("title, target_date")
        .not("target_date", "is", null),
      supabase
        .from("content_items")
        .select("title, scheduled_date")
        .not("scheduled_date", "is", null),
    ]);

  const items: CalendarItem[] = [
    ...(tasks ?? []).map((t) => ({
      date: t.due_date as string,
      type: "task" as const,
      label: t.title,
    })),
    ...(goals ?? []).map((g) => ({
      date: g.target_date as string,
      type: "goal" as const,
      label: g.title,
    })),
    ...(content ?? []).map((c) => ({
      date: c.scheduled_date as string,
      type: "content" as const,
      label: c.title,
    })),
  ].sort((a, b) => a.date.localeCompare(b.date));

  const grouped = new Map<string, CalendarItem[]>();
  for (const item of items) {
    if (!grouped.has(item.date)) grouped.set(item.date, []);
    grouped.get(item.date)!.push(item);
  }

  const t = await getTranslations("calendar");

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 sm:p-6">
      <h1 className="text-2xl font-semibold text-foreground">{t("title")}</h1>

      {grouped.size > 0 ? (
        <div className="space-y-6">
          {Array.from(grouped.entries()).map(([date, dayItems]) => (
            <div key={date}>
              <h2 className="mb-2 text-sm font-semibold text-foreground">
                {date}
              </h2>
              <ul className="divide-y divide-border rounded-lg border border-border">
                {dayItems.map((item, index) => (
                  <li
                    key={`${date}-${index}`}
                    className="flex items-center gap-3 px-4 py-3"
                  >
                    <Badge variant="outline">{t(item.type)}</Badge>
                    <span className="text-sm text-foreground">
                      {item.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">{t("empty")}</p>
      )}
    </div>
  );
}
