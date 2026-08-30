-- Habits: let a habit target specific weekdays (not just daily/weekly), and
-- give it a category for organizing the habits list.

alter table habits drop constraint habits_frequency_check;
alter table habits add constraint habits_frequency_check
  check (frequency in ('daily', 'custom_days', 'weekly'));

-- 0=Sunday..6=Saturday, only meaningful when frequency = 'custom_days'.
alter table habits add column custom_days int[];

alter table habits add column category text
  check (category is null or category in (
    'health', 'learning', 'spiritual', 'productivity', 'social', 'personal', 'other'
  ));
