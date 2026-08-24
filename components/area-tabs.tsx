"use client";

import { useTranslations } from "next-intl";
import { Users, Target, FolderKanban, ListTodo, StickyNote } from "lucide-react";
import { Link } from "@/i18n/navigation";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { TaskCheckbox } from "@/components/task-checkbox";
import { StatusBadge, PriorityBadge } from "@/components/status-badge";
import { AddGoalDialog } from "@/components/add-goal-dialog";
import { AddProjectDialog } from "@/components/add-project-dialog";
import { AddTaskDialog } from "@/components/add-task-dialog";
import { AddNoteDialog } from "@/components/add-note-dialog";
import { EmptyState } from "@/components/empty-state";
import { RowMenu } from "@/components/row-menu";
import { FilesList } from "@/components/files-list";
import { deleteGoal, deleteProject, deleteTask, deleteNote } from "@/lib/actions";

type Document = {
  id: string;
  file_name: string;
  file_type: string | null;
  size_bytes: number | null;
  storage_path: string;
  uploaded_at: string;
};
type Goal = { id: string; title: string; status: string; target_date: string | null };
type Project = {
  id: string;
  name: string;
  description: string | null;
  status: string;
  due_date: string | null;
  goal_id: string | null;
  taskCount: number;
  milestoneCount: number;
};
type Task = {
  id: string;
  title: string;
  status: string;
  priority: string;
  due_date: string | null;
  project_id: string | null;
};
type Note = { id: string; title: string; body: string };

export function AreaTabs({
  areaId,
  showMeetings,
  showFiles,
  goals,
  projects,
  tasks,
  notes,
  documents,
  overview,
}: {
  areaId: string;
  showMeetings: boolean;
  showFiles: boolean;
  goals: Goal[];
  projects: Project[];
  tasks: Task[];
  notes: Note[];
  documents: Document[];
  overview: {
    activeProjects: number;
    overdueTasks: number;
    latestNoteTitle: string | null;
  };
}) {
  const t = useTranslations("areas");
  const tCommon = useTranslations("common");

  return (
    <Tabs defaultValue="overview">
      <TabsList variant="line" className="mb-6 w-full justify-start overflow-x-auto">
        <TabsTrigger value="overview">{t("overview")}</TabsTrigger>
        <TabsTrigger value="goals">{t("goals")}</TabsTrigger>
        <TabsTrigger value="projects">{t("projects")}</TabsTrigger>
        <TabsTrigger value="tasks">{t("tasks")}</TabsTrigger>
        <TabsTrigger value="notes">{t("notes")}</TabsTrigger>
        {showMeetings && (
          <TabsTrigger value="meetings">{t("meetings")}</TabsTrigger>
        )}
        {showFiles && <TabsTrigger value="files">{t("files")}</TabsTrigger>}
      </TabsList>

      <TabsContent value="overview">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-2xl font-semibold text-foreground">
              {overview.activeProjects}
            </p>
            <p className="text-xs text-muted-foreground">
              {t("activeProjects")}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-2xl font-semibold text-destructive">
              {overview.overdueTasks}
            </p>
            <p className="text-xs text-muted-foreground">{t("overdueTasks")}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="truncate text-sm font-medium text-foreground">
              {overview.latestNoteTitle ?? "—"}
            </p>
            <p className="text-xs text-muted-foreground">{t("latestNote")}</p>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="goals">
        <div className="mb-3 flex justify-end">
          <AddGoalDialog lifeAreaId={areaId} />
        </div>
        {goals.length > 0 ? (
          <ul className="divide-y divide-border rounded-lg border border-border">
            {goals.map((goal) => (
              <li key={goal.id} className="flex items-center gap-3 px-4 py-3">
                <span className="flex-1 text-sm text-foreground">
                  {goal.title}
                </span>
                {goal.target_date && (
                  <span className="text-xs text-muted-foreground">
                    {goal.target_date}
                  </span>
                )}
                <StatusBadge status={goal.status} />
                <RowMenu
                  deleteTitle={tCommon("confirmDeleteTitle")}
                  deleteImpact={tCommon("deleteSimpleImpact")}
                  onDelete={() => deleteGoal(goal.id)}
                  renderEdit={(open, onOpenChange) => (
                    <AddGoalDialog
                      lifeAreaId={areaId}
                      initial={goal}
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
            icon={Target}
            message={t("emptyGoals")}
            action={<AddGoalDialog lifeAreaId={areaId} />}
          />
        )}
      </TabsContent>

      <TabsContent value="projects">
        <div className="mb-3 flex justify-end">
          <AddProjectDialog
            lifeAreaId={areaId}
            goals={goals.map((g) => ({ id: g.id, title: g.title }))}
          />
        </div>
        {projects.length > 0 ? (
          <ul className="divide-y divide-border rounded-lg border border-border">
            {projects.map((project) => (
              <li key={project.id} className="flex items-center">
                <Link
                  href={`/areas/${areaId}/projects/${project.id}`}
                  className="flex flex-1 items-center justify-between gap-3 px-4 py-3 hover:bg-accent"
                >
                  <span className="text-sm text-foreground">{project.name}</span>
                  <StatusBadge status={project.status} />
                </Link>
                <div className="pe-2">
                  <RowMenu
                    deleteTitle={tCommon("confirmDeleteTitle")}
                    deleteImpact={
                      project.taskCount > 0 || project.milestoneCount > 0
                        ? tCommon("deleteProjectImpact", {
                            tasks: project.taskCount,
                            milestones: project.milestoneCount,
                          })
                        : tCommon("deleteSimpleImpact")
                    }
                    onDelete={() => deleteProject(project.id)}
                    renderEdit={(open, onOpenChange) => (
                      <AddProjectDialog
                        lifeAreaId={areaId}
                        goals={goals.map((g) => ({ id: g.id, title: g.title }))}
                        initial={project}
                        open={open}
                        onOpenChange={onOpenChange}
                      />
                    )}
                  />
                </div>
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
                goals={goals.map((g) => ({ id: g.id, title: g.title }))}
              />
            }
          />
        )}
      </TabsContent>

      <TabsContent value="tasks">
        <div className="mb-3 flex justify-end">
          <AddTaskDialog
            lifeAreaId={areaId}
            projects={projects.map((p) => ({ id: p.id, name: p.name }))}
          />
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
                      projects={projects.map((p) => ({ id: p.id, name: p.name }))}
                      initial={task}
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
            message={t("emptyTasks")}
            action={
              <AddTaskDialog
                lifeAreaId={areaId}
                projects={projects.map((p) => ({ id: p.id, name: p.name }))}
              />
            }
          />
        )}
      </TabsContent>

      <TabsContent value="notes">
        <div className="mb-3 flex justify-end">
          <AddNoteDialog lifeAreaId={areaId} />
        </div>
        {notes.length > 0 ? (
          <ul className="grid gap-3 sm:grid-cols-2">
            {notes.map((note) => (
              <li
                key={note.id}
                className="relative rounded-lg border border-border bg-card p-4"
              >
                <div className="absolute top-2 end-2">
                  <RowMenu
                    deleteTitle={tCommon("confirmDeleteTitle")}
                    deleteImpact={tCommon("deleteSimpleImpact")}
                    onDelete={() => deleteNote(note.id)}
                    renderEdit={(open, onOpenChange) => (
                      <AddNoteDialog
                        lifeAreaId={areaId}
                        initial={note}
                        open={open}
                        onOpenChange={onOpenChange}
                      />
                    )}
                  />
                </div>
                <h3 className="mb-1 pe-6 text-sm font-semibold text-foreground">
                  {note.title}
                </h3>
                <p className="line-clamp-3 text-sm text-muted-foreground">
                  {note.body}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            icon={StickyNote}
            message={t("emptyNotes")}
            action={<AddNoteDialog lifeAreaId={areaId} />}
          />
        )}
      </TabsContent>

      {showMeetings && (
        <TabsContent value="meetings">
          <EmptyState icon={Users} message={t("comingSoon")} />
        </TabsContent>
      )}

      {showFiles && (
        <TabsContent value="files">
          <FilesList documents={documents} lifeAreaId={areaId} />
        </TabsContent>
      )}
    </Tabs>
  );
}
