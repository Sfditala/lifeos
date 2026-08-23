"use client";

import { useRef, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Plus } from "lucide-react";
import { createProject } from "@/lib/actions";
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

type Goal = { id: string; title: string };

export function AddProjectDialog({
  lifeAreaId,
  goals,
}: {
  lifeAreaId: string;
  goals: Goal[];
}) {
  const t = useTranslations("areas");
  const tCommon = useTranslations("common");
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!formRef.current) return;
    setPending(true);
    const formData = new FormData(formRef.current);
    await createProject(formData);
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
          <input type="hidden" name="life_area_id" value={lifeAreaId} />
          <div className="space-y-1">
            <Label htmlFor="project-name">{tCommon("name")}</Label>
            <Input id="project-name" name="name" required autoFocus />
          </div>
          {goals.length > 0 && (
            <div className="space-y-1">
              <Label htmlFor="goal_id">{tCommon("goal")}</Label>
              <select
                id="goal_id"
                name="goal_id"
                defaultValue=""
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
              >
                <option value="">{tCommon("none")}</option>
                {goals.map((goal) => (
                  <option key={goal.id} value={goal.id}>
                    {goal.title}
                  </option>
                ))}
              </select>
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
