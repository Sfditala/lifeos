import { Download, LayoutDashboard } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { NavLinks } from "@/components/nav-links";
import { MobileNav } from "@/components/mobile-nav";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { LogoutButton } from "@/components/logout-button";

async function getLifeAreas() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("life_areas")
    .select("id, name, color")
    .order("sort_order", { ascending: true });
  return data ?? [];
}

export default async function AppLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const sheetSide = locale === "ar" ? "right" : "left";
  const areas = await getLifeAreas();
  const tApp = await getTranslations("app");
  const tNav = await getTranslations("nav");
  const tCommon = await getTranslations("common");

  return (
    <div className="flex flex-1">
      <aside className="hidden w-60 shrink-0 border-e border-border p-4 md:block">
        <Link
          href="/"
          className="mb-6 flex items-center gap-2 font-semibold text-foreground"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <LayoutDashboard className="h-4 w-4" />
          </span>
          {tApp("name")}
        </Link>
        <NavLinks areas={areas} />
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <MobileNav
              areas={areas}
              appName={tApp("name")}
              menuLabel={tNav("menu")}
              side={sheetSide}
            />
            <span className="flex items-center gap-2 font-semibold text-foreground md:hidden">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <LayoutDashboard className="h-4 w-4" />
              </span>
              {tApp("name")}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/api/export"
              aria-label={tCommon("export")}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:text-foreground"
            >
              <Download className="h-4 w-4" />
            </a>
            <LanguageSwitcher />
            <ThemeToggle />
            <LogoutButton />
          </div>
        </header>
        <main className="flex flex-1 flex-col">{children}</main>
      </div>
    </div>
  );
}
