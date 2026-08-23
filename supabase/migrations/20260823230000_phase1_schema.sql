-- Phase 1: habits, content, knowledge notes, reviews, decisions

create table habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  life_area_id uuid references life_areas(id) on delete set null,
  name text not null,
  frequency text not null default 'daily' check (frequency in ('daily','weekly')),
  active boolean not null default true,
  created_at timestamptz default now()
);

create table habit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  habit_id uuid not null references habits(id) on delete cascade,
  log_date date not null,
  done boolean not null default true,
  created_at timestamptz default now(),
  unique (habit_id, log_date)
);

create table content_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  life_area_id uuid references life_areas(id) on delete set null,
  project_id uuid references projects(id) on delete set null,
  title text not null,
  status text not null default 'idea' check (status in ('idea','draft','scheduled','published')),
  scheduled_date date,
  notes text,
  created_at timestamptz default now()
);

create table knowledge_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  life_area_id uuid references life_areas(id) on delete set null,
  title text not null,
  body text not null,
  tags text[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('daily','weekly')),
  period_start date not null,
  period_end date not null,
  summary text,
  created_at timestamptz default now()
);

create table review_items (
  id uuid primary key default gen_random_uuid(),
  review_id uuid not null references reviews(id) on delete cascade,
  kind text not null check (kind in ('win','blocker','conflict','priority_next')),
  content text not null
);

create table decisions (
  id uuid primary key default gen_random_uuid(),
  review_id uuid references reviews(id) on delete set null,
  user_id uuid not null references auth.users(id) on delete cascade,
  content text not null,
  related_project_id uuid references projects(id) on delete set null,
  created_at timestamptz default now()
);

alter table habits enable row level security;
alter table habit_logs enable row level security;
alter table content_items enable row level security;
alter table knowledge_notes enable row level security;
alter table reviews enable row level security;
alter table review_items enable row level security;
alter table decisions enable row level security;

create policy "habits_owner" on habits
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "habit_logs_owner" on habit_logs
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "content_items_owner" on content_items
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "knowledge_notes_owner" on knowledge_notes
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "reviews_owner" on reviews
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "review_items_owner" on review_items
  for all using (
    exists (select 1 from reviews r where r.id = review_items.review_id and r.user_id = auth.uid())
  ) with check (
    exists (select 1 from reviews r where r.id = review_items.review_id and r.user_id = auth.uid())
  );

create policy "decisions_owner" on decisions
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
