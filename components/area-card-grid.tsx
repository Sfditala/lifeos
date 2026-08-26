import { getTranslations } from "next-intl/server";
import { Layers } from "lucide-react";
import { Link } from "@/i18n/navigation";

type Area = {
  id: string;
  name: string;
  color: string | null;
  activeProjects: number;
  overdueTasks: number;
};

export async function AreaCardGrid({ areas }: { areas: Area[] }) {
  const t = await getTranslations("areas");

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {areas.map((area) => {
        const color = area.color ?? "var(--muted-foreground)";
        return (
          <Link
            key={area.id}
            href={`/areas/${area.id}`}
            className="group relative flex flex-col gap-3 overflow-hidden rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            style={{ borderInlineStart: `3px solid ${color}` }}
          >
            <span
              aria-hidden
              className="pointer-events-none absolute -top-8 end-[-20%] h-24 w-24 rounded-full opacity-20 blur-2xl transition-opacity group-hover:opacity-30"
              style={{ backgroundColor: color }}
            />
            <span
              className="flex h-9 w-9 items-center justify-center rounded-[10px]"
              style={{
                backgroundColor: `color-mix(in oklab, ${color} 18%, var(--card))`,
                color,
              }}
            >
              <Layers className="h-[18px] w-[18px]" />
            </span>
            <span className="text-[15px] font-semibold text-foreground">
              {area.name}
            </span>
            <span className="flex gap-3 text-xs text-muted-foreground">
              <span>
                <b className="font-semibold text-foreground">
                  {area.activeProjects}
                </b>{" "}
                {t("activeProjects")}
              </span>
              {area.overdueTasks > 0 && (
                <span className="text-destructive">
                  <b className="font-semibold">{area.overdueTasks}</b>{" "}
                  {t("overdueTasks")}
                </span>
              )}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
