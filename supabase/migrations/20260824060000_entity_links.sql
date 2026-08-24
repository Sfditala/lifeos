-- Step 15: manual relationship graph between any two entities

create table entity_links (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  from_type text not null,
  from_id uuid not null,
  to_type text not null,
  to_id uuid not null,
  relation_label text,
  created_at timestamptz default now()
);

alter table entity_links enable row level security;

create policy "entity_links_owner" on entity_links
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Orphan-link cleanup: entities are only ever soft-deleted by the app (deleted_at),
-- so a real DELETE only happens at trash purge time (manual or the daily cron).
-- When that happens, remove any entity_links pointing at the deleted row.
create or replace function cleanup_entity_links() returns trigger as $$
declare
  entity_type text := TG_ARGV[0];
begin
  delete from entity_links
    where (from_type = entity_type and from_id = OLD.id)
       or (to_type = entity_type and to_id = OLD.id);
  return OLD;
end;
$$ language plpgsql;

create trigger trg_cleanup_links after delete on life_areas
  for each row execute function cleanup_entity_links('life_area');
create trigger trg_cleanup_links after delete on goals
  for each row execute function cleanup_entity_links('goal');
create trigger trg_cleanup_links after delete on projects
  for each row execute function cleanup_entity_links('project');
create trigger trg_cleanup_links after delete on tasks
  for each row execute function cleanup_entity_links('task');
create trigger trg_cleanup_links after delete on habits
  for each row execute function cleanup_entity_links('habit');
create trigger trg_cleanup_links after delete on content_items
  for each row execute function cleanup_entity_links('content_item');
create trigger trg_cleanup_links after delete on knowledge_notes
  for each row execute function cleanup_entity_links('knowledge_note');
create trigger trg_cleanup_links after delete on project_milestones
  for each row execute function cleanup_entity_links('project_milestone');
create trigger trg_cleanup_links after delete on documents
  for each row execute function cleanup_entity_links('document');
create trigger trg_cleanup_links after delete on meetings
  for each row execute function cleanup_entity_links('meeting');
