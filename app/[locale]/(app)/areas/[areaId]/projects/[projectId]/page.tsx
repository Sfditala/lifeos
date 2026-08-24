import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProjectDetail } from "@/components/project-detail";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ areaId: string; projectId: string }>;
}) {
  const { areaId, projectId } = await params;
  const supabase = await createClient();

  const [
    { data: project },
    { data: milestones },
    { data: tasks },
    { data: goals },
    { data: documents },
  ] = await Promise.all([
      supabase
        .from("projects")
        .select("id, name, description, status, due_date, goal_id")
        .eq("id", projectId)
        .eq("life_area_id", areaId)
        .is("deleted_at", null)
        .single(),
      supabase
        .from("project_milestones")
        .select("id, title, due_date, done")
        .eq("project_id", projectId)
        .is("deleted_at", null)
        .order("due_date", { ascending: true, nullsFirst: false }),
      supabase
        .from("tasks")
        .select("id, title, status, priority, due_date")
        .eq("project_id", projectId)
        .is("deleted_at", null)
        .order("created_at", { ascending: false }),
      supabase
        .from("goals")
        .select("id, title")
        .eq("life_area_id", areaId)
        .is("deleted_at", null),
      supabase
        .from("documents")
        .select("id, file_name, file_type, size_bytes, storage_path, uploaded_at")
        .eq("project_id", projectId)
        .is("deleted_at", null)
        .order("uploaded_at", { ascending: false }),
    ]);

  if (!project) notFound();

  return (
    <ProjectDetail
      areaId={areaId}
      project={project}
      milestones={milestones ?? []}
      tasks={tasks ?? []}
      goals={goals ?? []}
      documents={documents ?? []}
    />
  );
}
