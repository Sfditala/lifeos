-- Step 12: file storage per life area / project

insert into storage.buckets (id, name, public, file_size_limit)
values ('documents', 'documents', false, 20971520)
on conflict (id) do nothing;

create policy "documents_storage_select_own" on storage.objects
  for select using (
    bucket_id = 'documents' and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "documents_storage_insert_own" on storage.objects
  for insert with check (
    bucket_id = 'documents' and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "documents_storage_delete_own" on storage.objects
  for delete using (
    bucket_id = 'documents' and (storage.foldername(name))[1] = auth.uid()::text
  );

create table documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  life_area_id uuid references life_areas(id) on delete set null,
  project_id uuid references projects(id) on delete set null,
  file_name text not null,
  storage_path text not null,
  file_type text,
  size_bytes bigint,
  uploaded_at timestamptz default now(),
  deleted_at timestamptz
);

alter table documents enable row level security;

create policy "documents_owner" on documents
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
