-- Let each life area opt in to the Meetings / Files tabs (most areas don't need them)

alter table life_areas add column show_meetings boolean not null default false;
alter table life_areas add column show_files boolean not null default false;
