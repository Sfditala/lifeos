-- Step 17: shared team/company workspace (highest-risk migration — custom multi-user RLS)

create table companies (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  created_at timestamptz default now(),
  deleted_at timestamptz
);

create table team_members (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  email text not null,
  role text not null default 'member' check (role in ('owner','member')),
  status text not null default 'invited' check (status in ('invited','active','removed')),
  invited_at timestamptz default now(),
  joined_at timestamptz
);

create table project_messages (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  content text not null,
  created_at timestamptz default now()
);

alter table projects add column company_id uuid references companies(id) on delete set null;
alter table documents add column company_id uuid references companies(id) on delete set null;

alter table companies enable row level security;
alter table team_members enable row level security;
alter table project_messages enable row level security;

-- companies: owner has full control; active members can only read
create policy "companies_owner_all" on companies
  for all using (owner_user_id = auth.uid()) with check (owner_user_id = auth.uid());

create policy "companies_member_select" on companies
  for select using (
    exists (
      select 1 from team_members tm
      where tm.company_id = companies.id
        and tm.user_id = auth.uid()
        and tm.status = 'active'
    )
  );

-- team_members: owner manages the roster; a member can see the roster of their own company
create policy "team_members_owner_all" on team_members
  for all using (
    exists (select 1 from companies c where c.id = team_members.company_id and c.owner_user_id = auth.uid())
  ) with check (
    exists (select 1 from companies c where c.id = team_members.company_id and c.owner_user_id = auth.uid())
  );

create policy "team_members_self_select" on team_members
  for select using (
    user_id = auth.uid()
    or exists (
      select 1 from team_members tm2
      where tm2.company_id = team_members.company_id
        and tm2.user_id = auth.uid()
        and tm2.status = 'active'
    )
  );

-- projects: existing personal policy already covers the owner; add read access for active company members
create policy "projects_company_member_select" on projects
  for select using (
    company_id is not null
    and exists (
      select 1 from team_members tm
      where tm.company_id = projects.company_id
        and tm.user_id = auth.uid()
        and tm.status = 'active'
    )
  );

-- documents: same read-only extension for shared company projects/files
create policy "documents_company_member_select" on documents
  for select using (
    company_id is not null
    and exists (
      select 1 from team_members tm
      where tm.company_id = documents.company_id
        and tm.user_id = auth.uid()
        and tm.status = 'active'
    )
  );

-- project_messages: readable/writable by the project owner or any active member of the project's company
create policy "project_messages_access" on project_messages
  for all using (
    exists (
      select 1 from projects p
      where p.id = project_messages.project_id
        and (
          p.user_id = auth.uid()
          or (
            p.company_id is not null
            and exists (
              select 1 from team_members tm
              where tm.company_id = p.company_id
                and tm.user_id = auth.uid()
                and tm.status = 'active'
            )
          )
        )
    )
  ) with check (
    user_id = auth.uid()
    and exists (
      select 1 from projects p
      where p.id = project_messages.project_id
        and (
          p.user_id = auth.uid()
          or (
            p.company_id is not null
            and exists (
              select 1 from team_members tm
              where tm.company_id = p.company_id
                and tm.user_id = auth.uid()
                and tm.status = 'active'
            )
          )
        )
    )
  );

create trigger trg_cleanup_links after delete on companies
  for each row execute function cleanup_entity_links('company');
