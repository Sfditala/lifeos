-- Step 14: soft delete (trash with grace period) across all personal entities

alter table life_areas add column deleted_at timestamptz;
alter table goals add column deleted_at timestamptz;
alter table projects add column deleted_at timestamptz;
alter table tasks add column deleted_at timestamptz;
alter table habits add column deleted_at timestamptz;
alter table content_items add column deleted_at timestamptz;
alter table knowledge_notes add column deleted_at timestamptz;
alter table project_milestones add column deleted_at timestamptz;
