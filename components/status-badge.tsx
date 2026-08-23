import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";

const STATUS_CLASSES: Record<string, string> = {
  todo: "bg-muted text-muted-foreground",
  active: "bg-muted text-muted-foreground",
  doing: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  done: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  paused: "bg-muted text-muted-foreground",
  dropped: "bg-muted text-muted-foreground line-through",
};

export function StatusBadge({ status }: { status: string }) {
  const t = useTranslations("status");
  return (
    <Badge
      variant="outline"
      className={`border-transparent ${STATUS_CLASSES[status] ?? ""}`}
    >
      {t(status)}
    </Badge>
  );
}

const PRIORITY_CLASSES: Record<string, string> = {
  low: "bg-muted text-muted-foreground",
  medium: "bg-sky-500/15 text-sky-600 dark:text-sky-400",
  high: "bg-red-500/15 text-red-600 dark:text-red-400",
};

export function PriorityBadge({ priority }: { priority: string }) {
  const t = useTranslations("priority");
  return (
    <Badge
      variant="outline"
      className={`border-transparent ${PRIORITY_CLASSES[priority] ?? ""}`}
    >
      {t(priority)}
    </Badge>
  );
}
