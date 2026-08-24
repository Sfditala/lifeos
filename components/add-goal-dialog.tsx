"use client";

import { useRef, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Plus } from "lucide-react";
import { createGoal, updateGoal } from "@/lib/actions";
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

type Initial = { id: string; title: string; target_date: string | null };

export function AddGoalDialog({
  lifeAreaId,
  initial,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}: {
  lifeAreaId: string;
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
          <input type="hidden" name="life_area_id" value={lifeAreaId} />
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
          <div className="space-y-1">
            <Label htmlFor="target_date">{tCommon("targetDate")}</Label>
            <Input
              id="target_date"
              name="target_date"
              type="date"
              defaultValue={initial?.target_date ?? undefined}
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
