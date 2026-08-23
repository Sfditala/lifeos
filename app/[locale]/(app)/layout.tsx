import { Menu, Download } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { NavLinks } from "@/components/nav-links";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { LogoutButton } from "@/components/logout-button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

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
        <Link href="/" className="mb-6 block font-semibold text-foreground">
          {tApp("name")}
        </Link>
        <NavLinks areas={areas} />
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden"
                    aria-label={tNav("menu")}
                  />
                }
              >
                <Menu className="h-5 w-5" />
              </SheetTrigger>
              <SheetContent side={sheetSide} className="w-64 p-4">
                <SheetTitle className="mb-6 font-semibold text-foreground">
                  {tApp("name")}
                </SheetTitle>
                <NavLinks areas={areas} />
              </SheetContent>
            </Sheet>
            <span className="font-semibold text-foreground md:hidden">
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
