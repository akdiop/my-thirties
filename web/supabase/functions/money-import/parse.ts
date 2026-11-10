// Lecture d'un SMS de paiement (Wave, Orange Money…) transmis par un raccourci iPhone.
// Seuls le montant, le sens, le bénéficiaire et l'opérateur sont gardés : le texte du SMS n'est pas enregistré.
export type Tx = { kind: 'expense' | 'income'; amount: number; label: string; provider: string };

const plain = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const AMOUNT = /(\d{1,3}(?:[ .  ]\d{3})+|\d+)(?:,\d{1,2})?\s*(?:f\s?cfa|fcfa|xof|cfa|f)(?![a-z])/i;
const INCOME = /\b(recu|reception|depot|credite|credit de|vous a envoye|transfert recu)\b/;
const EXPENSE = /\b(paiement|paye|payee|achat|envoye|envoi|transfert|retrait|debite|facture|rechargement|recharge)\b/;

const toNumber = (s: string) => Number(s.replace(/[ .  ]/g, '').replace(',', '.'));

export function parseMoneySms(text: string): Tx | null {
  const t = text.slice(0, 1000).replace(/\s+/g, ' ').trim();
  if (!t) return null;
  const p = plain(t);
  const provider = /wave/.test(p) ? 'Wave' : /orange money|\bom\b/.test(p) ? 'Orange Money' : /free money/.test(p) ? 'Free Money' : '';
  // Le premier montant hors solde et hors frais.
  const parts = t.split(/(?<=[.;!])\s+/);
  let amount = 0;
  for (const part of parts) {
    const q = plain(part);
    const m = AMOUNT.exec(part);
    if (!m) continue;
    const before = q.slice(0, Math.max(0, q.indexOf(plain(m[0])))).slice(-25);
    if (/solde|frais|commission/.test(before)) continue;
    amount = toNumber(m[1]!); break;
  }
  if (!amount || !Number.isFinite(amount) || amount > 50_000_000) return null;
  const kind = INCOME.test(p) && !/vous avez (paye|envoye)/.test(p) ? 'income' : EXPENSE.test(p) ? 'expense' : null;
  if (!kind) return null;
  const who = /\b(?:a|chez|de|par)\s+([A-Za-zÀ-ÿ][\wÀ-ÿ'’&\- ]{1,40}?)(?=\s*(?:[.,;(]|\d|le |du |avec |est |a |$))/.exec(t.replace(/(^|\s)à(?=\s)/g, '$1a'));
  const label = (who?.[1] ?? '').replace(/\s+/g, ' ').trim();
  return { kind, amount, label: label || provider || 'Paiement mobile', provider };
}
