export const TASK_STATUS_STAGES = [
  "backlog",
  "ready",
  "in_progress",
  "in_review",
  "done",
] as const;
export type TaskStatus = (typeof TASK_STATUS_STAGES)[number];
