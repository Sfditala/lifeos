"use client";

import { useRef, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { DollarSign } from "lucide-react";
import { upsertDeal } from "@/lib/actions";
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

const CHANNELS = ["whatsapp", "email", "linkedin", "phone", "other"] as const;

type Initial = {
  contact_name: string | null;
  channel: string | null;
  deal_value: number | null;
  last_contacted_at: string | null;
};

export function DealDialog({
  taskId,
  companyId,
  initial,
  hasValue,
}: {
  taskId: string;
  companyId: string;
  initial?: Initial;
  hasValue: boolean;
}) {
  const t = useTranslations("deals");
  const tCommon = useTranslations("common");
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!formRef.current) return;
    setPending(true);
    await upsertDeal(taskId, new FormData(formRef.current));
    setPending(false);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <button
            type="button"
            title={t("dealInfo")}
            className={`flex h-6 w-6 items-center justify-center rounded-full transition-colors ${
              hasValue
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-muted-foreground/50 hover:text-muted-foreground"
            }`}
          />
        }
      >
        <DollarSign className="h-3.5 w-3.5" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("dealInfo")}</DialogTitle>
        </DialogHeader>
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          <input type="hidden" name="company_id" value={companyId} />
          <div className="space-y-1">
            <Label htmlFor="contact_name">{t("contactName")}</Label>
            <Input
              id="contact_name"
              name="contact_name"
              defaultValue={initial?.contact_name ?? undefined}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="channel">{t("channel")}</Label>
              <select
                id="channel"
                name="channel"
                defaultValue={initial?.channel ?? ""}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
              >
                <option value="">{tCommon("none")}</option>
                {CHANNELS.map((c) => (
                  <option key={c} value={c}>
                    {t(`channel_${c}`)}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="deal_value">{t("dealValue")}</Label>
              <Input
                id="deal_value"
                name="deal_value"
                type="number"
                step="0.01"
                min="0"
                defaultValue={initial?.deal_value ?? undefined}
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="last_contacted_at">{t("lastContactedAt")}</Label>
            <Input
              id="last_contacted_at"
              name="last_contacted_at"
              type="date"
              defaultValue={initial?.last_contacted_at ?? undefined}
            />
          </div>
          <p className="text-xs text-muted-foreground">{t("convertHint")}</p>
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
