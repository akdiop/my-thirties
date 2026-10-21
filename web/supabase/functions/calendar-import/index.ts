// Import iPhone → My Thirties : lit le calendrier iCloud public de la propriétaire et le recopie dans l'Agenda.
// Vérification JWT activée ; toutes les écritures passent par la session de l'utilisatrice (RLS).
// Secrets : SUPABASE_URL, SUPABASE_ANON_KEY (fournis par Supabase).
import { createClient } from 'npm:@supabase/supabase-js@2';

type Ev = { uid: string; title: string; date: string; time: string; endTime: string; location: string; notes: string };
const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info', 'Access-Control-Allow-Methods': 'POST, OPTIONS' };
const json = (data: unknown, status = 200) => new Response(JSON.stringify(data), { status, headers: { ...cors, 'Content-Type': 'application/json' } });
const pad = (n: number) => String(n).padStart(2, '0');
const unescape = (s: string) => s.replace(/\\n/gi, '\n').replace(/\\([,;\\])/g, '$1');
const isoDay = (d: Date) => d.getUTCFullYear() + '-' + pad(d.getUTCMonth() + 1) + '-' + pad(d.getUTCDate());

/** Date et heure locales (dans le fuseau tz) d'une valeur DTSTART/DTEND. */
function when(value: string, params: string, tz: string): { date: string; time: string } | null {
  const m = value.match(/^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})(Z)?)?$/);
  if (!m) return null;
  if (!m[4] || /VALUE=DATE(?!-)/.test(params)) return { date: `${m[1]}-${m[2]}-${m[3]}`, time: '' };
  if (m[7]) { // heure UTC → fuseau de l'utilisatrice
    const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]));
    const parts = Object.fromEntries(new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(d).map((p) => [p.type, p.value]));
    return { date: `${parts.year}-${parts.month}-${parts.day}`, time: `${parts.hour}:${parts.minute}` };
  }
  return { date: `${m[1]}-${m[2]}-${m[3]}`, time: `${m[4]}:${m[5]}` }; // heure locale (TZID) gardée telle quelle
}

/** Lit les VEVENT et développe les répétitions simples (DAILY/WEEKLY/MONTHLY/YEARLY, INTERVAL, COUNT, UNTIL, EXDATE). */
function parse(ics: string, tz: string, from: string, to: string): Ev[] {
  const lines = ics.replace(/\r?\n[ \t]/g, '').split(/\r?\n/);
  const out: Ev[] = [];
  let cur: Record<string, { v: string; p: string }[]> | null = null;
  for (const line of lines) {
    if (line === 'BEGIN:VEVENT') { cur = {}; continue; }
    if (line === 'END:VEVENT' && cur) {
      const get = (k: string) => cur![k]?.[0];
      const uid = get('UID')?.v ?? '';
      const start = get('DTSTART') && when(get('DTSTART')!.v, get('DTSTART')!.p, tz);
      const end = get('DTEND') && when(get('DTEND')!.v, get('DTEND')!.p, tz);
      if (start && uid && !uid.endsWith('@my-thirties') && !cur['RECURRENCE-ID']) {
        const base: Omit<Ev, 'date' | 'uid'> = { title: unescape(get('SUMMARY')?.v ?? 'Événement').slice(0, 170), time: start.time, endTime: end?.time ?? '', location: unescape(get('LOCATION')?.v ?? '').slice(0, 300), notes: unescape(get('DESCRIPTION')?.v ?? '').slice(0, 2000) };
        const ex = new Set((cur['EXDATE'] ?? []).flatMap((e) => e.v.split(',')).map((v) => when(v, '', tz)?.date).filter(Boolean));
        const rule = Object.fromEntries((get('RRULE')?.v ?? '').split(';').filter(Boolean).map((kv) => kv.split('=')));
        const freq = rule.FREQ as string | undefined;
        if (!freq) { if (start.date >= from && start.date <= to) out.push({ ...base, uid, date: start.date }); }
        else if (['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'].includes(freq)) {
          const step = Math.max(1, Number(rule.INTERVAL) || 1);
          const count = Number(rule.COUNT) || Infinity;
          const until = rule.UNTIL ? when(rule.UNTIL, '', tz)?.date ?? to : to;
          const d0 = new Date(start.date + 'T12:00:00Z');
          for (let i = 0, n = 0; i < 1000 && n < count; i++) {
            const d = new Date(d0);
            if (freq === 'DAILY') d.setUTCDate(d.getUTCDate() + i * step);
            if (freq === 'WEEKLY') d.setUTCDate(d.getUTCDate() + 7 * i * step);
            if (freq === 'MONTHLY') d.setUTCMonth(d.getUTCMonth() + i * step);
            if (freq === 'YEARLY') d.setUTCFullYear(d.getUTCFullYear() + i * step);
            const day = isoDay(d);
            if (day > until || day > to) break;
            n++;
            if (day >= from && !ex.has(day)) out.push({ ...base, uid: uid + '#' + day, date: day });
          }
        }
      }
      cur = null; continue;
    }
    if (cur) {
      const i = line.indexOf(':');
      if (i < 0) continue;
      const [name, ...params] = line.slice(0, i).split(';');
      (cur[name] ??= []).push({ v: line.slice(i + 1), p: params.join(';') });
    }
  }
  return out;
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
  if (request.method !== 'POST') return json({ error: 'Méthode interdite.' }, 405);
  const auth = request.headers.get('authorization') ?? '';
  const url = Deno.env.get('SUPABASE_URL'), anon = Deno.env.get('SUPABASE_ANON_KEY');
  if (!url || !anon) return json({ error: 'Configuration manquante.' }, 503);
  const db = createClient(url, anon, { global: { headers: { Authorization: auth } }, auth: { persistSession: false, autoRefreshToken: false } });
  const { data: user } = await db.auth.getUser(auth.replace(/^Bearer\s+/i, ''));
  if (!user?.user) return json({ error: 'Session invalide.' }, 401);
  const { data: owner } = await db.rpc('is_app_owner');
  if (owner !== true) return json({ error: 'Accès refusé.' }, 403);
  let tz = 'Africa/Dakar';
  try { const body = await request.json(); if (typeof body?.tz === 'string' && body.tz.length < 60) { new Intl.DateTimeFormat('fr', { timeZone: body.tz }); tz = body.tz; } } catch { /* fuseau par défaut */ }
  const { data: feed } = await db.from('calendar_feeds').select('import_url').maybeSingle();
  if (!feed?.import_url) return json({ error: 'Aucun calendrier iPhone relié.' }, 400);
  const source = feed.import_url.replace(/^webcal:/i, 'https:');
  let ics = '';
  try {
    const res = await fetch(source, { headers: { Accept: 'text/calendar' }, signal: AbortSignal.timeout(15000) });
    if (!res.ok) return json({ error: 'Le calendrier iPhone ne répond pas (' + res.status + ').' }, 502);
    ics = (await res.text()).slice(0, 5_000_000);
  } catch { return json({ error: 'Impossible de lire le calendrier iPhone.' }, 502); }
  if (!ics.includes('BEGIN:VCALENDAR')) return json({ error: 'Ce lien n’est pas un calendrier.' }, 400);

  const today = new Date();
  const from = isoDay(new Date(today.getTime() - 30 * 86_400_000)), to = isoDay(new Date(today.getTime() + 365 * 86_400_000));
  const events = parse(ics, tz, from, to).slice(0, 1500);
  const { data: existing } = await db.from('entries').select('id,title,entry_date,data').eq('module', 'quotidien').eq('kind', 'event').eq('data->>source', 'iphone');
  const byUid = new Map((existing ?? []).map((e) => [String(e.data?.externalUid), e]));
  let added = 0, updated = 0, removed = 0;
  for (const ev of events) {
    const data = { source: 'iphone', externalUid: ev.uid, date: ev.date, time: ev.time, endTime: ev.endTime, location: ev.location, notes: ev.notes };
    const old = byUid.get(ev.uid);
    byUid.delete(ev.uid);
    if (!old) { const { error } = await db.from('entries').insert({ module: 'quotidien', kind: 'event', title: ev.title, entry_date: ev.date, data }); if (!error) added++; }
    else if (old.title !== ev.title || old.entry_date !== ev.date || JSON.stringify({ ...old.data }) !== JSON.stringify(data)) {
      const { error } = await db.from('entries').update({ title: ev.title, entry_date: ev.date, data }).eq('id', old.id); if (!error) updated++;
    }
  }
  // Événements supprimés sur l'iPhone (dans la fenêtre importée) : retirés de l'Agenda.
  for (const old of byUid.values()) if (old.entry_date && old.entry_date >= from && old.entry_date <= to) {
    const { error } = await db.from('entries').delete().eq('id', old.id); if (!error) removed++;
  }
  await db.from('calendar_feeds').update({ imported_at: new Date().toISOString() }).eq('user_id', user.user.id);
  return json({ added, updated, removed, total: events.length });
});
