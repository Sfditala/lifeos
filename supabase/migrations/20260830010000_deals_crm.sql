-- Lightweight CRM layer on top of the task board: a task can optionally
-- carry deal info (contact, channel, expected value). One deal per task.
-- When a deal-carrying task is marked done, it converts once into a real
-- company revenue transaction (see updateTaskStatus in lib/actions.ts).

create table deals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  task_id uuid not null references tasks(id) on delete cascade,
  company_id uuid references companies(id) on delete set null,
  contact_name text,
  channel text check (channel is null or channel in (
    'whatsapp', 'email', 'linkedin', 'phone', 'other'
  )),
  deal_value numeric,
  last_contacted_at date,
  converted_at timestamptz,
  created_at timestamptz default now(),
  unique (task_id)
);

alter table deals enable row level security;

create policy "deals_owner" on deals
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "deals_company_member_select" on deals
  for select using (
    company_id is not null and is_active_company_member(company_id, auth.uid())
  );
