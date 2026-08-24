"use client";

import { useRef, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Plus } from "lucide-react";
import { createMeeting, updateMeeting } from "@/lib/actions";
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

type Initial = {
  id: string;
  title: string;
  starts_at: string;
  ends_at: string | null;
  location: string | null;
  notes: string | null;
};

function toLocalInputValue(iso?: string | null) {
  if (!iso) return undefined;
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function AddMeetingDialog({
  lifeAreaId,
  projectId,
  initial,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}: {
  lifeAreaId?: string;
  projectId?: string;
  initial?: Initial;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const t = useTranslations("meetings");
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
    const startsLocal = formData.get("starts_at") as string;
    const endsLocal = formData.get("ends_at") as string;
    formData.set(
      "starts_at",
      startsLocal ? new Date(startsLocal).toISOString() : "",
    );
    formData.set("ends_at", endsLocal ? new Date(endsLocal).toISOString() : "");

    if (initial) {
      await updateMeeting(initial.id, formData);
    } else {
      await createMeeting(formData);
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
          {t("addMeeting")}
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initial ? tCommon("edit") : t("newMeetingTitle")}
          </DialogTitle>
        </DialogHeader>
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          {lifeAreaId && (
            <input type="hidden" name="life_area_id" value={lifeAreaId} />
          )}
          {projectId && (
            <input type="hidden" name="project_id" value={projectId} />
          )}
          <div className="space-y-1">
            <Label htmlFor="meeting-title">{tCommon("title")}</Label>
            <Input
              id="meeting-title"
              name="title"
              required
              autoFocus
              defaultValue={initial?.title}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="starts_at">{t("startsAt")}</Label>
              <Input
                id="starts_at"
                name="starts_at"
                type="datetime-local"
                required
                defaultValue={toLocalInputValue(initial?.starts_at)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="ends_at">{t("endsAt")}</Label>
              <Input
                id="ends_at"
                name="ends_at"
                type="datetime-local"
                defaultValue={toLocalInputValue(initial?.ends_at)}
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="location">{t("location")}</Label>
            <Input
              id="location"
              name="location"
              defaultValue={initial?.location ?? undefined}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="meeting-notes">{t("notes")}</Label>
            <Textarea
              id="meeting-notes"
              name="notes"
              rows={2}
              defaultValue={initial?.notes ?? undefined}
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
