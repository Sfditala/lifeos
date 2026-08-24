-- Step 13: meetings

create table meetings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  life_area_id uuid references life_areas(id) on delete set null,
  project_id uuid references projects(id) on delete set null,
  title text not null,
  starts_at timestamptz not null,
  ends_at timestamptz,
  location text,
  notes text,
  created_at timestamptz default now(),
  deleted_at timestamptz
);

alter table meetings enable row level security;

create policy "meetings_owner" on meetings
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
