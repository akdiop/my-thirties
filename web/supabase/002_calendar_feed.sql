-- My Thirties : synchronisation avec le calendrier de l'iPhone, dans les deux sens.
-- token : lien d'abonnement privé My Thirties → iPhone (le régénérer invalide l'ancien).
-- import_url : lien du calendrier iCloud public, importé iPhone → My Thirties.
create table if not exists public.calendar_feeds (
  user_id uuid primary key default auth.uid() references auth.users(id) on delete cascade,
  token text unique check (token ~ '^[0-9a-f]{64}$'),
  import_url text check (import_url is null or (length(import_url) < 600 and import_url ~ '^(https|webcal)://')),
  imported_at timestamptz,
  created_at timestamptz not null default now()
);
alter table public.calendar_feeds enable row level security;
revoke all on public.calendar_feeds from anon;
grant select, insert, update, delete on public.calendar_feeds to authenticated;

drop policy if exists "owner manages calendar feed" on public.calendar_feeds;
create policy "owner manages calendar feed" on public.calendar_feeds for all to authenticated
using (public.is_app_owner() and user_id = (select auth.uid()))
with check (public.is_app_owner() and user_id = (select auth.uid()));
