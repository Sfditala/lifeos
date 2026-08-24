"use client";

import { useRef, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Upload } from "lucide-react";
import { uploadDocument } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const MAX_BYTES = 20 * 1024 * 1024;

export function UploadFileDialog({
  lifeAreaId,
  projectId,
}: {
  lifeAreaId?: string;
  projectId?: string;
}) {
  const t = useTranslations("files");
  const tCommon = useTranslations("common");
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!formRef.current) return;
    const formData = new FormData(formRef.current);
    const file = formData.get("file");
    if (file instanceof File && file.size > MAX_BYTES) {
      setError(t("tooLarge"));
      return;
    }
    setPending(true);
    setError(null);
    try {
      await uploadDocument(formData);
      setOpen(false);
      formRef.current.reset();
    } catch {
      setError(t("uploadError"));
    } finally {
      setPending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm" />}>
        <Upload className="h-4 w-4" />
        {t("addFile")}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("addFile")}</DialogTitle>
        </DialogHeader>
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          {lifeAreaId && (
            <input type="hidden" name="life_area_id" value={lifeAreaId} />
          )}
          {projectId && (
            <input type="hidden" name="project_id" value={projectId} />
          )}
          <input
            type="file"
            name="file"
            required
            className="w-full text-sm text-foreground file:me-3 file:rounded-md file:border file:border-border file:bg-card file:px-3 file:py-1.5 file:text-sm"
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="submit" disabled={pending}>
              {pending ? t("uploading") : tCommon("save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
