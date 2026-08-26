"use client";

import { useTranslations } from "next-intl";
import { deleteLifeArea } from "@/lib/actions";
import { AddLifeAreaDialog } from "@/components/add-life-area-dialog";
import { RowMenu } from "@/components/row-menu";

type Area = {
  id: string;
  name: string;
  color: string | null;
  show_meetings: boolean;
  show_files: boolean;
  projectCount: number;
  taskCount: number;
};

export function SettingsLifeAreas({ areas }: { areas: Area[] }) {
  const t = useTranslations("settings");
  const tCommon = useTranslations("common");

  return (
    <section className="flex max-w-lg flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">
          {t("lifeAreas")}
        </h2>
        <AddLifeAreaDialog />
      </div>
      <ul className="divide-y divide-border rounded-xl border border-border bg-card shadow-sm">
        {areas.map((area) => (
          <li key={area.id} className="flex items-center gap-3 px-4 py-3">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: area.color ?? "var(--muted-foreground)" }}
            />
            <span className="flex-1 truncate text-sm text-foreground">
              {area.name}
            </span>
            <RowMenu
              deleteTitle={tCommon("confirmDeleteTitle")}
              deleteImpact={
                area.projectCount > 0 || area.taskCount > 0
                  ? tCommon("deleteAreaImpact", {
                      projects: area.projectCount,
                      tasks: area.taskCount,
                    })
                  : tCommon("deleteSimpleImpact")
              }
              onDelete={() => deleteLifeArea(area.id)}
              renderEdit={(open, onOpenChange) => (
                <AddLifeAreaDialog
                  initial={area}
                  open={open}
                  onOpenChange={onOpenChange}
                />
              )}
            />
          </li>
        ))}
      </ul>
      {areas.length === 0 && (
        <p className="text-sm text-muted-foreground">{t("emptyLifeAreas")}</p>
      )}
    </section>
  );
}
