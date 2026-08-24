"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Plus, X } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { completeOnboarding } from "@/lib/actions";
import { LIFE_AREA_PALETTE } from "@/lib/palette";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

type AreaDraft = {
  key: string;
  name: string;
  color: string;
  selected: boolean;
  show_meetings: boolean;
  show_files: boolean;
  removable: boolean;
};

export function OnboardingForm({
  suggestions,
}: {
  suggestions: string[];
}) {
  const t = useTranslations("onboarding");
  const tAreas = useTranslations("areas");
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const [areas, setAreas] = useState<AreaDraft[]>(() =>
    suggestions.map((name, i) => ({
      key: `s-${i}`,
      name,
      color: LIFE_AREA_PALETTE[i % LIFE_AREA_PALETTE.length],
      selected: true,
      show_meetings: false,
      show_files: false,
      removable: false,
    })),
  );
  const [customName, setCustomName] = useState("");

  function updateArea(key: string, patch: Partial<AreaDraft>) {
    setAreas((prev) =>
      prev.map((a) => (a.key === key ? { ...a, ...patch } : a)),
    );
  }

  function addCustom() {
    const name = customName.trim();
    if (!name) return;
    setAreas((prev) => [
      ...prev,
      {
        key: `c-${Date.now()}`,
        name,
        color: LIFE_AREA_PALETTE[prev.length % LIFE_AREA_PALETTE.length],
        selected: true,
        show_meetings: false,
        show_files: false,
        removable: true,
      },
    ]);
    setCustomName("");
  }

  function removeArea(key: string) {
    setAreas((prev) => prev.filter((a) => a.key !== key));
  }

  function handleSubmit() {
    const selected = areas
      .filter((a) => a.selected)
      .map((a) => ({
        name: a.name,
        color: a.color,
        show_meetings: a.show_meetings,
        show_files: a.show_files,
      }));
    if (selected.length === 0) return;

    startTransition(async () => {
      const formData = new FormData();
      formData.set("areas", JSON.stringify(selected));
      await completeOnboarding(formData);
      router.push("/");
      router.refresh();
    });
  }

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-6 px-4 py-10">
      <div>
        <h1 className="text-xl font-semibold text-foreground">{t("title")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("subtitle")}</p>
      </div>

      <ul className="flex flex-col gap-2">
        {areas.map((area) => (
          <li
            key={area.key}
            className="rounded-lg border border-border bg-card p-3"
          >
            <div className="flex items-center gap-2">
              <Checkbox
                checked={area.selected}
                onCheckedChange={(checked) =>
                  updateArea(area.key, { selected: checked === true })
                }
              />
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: area.color }}
              />
              <span className="flex-1 text-sm text-foreground">
                {area.name}
              </span>
              {area.removable && (
                <button
                  type="button"
                  onClick={() => removeArea(area.key)}
                  className="text-muted-foreground hover:text-foreground"
                  aria-label={t("remove")}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            {area.selected && (
              <div className="mt-2 flex gap-4 ps-6 text-xs text-muted-foreground">
                <label className="flex items-center gap-1.5">
                  <Checkbox
                    checked={area.show_meetings}
                    onCheckedChange={(checked) =>
                      updateArea(area.key, { show_meetings: checked === true })
                    }
                  />
                  {tAreas("showMeetingsTab")}
                </label>
                <label className="flex items-center gap-1.5">
                  <Checkbox
                    checked={area.show_files}
                    onCheckedChange={(checked) =>
                      updateArea(area.key, { show_files: checked === true })
                    }
                  />
                  {tAreas("showFilesTab")}
                </label>
              </div>
            )}
          </li>
        ))}
      </ul>

      <div className="flex gap-2">
        <Input
          value={customName}
          onChange={(e) => setCustomName(e.target.value)}
          placeholder={t("customPlaceholder")}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addCustom();
            }
          }}
        />
        <Button type="button" variant="outline" onClick={addCustom}>
          <Plus className="h-4 w-4" />
          {t("addCustom")}
        </Button>
      </div>

      <Button
        type="button"
        disabled={pending || areas.every((a) => !a.selected)}
        onClick={handleSubmit}
      >
        {t("start")}
      </Button>
    </div>
  );
}
