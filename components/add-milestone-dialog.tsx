"use client";

import { useRef, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Plus } from "lucide-react";
import { createMilestone, updateMilestone } from "@/lib/actions";
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

type Initial = { id: string; title: string; due_date: string | null };

export function AddMilestoneDialog({
  projectId,
  initial,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}: {
  projectId: string;
  initial?: Initial;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const t = useTranslations("project");
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
      await updateMilestone(initial.id, formData);
    } else {
      await createMilestone(formData);
    }
    setPending(false);
    setOpen(false);
    formRef.current.reset();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!initial && (
        <DialogTrigger render={<Button size="sm" variant="outline" />}>
          <Plus className="h-4 w-4" />
          {t("addMilestone")}
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initial ? tCommon("edit") : t("newMilestoneTitle")}
          </DialogTitle>
        </DialogHeader>
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          <input type="hidden" name="project_id" value={projectId} />
          <div className="space-y-1">
            <Label htmlFor="milestone-title">{tCommon("title")}</Label>
            <Input
              id="milestone-title"
              name="title"
              required
              autoFocus
              defaultValue={initial?.title}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="milestone-due-date">{tCommon("dueDate")}</Label>
            <Input
              id="milestone-due-date"
              name="due_date"
              type="date"
              defaultValue={initial?.due_date ?? undefined}
            />
          </div>
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
