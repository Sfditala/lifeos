import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AreaTabs } from "@/components/area-tabs";

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export default async function AreaPage({
  params,
}: {
  params: Promise<{ areaId: string }>;
}) {
  const { areaId } = await params;
  const supabase = await createClient();
  const today = todayIso();

  const [{ data: area }, { data: goals }, { data: projects }, { data: tasks }, { data: notes }] =
    await Promise.all([
      supabase.from("life_areas").select("id, name, color").eq("id", areaId).single(),
      supabase
        .from("goals")
        .select("id, title, status, target_date")
        .eq("life_area_id", areaId)
        .order("created_at", { ascending: false }),
      supabase
        .from("projects")
        .select("id, name, status")
        .eq("life_area_id", areaId)
        .order("created_at", { ascending: false }),
      supabase
        .from("tasks")
        .select("id, title, status, priority, due_date")
        .eq("life_area_id", areaId)
        .order("created_at", { ascending: false }),
      supabase
        .from("knowledge_notes")
        .select("id, title, body")
        .eq("life_area_id", areaId)
        .order("updated_at", { ascending: false }),
    ]);

  if (!area) notFound();

  const activeProjects = (projects ?? []).filter(
    (p) => p.status === "active",
  ).length;
  const overdueTasks = (tasks ?? []).filter(
    (t) => t.due_date && t.due_date < today && t.status !== "done",
  ).length;
  const latestNoteTitle = notes && notes.length > 0 ? notes[0].title : null;

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6">
      <div className="flex items-center gap-3">
        <span
          className="h-3 w-3 rounded-full"
          style={{ backgroundColor: area.color ?? "var(--muted-foreground)" }}
        />
        <h1 className="text-2xl font-semibold text-foreground">{area.name}</h1>
      </div>

      <AreaTabs
        areaId={areaId}
        goals={goals ?? []}
        projects={projects ?? []}
        tasks={tasks ?? []}
        notes={notes ?? []}
        overview={{ activeProjects, overdueTasks, latestNoteTitle }}
      />
    </div>
  );
}
