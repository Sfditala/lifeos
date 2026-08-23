"use client";

import { useRef, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Plus } from "lucide-react";
import { createContentItem } from "@/lib/actions";
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

type Project = { id: string; name: string; life_area_id: string };

export function AddContentDialog({ projects }: { projects: Project[] }) {
  const t = useTranslations("content");
  const tCommon = useTranslations("common");
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!formRef.current) return;
    setPending(true);
    const formData = new FormData(formRef.current);
    const projectId = formData.get("project_id") as string;
    const project = projects.find((p) => p.id === projectId);
    if (project) formData.set("life_area_id", project.life_area_id);
    await createContentItem(formData);
    setPending(false);
    setOpen(false);
    formRef.current.reset();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm" />}>
        <Plus className="h-4 w-4" />
        {t("addItem")}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("newItemTitle")}</DialogTitle>
        </DialogHeader>
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="content-title">{tCommon("title")}</Label>
            <Input id="content-title" name="title" required autoFocus />
          </div>
          {projects.length > 0 && (
            <div className="space-y-1">
              <Label htmlFor="project_id">{tCommon("project")}</Label>
              <select
                id="project_id"
                name="project_id"
                defaultValue=""
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
              >
                <option value="">{tCommon("none")}</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
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
