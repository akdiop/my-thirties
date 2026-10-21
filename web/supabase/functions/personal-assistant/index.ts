// Deploy only to the dedicated My Thirties Supabase project.
// Secrets : GEMINI_API_KEY (gratuit, clé Google AI Studio) — ou AI_API_KEY + AI_BASE_URL pour une autre API
// compatible OpenAI (Groq, Mistral…), ou OPENAI_API_KEY —, SUPABASE_URL, SUPABASE_ANON_KEY, APP_ORIGIN.
// Optionnels : AI_MODEL, AI_FALLBACK_MODEL (liste séparée par des virgules).
// JWT verification must stay enabled. No service-role key is needed.
import { createClient } from 'npm:@supabase/supabase-js@2';

const OPENAI_BASE_URL = 'https://api.openai.com/v1';
const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/openai';

/** Fournisseur choisi par les secrets : Gemini gratuit par défaut, OpenAI si seule sa clé existe. */
function aiConfig() {
  const explicit = Deno.env.get('AI_API_KEY')?.trim();
  const gemini = Deno.env.get('GEMINI_API_KEY')?.trim();
  const openai = Deno.env.get('OPENAI_API_KEY')?.trim();
  const key = explicit || gemini || openai || '';
  const openaiOnly = !explicit && !gemini && Boolean(openai);
  const baseUrl = (Deno.env.get('AI_BASE_URL')?.trim() || (openaiOnly ? OPENAI_BASE_URL : GEMINI_BASE_URL)).replace(/\/+$/, '');
  const model = Deno.env.get('AI_MODEL')?.trim() || (openaiOnly ? 'gpt-4.1-mini' : 'gemini-3.1-flash-lite');
  // Le palier gratuit de Gemini change souvent de quotas : on essaie des modèles de secours sur 404/429/5xx.
  const fallbacks = openaiOnly ? [] : [...new Set([Deno.env.get('AI_FALLBACK_MODEL') ?? '', 'gemini-flash-lite-latest', 'gemini-flash-latest']
    .join(',').split(',').map((m) => m.trim()).filter((m) => m && m !== model))];
  return { key, baseUrl, model, fallbacks };
}

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
  const { key, baseUrl, model, fallbacks } = aiConfig();
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
    if (Number(request.headers.get('content-length') || 0) > 7000) throw new Error('Too large');
    const body = await request.json();
    if (typeof body?.message !== 'string') throw new Error('Invalid');
    prompt = body.message.trim();
    if (body.agenda !== undefined && (!Array.isArray(body.agenda) || body.agenda.length > 8)) throw new Error('Invalid agenda');
    if (Array.isArray(body.agenda)) {
      agenda = body.agenda.slice(0, 8).filter((item: any) => item && typeof item.date === 'string' && typeof item.title === 'string' && typeof item.time === 'string' && item.title.length <= 120 && /^\d{4}-\d{2}-\d{2}$/.test(item.date) && (item.time === '' || /^([01]\d|2[0-3]):[0-5]\d$/.test(item.time))).map((item: any) => ({ date: item.date, title: item.title, time: item.time }));
    }
    if (prompt.length < 2 || prompt.length > 1200) throw new Error('Invalid');
  } catch { return json({ error: 'Question invalide (2 à 1200 caractères).' }, 400, cors); }
  try {
    const call = (name: string) => fetch(baseUrl + '/chat/completions', {
      method: 'POST', headers: { 'Authorization': 'Bearer ' + key, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: name, max_tokens: 900,
        messages: [
          { role: 'system', content: 'Tu es l’assistante personnelle de My Thirties, l’application perso d’Aïda. Réponds en français, de façon chaleureuse, concrète et structurée (listes courtes quand c’est utile). Aide à organiser la vie quotidienne, les repas et les courses, le sport, les apprentissages, les voyages et les loisirs. Tu ne vois que la question et les événements d’agenda explicitement fournis. N’exécute aucune action. Si tu n’es pas sûre d’un fait (prix, horaires, conditions d’entrée), dis-le et indique où vérifier.' },
          { role: 'user', content: prompt + (agenda.length ? '\n\nAgenda sélectionné : ' + JSON.stringify(agenda) : '') },
        ],
      }),
    });
    let response = await call(model);
    for (const name of fallbacks) {
      if (response.ok || ![404, 429, 500, 502, 503, 504].includes(response.status)) break;
      response = await call(name);
    }
    if (!response.ok) return json({ error: 'Le fournisseur IA n’a pas répondu.' }, 502, cors);
    const data = await response.json();
    const answer = data?.choices?.[0]?.message?.content;
    if (typeof answer !== 'string' || !answer.trim()) return json({ error: 'Réponse indisponible.' }, 502, cors);
    return json({ answer: answer.slice(0, 5000) }, 200, cors);
  } catch { return json({ error: 'Erreur temporaire du service.' }, 502, cors); }
});
