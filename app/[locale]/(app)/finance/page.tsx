import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { FinanceTabs } from "@/components/finance-tabs";

function monthStartIso() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
}

export default async function FinancePage() {
  const supabase = await createClient();
  const monthStart = monthStartIso();

  const [
    { data: accounts },
    { data: transactions },
    { data: budgets },
    { data: financialGoals },
    { data: areas },
  ] = await Promise.all([
    supabase
      .from("finance_accounts")
      .select("id, name, type, currency, opening_balance")
      .is("deleted_at", null)
      .order("created_at", { ascending: true }),
    supabase
      .from("transactions")
      .select(
        "id, account_id, amount, direction, category, occurred_at, note, finance_accounts(name)",
      )
      .is("deleted_at", null)
      .order("occurred_at", { ascending: false })
      .limit(100),
    supabase
      .from("budgets")
      .select("id, category, monthly_limit, life_area_id")
      .is("deleted_at", null)
      .order("created_at", { ascending: true }),
    supabase
      .from("financial_goals")
      .select("id, title, target_amount, current_amount, target_date")
      .is("deleted_at", null)
      .order("created_at", { ascending: true }),
    supabase
      .from("life_areas")
      .select("id, name")
      .is("deleted_at", null)
      .order("sort_order", { ascending: true }),
  ]);

  const t = await getTranslations("finance");

  const balanceByAccount = new Map<string, number>();
  for (const account of accounts ?? []) {
    balanceByAccount.set(account.id, Number(account.opening_balance));
  }
  for (const tx of transactions ?? []) {
    const delta = tx.direction === "in" ? Number(tx.amount) : -Number(tx.amount);
    balanceByAccount.set(
      tx.account_id,
      (balanceByAccount.get(tx.account_id) ?? 0) + delta,
    );
  }

  const spentThisMonthByCategory = new Map<string, number>();
  for (const tx of transactions ?? []) {
    if (tx.direction !== "out" || !tx.category) continue;
    if (tx.occurred_at < monthStart) continue;
    spentThisMonthByCategory.set(
      tx.category,
      (spentThisMonthByCategory.get(tx.category) ?? 0) + Number(tx.amount),
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6">
      <h1 className="text-2xl font-semibold text-foreground">{t("title")}</h1>
      <FinanceTabs
        accounts={(accounts ?? []).map((a) => ({
          ...a,
          opening_balance: Number(a.opening_balance),
          balance: balanceByAccount.get(a.id) ?? Number(a.opening_balance),
        }))}
        transactions={(transactions ?? []).map((tx) => ({
          id: tx.id,
          amount: Number(tx.amount),
          direction: tx.direction,
          category: tx.category,
          occurred_at: tx.occurred_at,
          note: tx.note,
          account_name: tx.finance_accounts?.[0]?.name ?? "",
        }))}
        budgets={(budgets ?? []).map((b) => ({
          id: b.id,
          category: b.category,
          monthly_limit: Number(b.monthly_limit),
          spent: spentThisMonthByCategory.get(b.category) ?? 0,
        }))}
        financialGoals={(financialGoals ?? []).map((g) => ({
          ...g,
          target_amount: Number(g.target_amount),
          current_amount: Number(g.current_amount),
        }))}
        areas={areas ?? []}
      />
    </div>
  );
}
