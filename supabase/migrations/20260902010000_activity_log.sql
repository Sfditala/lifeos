create table activity_log (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id) on delete cascade,
  actor_user_id uuid references auth.users(id) on delete set null,
  action_type text not null check (action_type in (
    'project_created',
    'task_created',
    'task_completed',
    'task_assigned',
    'deal_converted',
    'member_invited',
    'member_joined',
    'document_uploaded'
  )),
  entity_label text not null,
  metadata jsonb,
  created_at timestamptz not null default now()
);

create index activity_log_company_created_idx
  on activity_log (company_id, created_at desc);

alter table activity_log enable row level security;

create policy "activity_log_company_member_select" on activity_log
  for select using (is_active_company_member(activity_log.company_id, auth.uid()));

create policy "activity_log_company_member_insert" on activity_log
  for insert with check (is_active_company_member(activity_log.company_id, auth.uid()));
