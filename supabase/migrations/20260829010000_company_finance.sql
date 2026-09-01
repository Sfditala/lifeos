-- Company finance: let a transaction or financial goal optionally belong to
-- a company, independent from the account it's logged against (accounts
-- stay personal — a company transaction just flows through one of them).

alter table transactions add column company_id uuid references companies(id) on delete set null;
alter table financial_goals add column company_id uuid references companies(id) on delete set null;
