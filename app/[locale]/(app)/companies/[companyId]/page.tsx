import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CompanyDetail } from "@/components/company-detail";

export default async function CompanyPage({
  params,
}: {
  params: Promise<{ companyId: string }>;
}) {
  const { companyId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: company }, { data: members }, { data: projects }] =
    await Promise.all([
      supabase
        .from("companies")
        .select(
          "id, name, owner_user_id, founded_date, description, industry, contact_email, contact_phone",
        )
        .eq("id", companyId)
        .is("deleted_at", null)
        .single(),
      supabase
        .from("team_members")
        .select("id, email, role, status, position, user_id")
        .eq("company_id", companyId)
        .order("invited_at", { ascending: true }),
      supabase
        .from("projects")
        .select("id, name, status, life_area_id")
        .eq("company_id", companyId)
        .is("deleted_at", null),
    ]);

  if (!company) notFound();

  const isOwner = company.owner_user_id === user?.id;

  const projectIds = (projects ?? []).map((p) => p.id);

  const [{ data: lifeAreas }, { data: tasks }, { data: meetings }, { data: documents }] =
    await Promise.all([
      isOwner
        ? supabase
            .from("life_areas")
            .select("id, name")
            .is("deleted_at", null)
            .order("sort_order", { ascending: true })
        : Promise.resolve({ data: null }),
      projectIds.length > 0
        ? supabase
            .from("tasks")
            .select(
              "id, title, status, priority, due_date, assigned_to, duration_minutes, project_id",
            )
            .in("project_id", projectIds)
            .is("deleted_at", null)
        : Promise.resolve({ data: [] }),
      projectIds.length > 0
        ? supabase
            .from("meetings")
            .select("id, title, starts_at, ends_at, location, notes, project_id")
            .in("project_id", projectIds)
            .is("deleted_at", null)
            .order("starts_at", { ascending: true })
        : Promise.resolve({ data: [] }),
      supabase
        .from("documents")
        .select("id, file_name, file_type, size_bytes, storage_path, uploaded_at")
        .eq("company_id", companyId)
        .is("deleted_at", null)
        .order("uploaded_at", { ascending: false }),
    ]);

  const assignees = (members ?? [])
    .filter((m) => m.status === "active" && m.user_id)
    .map((m) => ({ id: m.user_id as string, email: m.email }));

  return (
    <CompanyDetail
      company={company}
      isOwner={isOwner}
      members={members ?? []}
      projects={projects ?? []}
      tasks={tasks ?? []}
      meetings={meetings ?? []}
      documents={documents ?? []}
      lifeAreas={lifeAreas ?? []}
      assignees={assignees}
    />
  );
}
