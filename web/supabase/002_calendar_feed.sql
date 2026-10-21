-- My Thirties : lien d'abonnement privé pour le calendrier de l'iPhone (webcal).
-- Un seul lien par compte ; le régénérer invalide l'ancien.
create table if not exists public.calendar_feeds (
  user_id uuid primary key default auth.uid() references auth.users(id) on delete cascade,
  token text not null unique check (token ~ '^[0-9a-f]{64}$'),
  created_at timestamptz not null default now()
);
alter table public.calendar_feeds enable row level security;
revoke all on public.calendar_feeds from anon;
grant select, insert, update, delete on public.calendar_feeds to authenticated;

drop policy if exists "owner manages calendar feed" on public.calendar_feeds;
create policy "owner manages calendar feed" on public.calendar_feeds for all to authenticated
using (public.is_app_owner() and user_id = (select auth.uid()))
with check (public.is_app_owner() and user_id = (select auth.uid()));
