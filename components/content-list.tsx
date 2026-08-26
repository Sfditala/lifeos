"use client";

import { useTranslations } from "next-intl";
import { Newspaper } from "lucide-react";
import { AddContentDialog } from "@/components/add-content-dialog";
import { ContentStatusSelect } from "@/components/content-status-select";
import { EmptyState } from "@/components/empty-state";
import { RowMenu } from "@/components/row-menu";
import { deleteContentItem } from "@/lib/actions";

type Project = { id: string; name: string; life_area_id: string };
type Item = {
  id: string;
  title: string;
  status: string;
  scheduled_date: string | null;
  project_id: string | null;
  color: string | null;
};

export function ContentList({
  items,
  projects,
}: {
  items: Item[];
  projects: Project[];
}) {
  const t = useTranslations("content");
  const tCommon = useTranslations("common");

  if (items.length === 0) {
    return (
      <EmptyState
        icon={Newspaper}
        message={t("empty")}
        action={<AddContentDialog projects={projects} />}
      />
    );
  }

  return (
    <ul className="divide-y divide-border rounded-lg border border-border bg-card shadow-sm">
      {items.map((item) => (
        <li key={item.id} className="flex items-center gap-3 px-4 py-3">
          <span
            className="h-2 w-2 shrink-0 rounded-full"
            style={{ backgroundColor: item.color ?? "var(--muted-foreground)" }}
          />
          <span className="flex-1 text-sm text-foreground">{item.title}</span>
          {item.scheduled_date && (
            <span className="text-xs text-muted-foreground">
              {item.scheduled_date}
            </span>
          )}
          <ContentStatusSelect itemId={item.id} status={item.status} />
          <RowMenu
            deleteTitle={tCommon("confirmDeleteTitle")}
            deleteImpact={tCommon("deleteSimpleImpact")}
            onDelete={() => deleteContentItem(item.id)}
            renderEdit={(open, onOpenChange) => (
              <AddContentDialog
                projects={projects}
                initial={{
                  id: item.id,
                  title: item.title,
                  project_id: item.project_id,
                }}
                open={open}
                onOpenChange={onOpenChange}
              />
            )}
          />
        </li>
      ))}
    </ul>
  );
}
