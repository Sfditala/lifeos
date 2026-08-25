"use client";

import { useRef, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Plus } from "lucide-react";
import { createFinanceAccount, updateFinanceAccount } from "@/lib/actions";
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
  type: string;
  currency: string;
  opening_balance: number;
};

export function AddAccountDialog({
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
      await updateFinanceAccount(initial.id, formData);
    } else {
      await createFinanceAccount(formData);
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
          {t("addAccount")}
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initial ? tCommon("edit") : t("newAccountTitle")}
          </DialogTitle>
        </DialogHeader>
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="account-name">{tCommon("name")}</Label>
            <Input
              id="account-name"
              name="name"
              required
              autoFocus
              defaultValue={initial?.name}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="type">{t("accountType")}</Label>
              <select
                id="type"
                name="type"
                defaultValue={initial?.type ?? "cash"}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
              >
                <option value="cash">{t("cash")}</option>
                <option value="bank">{t("bank")}</option>
                <option value="credit">{t("credit")}</option>
                <option value="savings">{t("savings")}</option>
              </select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="currency">{t("currency")}</Label>
              <Input
                id="currency"
                name="currency"
                defaultValue={initial?.currency ?? "ILS"}
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="opening_balance">{t("openingBalance")}</Label>
            <Input
              id="opening_balance"
              name="opening_balance"
              type="number"
              step="0.01"
              defaultValue={initial?.opening_balance ?? 0}
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
