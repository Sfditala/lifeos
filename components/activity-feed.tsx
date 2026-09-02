"use client";

import { useTranslations, useLocale } from "next-intl";
import {
  FolderKanban,
  ListTodo,
  CheckCircle2,
  UserPlus,
  DollarSign,
  Mail,
  UserCheck,
  FileUp,
  Activity,
  type LucideIcon,
} from "lucide-react";
import { EmptyState } from "@/components/empty-state";

type ActionType =
  | "project_created"
  | "task_created"
  | "task_completed"
  | "task_assigned"
  | "deal_converted"
  | "member_invited"
  | "member_joined"
  | "document_uploaded";

type Entry = {
  id: string;
  actor_user_id: string | null;
  action_type: string;
  entity_label: string;
  metadata: { amount?: number } | null;
  created_at: string;
};

const ACTION_ICON: Record<ActionType, LucideIcon> = {
  project_created: FolderKanban,
  task_created: ListTodo,
  task_completed: CheckCircle2,
  task_assigned: UserPlus,
  deal_converted: DollarSign,
  member_invited: Mail,
  member_joined: UserCheck,
  document_uploaded: FileUp,
};

const ACTION_COLOR: Record<ActionType, string> = {
  project_created: "text-sky-600 dark:text-sky-400",
  task_created: "text-muted-foreground",
  task_completed: "text-emerald-600 dark:text-emerald-400",
  task_assigned: "text-violet-600 dark:text-violet-400",
  deal_converted: "text-emerald-600 dark:text-emerald-400",
  member_invited: "text-amber-600 dark:text-amber-400",
  member_joined: "text-amber-600 dark:text-amber-400",
  document_uploaded: "text-sky-600 dark:text-sky-400",
};

export function ActivityFeed({
  entries,
  emailByUserId,
}: {
  entries: Entry[];
  emailByUserId: Map<string, string>;
}) {
  const t = useTranslations("analytics");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const dateFormatter = new Intl.DateTimeFormat(
    locale === "ar" ? "ar-u-nu-latn" : "en",
    { dateStyle: "medium", timeStyle: "short" },
  );
  const numberFormatter = new Intl.NumberFormat(
    locale === "ar" ? "ar-u-nu-latn" : "en",
  );

  if (entries.length === 0) {
    return <EmptyState icon={Activity} message={t("emptyActivity")} />;
  }

  return (
    <ul className="divide-y divide-border rounded-lg border border-border bg-card shadow-sm">
      {entries.map((entry) => {
        const type = entry.action_type as ActionType;
        const Icon = ACTION_ICON[type] ?? Activity;
        const actorEmail =
          (entry.actor_user_id && emailByUserId.get(entry.actor_user_id)) ||
          tCommon("none");
        const actionLabel = t(`action_${type}` as "action_project_created");

        let detail = entry.entity_label;
        if (type === "member_joined") {
          detail = "";
        } else if (type === "deal_converted" && entry.metadata?.amount) {
          detail = `${entry.entity_label} (${numberFormatter.format(entry.metadata.amount)})`;
        }

        return (
          <li key={entry.id} className="flex items-start gap-3 px-4 py-3">
            <span
              className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted ${ACTION_COLOR[type] ?? "text-muted-foreground"}`}
            >
              <Icon className="h-3.5 w-3.5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-foreground">
                <span className="font-medium">{actorEmail}</span>{" "}
                <span className="text-muted-foreground">{actionLabel}</span>
                {detail && (
                  <>
                    {": "}
                    <span className="font-medium">{detail}</span>
                  </>
                )}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {dateFormatter.format(new Date(entry.created_at))}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
