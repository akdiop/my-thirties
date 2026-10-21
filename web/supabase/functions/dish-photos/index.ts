// Photos Unsplash pour les recettes, les destinations et les défis. Chaque recherche est mise en cache 30 jours
// dans la table dish_photos (palier gratuit Unsplash : 50 requêtes par heure). Le crédit photographe est renvoyé à l'app.
// L'app envoie { items: { clé: { qs: [{ q, lang }], must: [mots] } } } : les recherches sont essayées dans l'ordre et
// seules les photos dont la description contient un des mots `must` sont retenues (aucune photo plutôt qu'une fausse).
// Secrets : UNSPLASH_ACCESS_KEY (clé « Access Key » de l'application Unsplash), SUPABASE_URL, SUPABASE_ANON_KEY,
// SUPABASE_SERVICE_ROLE_KEY (fournis par Supabase). Vérification JWT activée ; réservé à la propriétaire.
import { createClient } from 'npm:@supabase/supabase-js@2';

type Shot = { src: string; author: string; authorUrl: string; photoUrl: string; text: string; download?: string };
type Item = { qs: { q: string; lang: string }[]; must: string[] };
const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info', 'Access-Control-Allow-Methods': 'POST, OPTIONS' };
const json = (data: unknown, status = 200) => new Response(JSON.stringify(data), { status, headers: { ...cors, 'Content-Type': 'application/json' } });
const utm = (url: string) => url + (url.includes('?') ? '&' : '?') + 'utm_source=my_thirties&utm_medium=referral';
const norm = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[-_]/g, ' ');
const MONTH = 30 * 86_400_000;
const MAX_SEARCHES = 25;
const cacheKey = (q: string, lang: string) => (lang === 'en' ? '' : lang + ':') + q;
/** Choix stable mais varié : deux recettes d'un même plat n'ont pas forcément la même photo. */
const hash = (s: string) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);

function readItems(body: any): Record<string, Item> {
  const out: Record<string, Item> = {};
  const clean = (q: unknown) => typeof q === 'string' ? q.trim().toLowerCase().slice(0, 80) : '';
  // Ancien format { queries: { plat: recherche } } encore envoyé par les versions déjà installées de l'app.
  for (const [key, q] of Object.entries(body?.queries ?? {}).slice(0, 80)) if (clean(q)) out[key.slice(0, 120)] = { qs: [{ q: clean(q), lang: 'en' }], must: [] };
  for (const [key, it] of Object.entries(body?.items ?? {}).slice(0, 60) as [string, any][]) {
    const qs = (Array.isArray(it?.qs) ? it.qs : []).slice(0, 2).map((x: any) => ({ q: clean(x?.q), lang: x?.lang === 'fr' ? 'fr' : 'en' })).filter((x: { q: string }) => x.q);
    const must = (Array.isArray(it?.must) ? it.must : []).filter((m: unknown) => typeof m === 'string').slice(0, 12).map((m: string) => norm(m).slice(0, 40)).filter(Boolean);
    if (qs.length) out[key.slice(0, 120)] = { qs, must };
  }
  return out;
}

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

  let items: Record<string, Item>;
  try { items = readItems(await request.json()); } catch { return json({ error: 'Requête invalide.' }, 400); }

  const db = createClient(url, service, { auth: { persistSession: false, autoRefreshToken: false } });
  const all = [...new Set(Object.values(items).flatMap((it) => it.qs.map((x) => cacheKey(x.q, x.lang))))];
  const { data: cached } = await db.from('dish_photos').select('query,photo,fetched_at').in('query', all);
  const shots = new Map<string, Shot[]>();
  for (const r of cached ?? []) if (Array.isArray(r.photo) && Date.now() - Date.parse(r.fetched_at) < MONTH) shots.set(r.query, r.photo as Shot[]);

  let searches = 0, unsplashStatus = 0, stopped = !key;
  const fresh = new Set<string>();
  const search = async (q: string, lang: string): Promise<Shot[] | null> => {
    const k = cacheKey(q, lang);
    if (shots.has(k)) return shots.get(k)!;
    if (stopped || searches >= MAX_SEARCHES) return null;
    searches++;
    try {
      const res = await fetch('https://api.unsplash.com/search/photos?' + new URLSearchParams({ query: q, lang, per_page: '15', orientation: 'landscape', content_filter: 'high' }),
        { headers: { Authorization: 'Client-ID ' + key, 'Accept-Version': 'v1' }, signal: AbortSignal.timeout(8000) });
      unsplashStatus = res.status;
      if (!res.ok) { console.error('Unsplash a répondu ' + res.status + ' pour « ' + q + ' »'); if ([401, 403, 429].includes(res.status)) stopped = true; return null; }
      const list: Shot[] = ((await res.json())?.results ?? []).map((hit: any) => ({
        src: hit.urls.raw + '&w=720&h=420&fit=crop&q=70&fm=jpg', author: String(hit.user?.name ?? 'Unsplash'),
        authorUrl: utm(hit.user?.links?.html ?? 'https://unsplash.com'), photoUrl: utm(hit.links?.html ?? 'https://unsplash.com'),
        text: norm([hit.alt_description, hit.description, hit.slug].filter(Boolean).join(' ')).slice(0, 400), download: hit.links?.download_location,
      }));
      await db.from('dish_photos').upsert({ query: k, photo: list, fetched_at: new Date().toISOString() });
      shots.set(k, list); fresh.add(k);
      return list;
    } catch { return null; }
  };

  const photos: Record<string, Omit<Shot, 'text' | 'download'>> = {};
  const none: string[] = [];
  for (const [itemKey, it] of Object.entries(items)) {
    let pending = false, found: Shot[] = [], from = '';
    for (const { q, lang } of it.qs) {
      const list = await search(q, lang);
      if (!list) { pending = true; break; }
      from = cacheKey(q, lang);
      found = it.must.length ? list.filter((s) => it.must.some((m) => (' ' + s.text + ' ').includes(m.includes(' ') ? m : ' ' + m))) : list.slice(0, 8);
      if (found.length) break;
    }
    if (found.length) {
      const { text: _t, download, ...shot } = found[hash(itemKey) % Math.min(found.length, 8)];
      photos[itemKey] = shot;
      // Unsplash demande de signaler l'utilisation d'une photo (une fois, quand elle vient d'être trouvée).
      if (download && key && fresh.has(from)) fetch(download, { headers: { Authorization: 'Client-ID ' + key } }).catch(() => {});
    } else if (!pending) none.push(itemKey);
  }
  if (!key) console.error('Secret UNSPLASH_ACCESS_KEY absent.');
  return json({ photos, none, missingKey: !key, unsplashStatus });
});
