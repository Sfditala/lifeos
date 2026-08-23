"use client";

import { useRef, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Plus } from "lucide-react";
import { createTask } from "@/lib/actions";
import { Button } from "@/components/ui/button";

type LifeArea = { id: string; name: string };

export function QuickAddTask({ areas }: { areas: LifeArea[] }) {
  const t = useTranslations("home");
  const tCommon = useTranslations("common");
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!formRef.current) return;
    setPending(true);
    const formData = new FormData(formRef.current);
    await createTask(formData);
    formRef.current.reset();
    setPending(false);
  }

  if (areas.length === 0) return null;

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="flex flex-col gap-2 sm:flex-row"
    >
      <input
        name="title"
        required
        placeholder={t("quickAddPlaceholder")}
        className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-ring"
      />
      <select
        name="life_area_id"
        required
        defaultValue={areas[0].id}
        className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-ring"
      >
        {areas.map((area) => (
          <option key={area.id} value={area.id}>
            {area.name}
          </option>
        ))}
      </select>
      <Button type="submit" disabled={pending} size="sm">
        <Plus className="h-4 w-4" />
        {tCommon("add")}
      </Button>
    </form>
  );
}
