"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
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
import { updateTaskStatus } from "@/lib/actions";
import { TASK_STATUS_STAGES, type TaskStatus } from "@/lib/tasks";
import { formatDurationMinutes } from "@/lib/format-duration";
import { PriorityBadge } from "@/components/status-badge";

type Assignee = { id: string; email: string };
type Task = {
  id: string;
  title: string;
  status: string;
  priority: string;
  due_date: string | null;
  assigned_to: string | null;
  duration_minutes: number | null;
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
}: {
  task: Task;
  assignee: Assignee | undefined;
  dragging?: boolean;
}) {
  const tCommon = useTranslations("common");
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
  });
  const durationLabel = task.duration_minutes
    ? formatDurationMinutes(task.duration_minutes, {
        hour: tCommon("hourShort"),
        minute: tCommon("minuteShort"),
      })
    : null;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={
        transform
          ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
          : undefined
      }
      className={`cursor-grab touch-none rounded-lg border border-border bg-card p-3 shadow-sm transition-shadow active:cursor-grabbing ${
        dragging ? "opacity-40" : "hover:shadow-md"
      }`}
    >
      <p className="text-sm font-medium text-foreground">{task.title}</p>
      <div className="mt-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <PriorityBadge priority={task.priority} />
          {durationLabel && (
            <span className="text-[11px] text-muted-foreground">{durationLabel}</span>
          )}
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
}: {
  status: TaskStatus;
  label: string;
  tasks: Task[];
  assigneeById: Map<string, Assignee>;
  activeId: string | null;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

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
      <div className="flex flex-col gap-2">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            assignee={task.assigned_to ? assigneeById.get(task.assigned_to) : undefined}
            dragging={activeId === task.id}
          />
        ))}
      </div>
    </div>
  );
}

export function TaskBoard({
  tasks: initialTasks,
  assignees,
}: {
  tasks: Task[];
  assignees: Assignee[];
}) {
  const tStatus = useTranslations("status");
  const [tasks, setTasks] = useState(initialTasks);
  const [activeId, setActiveId] = useState<string | null>(null);

  const assigneeById = useMemo(
    () => new Map(assignees.map((a) => [a.id, a])),
    [assignees],
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
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
