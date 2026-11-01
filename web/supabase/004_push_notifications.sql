-- My Thirties : notifications push (rappels même app fermée).
-- Abonnements des appareils et réglages : lisibles et modifiables uniquement par la propriétaire (RLS).
create table if not exists public.push_subscriptions (
  endpoint text primary key check (endpoint ~ '^https://' and length(endpoint) < 1000),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  subscription jsonb not null check (pg_column_size(subscription) < 4000),
  device text,
  created_at timestamptz not null default now()
);
alter table public.push_subscriptions enable row level security;
create policy "owner manages own subscriptions" on public.push_subscriptions for all to authenticated
  using (public.is_app_owner() and user_id = (select auth.uid())) with check (public.is_app_owner() and user_id = (select auth.uid()));

create table if not exists public.notification_prefs (
  user_id uuid primary key default auth.uid() references auth.users(id) on delete cascade,
  prefs jsonb not null default '{}'::jsonb check (pg_column_size(prefs) < 4000),
  tz text not null default 'Africa/Dakar' check (length(tz) < 60),
  updated_at timestamptz not null default now()
);
alter table public.notification_prefs enable row level security;
create policy "owner manages own notification prefs" on public.notification_prefs for all to authenticated
  using (public.is_app_owner() and user_id = (select auth.uid())) with check (public.is_app_owner() and user_id = (select auth.uid()));

-- Journal des envois (évite les doublons) et clés VAPID : réservés à la fonction serveur (clé de service).
create table if not exists public.push_log (user_id uuid not null, key text not null, sent_at timestamptz not null default now(), primary key (user_id, key));
alter table public.push_log enable row level security;
revoke all on public.push_log from anon, authenticated;
create table if not exists public.push_keys (id int primary key default 1 check (id = 1), public_key text not null, private_key text not null);
alter table public.push_keys enable row level security;
revoke all on public.push_keys from anon, authenticated;

-- Toutes les 5 minutes, la fonction envoie les rappels arrivés à échéance (chaque rappel une seule fois).
create extension if not exists pg_cron;
create extension if not exists pg_net;
select cron.schedule('my-thirties-push-reminders', '*/5 * * * *', $$
  select net.http_post(url := 'https://wqeipqjwvnkqelyctmcg.supabase.co/functions/v1/push-reminders',
    headers := '{"Content-Type": "application/json"}'::jsonb, body := '{"action": "run"}'::jsonb);
$$);
