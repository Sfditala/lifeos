"use client";

import { useTranslations } from "next-intl";
import { FolderKanban, ListTodo } from "lucide-react";
import { Link } from "@/i18n/navigation";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { EmptyState } from "@/components/empty-state";
import { StatusBadge } from "@/components/status-badge";
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
import { DonutChart } from "@/components/charts/donut-chart";
import { HorizontalBarChart } from "@/components/charts/horizontal-bar-chart";

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
}) {
  const t = useTranslations("team");
  const tAreas = useTranslations("areas");
  const tStatus = useTranslations("status");
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
            <TaskBoard tasks={tasks} assignees={assignees} projects={projectRefs} />
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
