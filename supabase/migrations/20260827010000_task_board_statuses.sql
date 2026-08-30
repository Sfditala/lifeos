-- Expand task status from 3 stages (todo/doing/done) to a GitHub Projects-style
-- board: backlog/ready/in_progress/in_review/done. Existing rows are remapped;
-- "done" stays the single terminal value everything else (goal progress,
-- overdue/today home queries) already keys off of.

update tasks set status = 'backlog' where status = 'todo';
update tasks set status = 'in_progress' where status = 'doing';

alter table tasks drop constraint tasks_status_check;
alter table tasks add constraint tasks_status_check
  check (status in ('backlog', 'ready', 'in_progress', 'in_review', 'done'));

alter table tasks alter column status set default 'backlog';
