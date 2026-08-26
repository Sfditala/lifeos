import { Building2 } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { Link } from "@/i18n/navigation";
import { EmptyState } from "@/components/empty-state";
import { AddCompanyDialog } from "@/components/add-company-dialog";

export default async function CompaniesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: companies } = await supabase
    .from("companies")
    .select("id, name, owner_user_id")
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  const t = await getTranslations("team");

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 sm:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">
          {t("title")}
        </h1>
        <AddCompanyDialog />
      </div>

      {companies && companies.length > 0 ? (
        <ul className="divide-y divide-border rounded-lg border border-border bg-card shadow-sm">
          {companies.map((company) => (
            <li key={company.id}>
              <Link
                href={`/companies/${company.id}`}
                className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-accent"
              >
                <span className="text-sm text-foreground">{company.name}</span>
                {company.owner_user_id === user?.id && (
                  <span className="text-xs text-muted-foreground">
                    {t("owner")}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          icon={Building2}
          message={t("empty")}
          action={<AddCompanyDialog />}
        />
      )}
    </div>
  );
}
