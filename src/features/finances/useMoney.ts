import { useData } from '@/hooks/useData';
import type { Currency, Rates } from '@/finances/money';
import { useAppData } from '@/state/appData';

/** Devise principale du profil et dernier taux USD/EUR enregistré. */
export function useMoney(): { main: Currency; rates: Rates } {
  const main = useAppData((s) => s.profile?.currency ?? 'XOF');
  const rate = useData(({ life }) => life.latestRate());
  return { main, rates: { usdPerEur: rate?.usdPerEur ?? null, date: rate?.date ?? null } };
}
