// Import Santé → My Thirties : le raccourci iPhone envoie les nuits (Sleep Cycle, montre…) lues dans l'app Santé.
// Déployer avec la vérification JWT désactivée (Raccourcis n'a pas de session) :
//   supabase functions deploy health-import --no-verify-jwt
// L'accès est protégé par le jeton secret du lien (64 caractères hexadécimaux, table health_imports).
// Secrets : SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY (fournis automatiquement par Supabase).
import { createClient } from 'npm:@supabase/supabase-js@2';
import { nightsFrom, parseSamples } from './sleep.ts';

const text = (body: string, status = 200) => new Response(body, { status, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });

Deno.serve(async (request) => {
  if (request.method !== 'POST') return text('Méthode interdite.', 405);
  const token = new URL(request.url).searchParams.get('token') ?? '';
  if (!/^[0-9a-f]{64}$/.test(token)) return text('Lien invalide.', 404);
  const body = await request.text();
  if (body.length > 300_000) return text('Trop de données : limite le raccourci aux 2 derniers jours.', 413);
  const url = Deno.env.get('SUPABASE_URL');
  const service = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!url || !service) return text('Configuration manquante.', 503);
  const db = createClient(url, service, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data: link } = await db.from('health_imports').select('user_id').eq('token', token).maybeSingle();
  if (!link) return text('Lien invalide.', 404);

  const nights = nightsFrom(parseSamples(body)).slice(-14);
  if (!nights.length) return text('Aucune nuit trouvée dans les données envoyées.');
  for (const n of nights) {
    const { data: found } = await db.from('entries').select('id,data').eq('user_id', link.user_id).eq('kind', 'sommeil').eq('entry_date', n.date).limit(1).maybeSingle();
    const prev = (found?.data ?? {}) as Record<string, unknown>;
    // Les heures mesurées par l'analyse de nuit de l'app restent prioritaires.
    const times = prev.analysis ? {} : { bed: n.bed, wake: n.wake };
    const data = { ...prev, date: n.date, ...times, health: n };
    const { error } = found
      ? await db.from('entries').update({ data }).eq('id', found.id).eq('user_id', link.user_id)
      : await db.from('entries').insert({ user_id: link.user_id, module: 'sante', kind: 'sommeil', title: 'Sommeil · ' + n.date, entry_date: n.date, data });
    if (error) return text('Erreur temporaire, réessaie plus tard.', 502);
  }
  await db.from('health_imports').update({ imported_at: new Date().toISOString() }).eq('user_id', link.user_id);
  const last = nights[nights.length - 1]!;
  return text(`My Thirties : ${nights.length} nuit${nights.length > 1 ? 's' : ''} importée${nights.length > 1 ? 's' : ''}. Dernière : ${Math.floor(last.asleep / 60)} h ${String(last.asleep % 60).padStart(2, '0')} de sommeil.`);
});
