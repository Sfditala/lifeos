import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { AddContentDialog } from "@/components/add-content-dialog";
import { ContentStatusSelect } from "@/components/content-status-select";

export default async function ContentPage() {
  const supabase = await createClient();

  const [{ data: items }, { data: projects }] = await Promise.all([
    supabase
      .from("content_items")
      .select("id, title, status, scheduled_date")
      .order("created_at", { ascending: false }),
    supabase
      .from("projects")
      .select("id, name, life_area_id")
      .order("created_at", { ascending: false }),
  ]);

  const t = await getTranslations("content");

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 sm:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">
          {t("title")}
        </h1>
        <AddContentDialog projects={projects ?? []} />
      </div>

      {items && items.length > 0 ? (
        <ul className="divide-y divide-border rounded-lg border border-border">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-center gap-3 px-4 py-3"
            >
              <span className="flex-1 text-sm text-foreground">
                {item.title}
              </span>
              {item.scheduled_date && (
                <span className="text-xs text-muted-foreground">
                  {item.scheduled_date}
                </span>
              )}
              <ContentStatusSelect itemId={item.id} status={item.status} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">{t("empty")}</p>
      )}
    </div>
  );
}
