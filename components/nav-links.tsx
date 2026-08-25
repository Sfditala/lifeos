"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { AddLifeAreaDialog } from "@/components/add-life-area-dialog";
import { RowMenu } from "@/components/row-menu";
import { deleteLifeArea } from "@/lib/actions";

type LifeArea = {
  id: string;
  name: string;
  color: string | null;
  show_meetings: boolean;
  show_files: boolean;
  projectCount: number;
  taskCount: number;
};

export function NavLinks({
  areas,
  onNavigate,
}: {
  areas: LifeArea[];
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const t = useTranslations("nav");
  const tCommon = useTranslations("common");

  return (
    <nav className="flex flex-col gap-1">
      <Link
        href="/"
        onClick={onNavigate}
        className={`rounded-md px-3 py-2 text-sm transition-colors ${
          pathname === "/"
            ? "bg-accent text-accent-foreground"
            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        }`}
      >
        {t("home")}
      </Link>
      {[
        { href: "/calendar", label: t("calendar") },
        { href: "/habits", label: t("habits") },
        { href: "/content", label: t("content") },
        { href: "/notes", label: t("notes") },
        { href: "/reviews", label: t("reviews") },
        { href: "/finance", label: t("finance") },
      ].map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={onNavigate}
          className={`rounded-md px-3 py-2 text-sm transition-colors ${
            pathname === item.href
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          }`}
        >
          {item.label}
        </Link>
      ))}
      <div className="mt-4 flex items-center justify-between px-3">
        <span className="text-xs font-medium text-muted-foreground">
          {t("lifeAreas")}
        </span>
        <AddLifeAreaDialog />
      </div>
      {areas.map((area) => {
        const href = `/areas/${area.id}`;
        const active = pathname === href;
        return (
          <div
            key={area.id}
            className={`group flex items-center gap-1 rounded-md ps-1 transition-colors ${
              active ? "bg-accent" : "hover:bg-accent"
            }`}
          >
            <Link
              href={href}
              onClick={onNavigate}
              className={`flex flex-1 items-center gap-2 rounded-md px-2 py-2 text-sm ${
                active ? "text-accent-foreground" : "text-muted-foreground"
              }`}
            >
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{
                  backgroundColor: area.color ?? "var(--muted-foreground)",
                }}
              />
              <span className="truncate">{area.name}</span>
            </Link>
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
                  initial={{
                    id: area.id,
                    name: area.name,
                    color: area.color,
                    show_meetings: area.show_meetings,
                    show_files: area.show_files,
                  }}
                  open={open}
                  onOpenChange={onOpenChange}
                />
              )}
            />
          </div>
        );
      })}
    </nav>
  );
}
