import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { computeGoalProgress } from "@/lib/goals";
import { GoalDetail } from "@/components/goal-detail";

export default async function GoalPage({
  params,
}: {
  params: Promise<{ goalId: string }>;
}) {
  const { goalId } = await params;
  const supabase = await createClient();

  const [{ data: goal }, { data: allGoals }, { data: allTasks }, { data: lifeAreas }] =
    await Promise.all([
      supabase
        .from("goals")
        .select(
          "id, title, description, status, target_date, period_type, parent_goal_id, life_area_id",
        )
        .eq("id", goalId)
        .is("deleted_at", null)
        .single(),
      supabase
        .from("goals")
        .select(
          "id, title, status, target_date, period_type, parent_goal_id, life_area_id",
        )
        .is("deleted_at", null),
      supabase.from("tasks").select("life_area_id, status").is("deleted_at", null),
      supabase
        .from("life_areas")
        .select("id, name")
        .is("deleted_at", null)
        .order("sort_order", { ascending: true }),
    ]);

  if (!goal) notFound();

  const progressMap = computeGoalProgress(allGoals ?? [], allTasks ?? []);

  const subGoals = (allGoals ?? [])
    .filter((g) => g.parent_goal_id === goal.id)
    .map((g) => ({ ...g, progress: progressMap.get(g.id) ?? 0 }));

  const parentGoal = goal.parent_goal_id
    ? (allGoals ?? []).find((g) => g.id === goal.parent_goal_id) ?? null
    : null;

  const lifeArea = goal.life_area_id
    ? (lifeAreas ?? []).find((a) => a.id === goal.life_area_id) ?? null
    : null;

  const { data: linkedProjects } = await supabase
    .from("projects")
    .select("id, name, status, life_area_id, due_date")
    .eq("goal_id", goalId)
    .is("deleted_at", null);

  const projectIds = (linkedProjects ?? []).map((p) => p.id);
  const { data: projectTasks } =
    projectIds.length > 0
      ? await supabase
          .from("tasks")
          .select("project_id, status")
          .in("project_id", projectIds)
          .is("deleted_at", null)
      : { data: [] as { project_id: string | null; status: string }[] };

  const taskStatsByProject = new Map<string, { done: number; total: number }>();
  for (const task of projectTasks ?? []) {
    if (!task.project_id) continue;
    const stat = taskStatsByProject.get(task.project_id) ?? { done: 0, total: 0 };
    stat.total += 1;
    if (task.status === "done") stat.done += 1;
    taskStatsByProject.set(task.project_id, stat);
  }

  return (
    <GoalDetail
      goal={{ ...goal, progress: progressMap.get(goal.id) ?? 0 }}
      parentGoal={parentGoal}
      lifeArea={lifeArea}
      subGoals={subGoals}
      linkedProjects={(linkedProjects ?? []).map((p) => ({
        ...p,
        taskStats: taskStatsByProject.get(p.id) ?? { done: 0, total: 0 },
      }))}
      allGoals={allGoals ?? []}
      lifeAreas={lifeAreas ?? []}
    />
  );
}
