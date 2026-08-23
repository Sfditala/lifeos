import { getTranslations } from "next-intl/server";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { LogoutButton } from "@/components/logout-button";

export default async function HomePage() {
  const t = await getTranslations("home");
  const tApp = await getTranslations("app");

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex items-center justify-between border-b border-border px-4 py-3">
        <span className="font-semibold text-foreground">{tApp("name")}</span>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <ThemeToggle />
          <LogoutButton />
        </div>
      </header>
      <main className="flex flex-1 items-center justify-center px-4 text-center">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            {t("welcome")}
          </h1>
          <p className="mt-2 text-muted-foreground">{t("empty")}</p>
        </div>
      </main>
    </div>
  );
}
