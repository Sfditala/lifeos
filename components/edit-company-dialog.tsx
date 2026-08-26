"use client";

import { useRef, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Pencil } from "lucide-react";
import { updateCompany } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Company = {
  id: string;
  name: string;
  founded_date: string | null;
  description: string | null;
  industry: string | null;
  contact_email: string | null;
  contact_phone: string | null;
};

export function EditCompanyDialog({ company }: { company: Company }) {
  const t = useTranslations("team");
  const tCommon = useTranslations("common");
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!formRef.current) return;
    setPending(true);
    await updateCompany(company.id, new FormData(formRef.current));
    setPending(false);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm" variant="outline" />}>
        <Pencil className="h-4 w-4" />
        {tCommon("edit")}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("editCompany")}</DialogTitle>
        </DialogHeader>
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="company-edit-name">{tCommon("name")}</Label>
            <Input
              id="company-edit-name"
              name="name"
              required
              autoFocus
              defaultValue={company.name}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="company-edit-industry">{t("industry")}</Label>
            <Input
              id="company-edit-industry"
              name="industry"
              defaultValue={company.industry ?? undefined}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="company-edit-founded">{t("foundedDate")}</Label>
            <Input
              id="company-edit-founded"
              name="founded_date"
              type="date"
              defaultValue={company.founded_date ?? undefined}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="company-edit-description">{t("description")}</Label>
            <Textarea
              id="company-edit-description"
              name="description"
              rows={3}
              defaultValue={company.description ?? undefined}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="company-edit-email">{t("contactEmail")}</Label>
              <Input
                id="company-edit-email"
                name="contact_email"
                type="email"
                defaultValue={company.contact_email ?? undefined}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="company-edit-phone">{t("contactPhone")}</Label>
              <Input
                id="company-edit-phone"
                name="contact_phone"
                type="tel"
                defaultValue={company.contact_phone ?? undefined}
              />
            </div>
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
