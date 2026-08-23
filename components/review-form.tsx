"use client";

import { useRef, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { createReview } from "@/lib/actions";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ReviewForm({
  type,
  periodStart,
  periodEnd,
}: {
  type: "daily" | "weekly";
  periodStart: string;
  periodEnd: string;
}) {
  const t = useTranslations("reviews");
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!formRef.current) return;
    setPending(true);
    const formData = new FormData(formRef.current);
    await createReview(formData);
    setPending(false);
    router.push("/reviews");
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
      <input type="hidden" name="type" value={type} />
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label htmlFor="period_start">{t("periodStart")}</Label>
          <Input
            id="period_start"
            name="period_start"
            type="date"
            defaultValue={periodStart}
            required
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="period_end">{t("periodEnd")}</Label>
          <Input
            id="period_end"
            name="period_end"
            type="date"
            defaultValue={periodEnd}
            required
          />
        </div>
      </div>

      <div className="space-y-1">
        <Label htmlFor="summary">{t("summary")}</Label>
        <Textarea id="summary" name="summary" rows={3} />
      </div>
      <div className="space-y-1">
        <Label htmlFor="win">{t("win")}</Label>
        <Textarea id="win" name="win" rows={2} />
      </div>
      <div className="space-y-1">
        <Label htmlFor="blocker">{t("blocker")}</Label>
        <Textarea id="blocker" name="blocker" rows={2} />
      </div>
      <div className="space-y-1">
        <Label htmlFor="conflict">{t("conflict")}</Label>
        <Textarea id="conflict" name="conflict" rows={2} />
      </div>
      <div className="space-y-1">
        <Label htmlFor="priority_next">{t("priority_next")}</Label>
        <Textarea id="priority_next" name="priority_next" rows={2} />
      </div>

      <Button type="submit" disabled={pending}>
        {t("save")}
      </Button>
    </form>
  );
}
