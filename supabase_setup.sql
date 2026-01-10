
-- 1. Create Tables
create table if not exists dm_products (
  id text primary key,
  data jsonb not null,
  updated_at timestamp with time zone default now()
);

create table if not exists dm_categories (
  id text primary key,
  data jsonb not null,
  updated_at timestamp with time zone default now()
);

create table if not exists dm_settings (
  id text primary key,
  data jsonb not null,
  updated_at timestamp with time zone default now()
);

-- 2. Drop Existing Policies (Fix for "Policy Already Exists")
drop policy if exists "Enable all access for anon" on dm_products;
drop policy if exists "Enable all access for anon" on dm_categories;
drop policy if exists "Enable all access for anon" on dm_settings;

-- 3. Enable RLS and Create Policies
alter table dm_products enable row level security;
alter table dm_categories enable row level security;
alter table dm_settings enable row level security;

create policy "Enable all access for anon" on dm_products for all using (true) with check (true);
create policy "Enable all access for anon" on dm_categories for all using (true) with check (true);
create policy "Enable all access for anon" on dm_settings for all using (true) with check (true);

-- 4. Storage Bucket Setup
insert into storage.buckets (id, name, public) 
values ('dm_assets', 'dm_assets', true)
on conflict (id) do nothing;

-- Drop existing storage policy to avoid conflict
drop policy if exists "Public Access" on storage.objects;
create policy "Public Access" on storage.objects for all using ( bucket_id = 'dm_assets' );

SELECT 'Setup Complete. Inventory, Data, and Images are ready.' as status;
