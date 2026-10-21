-- My Thirties : cache des photos Unsplash des plats (une recherche par plat, rafraîchie au plus une fois par mois).
-- Lu et écrit uniquement par la fonction dish-photos (clé de service) : aucun accès direct depuis l'app.
create table if not exists public.dish_photos (
  query text primary key check (length(query) between 1 and 80),
  photo jsonb,
  fetched_at timestamptz not null default now()
);
alter table public.dish_photos enable row level security;
revoke all on public.dish_photos from anon, authenticated;
