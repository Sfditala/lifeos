"use client";

import { useTranslations } from "next-intl";
import { Flag, ListTodo } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { TaskCheckbox } from "@/components/task-checkbox";
import { MilestoneCheckbox } from "@/components/milestone-checkbox";
import { StatusBadge, PriorityBadge } from "@/components/status-badge";
import { AddTaskDialog } from "@/components/add-task-dialog";
import { AddMilestoneDialog } from "@/components/add-milestone-dialog";
import { AddProjectDialog } from "@/components/add-project-dialog";
import { EmptyState } from "@/components/empty-state";
import { RowMenu } from "@/components/row-menu";
import { FilesList } from "@/components/files-list";
import { LinkedItems } from "@/components/linked-items";
import {
  deleteProject,
  deleteMilestone,
  deleteTask,
  type ResolvedLink,
} from "@/lib/actions";

type Project = {
  id: string;
  name: string;
  description: string | null;
  status: string;
  due_date: string | null;
  goal_id: string | null;
};
type Document = {
  id: string;
  file_name: string;
  file_type: string | null;
  size_bytes: number | null;
  storage_path: string;
  uploaded_at: string;
};
type Milestone = {
  id: string;
  title: string;
  due_date: string | null;
  done: boolean;
};
type Task = {
  id: string;
  title: string;
  status: string;
  priority: string;
  due_date: string | null;
};
type Goal = { id: string; title: string };

export function ProjectDetail({
  areaId,
  project,
  milestones,
  tasks,
  goals,
  documents,
  links,
}: {
  areaId: string;
  project: Project;
  milestones: Milestone[];
  tasks: Task[];
  goals: Goal[];
  documents: Document[];
  links: ResolvedLink[];
}) {
  const t = useTranslations("project");
  const tAreas = useTranslations("areas");
  const tFiles = useTranslations("files");
  const tCommon = useTranslations("common");
  const router = useRouter();

  const projectForTaskDialog = [{ id: project.id, name: project.name }];

  return (
    <div className="flex flex-1 flex-col gap-8 p-4 sm:p-6">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold text-foreground">
            {project.name}
          </h1>
          <StatusBadge status={project.status} />
          <RowMenu
            deleteTitle={tCommon("confirmDeleteTitle")}
            deleteImpact={
              tasks.length > 0 || milestones.length > 0
                ? tCommon("deleteProjectImpact", {
                    tasks: tasks.length,
                    milestones: milestones.length,
                  })
                : tCommon("deleteSimpleImpact")
            }
            onDelete={async () => {
              await deleteProject(project.id);
              router.push(`/areas/${areaId}`);
            }}
            renderEdit={(open, onOpenChange) => (
              <AddProjectDialog
                lifeAreaId={areaId}
                goals={goals}
                initial={project}
                open={open}
                onOpenChange={onOpenChange}
              />
            )}
          />
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
          <AddMilestoneDialog projectId={project.id} />
        </div>
        {milestones.length > 0 ? (
          <ul className="divide-y divide-border rounded-lg border border-border">
            {milestones.map((milestone) => (
              <li
                key={milestone.id}
                className="flex items-center gap-3 px-4 py-3"
              >
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
                <RowMenu
                  deleteTitle={tCommon("confirmDeleteTitle")}
                  deleteImpact={tCommon("deleteSimpleImpact")}
                  onDelete={() => deleteMilestone(milestone.id)}
                  renderEdit={(open, onOpenChange) => (
                    <AddMilestoneDialog
                      projectId={project.id}
                      initial={milestone}
                      open={open}
                      onOpenChange={onOpenChange}
                    />
                  )}
                />
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            icon={Flag}
            message={t("emptyMilestones")}
            action={<AddMilestoneDialog projectId={project.id} />}
          />
        )}
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">
            {tAreas("tasks")}
          </h2>
          <AddTaskDialog lifeAreaId={areaId} projects={projectForTaskDialog} />
        </div>
        {tasks.length > 0 ? (
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
                <RowMenu
                  deleteTitle={tCommon("confirmDeleteTitle")}
                  deleteImpact={tCommon("deleteSimpleImpact")}
                  onDelete={() => deleteTask(task.id)}
                  renderEdit={(open, onOpenChange) => (
                    <AddTaskDialog
                      lifeAreaId={areaId}
                      projects={projectForTaskDialog}
                      initial={{ ...task, project_id: project.id }}
                      open={open}
                      onOpenChange={onOpenChange}
                    />
                  )}
                />
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
                projects={projectForTaskDialog}
              />
            }
          />
        )}
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold text-foreground">
          {tFiles("title")}
        </h2>
        <FilesList documents={documents} projectId={project.id} />
      </section>

      <section>
        <LinkedItems entityType="project" entityId={project.id} links={links} />
      </section>
    </div>
  );
}
