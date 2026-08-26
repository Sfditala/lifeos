"use client";

import { useTranslations } from "next-intl";
import { Target } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { deleteGoal } from "@/lib/actions";
import { countDescendants, type GoalPeriodType } from "@/lib/goals";
import { AddGoalDialog } from "@/components/add-goal-dialog";
import { EmptyState } from "@/components/empty-state";
import { ProgressBar } from "@/components/progress-bar";
import { RowMenu } from "@/components/row-menu";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";

type Goal = {
  id: string;
  title: string;
  status: string;
  target_date: string | null;
  period_type: GoalPeriodType;
  parent_goal_id: string | null;
  life_area_id: string | null;
  period_start: string | null;
  period_end: string | null;
};
type LifeArea = { id: string; name: string };
type GoalWithProgress = Goal & { progress: number };

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function GoalTierSection({
  periodType,
  title,
  emptyMessage,
  goals,
  allGoals,
  lifeAreas,
  actionExtra,
}: {
  periodType: GoalPeriodType;
  title: string;
  emptyMessage: string;
  goals: GoalWithProgress[];
  allGoals: GoalWithProgress[];
  lifeAreas: LifeArea[];
  actionExtra?: React.ReactNode;
}) {
  const tCommon = useTranslations("common");
  const goalOptions = allGoals.map((g) => ({
    id: g.id,
    title: g.title,
    period_type: g.period_type,
  }));

  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        <div className="flex items-center gap-2">
          {actionExtra}
          <AddGoalDialog
            lifeAreas={lifeAreas}
            allGoals={goalOptions}
            defaultPeriodType={periodType}
          />
        </div>
      </div>
      {goals.length > 0 ? (
        <ul className="grid gap-3 sm:grid-cols-2">
          {goals.map((goal) => {
            const descendantCount = countDescendants(goal.id, allGoals);
            return (
              <li
                key={goal.id}
                className="rounded-lg border border-border bg-card p-4"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="flex-1 text-sm font-medium text-foreground">
                    {goal.title}
                  </span>
                  <StatusBadge status={goal.status} />
                  <RowMenu
                    deleteTitle={tCommon("confirmDeleteTitle")}
                    deleteImpact={
                      descendantCount > 0
                        ? tCommon("deleteGoalImpact", { count: descendantCount })
                        : tCommon("deleteSimpleImpact")
                    }
                    onDelete={() => deleteGoal(goal.id)}
                    renderEdit={(open, onOpenChange) => (
                      <AddGoalDialog
                        lifeAreas={lifeAreas}
                        allGoals={goalOptions}
                        initial={goal}
                        open={open}
                        onOpenChange={onOpenChange}
                      />
                    )}
                  />
                </div>
                {goal.target_date && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {goal.target_date}
                  </p>
                )}
                <div className="mt-2">
                  <ProgressBar percent={goal.progress} />
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <EmptyState
          icon={Target}
          message={emptyMessage}
          action={
            <AddGoalDialog
              lifeAreas={lifeAreas}
              allGoals={goalOptions}
              defaultPeriodType={periodType}
            />
          }
        />
      )}
    </section>
  );
}

export function GoalsDashboard({
  goals,
  progress,
  lifeAreas,
}: {
  goals: Goal[];
  progress: Record<string, number>;
  lifeAreas: LifeArea[];
}) {
  const t = useTranslations("goalHierarchy");
  const today = todayIso();

  const withProgress = goals.map((g) => ({ ...g, progress: progress[g.id] ?? 0 }));

  const big = withProgress.filter((g) => g.period_type === "big");
  const yearly = withProgress.filter((g) => g.period_type === "yearly");
  const monthly = withProgress.filter((g) => g.period_type === "monthly");
  const thisWeek = withProgress.filter(
    (g) =>
      g.period_type === "weekly" &&
      (!g.period_start || g.period_start <= today) &&
      (!g.period_end || g.period_end >= today),
  );

  return (
    <div className="flex flex-col gap-8">
      <GoalTierSection
        periodType="big"
        title={t("big")}
        emptyMessage={t("emptyBig")}
        goals={big}
        allGoals={withProgress}
        lifeAreas={lifeAreas}
      />
      <GoalTierSection
        periodType="yearly"
        title={t("yearly")}
        emptyMessage={t("emptyYearly")}
        goals={yearly}
        allGoals={withProgress}
        lifeAreas={lifeAreas}
      />
      <GoalTierSection
        periodType="monthly"
        title={t("monthly")}
        emptyMessage={t("emptyMonthly")}
        goals={monthly}
        allGoals={withProgress}
        lifeAreas={lifeAreas}
      />
      <GoalTierSection
        periodType="weekly"
        title={t("weekly")}
        emptyMessage={t("emptyWeekly")}
        goals={thisWeek}
        allGoals={withProgress}
        lifeAreas={lifeAreas}
        actionExtra={
          <Link href="/reviews/new?type=weekly">
            <Button variant="ghost" size="sm">
              {t("startWeeklyReview")}
            </Button>
          </Link>
        }
      />
    </div>
  );
}
