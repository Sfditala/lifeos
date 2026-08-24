-- Step 11: richer life area page + dedicated project page

alter table projects add column due_date date;

create table project_milestones (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  project_id uuid not null references projects(id) on delete cascade,
  title text not null,
  due_date date,
  done boolean not null default false,
  sort_order int default 0,
  created_at timestamptz default now()
);

alter table project_milestones enable row level security;

create policy "project_milestones_owner" on project_milestones
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
