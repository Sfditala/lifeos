"use client";

import { useRef, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Plus } from "lucide-react";
import { createTask, updateTask } from "@/lib/actions";
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

type Project = { id: string; name: string };
type Assignee = { id: string; email: string };
type Initial = {
  id: string;
  title: string;
  due_date: string | null;
  priority: string;
  project_id: string | null;
  assigned_to?: string | null;
};

export function AddTaskDialog({
  lifeAreaId,
  projects,
  assignees,
  initial,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}: {
  lifeAreaId: string;
  projects: Project[];
  assignees?: Assignee[];
  initial?: Initial;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const t = useTranslations("areas");
  const tTeam = useTranslations("team");
  const tCommon = useTranslations("common");
  const tPriority = useTranslations("priority");
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
      await updateTask(initial.id, formData);
    } else {
      await createTask(formData);
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
          {t("addTask")}
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initial ? tCommon("edit") : t("newTaskTitle")}
          </DialogTitle>
        </DialogHeader>
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          <input type="hidden" name="life_area_id" value={lifeAreaId} />
          <div className="space-y-1">
            <Label htmlFor="task-title">{tCommon("title")}</Label>
            <Input
              id="task-title"
              name="title"
              required
              autoFocus
              defaultValue={initial?.title}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="due_date">{tCommon("dueDate")}</Label>
              <Input
                id="due_date"
                name="due_date"
                type="date"
                defaultValue={initial?.due_date ?? undefined}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="priority">{tCommon("priority")}</Label>
              <select
                id="priority"
                name="priority"
                defaultValue={initial?.priority ?? "medium"}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
              >
                <option value="low">{tPriority("low")}</option>
                <option value="medium">{tPriority("medium")}</option>
                <option value="high">{tPriority("high")}</option>
              </select>
            </div>
          </div>
          {projects.length > 0 && (
            <div className="space-y-1">
              <Label htmlFor="project_id">{tCommon("project")}</Label>
              <select
                id="project_id"
                name="project_id"
                defaultValue={initial?.project_id ?? ""}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
              >
                <option value="">{tCommon("none")}</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          {assignees && assignees.length > 0 && (
            <div className="space-y-1">
              <Label htmlFor="assigned_to">{tTeam("assignTo")}</Label>
              <select
                id="assigned_to"
                name="assigned_to"
                defaultValue={initial?.assigned_to ?? ""}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
              >
                <option value="">{tTeam("unassigned")}</option>
                {assignees.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.email}
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
