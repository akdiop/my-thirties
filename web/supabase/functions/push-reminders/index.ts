// Rappels push de My Thirties (même app fermée). Appelée toutes les 5 minutes par pg_cron ({ action: 'run' }).
// Autres actions : 'key' (clé publique VAPID pour abonner un appareil) et 'test' (notification de test, session requise).
// Les clés VAPID sont générées au premier appel et gardées dans la table push_keys (accessible seulement à la clé de service).
// Chaque rappel n'est envoyé qu'une fois (table push_log). Le contenu envoyé se limite à un titre et une phrase.
// Déployer avec la vérification JWT désactivée : le minuteur pg_cron n'a pas de session ; 'test' vérifie lui-même la session.
// Secrets : SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY (fournis par Supabase). Facultatif : PUSH_SUBJECT.
import { createClient } from 'npm:@supabase/supabase-js@2';
import webpush from 'npm:web-push@3.6.7';
import { CalculationMethod, Coordinates, Madhab, PrayerTimes } from 'npm:adhan@4.4.3';
import { suppStatus } from './supplements.ts';
import { isEve, writingWindow, type CarnetSettings } from './carnet.ts';
import { wirdPace, wirdSlots } from './wird.ts';

type Prefs = { morning?: { on?: boolean; time?: string }; evening?: { on?: boolean; time?: string }; habits?: { on?: boolean; time?: string };
  agenda?: { on?: boolean; minutes?: number }; weekly?: { on?: boolean; day?: number; time?: string }; supplements?: { on?: boolean };
  plan?: { on?: boolean; time?: string }; birthdays?: { on?: boolean; time?: string };
  prayers?: { on?: boolean; minutes?: number }; fasting?: { on?: boolean; time?: string }; water?: { on?: boolean; time?: string }; carnet?: { on?: boolean; time?: string }; wird?: { on?: boolean }; gratitude?: { on?: boolean; time?: string } };
type Row = { id: string; module: string; kind: string; title: string; entry_date: string | null; data: Record<string, unknown> };
const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info', 'Access-Control-Allow-Methods': 'POST, OPTIONS' };
const json = (d: unknown, status = 200) => new Response(JSON.stringify(d), { status, headers: { ...cors, 'Content-Type': 'application/json' } });
const WINDOW = 10; // minutes : un rappel part s'il est dû depuis moins de 10 min (le minuteur passe toutes les 5 min)
const mins = (t: string) => { const m = /^(\d{2}):(\d{2})$/.exec(t); return m ? Number(m[1]) * 60 + Number(m[2]) : -1; };
const due = (now: number, at: number) => at >= 0 && now >= at && now < at + WINDOW;

/** Date, minutes depuis minuit et jour de la semaine (0 = dimanche) dans le fuseau de l'utilisatrice. */
function localNow(tz: string) {
  let zone = 'Africa/Dakar';
  try { new Intl.DateTimeFormat('fr', { timeZone: tz }); zone = tz; } catch { /* fuseau par défaut */ }
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-CA', { timeZone: zone, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', weekday: 'short', hourCycle: 'h23' })
    .formatToParts(new Date()).map((x) => [x.type, x.value]));
  return { date: `${p.year}-${p.month}-${p.day}`, minutes: Number(p.hour) * 60 + Number(p.minute), weekday: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(p.weekday), zone };
}
// Horaires de prière : même calcul que l'app (bibliothèque adhan), à partir de la position enregistrée une fois.
const PRAYER_NAMES = [['fajr', 'Fajr'], ['dhuhr', 'Dhuhr'], ['asr', 'Asr'], ['maghrib', 'Maghrib'], ['isha', 'Isha']] as const;
function prayerMinutes(d: Record<string, unknown>, date: string, zone: string) {
  const lat = Number(d.lat), lon = Number(d.lon);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return [];
  const m = String(d.method ?? 'mwl');
  const p = m === 'egypt' ? CalculationMethod.Egyptian() : m === 'makkah' ? CalculationMethod.UmmAlQura() : m === 'isna' ? CalculationMethod.NorthAmerica()
    : m === 'karachi' ? CalculationMethod.Karachi() : m === 'france' ? Object.assign(CalculationMethod.Other(), { fajrAngle: 12, ishaAngle: 12 }) : CalculationMethod.MuslimWorldLeague();
  p.madhab = d.hanafi === true || d.hanafi === 'true' ? Madhab.Hanafi : Madhab.Shafi;
  const [y, mo, da] = date.split('-').map(Number);
  const t = new PrayerTimes(new Coordinates(lat, lon), new Date(Date.UTC(y!, mo! - 1, da!, 12)), p);
  const hm = (x: Date) => { const q = Object.fromEntries(new Intl.DateTimeFormat('en-GB', { timeZone: zone, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(x).map((z) => [z.type, z.value])); return q.hour + ':' + q.minute; };
  return PRAYER_NAMES.map(([k, name]) => ({ name, time: hm(t[k]) }));
}
// Jeûnes recommandés et dates marquantes (calendrier Umm al-Qura), rappelés la veille au soir.
const hijri = (iso: string) => { const q = Object.fromEntries(new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', { day: 'numeric', month: 'numeric', timeZone: 'UTC' }).formatToParts(new Date(iso + 'T12:00:00Z')).map((x) => [x.type, x.value])); return { day: parseInt(q.day!, 10), month: parseInt(q.month!, 10) }; };
function fastingFor(iso: string) {
  const h = hijri(iso), wd = new Date(iso + 'T12:00:00Z').getUTCDay();
  const special: Record<string, string> = { '9-12': 'Jour de ‘Arafat : jeûne recommandé', '10-1': 'Achoura : jeûne recommandé', '9-1': 'Tassou‘a (veille d’Achoura) : jeûne recommandé', '1-9': 'Début du Ramadan', '1-10': 'Aïd al-Fitr (Korité)', '10-12': 'Aïd al-Adha (Tabaski)' };
  const key = special[h.day + '-' + h.month];
  if (key) return key;
  if (h.month === 9 || (h.month === 10 && h.day === 1) || (h.month === 12 && h.day >= 10 && h.day <= 13)) return '';
  if (h.day >= 13 && h.day <= 15) return 'Jour blanc (' + h.day + ') : jeûne recommandé';
  if (wd === 1) return 'Jeûne du lundi (sunna)';
  if (wd === 4) return 'Jeûne du jeudi (sunna)';
  return '';
}

const recurring = (e: Row) => e.kind === 'routine' || ['Quotidienne', 'Hebdomadaire'].includes(String(e.data.frequency));
const doneOn = (e: Row, d: string) => recurring(e) ? Boolean((e.data.completions as Record<string, boolean> | undefined)?.[d]) : e.data.completed === true;
function occursOn(e: Row, d: string, weekday: number) {
  const origin = e.entry_date ?? String(e.data.date ?? '');
  if (!origin) return false;
  if (e.data.frequency === 'Quotidienne' && d >= origin) return true;
  if (e.data.frequency === 'Hebdomadaire' && d >= origin && new Date(origin + 'T12:00:00Z').getUTCDay() === weekday) return true;
  const end = typeof e.data.endDate === 'string' ? e.data.endDate : '';
  return origin === d || Boolean(end && d >= origin && d <= end);
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
  if (request.method !== 'POST') return json({ error: 'Méthode interdite.' }, 405);
  const url = Deno.env.get('SUPABASE_URL'), anon = Deno.env.get('SUPABASE_ANON_KEY'), service = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!url || !anon || !service) return json({ error: 'Configuration manquante.' }, 503);
  const db = createClient(url, service, { auth: { persistSession: false, autoRefreshToken: false } });
  let action = 'run';
  try { const b = await request.json(); if (['key', 'test', 'run'].includes(b?.action)) action = b.action; } catch { /* run */ }

  // Clés VAPID : créées une seule fois, la clé privée ne quitte jamais le serveur.
  let { data: keys } = await db.from('push_keys').select('public_key,private_key').eq('id', 1).maybeSingle();
  if (!keys) {
    const k = webpush.generateVAPIDKeys();
    await db.from('push_keys').insert({ id: 1, public_key: k.publicKey, private_key: k.privateKey });
    ({ data: keys } = await db.from('push_keys').select('public_key,private_key').eq('id', 1).maybeSingle());
  }
  if (!keys) return json({ error: 'Clés indisponibles.' }, 503);
  if (action === 'key') return json({ publicKey: keys.public_key });
  webpush.setVapidDetails(Deno.env.get('PUSH_SUBJECT') ?? 'mailto:rappels@my-thirties.app', keys.public_key, keys.private_key);

  const send = async (userId: string, payload: { title: string; body: string; url: string; tag: string }) => {
    const { data: subs } = await db.from('push_subscriptions').select('endpoint,subscription').eq('user_id', userId);
    let sent = 0;
    for (const s of subs ?? []) {
      try { await webpush.sendNotification(s.subscription, JSON.stringify(payload), { TTL: 3600 }); sent++; }
      catch (e) { const code = (e as { statusCode?: number }).statusCode; if (code === 404 || code === 410) await db.from('push_subscriptions').delete().eq('endpoint', s.endpoint); }
    }
    return sent;
  };

  if (action === 'test') {
    const user = createClient(url, anon, { global: { headers: { Authorization: request.headers.get('authorization') ?? '' } }, auth: { persistSession: false } });
    const { data: me } = await user.auth.getUser((request.headers.get('authorization') ?? '').replace(/^Bearer\s+/i, ''));
    if (!me?.user) return json({ error: 'Session invalide.' }, 401);
    const { data: owner } = await user.rpc('is_app_owner');
    if (owner !== true) return json({ error: 'Accès refusé.' }, 403);
    return json({ sent: await send(me.user.id, { title: 'Notifications activées', body: 'Tes rappels arriveront bien sur cet appareil.', url: '/', tag: 'test' }) });
  }

  // Tournée du minuteur : chaque utilisatrice avec au moins un appareil abonné.
  const { data: users } = await db.from('notification_prefs').select('user_id,prefs,tz');
  let total = 0;
  for (const u of users ?? []) {
    const { count } = await db.from('push_subscriptions').select('endpoint', { count: 'exact', head: true }).eq('user_id', u.user_id);
    if (!count) continue;
    const p = (u.prefs ?? {}) as Prefs, now = localNow(u.tz);
    const queue: { key: string; title: string; body: string; url: string }[] = [];
    const { data: rows } = await db.from('entries').select('id,module,kind,title,entry_date,data').eq('user_id', u.user_id)
      .in('kind', ['daily', 'habit', 'task', 'event', 'appointment', 'routine', 'complement', 'proche', 'prayer_settings', 'cycle', 'carnet_reglages', 'wird', 'gratitude_jour']);
    const list = (rows ?? []) as Row[];
    const today = list.find((e) => e.kind === 'daily' && e.entry_date === now.date);

    if (p.morning?.on !== false && due(now.minutes, mins(p.morning?.time ?? '08:00')) && !(today?.data.intention || today?.data.mood))
      queue.push({ key: 'morning:' + now.date, title: 'Mon Daily Reset', body: '3 minutes pour poser ton intention du jour.', url: '/?ecran=myday&moment=matin' });
    if (p.evening?.on !== false && due(now.minutes, mins(p.evening?.time ?? '21:00')) && !(today?.data.win || today?.data.tomorrow))
      queue.push({ key: 'evening:' + now.date, title: 'Mon débriefing du soir', body: 'Ta victoire du jour, ce que tu déposes, ton intention pour demain.', url: '/?ecran=myday&moment=soir' });
    // Habitudes prévues aujourd'hui (jours de répétition : 0 = lundi … 6 = dimanche ; aucun = tous les jours).
    const scheduled = (e: Row) => { const d = Array.isArray(e.data.days) ? (e.data.days as unknown[]).map(Number) : []; return !d.length || d.length === 7 || d.includes((now.weekday + 6) % 7); };
    // « Tous les n jours » : attendue quand la dernière fois remonte à n jours ou plus.
    const dayNo = (iso: string) => Math.round(Date.parse(iso + 'T12:00:00Z') / 86_400_000);
    const everyDue = (e: Row) => { const n = Number(e.data.n) || 2, done = (e.data.done ?? {}) as Record<string, boolean>;
      const last = Object.keys(done).filter((d) => done[d] && d < now.date).sort().pop(); return !last || dayNo(now.date) - dayNo(last) >= n; };
    const habitLeft = (e: Row) => e.kind === 'habit' && !(e.data.done as Record<string, boolean> | undefined)?.[now.date]
      && ((e.data.freq ?? 'daily') === 'daily' ? scheduled(e) : e.data.freq === 'every' && everyDue(e));
    for (const e of list.filter((x) => habitLeft(x) && (x.data.remind as { on?: boolean } | undefined)?.on)) {
      const t = mins(String((e.data.remind as { time?: string }).time ?? ''));
      if (due(now.minutes, t)) queue.push({ key: 'habit:' + e.id + ':' + now.date, title: 'Mon habitude', body: e.title.slice(0, 80), url: '/?ecran=habits' });
    }
    if (p.habits?.on !== false && due(now.minutes, mins(p.habits?.time ?? '19:00'))) {
      const left = list.filter(habitLeft);
      if (left.length) queue.push({ key: 'habits:' + now.date, title: 'Mes habitudes', body: left.length === 1 ? 'Il te reste « ' + left[0]!.title + ' » aujourd’hui.' : 'Il te reste ' + left.length + ' habitudes aujourd’hui : ' + left.slice(0, 3).map((e) => e.title).join(', ') + '.', url: '/?ecran=habits' });
    }
    // Compléments : à l'heure choisie, tant que la prise du jour n'est pas cochée et que la cure est en cours.
    if (p.supplements?.on !== false) {
      for (const e of list.filter((x) => x.kind === 'complement' && x.data.remind !== false)) {
        const t = typeof e.data.time === 'string' ? mins(e.data.time) : -1;
        const start = String(e.data.start ?? e.entry_date ?? now.date), days = Number(e.data.days) || 0;
        const n = Math.floor((Date.parse(now.date + 'T12:00:00Z') - Date.parse(start + 'T12:00:00Z')) / 86_400_000) + 1;
        if (t < 0 || n < 1 || (days && n > days) || !suppStatus(e.data, now.date).due) continue;
        if (due(now.minutes, t)) queue.push({ key: 'supp:' + e.id + ':' + now.date, title: 'Mes compléments', body: e.title + (e.data.dose ? ' · ' + String(e.data.dose) : '') + (days ? ' · jour ' + n + '/' + days : ''), url: '/?ecran=complements' });
      }
    }
    if (p.weekly?.on !== false && now.weekday === (p.weekly?.day ?? 0) && due(now.minutes, mins(p.weekly?.time ?? '18:00')))
      queue.push({ key: 'weekly:' + now.date, title: 'Mon bilan de la semaine', body: 'Humeurs, habitudes, victoires : ta semaine t’attend.', url: '/?ecran=bilan' });
    // Dimanche soir : préparer la semaine avec l'assistant (ouvre l'idée « Planifier ma semaine »).
    if (p.plan?.on !== false && now.weekday === 0 && due(now.minutes, mins(p.plan?.time ?? '19:30')))
      queue.push({ key: 'plan:' + now.date, title: 'Préparer ma semaine', body: 'Quelques minutes avec l’assistant pour organiser la semaine qui vient.', url: '/?ecran=assistant&idee=semaine' });
    // Anniversaires : 3 jours avant et le jour J.
    if (p.birthdays?.on !== false && due(now.minutes, mins(p.birthdays?.time ?? '09:00'))) {
      const md = now.date.slice(5), in3 = new Date(Date.parse(now.date + 'T12:00:00Z') + 3 * 86_400_000).toISOString().slice(5, 10);
      const in7 = new Date(Date.parse(now.date + 'T12:00:00Z') + 7 * 86_400_000).toISOString().slice(5, 10);
      for (const e of list.filter((x) => x.kind === 'proche' && x.data.remind !== false)) {
        const day = String(e.data.day ?? '');
        if (day === md) queue.push({ key: 'bday:' + e.id + ':' + now.date, title: 'Anniversaire aujourd’hui', body: 'C’est l’anniversaire de ' + e.title.slice(0, 60) + ' !', url: '/?ecran=proches' });
        else if (day === in3) queue.push({ key: 'bday3:' + e.id + ':' + now.date, title: 'Anniversaire dans 3 jours', body: e.title.slice(0, 60) + (e.data.gifts ? ' · tes idées de cadeaux t’attendent' : ' · pense au cadeau'), url: '/?ecran=proches' });
        else if (day === in7) queue.push({ key: 'bday7:' + e.id + ':' + now.date, title: 'Anniversaire dans une semaine', body: e.title.slice(0, 60) + (e.data.gifts ? ' · tes idées de cadeaux t’attendent' : ' · le temps de trouver une attention'), url: '/?ecran=proches' });
      }
    }
    // Gratitude : le soir, seulement si rien n'a été noté aujourd'hui (ni dans Ma gratitude, ni dans Mon jour).
    if (p.gratitude?.on !== false && due(now.minutes, mins(p.gratitude?.time ?? '21:30'))) {
      const g = list.find((e) => e.kind === 'gratitude_jour' && e.entry_date === now.date)?.data ?? {};
      const any = (v: unknown) => Array.isArray(v) && v.some((x) => String(x).trim());
      if (!any(g.matin) && !any(g.soir) && !any(g.p7) && !any(today?.data.gratitudes))
        queue.push({ key: 'gratitude:' + now.date, title: 'Ma gratitude', body: 'Qu’est-ce que tu gardes de ta journée ? Une ligne suffit.', url: '/?ecran=gratitude' });
    }
    // Objectifs de dhikr : à 4 moments répartis dans la plage choisie, seulement si j'ai du retard.
    if (p.wird?.on !== false) {
      for (const e of list.filter((x) => x.kind === 'wird')) {
        const slot = wirdSlots(e.data).find((m) => due(now.minutes, m));
        if (slot === undefined) continue;
        const pace = wirdPace(e.data, now.date, now.minutes);
        if (!pace.finished && pace.behind > 0)
          queue.push({ key: 'wird:' + e.id + ':' + now.date + ':' + slot, title: 'Mon dhikr du jour', body: e.title.slice(0, 60) + ' · ' + pace.done + ' sur ' + pace.goal + ', vise ' + pace.expected + ' à cette heure.', url: '/?ecran=spiritualite' });
      }
    }
    // Carnet de vœux : la veille de la fenêtre d'écriture, un rappel neutre (sans mention du cycle).
    if (p.carnet?.on !== false && due(now.minutes, mins(p.carnet?.time ?? '20:00'))) {
      const settings = (list.find((e) => e.kind === 'carnet_reglages')?.data ?? {}) as CarnetSettings;
      const starts = list.filter((e) => e.kind === 'cycle' && e.entry_date).map((e) => e.entry_date!);
      if (isEve(writingWindow(starts, settings, now.date), now.date))
        queue.push({ key: 'carnet:' + now.date, title: 'Mon carnet', body: 'Demain, ta page du mois t’attend.', url: '/?ecran=carnet' });
    }
    // Eau : l'après-midi, si l'objectif de 8 verres n'est pas atteint.
    if (p.water?.on !== false && due(now.minutes, mins(p.water?.time ?? '16:00'))) {
      const n = Math.max(0, Number(today?.data.water) || 0);
      if (n < 8) queue.push({ key: 'water:' + now.date, title: 'Un verre d’eau ?', body: n ? n + ' verre' + (n > 1 ? 's' : '') + ' sur 8 aujourd’hui.' : 'Pas encore de verre noté aujourd’hui.', url: '/' });
    }
    // Prières : quelques minutes avant chaque heure (position enregistrée dans Ma spiritualité).
    const ps = list.filter((e) => e.kind === 'prayer_settings').sort((a, b) => String(b.data.updated ?? '').localeCompare(String(a.data.updated ?? '')))[0];
    if (ps && p.prayers?.on !== false) try {
      const before = Math.max(0, Math.min(30, Number(p.prayers?.minutes ?? 5)));
      for (const pr of prayerMinutes(ps.data, now.date, now.zone)) {
        if (due(now.minutes, mins(pr.time) - before)) queue.push({ key: 'prayer:' + pr.name + ':' + now.date, title: pr.name + ' · ' + pr.time,
          body: before ? 'L’heure de ' + pr.name + ' arrive dans ' + before + ' minutes.' : 'C’est l’heure de ' + pr.name + '.', url: '/?ecran=spiritualite' });
      }
    } catch { /* réglages de prière illisibles : les autres rappels partent quand même */ }
    // Jeûnes recommandés : la veille au soir.
    if (p.fasting?.on !== false && due(now.minutes, mins(p.fasting?.time ?? '20:30'))) try {
      const tomorrow = new Date(Date.parse(now.date + 'T12:00:00Z') + 86_400_000).toISOString().slice(0, 10);
      const f = fastingFor(tomorrow);
      if (f) queue.push({ key: 'fast:' + tomorrow, title: 'Demain', body: f + '.', url: '/?ecran=spiritualite' });
    } catch { /* calendrier hégirien indisponible */ }
    if (p.agenda?.on !== false) {
      const before = Math.max(0, Math.min(120, Number(p.agenda?.minutes ?? 15)));
      for (const e of list) {
        const t = typeof e.data.time === 'string' ? mins(e.data.time) : -1;
        if (t < 0 || !['task', 'event', 'appointment', 'routine'].includes(e.kind) || !occursOn(e, now.date, now.weekday) || doneOn(e, now.date)) continue;
        if (due(now.minutes, t - before)) queue.push({ key: 'agenda:' + e.id + ':' + now.date, title: (before ? 'Dans ' + before + ' min · ' : 'Maintenant · ') + String(e.data.time),
          body: e.title.slice(0, 120), url: '/?ecran=agenda' });
      }
    }
    for (const n of queue) {
      const { error } = await db.from('push_log').insert({ user_id: u.user_id, key: n.key });
      if (error) continue; // déjà envoyé
      total += await send(u.user_id, { title: n.title, body: n.body, url: n.url, tag: n.key });
    }
  }
  await db.from('push_log').delete().lt('sent_at', new Date(Date.now() - 14 * 86_400_000).toISOString());
  return json({ sent: total });
});
