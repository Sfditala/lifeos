"use client";

import { useTranslations } from "next-intl";
import { Users, FileBox } from "lucide-react";
import { Link } from "@/i18n/navigation";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { TaskCheckbox } from "@/components/task-checkbox";
import { StatusBadge, PriorityBadge } from "@/components/status-badge";
import { AddGoalDialog } from "@/components/add-goal-dialog";
import { AddProjectDialog } from "@/components/add-project-dialog";
import { AddTaskDialog } from "@/components/add-task-dialog";
import { AddNoteDialog } from "@/components/add-note-dialog";
import { EmptyState } from "@/components/empty-state";
import {
  Target,
  FolderKanban,
  ListTodo,
  StickyNote,
} from "lucide-react";

type Goal = { id: string; title: string; status: string; target_date: string | null };
type Project = { id: string; name: string; status: string };
type Task = {
  id: string;
  title: string;
  status: string;
  priority: string;
  due_date: string | null;
};
type Note = { id: string; title: string; body: string };

export function AreaTabs({
  areaId,
  goals,
  projects,
  tasks,
  notes,
  overview,
}: {
  areaId: string;
  goals: Goal[];
  projects: Project[];
  tasks: Task[];
  notes: Note[];
  overview: {
    activeProjects: number;
    overdueTasks: number;
    latestNoteTitle: string | null;
  };
}) {
  const t = useTranslations("areas");

  return (
    <Tabs defaultValue="overview">
      <TabsList variant="line" className="mb-6 w-full justify-start overflow-x-auto">
        <TabsTrigger value="overview">{t("overview")}</TabsTrigger>
        <TabsTrigger value="projects">{t("projects")}</TabsTrigger>
        <TabsTrigger value="tasks">{t("tasks")}</TabsTrigger>
        <TabsTrigger value="notes">{t("notes")}</TabsTrigger>
        <TabsTrigger value="meetings">{t("meetings")}</TabsTrigger>
        <TabsTrigger value="files">{t("files")}</TabsTrigger>
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
              <li key={project.id}>
                <Link
                  href={`/areas/${areaId}/projects/${project.id}`}
                  className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-accent"
                >
                  <span className="text-sm text-foreground">{project.name}</span>
                  <StatusBadge status={project.status} />
                </Link>
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
                className="rounded-lg border border-border bg-card p-4"
              >
                <h3 className="mb-1 text-sm font-semibold text-foreground">
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

      <TabsContent value="meetings">
        <EmptyState icon={Users} message={t("comingSoon")} />
      </TabsContent>

      <TabsContent value="files">
        <EmptyState icon={FileBox} message={t("comingSoon")} />
      </TabsContent>
    </Tabs>
  );
}
