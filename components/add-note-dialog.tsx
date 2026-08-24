"use client";

import { useRef, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Plus } from "lucide-react";
import { createNote, updateNote } from "@/lib/actions";
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

type Initial = { id: string; title: string; body: string };

export function AddNoteDialog({
  lifeAreaId,
  initial,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}: {
  lifeAreaId?: string;
  initial?: Initial;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
} = {}) {
  const t = useTranslations("notes");
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
      await updateNote(initial.id, formData);
    } else {
      await createNote(formData);
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
          {t("addNote")}
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initial ? tCommon("edit") : t("newNoteTitle")}
          </DialogTitle>
        </DialogHeader>
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          {lifeAreaId && (
            <input type="hidden" name="life_area_id" value={lifeAreaId} />
          )}
          <div className="space-y-1">
            <Label htmlFor="note-title">{tCommon("title")}</Label>
            <Input
              id="note-title"
              name="title"
              required
              autoFocus
              defaultValue={initial?.title}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="note-body">{t("body")}</Label>
            <Textarea
              id="note-body"
              name="body"
              required
              rows={6}
              defaultValue={initial?.body}
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
