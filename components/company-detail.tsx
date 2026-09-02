"use client";

import { useTranslations, useLocale } from "next-intl";
import { FolderKanban, ListTodo, Wallet, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { EmptyState } from "@/components/empty-state";
import { StatusBadge } from "@/components/status-badge";
import { ProgressBar } from "@/components/progress-bar";
import { RowMenu } from "@/components/row-menu";
import { InviteMemberDialog } from "@/components/invite-member-dialog";
import { RemoveMemberButton } from "@/components/remove-member-button";
import { AddCompanyProjectDialog } from "@/components/add-company-project-dialog";
import { EditCompanyDialog } from "@/components/edit-company-dialog";
import { MemberPositionSelect } from "@/components/member-position-select";
import { TaskBoard } from "@/components/task-board";
import { AddTaskDialog } from "@/components/add-task-dialog";
import { MeetingsList } from "@/components/meetings-list";
import { FilesList } from "@/components/files-list";
import { AddTransactionDialog } from "@/components/add-transaction-dialog";
import { AddFinancialGoalDialog } from "@/components/add-financial-goal-dialog";
import { DonutChart } from "@/components/charts/donut-chart";
import { HorizontalBarChart } from "@/components/charts/horizontal-bar-chart";
import { MonthlyFlowChart } from "@/components/charts/monthly-flow-chart";
import { LIFE_AREA_PALETTE } from "@/lib/palette";
import { deleteTransaction, deleteFinancialGoal } from "@/lib/actions";

type Company = {
  id: string;
  name: string;
  description: string | null;
  industry: string | null;
  founded_date: string | null;
  contact_email: string | null;
  contact_phone: string | null;
};
type Member = {
  id: string;
  email: string;
  role: string;
  status: string;
  position: string;
};
type Project = { id: string; name: string; status: string; life_area_id: string };
type Task = {
  id: string;
  title: string;
  status: string;
  priority: string;
  due_date: string | null;
  assigned_to: string | null;
  duration_minutes: number | null;
  project_id: string | null;
};
type Meeting = {
  id: string;
  title: string;
  starts_at: string;
  ends_at: string | null;
  location: string | null;
  notes: string | null;
  project_id: string | null;
};
type DocumentRow = {
  id: string;
  file_name: string;
  file_type: string | null;
  size_bytes: number | null;
  storage_path: string;
  uploaded_at: string;
};
type LifeArea = { id: string; name: string };
type Assignee = { id: string; email: string };
type Account = { id: string; name: string };
type Transaction = {
  id: string;
  amount: number;
  direction: string;
  category: string | null;
  occurred_at: string;
  note: string | null;
};
type FinancialGoal = {
  id: string;
  title: string;
  target_amount: number;
  current_amount: number;
  target_date: string | null;
};
type Deal = {
  task_id: string;
  contact_name: string | null;
  channel: string | null;
  deal_value: number | null;
  last_contacted_at: string | null;
};

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export function CompanyDetail({
  company,
  isOwner,
  members,
  projects,
  tasks,
  meetings,
  documents,
  lifeAreas,
  assignees,
  accounts,
  transactions,
  financialGoals,
  deals,
}: {
  company: Company;
  isOwner: boolean;
  members: Member[];
  projects: Project[];
  tasks: Task[];
  meetings: Meeting[];
  documents: DocumentRow[];
  lifeAreas: LifeArea[];
  assignees: Assignee[];
  accounts: Account[];
  transactions: Transaction[];
  financialGoals: FinancialGoal[];
  deals: Deal[];
}) {
  const t = useTranslations("team");
  const tAreas = useTranslations("areas");
  const tStatus = useTranslations("status");
  const tFinance = useTranslations("finance");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const numberFormatter = new Intl.NumberFormat(
    locale === "ar" ? "ar-u-nu-latn" : "en",
  );
  const today = todayIso();

  const activeProjects = projects.filter((p) => p.status === "active").length;
  const overdueTasks = tasks.filter(
    (task) => task.due_date && task.due_date < today && task.status !== "done",
  ).length;
  const in7Days = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  const nowIso = new Date().toISOString();
  const upcomingMeetings = meetings.filter(
    (m) => m.starts_at >= nowIso && m.starts_at <= in7Days,
  ).length;

  const statusCounts = { backlog: 0, ready: 0, in_progress: 0, in_review: 0, done: 0 };
  for (const task of tasks) {
    if (task.status in statusCounts) {
      statusCounts[task.status as keyof typeof statusCounts] += 1;
    }
  }
  const statusChartData = [
    { name: tStatus("backlog"), value: statusCounts.backlog, color: "var(--muted-foreground)" },
    { name: tStatus("ready"), value: statusCounts.ready, color: "#0EA5E9" },
    { name: tStatus("in_progress"), value: statusCounts.in_progress, color: "#F59E0B" },
    { name: tStatus("in_review"), value: statusCounts.in_review, color: "#8B5CF6" },
    { name: tStatus("done"), value: statusCounts.done, color: "#10B981" },
  ];

  const projectCompletionData = projects
    .map((p) => {
      const projectTasks = tasks.filter((task) => task.project_id === p.id);
      if (projectTasks.length === 0) return null;
      const done = projectTasks.filter((task) => task.status === "done").length;
      return { name: p.name, value: Math.round((done / projectTasks.length) * 100) };
    })
    .filter((d): d is { name: string; value: number } => d !== null);

  const projectRefs = projects.map((p) => ({
    id: p.id,
    name: p.name,
    life_area_id: p.life_area_id,
  }));

  const totalIncome = transactions
    .filter((tx) => tx.direction === "in")
    .reduce((sum, tx) => sum + tx.amount, 0);
  const totalExpense = transactions
    .filter((tx) => tx.direction === "out")
    .reduce((sum, tx) => sum + tx.amount, 0);

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
    <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-foreground">{company.name}</h1>
        {isOwner && <EditCompanyDialog company={company} />}
      </div>

      {(company.description ||
        company.industry ||
        company.founded_date ||
        company.contact_email ||
        company.contact_phone) && (
        <section className="grid gap-3 rounded-lg border border-border bg-card p-4 shadow-sm sm:grid-cols-2">
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

      <Tabs defaultValue="overview">
        <TabsList variant="line" className="mb-2 w-full justify-start overflow-x-auto">
          <TabsTrigger value="overview">{t("overview")}</TabsTrigger>
          <TabsTrigger value="projects">{t("projects")}</TabsTrigger>
          <TabsTrigger value="tasks">{t("tasks")}</TabsTrigger>
          <TabsTrigger value="meetings">{t("meetings")}</TabsTrigger>
          <TabsTrigger value="files">{t("files")}</TabsTrigger>
          <TabsTrigger value="finance">{tFinance("title")}</TabsTrigger>
          <TabsTrigger value="team">{t("team")}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-3 sm:grid-cols-4">
            <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
              <p className="text-2xl font-semibold text-foreground">{activeProjects}</p>
              <p className="text-xs text-muted-foreground">{t("activeProjects")}</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
              <p className="text-2xl font-semibold text-destructive">{overdueTasks}</p>
              <p className="text-xs text-muted-foreground">{t("overdueTasks")}</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
              <p className="text-2xl font-semibold text-foreground">{members.length}</p>
              <p className="text-xs text-muted-foreground">{t("teamSize")}</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
              <p className="text-2xl font-semibold text-foreground">{upcomingMeetings}</p>
              <p className="text-xs text-muted-foreground">{t("upcomingMeetings")}</p>
            </div>
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
              <h3 className="mb-2 text-sm font-semibold text-foreground">
                {t("taskStatusChart")}
              </h3>
              {statusChartData.some((d) => d.value > 0) ? (
                <DonutChart data={statusChartData} />
              ) : (
                <p className="text-sm text-muted-foreground">{t("emptyTasks")}</p>
              )}
            </div>
            <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
              <h3 className="mb-2 text-sm font-semibold text-foreground">
                {t("projectCompletionChart")}
              </h3>
              {projectCompletionData.length > 0 ? (
                <HorizontalBarChart data={projectCompletionData} />
              ) : (
                <p className="text-sm text-muted-foreground">{tAreas("emptyProjects")}</p>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="projects">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">{t("projects")}</h2>
            {isOwner && (
              <AddCompanyProjectDialog companyId={company.id} lifeAreas={lifeAreas} />
            )}
          </div>
          {projects.length > 0 ? (
            <ul className="divide-y divide-border rounded-lg border border-border bg-card shadow-sm">
              {projects.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/areas/${p.life_area_id}/projects/${p.id}`}
                    className="flex items-center justify-between px-4 py-3 hover:bg-accent"
                  >
                    <span className="text-sm text-foreground">{p.name}</span>
                    <StatusBadge status={p.status} />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState icon={FolderKanban} message={t("emptyProjects")} />
          )}
        </TabsContent>

        <TabsContent value="tasks">
          <div className="mb-3 flex justify-end">
            <AddTaskDialog projects={projectRefs} assignees={assignees} />
          </div>
          {tasks.length > 0 ? (
            <TaskBoard
              tasks={tasks}
              assignees={assignees}
              projects={projectRefs}
              companyId={company.id}
              deals={deals}
            />
          ) : (
            <EmptyState icon={ListTodo} message={t("emptyTasks")} />
          )}
        </TabsContent>

        <TabsContent value="meetings">
          <MeetingsList meetings={meetings} projects={projectRefs} />
        </TabsContent>

        <TabsContent value="files">
          <FilesList documents={documents} projects={projectRefs} />
        </TabsContent>

        <TabsContent value="finance">
          <div className="flex flex-col gap-6">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
                <p className="text-2xl font-semibold text-emerald-600 dark:text-emerald-400">
                  {numberFormatter.format(totalIncome)}
                </p>
                <p className="text-xs text-muted-foreground">{tFinance("income")}</p>
              </div>
              <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
                <p className="text-2xl font-semibold text-red-600 dark:text-red-400">
                  {numberFormatter.format(totalExpense)}
                </p>
                <p className="text-xs text-muted-foreground">{tFinance("expense")}</p>
              </div>
              <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
                <p className="text-2xl font-semibold text-foreground">
                  {numberFormatter.format(totalIncome - totalExpense)}
                </p>
                <p className="text-xs text-muted-foreground">{tFinance("net")}</p>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
                <h3 className="mb-2 text-sm font-semibold text-foreground">
                  {tFinance("expenseByCategory")}
                </h3>
                {categoryChartData.length > 0 ? (
                  <DonutChart data={categoryChartData} />
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {tFinance("emptyTransactions")}
                  </p>
                )}
              </div>
              <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
                <h3 className="mb-2 text-sm font-semibold text-foreground">
                  {tFinance("monthlyFlow")}
                </h3>
                {monthlyChartData.length > 0 ? (
                  <MonthlyFlowChart
                    data={monthlyChartData}
                    incomeLabel={tFinance("income")}
                    expenseLabel={tFinance("expense")}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {tFinance("emptyTransactions")}
                  </p>
                )}
              </div>
            </div>

            <section>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-foreground">
                  {tFinance("transactions")}
                </h2>
                {accounts.length > 0 && (
                  <AddTransactionDialog
                    accounts={accounts}
                    areas={[]}
                    companyId={company.id}
                  />
                )}
              </div>
              {transactions.length > 0 ? (
                <ul className="divide-y divide-border rounded-lg border border-border bg-card shadow-sm">
                  {transactions.map((tx) => (
                    <li key={tx.id} className="flex items-center gap-3 px-4 py-3">
                      <span className="flex-1 text-sm text-foreground">
                        {tx.note || tx.category || "—"}
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
                <EmptyState icon={Wallet} message={tFinance("emptyTransactions")} />
              )}
            </section>

            <section>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-foreground">
                  {tFinance("financialGoals")}
                </h2>
                <AddFinancialGoalDialog companyId={company.id} />
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
                <EmptyState icon={Wallet} message={tFinance("emptyFinancialGoals")} />
              )}
            </section>
          </div>
        </TabsContent>

        <TabsContent value="team">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">{t("members")}</h2>
            {isOwner && <InviteMemberDialog companyId={company.id} />}
          </div>
          <ul className="divide-y divide-border rounded-lg border border-border bg-card shadow-sm">
            {members.map((m) => (
              <li key={m.id} className="flex items-center gap-3 px-4 py-3">
                <span className="flex-1 text-sm text-foreground">{m.email}</span>
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
