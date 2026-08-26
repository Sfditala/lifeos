"use client";

import { useRef, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { UserPlus } from "lucide-react";
import { inviteMember } from "@/lib/actions";
import { TEAM_POSITIONS } from "@/lib/team-positions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function InviteMemberDialog({ companyId }: { companyId: string }) {
  const t = useTranslations("team");
  const tCommon = useTranslations("common");
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!formRef.current) return;
    const formData = new FormData(formRef.current);
    const email = formData.get("email") as string;
    const position = formData.get("position") as string;
    setPending(true);
    await inviteMember(companyId, email, position);
    setPending(false);
    setOpen(false);
    formRef.current.reset();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm" variant="outline" />}>
        <UserPlus className="h-4 w-4" />
        {t("inviteMember")}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("inviteMember")}</DialogTitle>
          <DialogDescription>{t("inviteHint")}</DialogDescription>
        </DialogHeader>
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="invite-email">{t("inviteEmail")}</Label>
            <Input
              id="invite-email"
              name="email"
              type="email"
              required
              autoFocus
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="invite-position">{t("position")}</Label>
            <select
              id="invite-position"
              name="position"
              defaultValue="member"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
            >
              {TEAM_POSITIONS.map((p) => (
                <option key={p} value={p}>
                  {t(`position_${p}`)}
                </option>
              ))}
            </select>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={pending}>
              {t("invite")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
