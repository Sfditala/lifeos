import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { AddContentDialog } from "@/components/add-content-dialog";
import { ContentList } from "@/components/content-list";

export default async function ContentPage() {
  const supabase = await createClient();

  const [{ data: items }, { data: projects }] = await Promise.all([
    supabase
      .from("content_items")
      .select("id, title, status, scheduled_date, project_id, life_areas(color)")
      .is("deleted_at", null)
      .order("created_at", { ascending: false }),
    supabase
      .from("projects")
      .select("id, name, life_area_id")
      .is("deleted_at", null)
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

      <ContentList
        items={(items ?? []).map((item) => ({
          id: item.id,
          title: item.title,
          status: item.status,
          scheduled_date: item.scheduled_date,
          project_id: item.project_id,
          color: item.life_areas?.[0]?.color ?? null,
        }))}
        projects={projects ?? []}
      />
    </div>
  );
}
