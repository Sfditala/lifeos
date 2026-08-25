"use client";

import { useRef, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Plus } from "lucide-react";
import { createProject, updateProject } from "@/lib/actions";
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

type Goal = { id: string; title: string };
type Company = { id: string; name: string };
type Initial = {
  id: string;
  name: string;
  description: string | null;
  due_date: string | null;
  goal_id?: string | null;
  company_id?: string | null;
};

export function AddProjectDialog({
  lifeAreaId,
  goals,
  companies,
  initial,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}: {
  lifeAreaId: string;
  goals: Goal[];
  companies?: Company[];
  initial?: Initial;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const t = useTranslations("areas");
  const tCommon = useTranslations("common");
  const isControlled = controlledOpen !== undefined;
  const [internalOpen, setInternalOpen] = useState(false);
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? setControlledOpen! : setInternalOpen;
  const [pending, setPending] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!formRef.current) return;
    setPending(true);
    const formData = new FormData(formRef.current);
    if (initial) {
      await updateProject(initial.id, formData);
    } else {
      await createProject(formData);
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
          {t("addProject")}
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initial ? tCommon("edit") : t("newProjectTitle")}
          </DialogTitle>
        </DialogHeader>
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          <input type="hidden" name="life_area_id" value={lifeAreaId} />
          <div className="space-y-1">
            <Label htmlFor="project-name">{tCommon("name")}</Label>
            <Input
              id="project-name"
              name="name"
              required
              autoFocus
              defaultValue={initial?.name}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="project-description">{tCommon("description")}</Label>
            <Textarea
              id="project-description"
              name="description"
              rows={2}
              defaultValue={initial?.description ?? undefined}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="project-due-date">{tCommon("dueDate")}</Label>
            <Input
              id="project-due-date"
              name="due_date"
              type="date"
              defaultValue={initial?.due_date ?? undefined}
            />
          </div>
          {goals.length > 0 && (
            <div className="space-y-1">
              <Label htmlFor="goal_id">{tCommon("goal")}</Label>
              <select
                id="goal_id"
                name="goal_id"
                defaultValue={initial?.goal_id ?? ""}
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
          {companies && companies.length > 0 && (
            <div className="space-y-1">
              <Label htmlFor="company_id">{tCommon("company")}</Label>
              <select
                id="company_id"
                name="company_id"
                defaultValue={initial?.company_id ?? ""}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
              >
                <option value="">{tCommon("none")}</option>
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
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
