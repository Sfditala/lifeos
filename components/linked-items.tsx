"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { X } from "lucide-react";
import type { ResolvedLink } from "@/lib/actions";
import { deleteEntityLink } from "@/lib/actions";
import { LinkEntityDialog } from "@/components/link-entity-dialog";
import { EmptyState } from "@/components/empty-state";
import { Link2 } from "lucide-react";

export function LinkedItems({
  entityType,
  entityId,
  links,
}: {
  entityType: string;
  entityId: string;
  links: ResolvedLink[];
}) {
  const t = useTranslations("links");
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">{t("title")}</h2>
        <LinkEntityDialog fromType={entityType} fromId={entityId} />
      </div>
      {links.length > 0 ? (
        <ul className="divide-y divide-border rounded-lg border border-border bg-card shadow-sm">
          {links.map((link) => (
            <li
              key={link.linkId}
              className="flex items-center gap-3 px-4 py-3"
            >
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                {link.otherType}
              </span>
              <span className="flex-1 text-sm text-foreground">
                {link.otherLabel}
              </span>
              {link.relationLabel && (
                <span className="text-xs text-muted-foreground">
                  {link.relationLabel}
                </span>
              )}
              <button
                type="button"
                disabled={isPending}
                onClick={() =>
                  startTransition(() => {
                    deleteEntityLink(link.linkId);
                  })
                }
                className="text-muted-foreground hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState icon={Link2} message={t("empty")} />
      )}
    </div>
  );
}
