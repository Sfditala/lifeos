-- Step 22: small improvements
-- Task duration (minutes), and a fixed income-source list separate from the
-- existing free-text expense category.

alter table tasks add column duration_minutes integer;

alter table transactions add column source text
  check (source is null or source in (
    'salary','freelance','business','investment','gift','refund','other'
  ));
