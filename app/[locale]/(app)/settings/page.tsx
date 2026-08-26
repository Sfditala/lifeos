import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { SettingsForm } from "@/components/settings-form";
import { AddLifeAreaDialog } from "@/components/add-life-area-dialog";
import { RowMenu } from "@/components/row-menu";
import { deleteLifeArea } from "@/lib/actions";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userId = user?.id ?? "";

  const [{ data: settings }, { data: areas }, { data: projects }, { data: tasks }] =
    await Promise.all([
      supabase
        .from("user_settings")
        .select("display_name, accent_color")
        .eq("user_id", userId)
        .maybeSingle(),
      supabase
        .from("life_areas")
        .select("id, name, color, show_meetings, show_files")
        .is("deleted_at", null)
        .order("sort_order", { ascending: true }),
      supabase.from("projects").select("life_area_id").is("deleted_at", null),
      supabase.from("tasks").select("life_area_id").is("deleted_at", null),
    ]);

  const projectCounts = new Map<string, number>();
  for (const p of projects ?? []) {
    projectCounts.set(p.life_area_id, (projectCounts.get(p.life_area_id) ?? 0) + 1);
  }
  const taskCounts = new Map<string, number>();
  for (const t of tasks ?? []) {
    taskCounts.set(t.life_area_id, (taskCounts.get(t.life_area_id) ?? 0) + 1);
  }

  const t = await getTranslations("settings");
  const tCommon = await getTranslations("common");

  return (
    <div className="flex flex-1 flex-col gap-8 p-4 sm:p-6">
      <h1 className="text-2xl font-semibold text-foreground">{t("title")}</h1>

      <section className="flex max-w-lg flex-col gap-3">
        <SettingsForm
          displayName={settings?.display_name ?? null}
          accentColor={settings?.accent_color ?? null}
        />
      </section>

      <section className="flex max-w-lg flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">
            {t("lifeAreas")}
          </h2>
          <AddLifeAreaDialog />
        </div>
        <ul className="divide-y divide-border rounded-xl border border-border bg-card shadow-sm">
          {(areas ?? []).map((area) => {
            const projectCount = projectCounts.get(area.id) ?? 0;
            const taskCount = taskCounts.get(area.id) ?? 0;
            return (
              <li
                key={area.id}
                className="flex items-center gap-3 px-4 py-3"
              >
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: area.color ?? "var(--muted-foreground)" }}
                />
                <span className="flex-1 truncate text-sm text-foreground">
                  {area.name}
                </span>
                <RowMenu
                  deleteTitle={tCommon("confirmDeleteTitle")}
                  deleteImpact={
                    projectCount > 0 || taskCount > 0
                      ? tCommon("deleteAreaImpact", {
                          projects: projectCount,
                          tasks: taskCount,
                        })
                      : tCommon("deleteSimpleImpact")
                  }
                  onDelete={() => deleteLifeArea(area.id)}
                  renderEdit={(open, onOpenChange) => (
                    <AddLifeAreaDialog
                      initial={area}
                      open={open}
                      onOpenChange={onOpenChange}
                    />
                  )}
                />
              </li>
            );
          })}
        </ul>
        {(areas ?? []).length === 0 && (
          <p className="text-sm text-muted-foreground">{t("emptyLifeAreas")}</p>
        )}
      </section>
    </div>
  );
}
