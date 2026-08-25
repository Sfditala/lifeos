"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Trash2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDeleteDialog } from "@/components/confirm-delete-dialog";
import { restoreFromTrash, purgeFromTrash } from "@/lib/actions";

export type TrashRow = {
  table:
    | "life_areas"
    | "goals"
    | "projects"
    | "tasks"
    | "habits"
    | "content_items"
    | "knowledge_notes"
    | "project_milestones"
    | "documents"
    | "meetings"
    | "finance_accounts"
    | "transactions"
    | "budgets"
    | "financial_goals";
  id: string;
  label: string;
  typeLabel: string;
  deletedAt: string;
};

function daysSince(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
}

export function TrashList({ rows }: { rows: TrashRow[] }) {
  const t = useTranslations("trash");
  const [purgeTarget, setPurgeTarget] = useState<TrashRow | null>(null);
  const [isPending, startTransition] = useTransition();

  if (rows.length === 0) {
    return <p className="text-sm text-muted-foreground">{t("empty")}</p>;
  }

  return (
    <>
      <ul className="divide-y divide-border rounded-lg border border-border">
        {rows.map((row) => {
          const elapsed = daysSince(row.deletedAt);
          const remaining = Math.max(0, 30 - elapsed);
          return (
            <li key={`${row.table}-${row.id}`} className="flex items-center gap-3 px-4 py-3">
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                {row.typeLabel}
              </span>
              <span className="flex-1 text-sm text-foreground">
                {row.label}
              </span>
              <span className="hidden text-xs text-muted-foreground sm:block">
                {t("deletedDaysAgo", { days: elapsed })} ·{" "}
                {t("autoPurgeIn", { days: remaining })}
              </span>
              <Button
                variant="ghost"
                size="icon-sm"
                disabled={isPending}
                aria-label={t("restore")}
                onClick={() =>
                  startTransition(() => {
                    restoreFromTrash(row.table, row.id);
                  })
                }
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label={t("deleteForever")}
                onClick={() => setPurgeTarget(row)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </li>
          );
        })}
      </ul>
      <ConfirmDeleteDialog
        open={purgeTarget !== null}
        onOpenChange={(open) => !open && setPurgeTarget(null)}
        title={t("confirmForeverTitle")}
        impactMessage={t("confirmForeverMessage")}
        onConfirm={async () => {
          if (purgeTarget) await purgeFromTrash(purgeTarget.table, purgeTarget.id);
        }}
      />
    </>
  );
}
