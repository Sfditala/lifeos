-- Step 21: professional company workspace
-- Company profile details, a fixed job-function list per member (separate from
-- the owner/member permission tier), and task assignment to specific team
-- members — plus the RLS a shared project's tasks/milestones actually need so
-- a company member can see them at all (previously only the creator could).

alter table companies add column founded_date date;
alter table companies add column description text;
alter table companies add column industry text;
alter table companies add column contact_email text;
alter table companies add column contact_phone text;

alter table team_members add column position text not null default 'member'
  check (position in (
    'manager','accountant','developer','designer',
    'marketing','sales','hr','support','member'
  ));

alter table tasks add column assigned_to uuid references auth.users(id) on delete set null;

create policy "tasks_company_member_select" on tasks
  for select using (
    exists (
      select 1 from projects p
      where p.id = tasks.project_id
        and p.company_id is not null
        and is_active_company_member(p.company_id, auth.uid())
    )
  );

create policy "tasks_assignee_update" on tasks
  for update using (assigned_to = auth.uid())
  with check (assigned_to = auth.uid());

create policy "project_milestones_company_member_select" on project_milestones
  for select using (
    exists (
      select 1 from projects p
      where p.id = project_milestones.project_id
        and p.company_id is not null
        and is_active_company_member(p.company_id, auth.uid())
    )
  );
