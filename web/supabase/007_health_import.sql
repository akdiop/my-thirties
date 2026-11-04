-- My Thirties : import des nuits de l'app Santé (Sleep Cycle, montre…) par un raccourci iPhone.
-- token : lien privé utilisé par le raccourci (le régénérer invalide l'ancien).
create table if not exists public.health_imports (
  user_id uuid primary key default auth.uid() references auth.users(id) on delete cascade,
  token text unique check (token ~ '^[0-9a-f]{64}$'),
  imported_at timestamptz,
  created_at timestamptz not null default now()
);
alter table public.health_imports enable row level security;
revoke all on public.health_imports from anon;
grant select, insert, update, delete on public.health_imports to authenticated;

drop policy if exists "owner manages health import" on public.health_imports;
create policy "owner manages health import" on public.health_imports for all to authenticated
using (public.is_app_owner() and user_id = (select auth.uid()))
with check (public.is_app_owner() and user_id = (select auth.uid()));
