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
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const currentUserId = user?.id ?? "";

  const [
    { data: area },
    { data: goals },
    { data: projects },
    { data: tasks },
    { data: notes },
    { data: documents },
    { data: meetings },
    { data: companies },
  ] = await Promise.all([
    supabase
      .from("life_areas")
      .select("id, name, color, show_meetings, show_files")
      .eq("id", areaId)
      .is("deleted_at", null)
      .single(),
    supabase
      .from("goals")
      .select("id, title, status, target_date")
      .eq("life_area_id", areaId)
      .is("deleted_at", null)
      .order("created_at", { ascending: false }),
    supabase
      .from("projects")
      .select("id, name, description, status, due_date, goal_id, company_id")
      .eq("life_area_id", areaId)
      .is("deleted_at", null)
      .order("created_at", { ascending: false }),
    supabase
      .from("tasks")
      .select("id, title, status, priority, due_date, project_id, duration_minutes")
      .eq("life_area_id", areaId)
      .is("deleted_at", null)
      .order("created_at", { ascending: false }),
    supabase
      .from("knowledge_notes")
      .select("id, title, body")
      .eq("life_area_id", areaId)
      .is("deleted_at", null)
      .order("updated_at", { ascending: false }),
    supabase
      .from("documents")
      .select("id, file_name, file_type, size_bytes, storage_path, uploaded_at")
      .eq("life_area_id", areaId)
      .is("deleted_at", null)
      .order("uploaded_at", { ascending: false }),
    supabase
      .from("meetings")
      .select("id, title, starts_at, ends_at, location, notes")
      .eq("life_area_id", areaId)
      .is("deleted_at", null)
      .order("starts_at", { ascending: true }),
    supabase
      .from("companies")
      .select("id, name")
      .eq("owner_user_id", currentUserId)
      .is("deleted_at", null),
  ]);

  if (!area) notFound();

  const projectIds = (projects ?? []).map((p) => p.id);
  const { data: milestones } =
    projectIds.length > 0
      ? await supabase
          .from("project_milestones")
          .select("id, project_id")
          .in("project_id", projectIds)
          .is("deleted_at", null)
      : { data: [] as { id: string; project_id: string }[] };

  const activeProjects = (projects ?? []).filter(
    (p) => p.status === "active",
  ).length;
  const overdueTasks = (tasks ?? []).filter(
    (t) => t.due_date && t.due_date < today && t.status !== "done",
  ).length;
  const latestNoteTitle = notes && notes.length > 0 ? notes[0].title : null;

  const taskCountByProject = new Map<string, number>();
  for (const task of tasks ?? []) {
    if (!task.project_id) continue;
    taskCountByProject.set(
      task.project_id,
      (taskCountByProject.get(task.project_id) ?? 0) + 1,
    );
  }
  const milestoneCountByProject = new Map<string, number>();
  for (const m of milestones ?? []) {
    milestoneCountByProject.set(
      m.project_id,
      (milestoneCountByProject.get(m.project_id) ?? 0) + 1,
    );
  }

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
        showMeetings={area.show_meetings}
        showFiles={area.show_files}
        goals={goals ?? []}
        projects={(projects ?? []).map((p) => ({
          ...p,
          taskCount: taskCountByProject.get(p.id) ?? 0,
          milestoneCount: milestoneCountByProject.get(p.id) ?? 0,
        }))}
        tasks={tasks ?? []}
        notes={notes ?? []}
        documents={documents ?? []}
        meetings={meetings ?? []}
        companies={companies ?? []}
        overview={{ activeProjects, overdueTasks, latestNoteTitle }}
      />
    </div>
  );
}
