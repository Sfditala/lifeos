"use client";

import { useRef, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Plus } from "lucide-react";
import { createTransaction } from "@/lib/actions";
import { INCOME_SOURCES } from "@/lib/income-sources";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Account = { id: string; name: string };
type LifeArea = { id: string; name: string };

export function AddTransactionDialog({
  accounts,
  areas,
  companyId,
}: {
  accounts: Account[];
  areas: LifeArea[];
  companyId?: string;
}) {
  const t = useTranslations("finance");
  const tCommon = useTranslations("common");
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [isRecurring, setIsRecurring] = useState(false);
  const [direction, setDirection] = useState("out");
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!formRef.current) return;
    setPending(true);
    const formData = new FormData(formRef.current);
    await createTransaction(formData);
    setPending(false);
    setOpen(false);
    formRef.current.reset();
    setIsRecurring(false);
    setDirection("out");
  }

  if (accounts.length === 0) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm" />}>
        <Plus className="h-4 w-4" />
        {t("addTransaction")}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("newTransactionTitle")}</DialogTitle>
        </DialogHeader>
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          {companyId && (
            <input type="hidden" name="company_id" value={companyId} />
          )}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="account_id">{t("account")}</Label>
              <select
                id="account_id"
                name="account_id"
                required
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
              >
                {accounts.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="direction">{t("direction")}</Label>
              <select
                id="direction"
                name="direction"
                value={direction}
                onChange={(e) => setDirection(e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
              >
                <option value="out">{t("expense")}</option>
                <option value="in">{t("income")}</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="amount">{t("amount")}</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                required
                autoFocus
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="occurred_at">{t("occurredAt")}</Label>
              <Input
                id="occurred_at"
                name="occurred_at"
                type="date"
                required
                defaultValue={new Date().toISOString().slice(0, 10)}
              />
            </div>
          </div>
          {direction === "in" ? (
            <div className="space-y-1">
              <Label htmlFor="source">{t("source")}</Label>
              <select
                id="source"
                name="source"
                defaultValue="salary"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
              >
                {INCOME_SOURCES.map((s) => (
                  <option key={s} value={s}>
                    {t(`source_${s}`)}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="space-y-1">
              <Label htmlFor="category">{t("category")}</Label>
              <Input id="category" name="category" />
            </div>
          )}
          {areas.length > 0 && (
            <div className="space-y-1">
              <Label htmlFor="life_area_id">{tCommon("lifeArea")}</Label>
              <select
                id="life_area_id"
                name="life_area_id"
                defaultValue=""
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
              >
                <option value="">{tCommon("none")}</option>
                {areas.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="space-y-1">
            <Label htmlFor="note">{t("note")}</Label>
            <Input id="note" name="note" />
          </div>
          <label className="flex items-center gap-2 text-sm text-foreground">
            <Checkbox
              name="is_recurring"
              value="on"
              checked={isRecurring}
              onCheckedChange={(c) => setIsRecurring(c === true)}
            />
            {t("isRecurring")}
          </label>
          {isRecurring && (
            <div className="space-y-1">
              <Label htmlFor="recurrence_rule">{t("recurrenceRule")}</Label>
              <Input id="recurrence_rule" name="recurrence_rule" />
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
