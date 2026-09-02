"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { GripVertical } from "lucide-react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  useDraggable,
  useDroppable,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { deleteTask, updateTaskStatus } from "@/lib/actions";
import { TASK_STATUS_STAGES, type TaskStatus } from "@/lib/tasks";
import { formatDurationMinutes } from "@/lib/format-duration";
import { PriorityBadge } from "@/components/status-badge";
import { AddTaskDialog } from "@/components/add-task-dialog";
import { DealDialog } from "@/components/deal-dialog";
import { RowMenu } from "@/components/row-menu";

type Assignee = { id: string; email: string };
type ProjectRef = { id: string; name: string; life_area_id: string };
type Deal = {
  contact_name: string | null;
  channel: string | null;
  deal_value: number | null;
  last_contacted_at: string | null;
};
type Task = {
  id: string;
  title: string;
  status: string;
  priority: string;
  due_date: string | null;
  assigned_to: string | null;
  duration_minutes: number | null;
  project_id?: string | null;
};

const COLUMN_ACCENT: Record<TaskStatus, string> = {
  backlog: "var(--muted-foreground)",
  ready: "#0EA5E9",
  in_progress: "#F59E0B",
  in_review: "#8B5CF6",
  done: "#10B981",
};

function avatarColor(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
  const hue = Math.abs(hash) % 360;
  return `oklch(0.62 0.14 ${hue})`;
}

function Avatar({ email }: { email: string }) {
  return (
    <span
      title={email}
      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold text-white"
      style={{ backgroundColor: avatarColor(email) }}
    >
      {email.slice(0, 1).toUpperCase()}
    </span>
  );
}

function TaskCard({
  task,
  assignee,
  dragging,
  projects,
  assignees,
  showProjectBadge,
  companyId,
  deal,
  numberFormatter,
}: {
  task: Task;
  assignee: Assignee | undefined;
  dragging?: boolean;
  projects: ProjectRef[];
  assignees: Assignee[];
  showProjectBadge: boolean;
  companyId?: string;
  deal: Deal | undefined;
  numberFormatter: Intl.NumberFormat;
}) {
  const tCommon = useTranslations("common");
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
  });
  const project = projects.find((p) => p.id === task.project_id);
  const durationLabel = task.duration_minutes
    ? formatDurationMinutes(task.duration_minutes, {
        hour: tCommon("hourShort"),
        minute: tCommon("minuteShort"),
      })
    : null;

  return (
    <div
      ref={setNodeRef}
      style={
        transform
          ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
          : undefined
      }
      className={`rounded-lg border border-border bg-card p-3 shadow-sm transition-shadow ${
        dragging ? "opacity-40" : "hover:shadow-md"
      }`}
    >
      <div className="flex items-start gap-1.5">
        <button
          type="button"
          {...listeners}
          {...attributes}
          className="mt-0.5 cursor-grab touch-none text-muted-foreground/50 hover:text-muted-foreground active:cursor-grabbing"
        >
          <GripVertical className="h-3.5 w-3.5" />
        </button>
        <p className="flex-1 text-sm font-medium text-foreground">{task.title}</p>
        {companyId && (
          <DealDialog
            taskId={task.id}
            companyId={companyId}
            initial={deal}
            hasValue={Boolean(deal?.deal_value)}
          />
        )}
        <RowMenu
          deleteTitle={tCommon("confirmDeleteTitle")}
          deleteImpact={tCommon("deleteSimpleImpact")}
          onDelete={() => deleteTask(task.id)}
          renderEdit={(open, onOpenChange) => (
            <AddTaskDialog
              lifeAreaId={projects.length === 1 ? projects[0].id : undefined}
              projects={projects}
              assignees={assignees}
              initial={{ ...task, project_id: task.project_id ?? null }}
              open={open}
              onOpenChange={onOpenChange}
            />
          )}
        />
      </div>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2 ps-5">
        <div className="flex items-center gap-1.5">
          <PriorityBadge priority={task.priority} />
          {durationLabel && (
            <span className="text-[11px] text-muted-foreground">{durationLabel}</span>
          )}
          {showProjectBadge && project && (
            <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
              {project.name}
            </span>
          )}
          {deal?.deal_value ? (
            <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
              {numberFormatter.format(deal.deal_value)}
            </span>
          ) : null}
        </div>
        {assignee && <Avatar email={assignee.email} />}
      </div>
    </div>
  );
}

function Column({
  status,
  label,
  tasks,
  assigneeById,
  activeId,
  projects,
  assignees,
  showProjectBadge,
  companyId,
  dealByTaskId,
  numberFormatter,
}: {
  status: TaskStatus;
  label: string;
  tasks: Task[];
  assigneeById: Map<string, Assignee>;
  activeId: string | null;
  projects: ProjectRef[];
  assignees: Assignee[];
  showProjectBadge: boolean;
  companyId?: string;
  dealByTaskId: Map<string, Deal>;
  numberFormatter: Intl.NumberFormat;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status });
  const columnDealTotal = tasks.reduce(
    (sum, task) => sum + (dealByTaskId.get(task.id)?.deal_value ?? 0),
    0,
  );

  return (
    <div
      ref={setNodeRef}
      className={`flex w-72 shrink-0 flex-col gap-3 rounded-xl border border-border p-3 transition-colors ${
        isOver ? "bg-accent" : "bg-card/40"
      }`}
    >
      <div className="flex items-center gap-2 px-1">
        <span
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: COLUMN_ACCENT[status] }}
        />
        <span className="text-xs font-semibold text-foreground">{label}</span>
        <span className="ms-auto rounded-full bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
          {tasks.length}
        </span>
      </div>
      {companyId && columnDealTotal > 0 && (
        <p className="-mt-2 px-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
          {numberFormatter.format(columnDealTotal)}
        </p>
      )}
      <div className="flex flex-col gap-2">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            assignee={task.assigned_to ? assigneeById.get(task.assigned_to) : undefined}
            dragging={activeId === task.id}
            projects={projects}
            assignees={assignees}
            showProjectBadge={showProjectBadge}
            companyId={companyId}
            deal={dealByTaskId.get(task.id)}
            numberFormatter={numberFormatter}
          />
        ))}
      </div>
    </div>
  );
}

export function TaskBoard({
  tasks: initialTasks,
  assignees,
  projects,
  companyId,
  deals,
}: {
  tasks: Task[];
  assignees: Assignee[];
  projects: ProjectRef[];
  companyId?: string;
  deals?: (Deal & { task_id: string })[];
}) {
  const tStatus = useTranslations("status");
  const locale = useLocale();
  const [tasks, setTasks] = useState(initialTasks);
  const [activeId, setActiveId] = useState<string | null>(null);
  const showProjectBadge = projects.length > 1;
  const numberFormatter = useMemo(
    () => new Intl.NumberFormat(locale === "ar" ? "ar-u-nu-latn" : "en"),
    [locale],
  );

  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  const assigneeById = useMemo(
    () => new Map(assignees.map((a) => [a.id, a])),
    [assignees],
  );
  const dealByTaskId = useMemo(
    () => new Map((deals ?? []).map((d) => [d.task_id, d])),
    [deals],
  );
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;
    const newStatus = over.id as TaskStatus;
    const taskId = active.id as string;
    const task = tasks.find((t) => t.id === taskId);
    if (!task || task.status === newStatus) return;

    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)),
    );
    updateTaskStatus(taskId, newStatus);
  }

  const activeTask = activeId ? tasks.find((t) => t.id === activeId) : null;

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-3 overflow-x-auto pb-2">
        {TASK_STATUS_STAGES.map((status) => (
          <Column
            key={status}
            status={status}
            label={tStatus(status)}
            tasks={tasks.filter((t) => t.status === status)}
            assigneeById={assigneeById}
            activeId={activeId}
            projects={projects}
            assignees={assignees}
            showProjectBadge={showProjectBadge}
            companyId={companyId}
            dealByTaskId={dealByTaskId}
            numberFormatter={numberFormatter}
          />
        ))}
      </div>
      <DragOverlay>
        {activeTask ? (
          <TaskCard
            task={activeTask}
            assignee={
              activeTask.assigned_to ? assigneeById.get(activeTask.assigned_to) : undefined
            }
            projects={projects}
            assignees={assignees}
            showProjectBadge={showProjectBadge}
            companyId={companyId}
            deal={dealByTaskId.get(activeTask.id)}
            numberFormatter={numberFormatter}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
