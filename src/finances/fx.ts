/** Taux USD/EUR publié par la Banque centrale européenne, via Frankfurter (aucune donnée personnelle envoyée). EUR↔XOF est une parité fixe. */
export const FX_SOURCE = 'BCE via Frankfurter';
const URL = 'https://api.frankfurter.dev/v1/latest?base=EUR&symbols=USD';

export function parseFrankfurter(json: unknown): { date: string; usdPerEur: number } {
  const body = json as { date?: unknown; rates?: { USD?: unknown } };
  const rate = body.rates?.USD;
  if (typeof body.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(body.date) || typeof rate !== 'number' || !(rate > 0)) throw new Error('Réponse du service de taux inattendue.');
  return { date: body.date, usdPerEur: rate };
}

export async function fetchUsdRate() {
  const res = await fetch(URL, { headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error(`Service de taux indisponible (${res.status}).`);
  return parseFrankfurter(await res.json());
}
