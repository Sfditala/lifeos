import { notFound } from "next/navigation";
import { Flag, ListTodo } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { TaskCheckbox } from "@/components/task-checkbox";
import { MilestoneCheckbox } from "@/components/milestone-checkbox";
import { StatusBadge, PriorityBadge } from "@/components/status-badge";
import { AddTaskDialog } from "@/components/add-task-dialog";
import { AddMilestoneDialog } from "@/components/add-milestone-dialog";
import { EmptyState } from "@/components/empty-state";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ areaId: string; projectId: string }>;
}) {
  const { areaId, projectId } = await params;
  const supabase = await createClient();

  const [{ data: project }, { data: milestones }, { data: tasks }] =
    await Promise.all([
      supabase
        .from("projects")
        .select("id, name, description, status, due_date")
        .eq("id", projectId)
        .eq("life_area_id", areaId)
        .single(),
      supabase
        .from("project_milestones")
        .select("id, title, due_date, done")
        .eq("project_id", projectId)
        .order("due_date", { ascending: true, nullsFirst: false }),
      supabase
        .from("tasks")
        .select("id, title, status, priority, due_date")
        .eq("project_id", projectId)
        .order("created_at", { ascending: false }),
    ]);

  if (!project) notFound();

  const t = await getTranslations("project");
  const tAreas = await getTranslations("areas");

  return (
    <div className="flex flex-1 flex-col gap-8 p-4 sm:p-6">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold text-foreground">
            {project.name}
          </h1>
          <StatusBadge status={project.status} />
        </div>
        {project.description && (
          <p className="mt-2 text-sm text-muted-foreground">
            {project.description}
          </p>
        )}
        {project.due_date && (
          <p className="mt-1 text-xs text-muted-foreground">
            {t("dueDate")}: {project.due_date}
          </p>
        )}
      </div>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">
            {t("milestones")}
          </h2>
          <AddMilestoneDialog projectId={projectId} />
        </div>
        {milestones && milestones.length > 0 ? (
          <ul className="divide-y divide-border rounded-lg border border-border">
            {milestones.map((milestone) => (
              <li key={milestone.id} className="flex items-center gap-3 px-4 py-3">
                <MilestoneCheckbox
                  milestoneId={milestone.id}
                  done={milestone.done}
                />
                <span className="flex-1 text-sm text-foreground">
                  {milestone.title}
                </span>
                {milestone.due_date && (
                  <span className="text-xs text-muted-foreground">
                    {milestone.due_date}
                  </span>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            icon={Flag}
            message={t("emptyMilestones")}
            action={<AddMilestoneDialog projectId={projectId} />}
          />
        )}
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">
            {tAreas("tasks")}
          </h2>
          <AddTaskDialog
            lifeAreaId={areaId}
            projects={[{ id: projectId, name: project.name }]}
          />
        </div>
        {tasks && tasks.length > 0 ? (
          <ul className="divide-y divide-border rounded-lg border border-border">
            {tasks.map((task) => (
              <li key={task.id} className="flex items-center gap-3 px-4 py-3">
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
            message={tAreas("emptyTasks")}
            action={
              <AddTaskDialog
                lifeAreaId={areaId}
                projects={[{ id: projectId, name: project.name }]}
              />
            }
          />
        )}
      </section>
    </div>
  );
}
