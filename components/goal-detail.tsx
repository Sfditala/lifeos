"use client";

import { useTranslations } from "next-intl";
import { Target, FolderKanban } from "lucide-react";
import { Link, useRouter } from "@/i18n/navigation";
import { deleteGoal } from "@/lib/actions";
import { countDescendants, type GoalPeriodType } from "@/lib/goals";
import { AddGoalDialog } from "@/components/add-goal-dialog";
import { AddGoalProjectDialog } from "@/components/add-goal-project-dialog";
import { EmptyState } from "@/components/empty-state";
import { ProgressBar } from "@/components/progress-bar";
import { RowMenu } from "@/components/row-menu";
import { StatusBadge } from "@/components/status-badge";

type LifeArea = { id: string; name: string };
type GoalRef = { id: string; title: string };
type GoalOption = {
  id: string;
  title: string;
  period_type: GoalPeriodType;
  parent_goal_id: string | null;
  life_area_id: string | null;
  status: string;
  target_date: string | null;
};
type SubGoal = {
  id: string;
  title: string;
  status: string;
  period_type: GoalPeriodType;
  target_date: string | null;
  progress: number;
};
type LinkedProject = {
  id: string;
  name: string;
  status: string;
  life_area_id: string;
  due_date: string | null;
  taskStats: { done: number; total: number };
};
type Goal = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  target_date: string | null;
  period_type: GoalPeriodType;
  parent_goal_id: string | null;
  life_area_id: string | null;
  progress: number;
};

export function GoalDetail({
  goal,
  parentGoal,
  lifeArea,
  subGoals,
  linkedProjects,
  allGoals,
  lifeAreas,
}: {
  goal: Goal;
  parentGoal: GoalRef | null;
  lifeArea: LifeArea | null;
  subGoals: SubGoal[];
  linkedProjects: LinkedProject[];
  allGoals: GoalOption[];
  lifeAreas: LifeArea[];
}) {
  const t = useTranslations("goalHierarchy");
  const tCommon = useTranslations("common");
  const tAreas = useTranslations("areas");
  const router = useRouter();

  const descendantCount = countDescendants(goal.id, allGoals);

  return (
    <div className="flex flex-1 flex-col gap-8 p-4 sm:p-6">
      <div>
        {parentGoal && (
          <Link
            href={`/goals/${parentGoal.id}`}
            className="mb-2 inline-block text-xs text-muted-foreground hover:text-foreground"
          >
            ← {t("partOf")} {parentGoal.title}
          </Link>
        )}
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold text-foreground">
            {goal.title}
          </h1>
          <StatusBadge status={goal.status} />
          <RowMenu
            deleteTitle={tCommon("confirmDeleteTitle")}
            deleteImpact={
              descendantCount > 0
                ? tCommon("deleteGoalImpact", { count: descendantCount })
                : tCommon("deleteSimpleImpact")
            }
            onDelete={async () => {
              await deleteGoal(goal.id);
              router.push("/");
            }}
            renderEdit={(open, onOpenChange) => (
              <AddGoalDialog
                lifeAreas={lifeAreas}
                allGoals={allGoals}
                initial={goal}
                open={open}
                onOpenChange={onOpenChange}
              />
            )}
          />
        </div>
        {goal.description && (
          <p className="mt-2 text-sm text-muted-foreground">
            {goal.description}
          </p>
        )}
        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span>{t(goal.period_type)}</span>
          {goal.target_date && <span>{goal.target_date}</span>}
          {lifeArea && (
            <Link
              href={`/areas/${lifeArea.id}`}
              className="hover:text-foreground"
            >
              {tCommon("lifeArea")}: {lifeArea.name}
            </Link>
          )}
        </div>
        <div className="mt-4 max-w-sm">
          <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
            <span>{tCommon("progress")}</span>
            <span>{goal.progress}%</span>
          </div>
          <ProgressBar percent={goal.progress} />
        </div>
      </div>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">
            {t("subGoals")}
          </h2>
          <AddGoalDialog
            lifeAreas={lifeAreas}
            allGoals={allGoals}
            defaultPeriodType={goal.period_type}
          />
        </div>
        {subGoals.length > 0 ? (
          <ul className="grid gap-3 sm:grid-cols-2">
            {subGoals.map((sub) => (
              <li
                key={sub.id}
                className="rounded-xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
              >
                <Link href={`/goals/${sub.id}`} className="block">
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex-1 text-sm font-medium text-foreground">
                      {sub.title}
                    </span>
                    <StatusBadge status={sub.status} />
                  </div>
                  {sub.target_date && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      {sub.target_date}
                    </p>
                  )}
                  <div className="mt-2">
                    <ProgressBar percent={sub.progress} />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState icon={Target} message={t("emptySubGoals")} />
        )}
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">
            {t("linkedProjects")}
          </h2>
          <AddGoalProjectDialog goalId={goal.id} lifeAreas={lifeAreas} />
        </div>
        {linkedProjects.length > 0 ? (
          <ul className="divide-y divide-border rounded-lg border border-border bg-card shadow-sm">
            {linkedProjects.map((project) => (
              <li key={project.id}>
                <Link
                  href={`/areas/${project.life_area_id}/projects/${project.id}`}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-accent"
                >
                  <span className="flex-1 text-sm text-foreground">
                    {project.name}
                  </span>
                  {project.taskStats.total > 0 && (
                    <span className="text-xs text-muted-foreground">
                      {project.taskStats.done}/{project.taskStats.total}
                    </span>
                  )}
                  <StatusBadge status={project.status} />
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState icon={FolderKanban} message={tAreas("emptyProjects")} />
        )}
      </section>
    </div>
  );
}
