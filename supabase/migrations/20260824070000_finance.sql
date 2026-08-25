-- Step 16: full personal finance module

create table finance_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  type text not null check (type in ('cash','bank','credit','savings')),
  currency text not null default 'ILS',
  opening_balance numeric not null default 0,
  created_at timestamptz default now(),
  deleted_at timestamptz
);

create table transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  account_id uuid not null references finance_accounts(id) on delete cascade,
  life_area_id uuid references life_areas(id) on delete set null,
  project_id uuid references projects(id) on delete set null,
  amount numeric not null,
  direction text not null check (direction in ('in','out')),
  category text,
  occurred_at date not null,
  note text,
  is_recurring boolean not null default false,
  recurrence_rule text,
  created_at timestamptz default now(),
  deleted_at timestamptz
);

create table budgets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  life_area_id uuid references life_areas(id) on delete set null,
  category text not null,
  monthly_limit numeric not null,
  created_at timestamptz default now(),
  deleted_at timestamptz
);

create table financial_goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  target_amount numeric not null,
  current_amount numeric not null default 0,
  target_date date,
  created_at timestamptz default now(),
  deleted_at timestamptz
);

alter table finance_accounts enable row level security;
alter table transactions enable row level security;
alter table budgets enable row level security;
alter table financial_goals enable row level security;

create policy "finance_accounts_owner" on finance_accounts
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "transactions_owner" on transactions
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "budgets_owner" on budgets
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "financial_goals_owner" on financial_goals
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create trigger trg_cleanup_links after delete on finance_accounts
  for each row execute function cleanup_entity_links('finance_account');
create trigger trg_cleanup_links after delete on transactions
  for each row execute function cleanup_entity_links('transaction');
create trigger trg_cleanup_links after delete on budgets
  for each row execute function cleanup_entity_links('budget');
create trigger trg_cleanup_links after delete on financial_goals
  for each row execute function cleanup_entity_links('financial_goal');
