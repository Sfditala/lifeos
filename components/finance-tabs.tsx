"use client";

import { useTranslations } from "next-intl";
import { Wallet, Receipt, PiggyBank, Target, Trash2 } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { EmptyState } from "@/components/empty-state";
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

  return (
    <Tabs defaultValue="accounts">
      <TabsList variant="line" className="mb-6 w-full justify-start overflow-x-auto">
        <TabsTrigger value="accounts">{t("accounts")}</TabsTrigger>
        <TabsTrigger value="transactions">{t("transactions")}</TabsTrigger>
        <TabsTrigger value="budgets">{t("budgets")}</TabsTrigger>
        <TabsTrigger value="goals">{t("financialGoals")}</TabsTrigger>
      </TabsList>

      <TabsContent value="accounts">
        <div className="mb-3 flex justify-end">
          <AddAccountDialog />
        </div>
        {accounts.length > 0 ? (
          <ul className="grid gap-3 sm:grid-cols-2">
            {accounts.map((a) => (
              <li
                key={a.id}
                className="rounded-lg border border-border bg-card p-4"
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
                  {a.balance.toLocaleString()} {a.currency}
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
          <ul className="divide-y divide-border rounded-lg border border-border">
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
                  {tx.amount.toLocaleString()}
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
                  className="rounded-lg border border-border bg-card p-4"
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
                    {t("spentThisMonth")}: {b.spent.toLocaleString()} /{" "}
                    {b.monthly_limit.toLocaleString()}
                  </p>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full ${over ? "bg-destructive" : "bg-primary"}`}
                      style={{ width: `${percent}%` }}
                    />
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
                  className="rounded-lg border border-border bg-card p-4"
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
                    {g.current_amount.toLocaleString()} /{" "}
                    {g.target_amount.toLocaleString()} ({percent}%)
                  </p>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${percent}%` }}
                    />
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
