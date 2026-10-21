// Flux iCalendar privé pour l'abonnement « Calendrier » de l'iPhone (sens My Thirties → iPhone).
// Déployer avec la vérification JWT désactivée (l'app Calendrier n'envoie pas de jeton) :
//   supabase functions deploy calendar-feed --no-verify-jwt
// L'accès est protégé par le jeton secret du lien (64 caractères hexadécimaux, table calendar_feeds).
// Secrets utilisés : SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY (fournis automatiquement par Supabase).
import { createClient } from 'npm:@supabase/supabase-js@2';

const KINDS = ['task', 'routine', 'event', 'appointment', 'meal'];
const escape = (s: string) => s.replace(/\\/g, '\\\\').replace(/\r?\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');
const pad = (n: number) => String(n).padStart(2, '0');
const day = (d: string) => d.replace(/-/g, '');
const nextDay = (d: string) => { const x = new Date(d + 'T12:00:00Z'); x.setUTCDate(x.getUTCDate() + 1); return x.toISOString().slice(0, 10); };
const local = (d: string, t: string) => day(d) + 'T' + t.replace(':', '') + '00';
const plus = (d: string, t: string, minutes: number) => {
  const [h, m] = t.split(':').map(Number);
  const total = h * 60 + m + minutes;
  const date = total >= 1440 ? nextDay(d) : d;
  return local(date, pad(Math.floor(total % 1440 / 60)) + ':' + pad(total % 60));
};
// Heures « flottantes » (sans fuseau) : l'iPhone les affiche à l'heure locale, comme dans l'app.
const fold = (line: string) => { const out: string[] = []; let r = line; while (r.length > 70) { out.push(r.slice(0, 70)); r = ' ' + r.slice(70); } out.push(r); return out.join('\r\n'); };

type Row = { id: string; kind: string; title: string; entry_date: string; data: Record<string, unknown> };

function ics(rows: Row[]) {
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const events = rows.map((e) => {
    const time = typeof e.data.time === 'string' && /^([01]\d|2[0-3]):[0-5]\d$/.test(e.data.time) ? e.data.time : null;
    const freq = e.data.frequency === 'Quotidienne' ? 'RRULE:FREQ=DAILY' : e.data.frequency === 'Hebdomadaire' ? 'RRULE:FREQ=WEEKLY' : '';
    const lines = ['BEGIN:VEVENT', 'UID:' + e.id + '@my-thirties', 'DTSTAMP:' + stamp,
      time ? 'DTSTART:' + local(e.entry_date, time) : 'DTSTART;VALUE=DATE:' + day(e.entry_date),
      time ? 'DTEND:' + plus(e.entry_date, time, 30) : 'DTEND;VALUE=DATE:' + day(nextDay(e.entry_date)),
      'SUMMARY:' + escape(e.title)];
    if (typeof e.data.location === 'string' && e.data.location) lines.push('LOCATION:' + escape(e.data.location));
    if (typeof e.data.notes === 'string' && e.data.notes) lines.push('DESCRIPTION:' + escape(e.data.notes));
    if (freq) lines.push(freq);
    lines.push('END:VEVENT');
    return lines.map(fold).join('\r\n');
  });
  return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//My Thirties//Agenda//FR', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
    'X-WR-CALNAME:My Thirties', 'REFRESH-INTERVAL;VALUE=DURATION:PT1H', 'X-PUBLISHED-TTL:PT1H',
    ...events, 'END:VCALENDAR'].join('\r\n') + '\r\n';
}

Deno.serve(async (request) => {
  if (request.method !== 'GET') return new Response('Méthode interdite.', { status: 405 });
  const token = new URL(request.url).searchParams.get('token') ?? '';
  if (!/^[0-9a-f]{64}$/.test(token)) return new Response('Lien invalide.', { status: 404 });
  const url = Deno.env.get('SUPABASE_URL');
  const service = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!url || !service) return new Response('Configuration manquante.', { status: 503 });
  const db = createClient(url, service, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data: feed } = await db.from('calendar_feeds').select('user_id').eq('token', token).maybeSingle();
  if (!feed) return new Response('Lien invalide.', { status: 404 });
  const { data, error } = await db.from('entries').select('id,kind,title,entry_date,data')
    .eq('user_id', feed.user_id).in('kind', KINDS).not('entry_date', 'is', null).limit(2000);
  if (error) return new Response('Erreur temporaire.', { status: 502 });
  // Les événements venus de l'iPhone n'y sont pas renvoyés (sinon ils apparaîtraient en double).
  const rows = ((data ?? []) as Row[]).filter((e) => e.data?.source !== 'iphone');
  return new Response(ics(rows), { headers: {
    'Content-Type': 'text/calendar; charset=utf-8', 'Cache-Control': 'private, max-age=900',
    'Content-Disposition': 'inline; filename="my-thirties.ics"' } });
});
