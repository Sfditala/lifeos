"use client";

import { useTranslations, useLocale } from "next-intl";
import { Wallet, Receipt, PiggyBank, Target, Trash2 } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { EmptyState } from "@/components/empty-state";
import { ProgressBar } from "@/components/progress-bar";
import { DonutChart } from "@/components/charts/donut-chart";
import { MonthlyFlowChart } from "@/components/charts/monthly-flow-chart";
import { LIFE_AREA_PALETTE } from "@/lib/palette";
import { RowMenu } from "@/components/row-menu";
import { Button } from "@/components/ui/button";
import { AddAccountDialog } from "@/components/add-account-dialog";
import { AddTransactionDialog } from "@/components/add-transaction-dialog";
import { AddBudgetDialog } from "@/components/add-budget-dialog";
import { AddFinancialGoalDialog } from "@/components/add-financial-goal-dialog";
import {
  deleteFinanceAccount,
  deleteTransaction,
  deleteBudget,
  deleteFinancialGoal,
} from "@/lib/actions";

type Account = {
  id: string;
  name: string;
  type: string;
  currency: string;
  opening_balance: number;
  balance: number;
};
type Transaction = {
  id: string;
  amount: number;
  direction: string;
  category: string | null;
  occurred_at: string;
  note: string | null;
  account_name: string;
};
type Budget = {
  id: string;
  category: string;
  monthly_limit: number;
  spent: number;
};
type FinancialGoal = {
  id: string;
  title: string;
  target_amount: number;
  current_amount: number;
  target_date: string | null;
};
type LifeArea = { id: string; name: string };

export function FinanceTabs({
  accounts,
  transactions,
  budgets,
  financialGoals,
  areas,
}: {
  accounts: Account[];
  transactions: Transaction[];
  budgets: Budget[];
  financialGoals: FinancialGoal[];
  areas: LifeArea[];
}) {
  const t = useTranslations("finance");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const numberFormatter = new Intl.NumberFormat(
    locale === "ar" ? "ar-u-nu-latn" : "en",
  );

  const expenseByCategory = new Map<string, number>();
  for (const tx of transactions) {
    if (tx.direction !== "out") continue;
    const key = tx.category || tCommon("none");
    expenseByCategory.set(key, (expenseByCategory.get(key) ?? 0) + tx.amount);
  }
  const categoryChartData = Array.from(expenseByCategory.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([name, value], i) => ({
      name,
      value,
      color: LIFE_AREA_PALETTE[i % LIFE_AREA_PALETTE.length],
    }));

  const monthlyMap = new Map<string, { income: number; expense: number }>();
  for (const tx of transactions) {
    const month = tx.occurred_at.slice(0, 7);
    const entry = monthlyMap.get(month) ?? { income: 0, expense: 0 };
    if (tx.direction === "in") entry.income += tx.amount;
    else entry.expense += tx.amount;
    monthlyMap.set(month, entry);
  }
  const monthlyChartData = Array.from(monthlyMap.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .slice(-6)
    .map(([month, v]) => ({ month, income: v.income, expense: v.expense }));

  return (
    <Tabs defaultValue="overview">
      <TabsList variant="line" className="mb-6 w-full justify-start overflow-x-auto">
        <TabsTrigger value="overview">{t("overview")}</TabsTrigger>
        <TabsTrigger value="accounts">{t("accounts")}</TabsTrigger>
        <TabsTrigger value="transactions">{t("transactions")}</TabsTrigger>
        <TabsTrigger value="budgets">{t("budgets")}</TabsTrigger>
        <TabsTrigger value="goals">{t("financialGoals")}</TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
            <h3 className="mb-2 text-sm font-semibold text-foreground">
              {t("expenseByCategory")}
            </h3>
            {categoryChartData.length > 0 ? (
              <DonutChart data={categoryChartData} />
            ) : (
              <p className="text-sm text-muted-foreground">{t("emptyTransactions")}</p>
            )}
          </div>
          <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
            <h3 className="mb-2 text-sm font-semibold text-foreground">
              {t("monthlyFlow")}
            </h3>
            {monthlyChartData.length > 0 ? (
              <MonthlyFlowChart
                data={monthlyChartData}
                incomeLabel={t("income")}
                expenseLabel={t("expense")}
              />
            ) : (
              <p className="text-sm text-muted-foreground">{t("emptyTransactions")}</p>
            )}
          </div>
        </div>
      </TabsContent>

      <TabsContent value="accounts">
        <div className="mb-3 flex justify-end">
          <AddAccountDialog />
        </div>
        {accounts.length > 0 ? (
          <ul className="grid gap-3 sm:grid-cols-2">
            {accounts.map((a) => (
              <li
                key={a.id}
                className="rounded-lg border border-border bg-card p-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">
                    {a.name}
                  </span>
                  <RowMenu
                    deleteTitle={tCommon("confirmDeleteTitle")}
                    deleteImpact={tCommon("deleteSimpleImpact")}
                    onDelete={() => deleteFinanceAccount(a.id)}
                    renderEdit={(open, onOpenChange) => (
                      <AddAccountDialog
                        initial={a}
                        open={open}
                        onOpenChange={onOpenChange}
                      />
                    )}
                  />
                </div>
                <p className="mt-2 text-lg font-semibold text-foreground">
                  {numberFormatter.format(a.balance)} {a.currency}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t(a.type as "cash" | "bank" | "credit" | "savings")}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            icon={Wallet}
            message={t("emptyAccounts")}
            action={<AddAccountDialog />}
          />
        )}
      </TabsContent>

      <TabsContent value="transactions">
        <div className="mb-3 flex justify-end">
          <AddTransactionDialog accounts={accounts} areas={areas} />
        </div>
        {transactions.length > 0 ? (
          <ul className="divide-y divide-border rounded-lg border border-border bg-card shadow-sm">
            {transactions.map((tx) => (
              <li key={tx.id} className="flex items-center gap-3 px-4 py-3">
                <span className="flex-1 text-sm text-foreground">
                  {tx.note || tx.category || "—"}
                  <span className="text-muted-foreground"> · {tx.account_name}</span>
                </span>
                <span className="text-xs text-muted-foreground">
                  {tx.occurred_at}
                </span>
                <span
                  className={`text-sm font-medium ${
                    tx.direction === "in"
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {tx.direction === "in" ? "+" : "-"}
                  {numberFormatter.format(tx.amount)}
                </span>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={tCommon("delete")}
                  onClick={() => deleteTransaction(tx.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            icon={Receipt}
            message={t("emptyTransactions")}
            action={<AddTransactionDialog accounts={accounts} areas={areas} />}
          />
        )}
      </TabsContent>

      <TabsContent value="budgets">
        <div className="mb-3 flex justify-end">
          <AddBudgetDialog areas={areas} />
        </div>
        {budgets.length > 0 ? (
          <ul className="grid gap-3 sm:grid-cols-2">
            {budgets.map((b) => {
              const percent = Math.min(
                100,
                Math.round((b.spent / b.monthly_limit) * 100),
              );
              const over = b.spent > b.monthly_limit;
              return (
                <li
                  key={b.id}
                  className="rounded-lg border border-border bg-card p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">
                      {b.category}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label={tCommon("delete")}
                      onClick={() => deleteBudget(b.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {t("spentThisMonth")}: {numberFormatter.format(b.spent)} /{" "}
                    {numberFormatter.format(b.monthly_limit)}
                  </p>
                  <div className="mt-2">
                    <ProgressBar percent={percent} tone={over ? "warn" : "default"} />
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <EmptyState
            icon={PiggyBank}
            message={t("emptyBudgets")}
            action={<AddBudgetDialog areas={areas} />}
          />
        )}
      </TabsContent>

      <TabsContent value="goals">
        <div className="mb-3 flex justify-end">
          <AddFinancialGoalDialog />
        </div>
        {financialGoals.length > 0 ? (
          <ul className="grid gap-3 sm:grid-cols-2">
            {financialGoals.map((g) => {
              const percent = Math.min(
                100,
                Math.round((g.current_amount / g.target_amount) * 100),
              );
              return (
                <li
                  key={g.id}
                  className="rounded-lg border border-border bg-card p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">
                      {g.title}
                    </span>
                    <RowMenu
                      deleteTitle={tCommon("confirmDeleteTitle")}
                      deleteImpact={tCommon("deleteSimpleImpact")}
                      onDelete={() => deleteFinancialGoal(g.id)}
                      renderEdit={(open, onOpenChange) => (
                        <AddFinancialGoalDialog
                          initial={g}
                          open={open}
                          onOpenChange={onOpenChange}
                        />
                      )}
                    />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {numberFormatter.format(g.current_amount)} /{" "}
                    {numberFormatter.format(g.target_amount)} ({percent}%)
                  </p>
                  <div className="mt-2">
                    <ProgressBar percent={percent} />
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <EmptyState
            icon={Target}
            message={t("emptyFinancialGoals")}
            action={<AddFinancialGoalDialog />}
          />
        )}
      </TabsContent>
    </Tabs>
  );
}
