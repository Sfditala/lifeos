"use client";

import { useRef, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Plus } from "lucide-react";
import { createFinancialGoal, updateFinancialGoal } from "@/lib/actions";
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

type Initial = {
  id: string;
  title: string;
  target_amount: number;
  current_amount: number;
  target_date: string | null;
};

export function AddFinancialGoalDialog({
  initial,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}: {
  initial?: Initial;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
} = {}) {
  const t = useTranslations("finance");
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
      await updateFinancialGoal(initial.id, formData);
    } else {
      await createFinancialGoal(formData);
    }
    setPending(false);
    setOpen(false);
    formRef.current.reset();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!initial && (
        <DialogTrigger render={<Button size="sm" />}>
          <Plus className="h-4 w-4" />
          {t("addFinancialGoal")}
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initial ? tCommon("edit") : t("newFinancialGoalTitle")}
          </DialogTitle>
        </DialogHeader>
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="fg-title">{tCommon("title")}</Label>
            <Input
              id="fg-title"
              name="title"
              required
              autoFocus
              defaultValue={initial?.title}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="target_amount">{t("targetAmount")}</Label>
              <Input
                id="target_amount"
                name="target_amount"
                type="number"
                step="0.01"
                required
                defaultValue={initial?.target_amount}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="current_amount">{t("currentAmount")}</Label>
              <Input
                id="current_amount"
                name="current_amount"
                type="number"
                step="0.01"
                defaultValue={initial?.current_amount ?? 0}
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="fg-target-date">{t("targetDate")}</Label>
            <Input
              id="fg-target-date"
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
