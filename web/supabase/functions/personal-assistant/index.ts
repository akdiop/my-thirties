// Deploy only to the dedicated My Thirties Supabase project.
// Secrets: OPENAI_API_KEY, SUPABASE_URL, SUPABASE_ANON_KEY, APP_ORIGIN.
// JWT verification must stay enabled. No service-role key is needed.
import { createClient } from 'npm:@supabase/supabase-js@2';

const json = (data: unknown, status = 200, origin = '') => new Response(JSON.stringify(data), {
  status, headers: { 'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store', 'Vary': 'Origin', ...(origin ? { 'Access-Control-Allow-Origin': origin } : {}) },
});

Deno.serve(async (request) => {
  const allowedOrigin = Deno.env.get('APP_ORIGIN') ?? '';
  const origin = request.headers.get('origin') ?? '';
  const cors = Boolean(allowedOrigin && origin === allowedOrigin) ? origin : '';
  if (request.method === 'OPTIONS') return new Response(null, {
    status: cors ? 204 : 403,
    headers: { ...(cors ? { 'Access-Control-Allow-Origin': cors } : {}), 'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info', 'Vary': 'Origin' },
  });
  if (request.method !== 'POST') return json({ error: 'Méthode interdite.' }, 405, cors);
  if (!cors) return json({ error: 'Origine non autorisée.' }, 403);
  const bearer = request.headers.get('authorization') ?? '';
  if (!/^Bearer\s+\S+$/i.test(bearer)) return json({ error: 'Authentification requise.' }, 401, cors);
  const key = Deno.env.get('OPENAI_API_KEY');
  const url = Deno.env.get('SUPABASE_URL');
  const anon = Deno.env.get('SUPABASE_ANON_KEY');
  if (!key || !url || !anon) return json({ error: 'Assistant indisponible : configuration manquante.' }, 503, cors);
  const supabase = createClient(url, anon, {
    global: { headers: { Authorization: bearer } }, auth: { persistSession: false, autoRefreshToken: false },
  });
  const token = bearer.replace(/^Bearer\s+/i, '');
  const { data: user, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user.user) return json({ error: 'Session invalide.' }, 401, cors);
  const { data: owner, error: ownerError } = await supabase.rpc('is_app_owner');
  if (ownerError || owner !== true) return json({ error: 'Accès refusé.' }, 403, cors);
  let prompt = '';
  let agenda: { date: string; title: string; time: string }[] = [];
  try {
    if (Number(request.headers.get('content-length') || 0) > 5000) throw new Error('Too large');
    const body = await request.json();
    if (typeof body?.message !== 'string') throw new Error('Invalid');
    prompt = body.message.trim();
    if (Array.isArray(body.agenda)) {
      agenda = body.agenda.slice(0, 8).filter((item: any) => item && typeof item.date === 'string' && typeof item.title === 'string' && typeof item.time === 'string' && item.title.length <= 120 && item.date.length === 10 && item.time.length <= 5).map((item: any) => ({ date: item.date, title: item.title, time: item.time }));
    }
    if (prompt.length < 2 || prompt.length > 1200) throw new Error('Invalid');
  } catch { return json({ error: 'Question invalide (2 à 1200 caractères).' }, 400, cors); }
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST', headers: { 'Authorization': 'Bearer ' + key, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: Deno.env.get('OPENAI_MODEL') || 'gpt-4.1-mini',
        store: false, max_completion_tokens: 500,
        messages: [
          { role: 'system', content: 'Tu es l’assistant personnel de My Thirties. Réponds en français, clairement et brièvement. Aide à organiser la vie quotidienne, les apprentissages, les voyages et les loisirs. Tu ne vois aucune donnée personnelle de l’application. Ne prétends pas avoir consulté le calendrier, les finances, la santé ou les journaux. N’exécute aucune action. Ne donne pas de diagnostic médical ni de conseil financier personnalisé. Pour une demande sensible, invite à consulter une personne compétente. N’invente pas de faits récents.' },
          { role: 'user', content: prompt + (agenda.length ? '\n\nAgenda sélectionné : ' + JSON.stringify(agenda) : '') },
        ],
      }),
    });
    if (!response.ok) return json({ error: 'Le fournisseur IA n’a pas répondu.' }, 502, cors);
    const data = await response.json();
    const answer = data?.choices?.[0]?.message?.content;
    if (typeof answer !== 'string' || !answer.trim()) return json({ error: 'Réponse indisponible.' }, 502, cors);
    return json({ answer: answer.slice(0, 5000) }, 200, cors);
  } catch { return json({ error: 'Erreur temporaire du service.' }, 502, cors); }
});
