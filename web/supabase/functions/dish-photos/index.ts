// Photos Unsplash des plats pour les recettes. Une recherche par plat, mise en cache dans la table dish_photos
// (palier gratuit Unsplash : 50 requêtes par heure). Crédit photographe renvoyé à l'app, comme l'exige Unsplash.
// Secrets : UNSPLASH_ACCESS_KEY (clé « Access Key » de l'application Unsplash), SUPABASE_URL, SUPABASE_ANON_KEY,
// SUPABASE_SERVICE_ROLE_KEY (fournis par Supabase). Vérification JWT activée ; réservé à la propriétaire.
import { createClient } from 'npm:@supabase/supabase-js@2';

type Photo = { src: string; author: string; authorUrl: string; photoUrl: string };
const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info', 'Access-Control-Allow-Methods': 'POST, OPTIONS' };
const json = (data: unknown, status = 200) => new Response(JSON.stringify(data), { status, headers: { ...cors, 'Content-Type': 'application/json' } });
const utm = (url: string) => url + (url.includes('?') ? '&' : '?') + 'utm_source=my_thirties&utm_medium=referral';
const MONTH = 30 * 86_400_000;

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
  if (request.method !== 'POST') return json({ error: 'Méthode interdite.' }, 405);
  const url = Deno.env.get('SUPABASE_URL'), anon = Deno.env.get('SUPABASE_ANON_KEY'), service = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  const key = Deno.env.get('UNSPLASH_ACCESS_KEY')?.trim();
  if (!url || !anon || !service) return json({ error: 'Configuration manquante.' }, 503);
  const auth = request.headers.get('authorization') ?? '';
  const user = createClient(url, anon, { global: { headers: { Authorization: auth } }, auth: { persistSession: false, autoRefreshToken: false } });
  const { data: me } = await user.auth.getUser(auth.replace(/^Bearer\s+/i, ''));
  if (!me?.user) return json({ error: 'Session invalide.' }, 401);
  const { data: owner } = await user.rpc('is_app_owner');
  if (owner !== true) return json({ error: 'Accès refusé.' }, 403);

  // { plat: recherche } envoyé par l'app ; limité en taille.
  let wanted: Record<string, string> = {};
  try {
    const body = await request.json();
    for (const [dish, q] of Object.entries(body?.queries ?? {}).slice(0, 80)) {
      if (typeof q === 'string' && q.length <= 80 && dish.length <= 80) wanted[dish] = q.trim().toLowerCase();
    }
  } catch { return json({ error: 'Requête invalide.' }, 400); }

  const db = createClient(url, service, { auth: { persistSession: false, autoRefreshToken: false } });
  const queries = [...new Set(Object.values(wanted))];
  const { data: cached } = await db.from('dish_photos').select('query,photo,fetched_at').in('query', queries);
  const byQuery = new Map((cached ?? []).map((r) => [r.query as string, r]));

  // Recherches manquantes ou périmées, au plus 40 par appel pour rester sous la limite horaire.
  const stale = queries.filter((q) => { const r = byQuery.get(q); return !r || Date.now() - Date.parse(r.fetched_at) > MONTH; }).slice(0, 40);
  let unsplashStatus = 0;
  if (key) for (const q of stale) {
    try {
      const res = await fetch('https://api.unsplash.com/search/photos?' + new URLSearchParams({ query: q, per_page: '1', orientation: 'landscape', content_filter: 'high' }),
        { headers: { Authorization: 'Client-ID ' + key, 'Accept-Version': 'v1' }, signal: AbortSignal.timeout(8000) });
      unsplashStatus = res.status;
      if (!res.ok) console.error('Unsplash a répondu ' + res.status + ' pour « ' + q + ' »');
      if ([401, 403, 429].includes(res.status)) break; // clé refusée ou quota atteint : on réessaiera plus tard
      if (!res.ok) continue;
      const hit = (await res.json())?.results?.[0];
      const photo: Photo | null = hit ? {
        src: hit.urls.raw + '&w=720&h=420&fit=crop&q=70&fm=jpg', author: String(hit.user?.name ?? 'Unsplash'),
        authorUrl: utm(hit.user?.links?.html ?? 'https://unsplash.com'), photoUrl: utm(hit.links?.html ?? 'https://unsplash.com'),
      } : null;
      // Unsplash demande de signaler l'utilisation d'une photo via son lien de téléchargement.
      if (hit?.links?.download_location) fetch(hit.links.download_location, { headers: { Authorization: 'Client-ID ' + key } }).catch(() => {});
      await db.from('dish_photos').upsert({ query: q, photo, fetched_at: new Date().toISOString() });
      byQuery.set(q, { query: q, photo, fetched_at: new Date().toISOString() });
    } catch { /* plat suivant */ }
  }

  const photos: Record<string, Photo> = {};
  for (const [dish, q] of Object.entries(wanted)) { const p = byQuery.get(q)?.photo; if (p) photos[dish] = p as Photo; }
  if (!key) console.error('Secret UNSPLASH_ACCESS_KEY absent.');
  return json({ photos, missingKey: !key, unsplashStatus });
});
