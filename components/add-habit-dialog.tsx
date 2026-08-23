"use client";

import { useRef, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Plus } from "lucide-react";
import { createHabit } from "@/lib/actions";
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

export function AddHabitDialog() {
  const t = useTranslations("habits");
  const tCommon = useTranslations("common");
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!formRef.current) return;
    setPending(true);
    const formData = new FormData(formRef.current);
    await createHabit(formData);
    setPending(false);
    setOpen(false);
    formRef.current.reset();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm" />}>
        <Plus className="h-4 w-4" />
        {t("addHabit")}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("newHabitTitle")}</DialogTitle>
        </DialogHeader>
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="habit-name">{tCommon("name")}</Label>
            <Input id="habit-name" name="name" required autoFocus />
          </div>
          <div className="space-y-1">
            <Label htmlFor="frequency">{t("frequency")}</Label>
            <select
              id="frequency"
              name="frequency"
              defaultValue="daily"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
            >
              <option value="daily">{t("daily")}</option>
              <option value="weekly">{t("weekly")}</option>
            </select>
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
