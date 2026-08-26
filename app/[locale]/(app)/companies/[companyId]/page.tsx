import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { Link } from "@/i18n/navigation";
import { EmptyState } from "@/components/empty-state";
import { InviteMemberDialog } from "@/components/invite-member-dialog";
import { RemoveMemberButton } from "@/components/remove-member-button";
import { AddCompanyProjectDialog } from "@/components/add-company-project-dialog";
import { EditCompanyDialog } from "@/components/edit-company-dialog";
import { MemberPositionSelect } from "@/components/member-position-select";
import { FolderKanban } from "lucide-react";

export default async function CompanyPage({
  params,
}: {
  params: Promise<{ companyId: string }>;
}) {
  const { companyId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: company }, { data: members }, { data: projects }] =
    await Promise.all([
      supabase
        .from("companies")
        .select(
          "id, name, owner_user_id, founded_date, description, industry, contact_email, contact_phone",
        )
        .eq("id", companyId)
        .is("deleted_at", null)
        .single(),
      supabase
        .from("team_members")
        .select("id, email, role, status, position")
        .eq("company_id", companyId)
        .order("invited_at", { ascending: true }),
      supabase
        .from("projects")
        .select("id, name, status, life_area_id")
        .eq("company_id", companyId)
        .is("deleted_at", null),
    ]);

  if (!company) notFound();

  const t = await getTranslations("team");
  const isOwner = company.owner_user_id === user?.id;

  const { data: lifeAreas } = isOwner
    ? await supabase
        .from("life_areas")
        .select("id, name")
        .is("deleted_at", null)
        .order("sort_order", { ascending: true })
    : { data: null };

  return (
    <div className="flex flex-1 flex-col gap-8 p-4 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-foreground">
          {company.name}
        </h1>
        {isOwner && <EditCompanyDialog company={company} />}
      </div>

      {(company.description ||
        company.industry ||
        company.founded_date ||
        company.contact_email ||
        company.contact_phone) && (
        <section className="grid gap-3 rounded-lg border border-border bg-card p-4 sm:grid-cols-2">
          {company.description && (
            <p className="text-sm text-muted-foreground sm:col-span-2">
              {company.description}
            </p>
          )}
          {company.industry && (
            <p className="text-xs text-muted-foreground">
              {t("industry")}: <span className="text-foreground">{company.industry}</span>
            </p>
          )}
          {company.founded_date && (
            <p className="text-xs text-muted-foreground">
              {t("foundedDate")}: <span className="text-foreground">{company.founded_date}</span>
            </p>
          )}
          {company.contact_email && (
            <p className="text-xs text-muted-foreground">
              {t("contactEmail")}: <span className="text-foreground">{company.contact_email}</span>
            </p>
          )}
          {company.contact_phone && (
            <p className="text-xs text-muted-foreground">
              {t("contactPhone")}: <span className="text-foreground">{company.contact_phone}</span>
            </p>
          )}
        </section>
      )}

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">
            {t("members")}
          </h2>
          {isOwner && <InviteMemberDialog companyId={companyId} />}
        </div>
        <ul className="divide-y divide-border rounded-lg border border-border">
          {(members ?? []).map((m) => (
            <li key={m.id} className="flex items-center gap-3 px-4 py-3">
              <span className="flex-1 text-sm text-foreground">
                {m.email}
              </span>
              <span className="text-xs text-muted-foreground">
                {t(m.role === "owner" ? "owner" : "member")} ·{" "}
                {t(`status_${m.status}` as "status_invited")}
              </span>
              {isOwner && m.status !== "removed" ? (
                <MemberPositionSelect memberId={m.id} position={m.position} />
              ) : (
                <span className="text-xs text-muted-foreground">
                  {t(`position_${m.position}` as "position_member")}
                </span>
              )}
              {isOwner && m.role !== "owner" && m.status !== "removed" && (
                <RemoveMemberButton memberId={m.id} label={t("remove")} />
              )}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">
            {t("projects")}
          </h2>
          {isOwner && (
            <AddCompanyProjectDialog
              companyId={companyId}
              lifeAreas={lifeAreas ?? []}
            />
          )}
        </div>
        {projects && projects.length > 0 ? (
          <ul className="divide-y divide-border rounded-lg border border-border">
            {projects.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/areas/${p.life_area_id}/projects/${p.id}`}
                  className="flex items-center justify-between px-4 py-3 hover:bg-accent"
                >
                  <span className="text-sm text-foreground">{p.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState icon={FolderKanban} message={t("emptyProjects")} />
        )}
      </section>
    </div>
  );
}
