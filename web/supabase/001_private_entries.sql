-- My Thirties: dedicated Supabase project. Run only in the new personal project.
-- Provision exactly one account in Supabase Auth; disable public signup.
create extension if not exists pgcrypto;

create table if not exists public.app_owner (
  user_id uuid primary key references auth.users(id) on delete cascade
);
alter table public.app_owner enable row level security;
revoke all on public.app_owner from anon, authenticated;

create or replace function public.is_app_owner()
returns boolean
language sql stable security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.app_owner o
    where o.user_id = (select auth.uid())
  );
$$;
revoke all on function public.is_app_owner() from public, anon;
grant execute on function public.is_app_owner() to authenticated;

create table if not exists public.entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  module text not null check (module in (
    'quotidien','sante','sport','challenges','equilibre','spiritualite',
    'finances','cuisine','decouvertes','passions','listes'
  )),
  kind text not null check (length(kind) between 1 and 60),
  title text not null check (length(title) between 1 and 180),
  entry_date date,
  data jsonb not null default '{}'::jsonb check (jsonb_typeof(data) = 'object' and pg_column_size(data) < 65536),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists entries_user_module_date on public.entries(user_id,module,entry_date desc);
create index if not exists entries_user_updated on public.entries(user_id,updated_at desc);

create or replace function public.touch_entry()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at := now();
  new.user_id := old.user_id;
  return new;
end;
$$;
drop trigger if exists trg_touch_entry on public.entries;
create trigger trg_touch_entry before update on public.entries
for each row execute function public.touch_entry();

alter table public.entries enable row level security;
revoke all on public.entries from anon;
grant select, insert, update, delete on public.entries to authenticated;

drop policy if exists "owner read entries" on public.entries;
drop policy if exists "owner insert entries" on public.entries;
drop policy if exists "owner update entries" on public.entries;
drop policy if exists "owner delete entries" on public.entries;

create policy "owner read entries" on public.entries for select to authenticated
using (public.is_app_owner() and user_id = (select auth.uid()));
create policy "owner insert entries" on public.entries for insert to authenticated
with check (public.is_app_owner() and user_id = (select auth.uid()));
create policy "owner update entries" on public.entries for update to authenticated
using (public.is_app_owner() and user_id = (select auth.uid()))
with check (public.is_app_owner() and user_id = (select auth.uid()));
create policy "owner delete entries" on public.entries for delete to authenticated
using (public.is_app_owner() and user_id = (select auth.uid()));

-- After creating your account manually in Supabase Auth, run ONCE with its real UUID:
-- insert into public.app_owner(user_id) values ('REPLACE-WITH-AUTH-USER-UUID');
-- Do not create an app_owner row for any other account.
