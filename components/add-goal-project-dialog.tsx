"use client";

import { useRef, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Plus } from "lucide-react";
import { createProject } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type LifeArea = { id: string; name: string };

export function AddGoalProjectDialog({
  goalId,
  lifeAreas,
}: {
  goalId: string;
  lifeAreas: LifeArea[];
}) {
  const t = useTranslations("areas");
  const tTeam = useTranslations("team");
  const tGoals = useTranslations("goalHierarchy");
  const tCommon = useTranslations("common");
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!formRef.current) return;
    setPending(true);
    await createProject(new FormData(formRef.current));
    setPending(false);
    setOpen(false);
    formRef.current.reset();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" size="sm" />}>
        <Plus className="h-4 w-4" />
        {t("addProject")}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("newProjectTitle")}</DialogTitle>
        </DialogHeader>
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          <input type="hidden" name="goal_id" value={goalId} />
          <div className="space-y-1">
            <Label htmlFor="goal-project-name">{tCommon("name")}</Label>
            <Input id="goal-project-name" name="name" required autoFocus />
          </div>
          <div className="space-y-1">
            <Label htmlFor="goal-project-description">
              {tCommon("description")}
            </Label>
            <Textarea id="goal-project-description" name="description" rows={2} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="goal-project-life-area">{tGoals("lifeAreaFor")}</Label>
            <select
              id="goal-project-life-area"
              name="life_area_id"
              required
              defaultValue=""
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
            >
              <option value="" disabled>
                {tTeam("chooseLifeArea")}
              </option>
              {lifeAreas.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <Label htmlFor="goal-project-due-date">{tCommon("dueDate")}</Label>
            <Input id="goal-project-due-date" name="due_date" type="date" />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={pending || lifeAreas.length === 0}>
              {tCommon("save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
