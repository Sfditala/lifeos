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
import { DonutChart } from "@/components/charts/donut-chart";
import { LinkedItems } from "@/components/linked-items";
import { ProjectChat } from "@/components/project-chat";
import { TaskBoard } from "@/components/task-board";
import { formatDurationMinutes } from "@/lib/format-duration";
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
  company_id: string | null;
};
type Company = { id: string; name: string };
type Message = {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  authorLabel: string;
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
  assigned_to: string | null;
  duration_minutes: number | null;
};
type Goal = { id: string; title: string };
type Assignee = { id: string; email: string };

export function ProjectDetail({
  areaId,
  project,
  milestones,
  tasks,
  goals,
  documents,
  links,
  companies,
  assignees,
  messages,
  currentUserId,
}: {
  areaId: string;
  project: Project;
  milestones: Milestone[];
  tasks: Task[];
  goals: Goal[];
  documents: Document[];
  links: ResolvedLink[];
  companies: Company[];
  assignees: Assignee[];
  messages: Message[];
  currentUserId: string;
}) {
  const t = useTranslations("project");
  const tAreas = useTranslations("areas");
  const tFiles = useTranslations("files");
  const tCommon = useTranslations("common");
  const tStatus = useTranslations("status");
  const router = useRouter();
  const durationLabels = {
    hour: tCommon("hourShort"),
    minute: tCommon("minuteShort"),
  };

  const projectForTaskDialog = [{ id: project.id, name: project.name }];
  const emailByAssigneeId = new Map(assignees.map((a) => [a.id, a.email]));

  const statusCounts = { backlog: 0, ready: 0, in_progress: 0, in_review: 0, done: 0 };
  for (const task of tasks) {
    if (task.status in statusCounts) {
      statusCounts[task.status as keyof typeof statusCounts] += 1;
    }
  }
  const statusChartData = [
    { name: tStatus("backlog"), value: statusCounts.backlog, color: "var(--muted-foreground)" },
    { name: tStatus("ready"), value: statusCounts.ready, color: "#0EA5E9" },
    { name: tStatus("in_progress"), value: statusCounts.in_progress, color: "#F59E0B" },
    { name: tStatus("in_review"), value: statusCounts.in_review, color: "#8B5CF6" },
    { name: tStatus("done"), value: statusCounts.done, color: "#10B981" },
  ];
  const totalTasks = tasks.length;
  const completionPercent =
    totalTasks > 0 ? Math.round((statusCounts.done / totalTasks) * 100) : 0;

  return (
    <div className="flex flex-1 flex-col gap-8 p-4 sm:p-6">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold text-foreground">
            {project.name}
          </h1>
          <StatusBadge status={project.status} />
          {project.company_id && (
            <ProjectChat
              projectId={project.id}
              messages={messages}
              currentUserId={currentUserId}
            />
          )}
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
                companies={companies}
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

      {totalTasks > 0 && (
        <section>
          <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
            <h3 className="mb-2 text-sm font-semibold text-foreground">
              {t("taskCompletion")} ({completionPercent}%)
            </h3>
            <DonutChart data={statusChartData} height={180} />
          </div>
        </section>
      )}

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">
            {t("milestones")}
          </h2>
          <AddMilestoneDialog projectId={project.id} />
        </div>
        {milestones.length > 0 ? (
          <ul className="divide-y divide-border rounded-lg border border-border bg-card shadow-sm">
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
          <AddTaskDialog
            lifeAreaId={areaId}
            projects={projectForTaskDialog}
            assignees={assignees}
          />
        </div>
        {tasks.length > 0 ? (
          project.company_id ? (
            <TaskBoard
              tasks={tasks}
              assignees={assignees}
              lifeAreaId={areaId}
              projectId={project.id}
              projectName={project.name}
            />
          ) : (
            <ul className="divide-y divide-border rounded-lg border border-border bg-card shadow-sm">
              {tasks.map((task) => (
                <li key={task.id} className="flex items-center gap-3 px-4 py-3">
                  <TaskCheckbox taskId={task.id} done={task.status === "done"} />
                  <span className="flex-1 text-sm text-foreground">
                    {task.title}
                  </span>
                  {task.assigned_to && emailByAssigneeId.get(task.assigned_to) && (
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                      {emailByAssigneeId.get(task.assigned_to)}
                    </span>
                  )}
                  {task.duration_minutes != null && (
                    <span className="text-xs text-muted-foreground">
                      {formatDurationMinutes(task.duration_minutes, durationLabels)}
                    </span>
                  )}
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
                        assignees={assignees}
                        initial={{ ...task, project_id: project.id }}
                        open={open}
                        onOpenChange={onOpenChange}
                      />
                    )}
                  />
                </li>
              ))}
            </ul>
          )
        ) : (
          <EmptyState
            icon={ListTodo}
            message={tAreas("emptyTasks")}
            action={
              <AddTaskDialog
                lifeAreaId={areaId}
                projects={projectForTaskDialog}
                assignees={assignees}
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
