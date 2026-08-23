"use client";

import { useRef, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Plus } from "lucide-react";
import { createGoal } from "@/lib/actions";
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

export function AddGoalDialog({ lifeAreaId }: { lifeAreaId: string }) {
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
    await createGoal(formData);
    setPending(false);
    setOpen(false);
    formRef.current.reset();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" size="sm" />}>
        <Plus className="h-4 w-4" />
        {t("addGoal")}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("newGoalTitle")}</DialogTitle>
        </DialogHeader>
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          <input type="hidden" name="life_area_id" value={lifeAreaId} />
          <div className="space-y-1">
            <Label htmlFor="title">{tCommon("title")}</Label>
            <Input id="title" name="title" required autoFocus />
          </div>
          <div className="space-y-1">
            <Label htmlFor="target_date">{tCommon("targetDate")}</Label>
            <Input id="target_date" name="target_date" type="date" />
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
