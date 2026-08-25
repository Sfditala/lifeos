-- Fix: infinite recursion between companies <-> team_members RLS policies.
-- Root cause: companies_member_select queries team_members, whose own
-- owner policy queries companies, which re-triggers companies_member_select, etc.
-- Fix: move the cross-table checks into SECURITY DEFINER helper functions that
-- query the base table directly (bypassing RLS on the *internal* query only),
-- so evaluating one table's policy no longer re-invokes the other table's RLS.

create or replace function is_active_company_member(target_company_id uuid, target_user_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from team_members tm
    where tm.company_id = target_company_id
      and tm.user_id = target_user_id
      and tm.status = 'active'
  );
$$;

create or replace function is_company_owner(target_company_id uuid, target_user_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from companies c
    where c.id = target_company_id
      and c.owner_user_id = target_user_id
  );
$$;

drop policy if exists "companies_member_select" on companies;
create policy "companies_member_select" on companies
  for select using (is_active_company_member(companies.id, auth.uid()));

drop policy if exists "team_members_owner_all" on team_members;
create policy "team_members_owner_all" on team_members
  for all using (is_company_owner(team_members.company_id, auth.uid()))
  with check (is_company_owner(team_members.company_id, auth.uid()));

drop policy if exists "team_members_self_select" on team_members;
create policy "team_members_self_select" on team_members
  for select using (
    user_id = auth.uid()
    or is_active_company_member(team_members.company_id, auth.uid())
  );

drop policy if exists "projects_company_member_select" on projects;
create policy "projects_company_member_select" on projects
  for select using (
    company_id is not null
    and is_active_company_member(projects.company_id, auth.uid())
  );

drop policy if exists "documents_company_member_select" on documents;
create policy "documents_company_member_select" on documents
  for select using (
    company_id is not null
    and is_active_company_member(documents.company_id, auth.uid())
  );

drop policy if exists "project_messages_access" on project_messages;
create policy "project_messages_access" on project_messages
  for all using (
    exists (
      select 1 from projects p
      where p.id = project_messages.project_id
        and (
          p.user_id = auth.uid()
          or (p.company_id is not null and is_active_company_member(p.company_id, auth.uid()))
        )
    )
  ) with check (
    user_id = auth.uid()
    and exists (
      select 1 from projects p
      where p.id = project_messages.project_id
        and (
          p.user_id = auth.uid()
          or (p.company_id is not null and is_active_company_member(p.company_id, auth.uid()))
        )
    )
  );
