"use client";

import { useRef, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Plus } from "lucide-react";
import { createLifeArea, updateLifeArea } from "@/lib/actions";
import { LIFE_AREA_PALETTE } from "@/lib/palette";
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

type Initial = { id: string; name: string; color: string | null };

export function AddLifeAreaDialog({
  initial,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}: {
  initial?: Initial;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
} = {}) {
  const t = useTranslations("areas");
  const tCommon = useTranslations("common");
  const isControlled = controlledOpen !== undefined;
  const [internalOpen, setInternalOpen] = useState(false);
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? setControlledOpen! : setInternalOpen;
  const [color, setColor] = useState(initial?.color ?? LIFE_AREA_PALETTE[0]);
  const [pending, setPending] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!formRef.current) return;
    setPending(true);
    const formData = new FormData(formRef.current);
    if (initial) {
      await updateLifeArea(initial.id, formData);
    } else {
      await createLifeArea(formData);
    }
    setPending(false);
    setOpen(false);
    formRef.current.reset();
    setColor(LIFE_AREA_PALETTE[0]);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!initial && (
        <DialogTrigger
          render={
            <Button variant="ghost" size="icon-sm" aria-label={t("addArea")} />
          }
        >
          <Plus className="h-4 w-4" />
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initial ? tCommon("edit") : t("newAreaTitle")}
          </DialogTitle>
        </DialogHeader>
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="name">{tCommon("name")}</Label>
            <Input
              id="name"
              name="name"
              required
              autoFocus
              defaultValue={initial?.name}
            />
          </div>
          <div className="space-y-1">
            <Label>{tCommon("color")}</Label>
            <input type="hidden" name="color" value={color} />
            <div className="flex flex-wrap gap-2">
              {LIFE_AREA_PALETTE.map((swatch) => (
                <button
                  key={swatch}
                  type="button"
                  onClick={() => setColor(swatch)}
                  className={`h-6 w-6 rounded-full ring-offset-2 ring-offset-popover ${
                    color === swatch ? "ring-2 ring-ring" : ""
                  }`}
                  style={{ backgroundColor: swatch }}
                />
              ))}
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
