import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { SettingsForm } from "@/components/settings-form";
import { SettingsLifeAreas } from "@/components/settings-life-areas";

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

  return (
    <div className="flex flex-1 flex-col gap-8 p-4 sm:p-6">
      <h1 className="text-2xl font-semibold text-foreground">{t("title")}</h1>

      <section className="flex max-w-lg flex-col gap-3">
        <SettingsForm
          displayName={settings?.display_name ?? null}
          accentColor={settings?.accent_color ?? null}
        />
      </section>

      <SettingsLifeAreas
        areas={(areas ?? []).map((area) => ({
          ...area,
          projectCount: projectCounts.get(area.id) ?? 0,
          taskCount: taskCounts.get(area.id) ?? 0,
        }))}
      />
    </div>
  );
}
