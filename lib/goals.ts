export const GOAL_PERIOD_TIERS = ["big", "yearly", "monthly", "weekly"] as const;
export type GoalPeriodType = (typeof GOAL_PERIOD_TIERS)[number];

export function parentTierFor(type: GoalPeriodType): GoalPeriodType | null {
  const idx = GOAL_PERIOD_TIERS.indexOf(type);
  return idx > 0 ? GOAL_PERIOD_TIERS[idx - 1] : null;
}

export function currentWeekRange(): { start: string; end: string } {
  const now = new Date();
  const day = now.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diffToMonday);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  return { start: fmt(monday), end: fmt(sunday) };
}

export type GoalNode = {
  id: string;
  period_type: GoalPeriodType;
  parent_goal_id: string | null;
  life_area_id: string | null;
  status: string;
};

export type TaskStat = { life_area_id: string | null; status: string };

export function computeGoalProgress(
  goals: GoalNode[],
  tasks: TaskStat[],
): Map<string, number> {
  const childrenOf = new Map<string, GoalNode[]>();
  for (const g of goals) {
    if (g.parent_goal_id) {
      const arr = childrenOf.get(g.parent_goal_id) ?? [];
      arr.push(g);
      childrenOf.set(g.parent_goal_id, arr);
    }
  }

  const taskStatsByArea = new Map<string, { done: number; total: number }>();
  for (const task of tasks) {
    if (!task.life_area_id) continue;
    const stat = taskStatsByArea.get(task.life_area_id) ?? {
      done: 0,
      total: 0,
    };
    stat.total += 1;
    if (task.status === "done") stat.done += 1;
    taskStatsByArea.set(task.life_area_id, stat);
  }

  const progress = new Map<string, number>();

  function computeFor(goal: GoalNode): number {
    const cached = progress.get(goal.id);
    if (cached !== undefined) return cached;
    const children = childrenOf.get(goal.id) ?? [];
    let value: number;
    if (children.length > 0) {
      const sum = children.reduce((acc, child) => acc + computeFor(child), 0);
      value = Math.round(sum / children.length);
    } else if (goal.life_area_id && taskStatsByArea.has(goal.life_area_id)) {
      const stat = taskStatsByArea.get(goal.life_area_id)!;
      value = stat.total > 0 ? Math.round((stat.done / stat.total) * 100) : 0;
    } else {
      value = goal.status === "done" ? 100 : 0;
    }
    progress.set(goal.id, value);
    return value;
  }

  for (const g of goals) computeFor(g);
  return progress;
}

export function countDescendants(
  goalId: string,
  goals: { id: string; parent_goal_id: string | null }[],
): number {
  const childrenOf = new Map<string, string[]>();
  for (const g of goals) {
    if (g.parent_goal_id) {
      const arr = childrenOf.get(g.parent_goal_id) ?? [];
      arr.push(g.id);
      childrenOf.set(g.parent_goal_id, arr);
    }
  }
  let count = 0;
  const queue = [...(childrenOf.get(goalId) ?? [])];
  while (queue.length > 0) {
    const current = queue.pop()!;
    count += 1;
    queue.push(...(childrenOf.get(current) ?? []));
  }
  return count;
}

export function descendantIds(
  goalId: string,
  goals: { id: string; parent_goal_id: string | null }[],
): Set<string> {
  const childrenOf = new Map<string, string[]>();
  for (const g of goals) {
    if (g.parent_goal_id) {
      const arr = childrenOf.get(g.parent_goal_id) ?? [];
      arr.push(g.id);
      childrenOf.set(g.parent_goal_id, arr);
    }
  }
  const result = new Set<string>();
  const queue = [...(childrenOf.get(goalId) ?? [])];
  while (queue.length > 0) {
    const current = queue.pop()!;
    if (!result.has(current)) {
      result.add(current);
      queue.push(...(childrenOf.get(current) ?? []));
    }
  }
  return result;
}
