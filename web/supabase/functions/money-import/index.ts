// Paiements mobiles → My Thirties : un raccourci iPhone transmet le SMS de Wave ou Orange Money, la dépense ou le revenu est ajouté.
// Déployer avec la vérification JWT désactivée (Raccourcis n'a pas de session) :
//   supabase functions deploy money-import --no-verify-jwt
// Même lien privé que l'import Santé (table health_imports). Le texte du SMS n'est jamais enregistré, seulement le montant et le libellé.
// Secrets : SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY (fournis automatiquement par Supabase).
import { createClient } from 'npm:@supabase/supabase-js@2';
import { parseMoneySms } from './parse.ts';

const text = (body: string, status = 200) => new Response(body, { status, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
const fmt = (n: number) => new Intl.NumberFormat('fr-FR').format(n).replace(/\u202f|\u00a0/g, ' ') + ' XOF';

Deno.serve(async (request) => {
  if (request.method !== 'POST') return text('Méthode interdite.', 405);
  const token = new URL(request.url).searchParams.get('token') ?? '';
  if (!/^[0-9a-f]{64}$/.test(token)) return text('Lien invalide.', 404);
  const body = await request.text();
  if (body.length > 4000) return text('Message trop long.', 413);
  const url = Deno.env.get('SUPABASE_URL');
  const service = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!url || !service) return text('Configuration manquante.', 503);
  const db = createClient(url, service, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data: link } = await db.from('health_imports').select('user_id').eq('token', token).maybeSingle();
  if (!link) return text('Lien invalide.', 404);

  const tx = parseMoneySms(body);
  if (!tx) return text('Message non reconnu : rien n’a été ajouté.');
  // Empreinte du message pour ne pas l'ajouter deux fois (le texte lui-même n'est pas gardé).
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(body.trim()));
  const smsId = Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('').slice(0, 32);
  const date = new Intl.DateTimeFormat('en-CA', { timeZone: 'Africa/Dakar', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
  const { data: dup } = await db.from('entries').select('id').eq('user_id', link.user_id).in('kind', ['expense', 'income']).contains('data', { smsId }).limit(1).maybeSingle();
  if (dup) return text('Déjà ajouté.');
  const { error } = await db.from('entries').insert({ user_id: link.user_id, module: 'finances', kind: tx.kind, title: tx.label.slice(0, 120), entry_date: date,
    data: { date, amount: tx.amount, currency: 'XOF', category: tx.kind === 'expense' ? 'Autres' : '', note: 'Ajouté depuis un SMS' + (tx.provider ? ' ' + tx.provider : ''), smsId } });
  if (error) return text('Erreur temporaire, réessaie plus tard.', 502);
  return text('My Thirties : ' + (tx.kind === 'expense' ? 'dépense' : 'revenu') + ' de ' + fmt(tx.amount) + ' ajouté (' + tx.label + ').');
});
