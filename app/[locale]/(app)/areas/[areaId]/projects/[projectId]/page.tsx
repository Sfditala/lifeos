import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getEntityLinks } from "@/lib/actions";
import { ProjectDetail } from "@/components/project-detail";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ areaId: string; projectId: string }>;
}) {
  const { areaId, projectId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const currentUserId = user?.id ?? "";

  const [
    { data: project },
    { data: milestones },
    { data: tasks },
    { data: goals },
    { data: documents },
  ] = await Promise.all([
      supabase
        .from("projects")
        .select("id, name, description, status, due_date, goal_id, company_id")
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
        .select("id, title, status, priority, due_date, assigned_to")
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

  const [links, { data: companies }] = await Promise.all([
    getEntityLinks("project", projectId),
    supabase
      .from("companies")
      .select("id, name")
      .eq("owner_user_id", currentUserId)
      .is("deleted_at", null),
  ]);

  let messages: {
    id: string;
    content: string;
    created_at: string;
    user_id: string;
    authorLabel: string;
  }[] = [];
  let assignees: { id: string; email: string }[] = [];

  if (project.company_id) {
    const [{ data: rawMessages }, { data: members }] = await Promise.all([
      supabase
        .from("project_messages")
        .select("id, content, created_at, user_id")
        .eq("project_id", projectId)
        .order("created_at", { ascending: true }),
      supabase
        .from("team_members")
        .select("user_id, email, status")
        .eq("company_id", project.company_id),
    ]);
    const emailByUser = new Map(
      (members ?? []).map((m) => [m.user_id, m.email]),
    );
    messages = (rawMessages ?? []).map((m) => ({
      ...m,
      authorLabel: emailByUser.get(m.user_id) ?? "—",
    }));
    assignees = (members ?? [])
      .filter((m) => m.status === "active" && m.user_id)
      .map((m) => ({ id: m.user_id as string, email: m.email }));
  }

  return (
    <ProjectDetail
      areaId={areaId}
      project={project}
      milestones={milestones ?? []}
      tasks={tasks ?? []}
      goals={goals ?? []}
      documents={documents ?? []}
      links={links}
      companies={companies ?? []}
      assignees={assignees}
      messages={messages}
      currentUserId={currentUserId}
    />
  );
}
