/** Fréquences pour méditer : intention de chaque fréquence, choix selon le besoin, méthode et journal d'écoute (fiches envoyées par Aïda). */
import type { Entry } from './cloud';
import { MEDITATION_KIND } from './meditation';

export type Frequence = { hz: number; titre: string; texte: string };
export const FREQUENCES: Frequence[] = [
  { hz: 174, titre: 'Ancrage et sécurité intérieure', texte: 'Pour apaiser le mental et revenir dans le corps.' },
  { hz: 285, titre: 'Régénération', texte: 'Pour relâcher les tensions internes et se ressourcer.' },
  { hz: 396, titre: 'Libérer la peur et la culpabilité', texte: 'Pour les périodes d’anxiété et de blocages émotionnels.' },
  { hz: 417, titre: 'Tourner la page', texte: 'Pour sortir des schémas répétitifs et des mémoires qui pèsent.' },
  { hz: 528, titre: 'Amour et guérison', texte: 'Harmonie, amour profond, transformation.' },
  { hz: 639, titre: 'Relations et ouverture du cœur', texte: 'Pour les liens familiaux, amicaux et amoureux.' },
  { hz: 741, titre: 'Intuition et clarté', texte: 'Vérité intérieure, alignement, clarté quand le mental est surmené.' },
  { hz: 852, titre: 'Méditation profonde', texte: 'Pour approfondir la méditation et le recueillement.' },
  { hz: 963, titre: 'Paix et présence', texte: 'Conscience élargie, paix, présence.' },
];
export const BESOINS: { label: string; hz: number[] }[] = [
  { label: 'Stress, anxiété', hz: [396, 417] }, { label: 'Cœur brisé, relations', hz: [639] }, { label: 'Manque de confiance', hz: [528] },
  { label: 'Surmenage mental', hz: [741] }, { label: 'Insécurité, ancrage', hz: [174] }, { label: 'Blocages', hz: [285, 417] }, { label: 'Travail spirituel', hz: [852, 963] },
];
export const METHODE = [
  'Choisis une intention : apaiser le stress, t’ancrer, ouvrir ton cœur, libérer une émotion.',
  'Sélectionne la fréquence qui lui correspond.',
  'Installe-toi avec un casque ou des écouteurs.',
  'Respire profondément pendant 2 minutes.',
  'Laisse-toi traverser par la vibration : sens ce qu’elle fait dans ton corps.',
  'Note tes ressentis après la séance.',
];
export const RESSENTIS = ['Apaisée', 'Ancrée', 'Légère', 'Émue', 'Énergisée', 'Plus claire', 'Agitée', 'Rien de particulier'];

export type Ecoute = { date: string; hz: number; minutes: number; ressentis: string[]; note: string; intention: string };
/** Mon journal d'écoute : les séances de fréquences, de la plus récente à la plus ancienne. */
export function ecoutes(entries: Entry[]): Ecoute[] {
  return entries.filter((e) => e.kind === MEDITATION_KIND && e.data.type === 'frequence' && Number(e.data.hz) > 0)
    .map((e) => ({ date: String(e.entry_date ?? e.data.date ?? ''), hz: Number(e.data.hz), minutes: Number(e.data.minutes) || 0,
      ressentis: Array.isArray(e.data.ressentis) ? e.data.ressentis.map(String) : [], note: String(e.data.note ?? ''), intention: String(e.data.intention ?? '') }))
    .sort((a, b) => b.date.localeCompare(a.date));
}
/** Les fréquences qui m'aident le plus : nombre d'écoutes et ressenti le plus fréquent (hors « agitée » et « rien de particulier »). */
export function mesFrequences(list: Ecoute[]) {
  const by = new Map<number, Ecoute[]>();
  for (const x of list) by.set(x.hz, [...(by.get(x.hz) ?? []), x]);
  return [...by.entries()].map(([hz, xs]) => {
    const count = new Map<string, number>();
    for (const r of xs.flatMap((x) => x.ressentis)) if (r !== 'Agitée' && r !== 'Rien de particulier') count.set(r, (count.get(r) ?? 0) + 1);
    const top = [...count.entries()].sort((a, b) => b[1] - a[1])[0];
    const good = xs.filter((x) => x.ressentis.some((r) => r !== 'Agitée' && r !== 'Rien de particulier')).length;
    return { hz, fois: xs.length, minutes: xs.reduce((a, x) => a + x.minutes, 0), ressenti: top?.[0] ?? '', bien: good };
  }).sort((a, b) => b.bien - a.bien || b.fois - a.fois);
}
