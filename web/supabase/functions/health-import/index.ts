// Import Santé → My Thirties : le raccourci iPhone envoie les nuits (Sleep Cycle, montre…), les pas, les séances et les règles lus dans l'app Santé.
// Déployer avec la vérification JWT désactivée (Raccourcis n'a pas de session) :
//   supabase functions deploy health-import --no-verify-jwt
// L'accès est protégé par le jeton secret du lien (64 caractères hexadécimaux, table health_imports).
// Secrets : SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY (fournis automatiquement par Supabase).
import { createClient } from 'npm:@supabase/supabase-js@2';
import { nightsFrom, parseSamples } from './sleep.ts';
import { parseExtra } from './extra.ts';

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
  const extra = parseExtra(body);
  const steps = extra.steps.slice(-31), workouts = extra.workouts.slice(-60), periods = extra.periods.slice(-6);
  if (!nights.length && !steps.length && !workouts.length && !periods.length) return text('Aucune donnée reconnue dans ce qui a été envoyé.');
  const uid = link.user_id;
  const upsertDay = async (kind: string, module: string, date: string, title: string, patch: (prev: Record<string, unknown>) => Record<string, unknown>) => {
    const { data: found } = await db.from('entries').select('id,data').eq('user_id', uid).eq('kind', kind).eq('entry_date', date).limit(1).maybeSingle();
    const prev = (found?.data ?? {}) as Record<string, unknown>;
    const data = { ...prev, date, ...patch(prev) };
    const { error } = found ? await db.from('entries').update({ data }).eq('id', found.id).eq('user_id', uid)
      : await db.from('entries').insert({ user_id: uid, module, kind, title, entry_date: date, data });
    if (error) throw error;
  };
  try {
    // Les heures mesurées par l'analyse de nuit de l'app restent prioritaires.
    for (const n of nights) await upsertDay('sommeil', 'sante', n.date, 'Sommeil · ' + n.date, (prev) => ({ ...(prev.analysis ? {} : { bed: n.bed, wake: n.wake }), health: n }));
    for (const s of steps) await upsertDay('daily', 'equilibre', s.date, 'Mon jour · ' + s.date, () => ({ steps: s.steps }));
    if (workouts.length) {
      const { data: known } = await db.from('entries').select('data').eq('user_id', uid).eq('kind', 'session').gte('entry_date', workouts[0]!.date);
      const seen = new Set((known ?? []).map((r) => String((r.data as Record<string, unknown>)?.healthId ?? '')));
      for (const w of workouts.filter((x) => !seen.has(x.id))) {
        const { error } = await db.from('entries').insert({ user_id: uid, module: 'sport', kind: 'session', title: w.discipline + ' · ' + w.minutes + ' min', entry_date: w.date,
          data: { date: w.date, time: w.time, discipline: w.discipline, duration: String(w.minutes), source: 'Santé' + (w.source ? ' · ' + w.source : ''), healthId: w.id } });
        if (error) throw error;
      }
    }
    for (const p of periods) {
      const from = new Date(Date.parse(p.start + 'T12:00:00Z') - 4 * 86_400_000).toISOString().slice(0, 10), to = new Date(Date.parse(p.start + 'T12:00:00Z') + 4 * 86_400_000).toISOString().slice(0, 10);
      const { data: near } = await db.from('entries').select('id,data').eq('user_id', uid).eq('kind', 'cycle').gte('entry_date', from).lte('entry_date', to).limit(1).maybeSingle();
      const { error } = near
        ? await db.from('entries').update({ data: { ...(near.data as Record<string, unknown>), endDate: p.end, ...((near.data as Record<string, unknown>)?.flow || !p.flow ? {} : { flow: p.flow }) } }).eq('id', near.id).eq('user_id', uid)
        : await db.from('entries').insert({ user_id: uid, module: 'sante', kind: 'cycle', title: 'Règles', entry_date: p.start, data: { date: p.start, endDate: p.end, ...(p.flow ? { flow: p.flow } : {}), source: 'Santé' } });
      if (error) throw error;
    }
  } catch { return text('Erreur temporaire, réessaie plus tard.', 502); }
  await db.from('health_imports').update({ imported_at: new Date().toISOString() }).eq('user_id', uid);
  const parts = [
    nights.length ? nights.length + ' nuit' + (nights.length > 1 ? 's' : '') : '',
    steps.length ? 'pas de ' + steps.length + ' jour' + (steps.length > 1 ? 's' : '') : '',
    workouts.length ? workouts.length + ' séance' + (workouts.length > 1 ? 's' : '') : '',
    periods.length ? 'règles' : '',
  ].filter(Boolean);
  return text('My Thirties : ' + parts.join(', ') + ' importé' + (parts.length > 1 ? 's' : '') + '.');
});
