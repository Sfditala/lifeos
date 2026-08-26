-- Personal settings: display name + a customizable accent color, overriding
-- the app-wide default primary color from globals.css for this account only.

create table user_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  accent_color text,
  updated_at timestamptz default now()
);

alter table user_settings enable row level security;

create policy "user_settings_owner" on user_settings
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
