-- Phase 0 / Step 1: identity, life areas, goals, projects, tasks

create table life_areas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  color text,
  sort_order int default 0,
  created_at timestamptz default now()
);

create table goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  life_area_id uuid references life_areas(id) on delete set null,
  title text not null,
  description text,
  target_date date,
  status text not null default 'active' check (status in ('active','paused','done','dropped')),
  created_at timestamptz default now()
);

create table projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  life_area_id uuid not null references life_areas(id) on delete cascade,
  goal_id uuid references goals(id) on delete set null,
  name text not null,
  description text,
  status text not null default 'active' check (status in ('active','paused','done','dropped')),
  created_at timestamptz default now()
);

create table tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  life_area_id uuid not null references life_areas(id) on delete cascade,
  project_id uuid references projects(id) on delete cascade,
  title text not null,
  notes text,
  due_date date,
  priority text not null default 'medium' check (priority in ('low','medium','high')),
  status text not null default 'todo' check (status in ('todo','doing','done')),
  completed_at timestamptz,
  created_at timestamptz default now()
);

alter table life_areas enable row level security;
alter table goals enable row level security;
alter table projects enable row level security;
alter table tasks enable row level security;

create policy "life_areas_owner" on life_areas
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "goals_owner" on goals
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "projects_owner" on projects
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "tasks_owner" on tasks
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
