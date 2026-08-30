"use client";

import { useRef, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Plus } from "lucide-react";
import { createHabit, updateHabit } from "@/lib/actions";
import { HABIT_CATEGORIES, WEEKDAY_INDEXES, type HabitFrequency } from "@/lib/habits";
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
  name: string;
  frequency: string;
  category?: string | null;
  custom_days?: number[] | null;
};

export function AddHabitDialog({
  initial,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}: {
  initial?: Initial;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
} = {}) {
  const t = useTranslations("habits");
  const tCommon = useTranslations("common");
  const tWeekdays = useTranslations("weekdays");
  const isControlled = controlledOpen !== undefined;
  const [internalOpen, setInternalOpen] = useState(false);
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? setControlledOpen! : setInternalOpen;
  const [pending, setPending] = useState(false);
  const [frequency, setFrequency] = useState<HabitFrequency>(
    (initial?.frequency as HabitFrequency) ?? "daily",
  );
  const [selectedDays, setSelectedDays] = useState<Set<number>>(
    new Set(initial?.custom_days ?? []),
  );
  const formRef = useRef<HTMLFormElement>(null);

  function toggleDay(day: number) {
    setSelectedDays((prev) => {
      const next = new Set(prev);
      if (next.has(day)) next.delete(day);
      else next.add(day);
      return next;
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!formRef.current) return;
    setPending(true);
    const formData = new FormData(formRef.current);
    if (initial) {
      await updateHabit(initial.id, formData);
    } else {
      await createHabit(formData);
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
          {t("addHabit")}
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initial ? tCommon("edit") : t("newHabitTitle")}
          </DialogTitle>
        </DialogHeader>
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="habit-name">{tCommon("name")}</Label>
            <Input
              id="habit-name"
              name="name"
              required
              autoFocus
              defaultValue={initial?.name}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="frequency">{t("frequency")}</Label>
            <select
              id="frequency"
              name="frequency"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value as HabitFrequency)}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
            >
              <option value="daily">{t("daily")}</option>
              <option value="custom_days">{t("customDays")}</option>
              <option value="weekly">{t("weekly")}</option>
            </select>
            <p className="text-xs text-muted-foreground">
              {frequency === "daily"
                ? t("dailyHint")
                : frequency === "custom_days"
                  ? t("customDaysHint")
                  : t("weeklyHint")}
            </p>
          </div>

          {frequency === "custom_days" && (
            <div className="space-y-1">
              <Label>{t("chooseDays")}</Label>
              <div className="flex flex-wrap gap-2">
                {WEEKDAY_INDEXES.map((day) => (
                  <label
                    key={day}
                    className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border text-xs font-medium transition-colors ${
                      selectedDays.has(day)
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <input
                      type="checkbox"
                      name="custom_days"
                      value={day}
                      checked={selectedDays.has(day)}
                      onChange={() => toggleDay(day)}
                      className="sr-only"
                    />
                    {tWeekdays(`short${day}` as "short0")}
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-1">
            <Label htmlFor="category">{t("category")}</Label>
            <select
              id="category"
              name="category"
              defaultValue={initial?.category ?? ""}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
            >
              <option value="">{tCommon("none")}</option>
              {HABIT_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {t(`category_${cat}` as "category_health")}
                </option>
              ))}
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
