-- Step 19: hierarchical goals (big -> yearly -> monthly -> weekly)

alter table goals add column period_type text not null default 'yearly'
  check (period_type in ('big', 'yearly', 'monthly', 'weekly'));
alter table goals add column parent_goal_id uuid references goals(id) on delete set null;
alter table goals add column period_start date;
alter table goals add column period_end date;
