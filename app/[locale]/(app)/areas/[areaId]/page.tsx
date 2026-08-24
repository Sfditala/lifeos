import { notFound } from "next/navigation";
import { Target, FolderKanban, ListTodo } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { TaskCheckbox } from "@/components/task-checkbox";
import { StatusBadge, PriorityBadge } from "@/components/status-badge";
import { AddGoalDialog } from "@/components/add-goal-dialog";
import { AddProjectDialog } from "@/components/add-project-dialog";
import { AddTaskDialog } from "@/components/add-task-dialog";
import { EmptyState } from "@/components/empty-state";

export default async function AreaPage({
  params,
}: {
  params: Promise<{ areaId: string }>;
}) {
  const { areaId } = await params;
  const supabase = await createClient();

  const [{ data: area }, { data: goals }, { data: projects }, { data: tasks }] =
    await Promise.all([
      supabase.from("life_areas").select("id, name, color").eq("id", areaId).single(),
      supabase
        .from("goals")
        .select("id, title, status, target_date")
        .eq("life_area_id", areaId)
        .order("created_at", { ascending: false }),
      supabase
        .from("projects")
        .select("id, name, status, goal_id")
        .eq("life_area_id", areaId)
        .order("created_at", { ascending: false }),
      supabase
        .from("tasks")
        .select("id, title, status, priority, due_date, project_id")
        .eq("life_area_id", areaId)
        .order("created_at", { ascending: false }),
    ]);

  if (!area) notFound();

  const t = await getTranslations("areas");

  return (
    <div className="flex flex-1 flex-col gap-8 p-4 sm:p-6">
      <div className="flex items-center gap-3">
        <span
          className="h-3 w-3 rounded-full"
          style={{ backgroundColor: area.color ?? "var(--muted-foreground)" }}
        />
        <h1 className="text-2xl font-semibold text-foreground">{area.name}</h1>
      </div>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">
            {t("goals")}
          </h2>
          <AddGoalDialog lifeAreaId={areaId} />
        </div>
        {goals && goals.length > 0 ? (
          <ul className="divide-y divide-border rounded-lg border border-border">
            {goals.map((goal) => (
              <li
                key={goal.id}
                className="flex items-center justify-between gap-3 px-4 py-3"
              >
                <span className="text-sm text-foreground">{goal.title}</span>
                <div className="flex items-center gap-2">
                  {goal.target_date && (
                    <span className="text-xs text-muted-foreground">
                      {goal.target_date}
                    </span>
                  )}
                  <StatusBadge status={goal.status} />
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            icon={Target}
            message={t("emptyGoals")}
            action={<AddGoalDialog lifeAreaId={areaId} />}
          />
        )}
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">
            {t("projects")}
          </h2>
          <AddProjectDialog
            lifeAreaId={areaId}
            goals={(goals ?? []).map((g) => ({ id: g.id, title: g.title }))}
          />
        </div>
        {projects && projects.length > 0 ? (
          <ul className="divide-y divide-border rounded-lg border border-border">
            {projects.map((project) => (
              <li
                key={project.id}
                className="flex items-center justify-between gap-3 px-4 py-3"
              >
                <span className="text-sm text-foreground">{project.name}</span>
                <StatusBadge status={project.status} />
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            icon={FolderKanban}
            message={t("emptyProjects")}
            action={
              <AddProjectDialog
                lifeAreaId={areaId}
                goals={(goals ?? []).map((g) => ({ id: g.id, title: g.title }))}
              />
            }
          />
        )}
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">
            {t("tasks")}
          </h2>
          <AddTaskDialog
            lifeAreaId={areaId}
            projects={(projects ?? []).map((p) => ({ id: p.id, name: p.name }))}
          />
        </div>
        {tasks && tasks.length > 0 ? (
          <ul className="divide-y divide-border rounded-lg border border-border">
            {tasks.map((task) => (
              <li
                key={task.id}
                className="flex items-center gap-3 px-4 py-3"
              >
                <TaskCheckbox taskId={task.id} done={task.status === "done"} />
                <span className="flex-1 text-sm text-foreground">
                  {task.title}
                </span>
                {task.due_date && (
                  <span className="text-xs text-muted-foreground">
                    {task.due_date}
                  </span>
                )}
                <PriorityBadge priority={task.priority} />
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            icon={ListTodo}
            message={t("emptyTasks")}
            action={
              <AddTaskDialog
                lifeAreaId={areaId}
                projects={(projects ?? []).map((p) => ({ id: p.id, name: p.name }))}
              />
            }
          />
        )}
      </section>
    </div>
  );
}
