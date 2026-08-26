"use client";

import { useRef, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Plus } from "lucide-react";
import { createGoal, updateGoal } from "@/lib/actions";
import {
  GOAL_PERIOD_TIERS,
  parentTierFor,
  currentWeekRange,
  type GoalPeriodType,
} from "@/lib/goals";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type LifeArea = { id: string; name: string };
type GoalOption = { id: string; title: string; period_type: GoalPeriodType };
type Initial = {
  id: string;
  title: string;
  target_date: string | null;
  period_type?: GoalPeriodType;
  parent_goal_id?: string | null;
  life_area_id?: string | null;
  period_start?: string | null;
  period_end?: string | null;
};

export function AddGoalDialog({
  lifeAreaId,
  lifeAreas,
  allGoals,
  defaultPeriodType,
  initial,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}: {
  lifeAreaId?: string;
  lifeAreas?: LifeArea[];
  allGoals?: GoalOption[];
  defaultPeriodType?: GoalPeriodType;
  initial?: Initial;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const t = useTranslations("areas");
  const tGoals = useTranslations("goalHierarchy");
  const tCommon = useTranslations("common");
  const hierarchical = !!allGoals;
  const isControlled = controlledOpen !== undefined;
  const [internalOpen, setInternalOpen] = useState(false);
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? setControlledOpen! : setInternalOpen;
  const [pending, setPending] = useState(false);
  const [periodType, setPeriodType] = useState<GoalPeriodType>(
    initial?.period_type ?? defaultPeriodType ?? "yearly",
  );
  const formRef = useRef<HTMLFormElement>(null);

  const parentTier = hierarchical ? parentTierFor(periodType) : null;
  const parentOptions = (allGoals ?? []).filter(
    (g) => g.period_type === parentTier && g.id !== initial?.id,
  );
  const week = currentWeekRange();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!formRef.current) return;
    setPending(true);
    const formData = new FormData(formRef.current);
    if (initial) {
      await updateGoal(initial.id, formData);
    } else {
      await createGoal(formData);
    }
    setPending(false);
    setOpen(false);
    formRef.current.reset();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!initial && (
        <DialogTrigger render={<Button variant="outline" size="sm" />}>
          <Plus className="h-4 w-4" />
          {t("addGoal")}
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initial ? tCommon("edit") : t("newGoalTitle")}
          </DialogTitle>
        </DialogHeader>
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          {lifeAreaId && <input type="hidden" name="life_area_id" value={lifeAreaId} />}
          {!hierarchical && <input type="hidden" name="period_type" value="yearly" />}

          {hierarchical && !initial && (
            <div className="space-y-1">
              <Label htmlFor="period_type">{tGoals("periodType")}</Label>
              <select
                id="period_type"
                name="period_type"
                value={periodType}
                onChange={(e) => setPeriodType(e.target.value as GoalPeriodType)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
              >
                {GOAL_PERIOD_TIERS.map((tier) => (
                  <option key={tier} value={tier}>
                    {tGoals(tier)}
                  </option>
                ))}
              </select>
            </div>
          )}
          {hierarchical && initial && (
            <input type="hidden" name="period_type" value={periodType} />
          )}

          <div className="space-y-1">
            <Label htmlFor="title">{tCommon("title")}</Label>
            <Input
              id="title"
              name="title"
              required
              autoFocus
              defaultValue={initial?.title}
            />
          </div>

          {hierarchical && parentTier && (
            <div className="space-y-1">
              <Label htmlFor="parent_goal_id">{tGoals("parentGoal")}</Label>
              <select
                id="parent_goal_id"
                name="parent_goal_id"
                defaultValue={initial?.parent_goal_id ?? ""}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
              >
                <option value="">{tCommon("none")}</option>
                {parentOptions.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          {hierarchical && lifeAreas && (
            <div className="space-y-1">
              <Label htmlFor="life_area_id">{tCommon("lifeArea")}</Label>
              <select
                id="life_area_id"
                name="life_area_id"
                defaultValue={initial?.life_area_id ?? ""}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
              >
                <option value="">{tCommon("none")}</option>
                {lifeAreas.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="space-y-1">
            <Label htmlFor="target_date">{tCommon("targetDate")}</Label>
            <Input
              id="target_date"
              name="target_date"
              type="date"
              defaultValue={initial?.target_date ?? undefined}
            />
          </div>

          {hierarchical && periodType === "weekly" && (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="period_start">{tGoals("periodStart")}</Label>
                <Input
                  id="period_start"
                  name="period_start"
                  type="date"
                  defaultValue={initial?.period_start ?? week.start}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="period_end">{tGoals("periodEnd")}</Label>
                <Input
                  id="period_end"
                  name="period_end"
                  type="date"
                  defaultValue={initial?.period_end ?? week.end}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button type="submit" disabled={pending}>
              {tCommon("save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
