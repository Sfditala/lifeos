import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { TrashList, type TrashRow } from "@/components/trash-list";

export default async function TrashPage() {
  const supabase = await createClient();

  const [
    { data: areas },
    { data: goals },
    { data: projects },
    { data: tasks },
    { data: habits },
    { data: content },
    { data: notes },
    { data: milestones },
    { data: documents },
  ] = await Promise.all([
    supabase
      .from("life_areas")
      .select("id, name, deleted_at")
      .not("deleted_at", "is", null),
    supabase
      .from("goals")
      .select("id, title, deleted_at")
      .not("deleted_at", "is", null),
    supabase
      .from("projects")
      .select("id, name, deleted_at")
      .not("deleted_at", "is", null),
    supabase
      .from("tasks")
      .select("id, title, deleted_at")
      .not("deleted_at", "is", null),
    supabase
      .from("habits")
      .select("id, name, deleted_at")
      .not("deleted_at", "is", null),
    supabase
      .from("content_items")
      .select("id, title, deleted_at")
      .not("deleted_at", "is", null),
    supabase
      .from("knowledge_notes")
      .select("id, title, deleted_at")
      .not("deleted_at", "is", null),
    supabase
      .from("project_milestones")
      .select("id, title, deleted_at")
      .not("deleted_at", "is", null),
    supabase
      .from("documents")
      .select("id, file_name, deleted_at")
      .not("deleted_at", "is", null),
  ]);

  const t = await getTranslations("trash");
  const tAreas = await getTranslations("areas");
  const tHabits = await getTranslations("habits");
  const tContent = await getTranslations("content");
  const tNotes = await getTranslations("notes");
  const tProject = await getTranslations("project");
  const tFiles = await getTranslations("files");
  const tCommon = await getTranslations("common");

  const rows: TrashRow[] = [
    ...(areas ?? []).map((r) => ({
      table: "life_areas" as const,
      id: r.id,
      label: r.name,
      typeLabel: tCommon("lifeArea"),
      deletedAt: r.deleted_at as string,
    })),
    ...(goals ?? []).map((r) => ({
      table: "goals" as const,
      id: r.id,
      label: r.title,
      typeLabel: tCommon("goal"),
      deletedAt: r.deleted_at as string,
    })),
    ...(projects ?? []).map((r) => ({
      table: "projects" as const,
      id: r.id,
      label: r.name,
      typeLabel: tCommon("project"),
      deletedAt: r.deleted_at as string,
    })),
    ...(tasks ?? []).map((r) => ({
      table: "tasks" as const,
      id: r.id,
      label: r.title,
      typeLabel: tAreas("tasks"),
      deletedAt: r.deleted_at as string,
    })),
    ...(habits ?? []).map((r) => ({
      table: "habits" as const,
      id: r.id,
      label: r.name,
      typeLabel: tHabits("title"),
      deletedAt: r.deleted_at as string,
    })),
    ...(content ?? []).map((r) => ({
      table: "content_items" as const,
      id: r.id,
      label: r.title,
      typeLabel: tContent("title"),
      deletedAt: r.deleted_at as string,
    })),
    ...(notes ?? []).map((r) => ({
      table: "knowledge_notes" as const,
      id: r.id,
      label: r.title,
      typeLabel: tNotes("title"),
      deletedAt: r.deleted_at as string,
    })),
    ...(milestones ?? []).map((r) => ({
      table: "project_milestones" as const,
      id: r.id,
      label: r.title,
      typeLabel: tProject("milestones"),
      deletedAt: r.deleted_at as string,
    })),
    ...(documents ?? []).map((r) => ({
      table: "documents" as const,
      id: r.id,
      label: r.file_name,
      typeLabel: tFiles("title"),
      deletedAt: r.deleted_at as string,
    })),
  ].sort((a, b) => b.deletedAt.localeCompare(a.deletedAt));

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 sm:p-6">
      <h1 className="text-2xl font-semibold text-foreground">{t("title")}</h1>
      <TrashList rows={rows} />
    </div>
  );
}
