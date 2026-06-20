create table if not exists public.site_content (
  id text primary key,
  content jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.site_content enable row level security;

drop policy if exists "public can read site content" on public.site_content;
create policy "public can read site content"
on public.site_content for select
to anon, authenticated
using (true);

drop policy if exists "authenticated admin can insert content" on public.site_content;
create policy "authenticated admin can insert content"
on public.site_content for insert
to authenticated
with check (true);

drop policy if exists "authenticated admin can update content" on public.site_content;
create policy "authenticated admin can update content"
on public.site_content for update
to authenticated
using (true)
with check (true);

grant select on public.site_content to anon;
grant select, insert, update on public.site_content to authenticated;
