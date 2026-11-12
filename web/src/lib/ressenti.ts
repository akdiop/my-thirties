/** « Je me sens… » : nommer ce que je ressens, des gestes immédiats selon l'émotion, un coach IA (sur demande) et l'historique. */
import type { Entry } from './cloud';

export const RESSENTI_KIND = 'ressenti';

export type Cible = 'calme' | 'tcc' | 'hsp' | 'gratitude' | 'mediter' | 'notes' | 'invocations' | 'proches' | 'sommeil';
export type Geste = { texte: string; cible?: Cible; libelle?: string };
export type Ressenti = { id: string; label: string; gestes: Geste[] };

const g = (texte: string, cible?: Cible, libelle?: string): Geste => ({ texte, cible, libelle });

export const RESSENTIS: Ressenti[] = [
  { id: 'frustree', label: 'Frustrée', gestes: [g('Nomme précisément ce qui bloque, en une phrase.'), g('Bouge cinq minutes : marche, étire-toi, secoue les mains pour évacuer la tension.'),
    g('Distingue ce qui dépend de toi de ce qui n’en dépend pas.', 'tcc', 'Trier dans la résolution de problèmes'), g('Si c’est une pensée qui tourne, examine-la.', 'tcc', 'Colonnes de Beck')] },
  { id: 'triste', label: 'Triste', gestes: [g('Laisse la tristesse exister quelques minutes, sans te juger.'), g('Écris ce que tu ressens, sans filtre.', 'notes', 'Écrire'),
    g('Envoie un message à quelqu’un qui te fait du bien.', 'proches', 'Mes proches'), g('Une chose douce : boisson chaude, douche, plaid.')] },
  { id: 'anxieuse', label: 'Anxieuse', gestes: [g('Respire en allongeant l’expiration : 4 temps pour inspirer, 6 pour expirer.', 'calme', 'Respirer'),
    g('Reviens au présent : 5 choses que tu vois, 4 que tu touches, 3 que tu entends.'), g('Trie l’inquiétude : puis-je agir maintenant ?', 'tcc', 'Trier une inquiétude'), g('Dis une invocation qui t’apaise.', 'invocations', 'Mes invocations')] },
  { id: 'colere', label: 'En colère', gestes: [g('Ne réponds pas tout de suite : attends que la vague redescende.'), g('Éloigne-toi quelques minutes et respire.', 'calme', 'SOS colère'),
    g('Écris tout ce qui t’énerve, sans retenue, pour toi seule.', 'notes', 'Note de colère'), g('Ensuite seulement : quel est mon besoin, et quelle demande claire puis-je faire ?', 'hsp', 'Poser une limite')] },
  { id: 'epuisee', label: 'Épuisée', gestes: [g('Autorise-toi une vraie pause, même vingt minutes.'), g('Regarde ce qui peut attendre demain et laisse-le.'),
    g('Fais le point sur ta batterie et ce qui te vide.', 'hsp', 'Ma batterie du jour'), g('Protège ta nuit de ce soir.', 'sommeil', 'Sommeil')] },
  { id: 'seule', label: 'Seule', gestes: [g('Écris à une personne, même un message simple.', 'proches', 'Mes proches'), g('Sors quelques minutes là où il y a de la vie : un café, une marche.'),
    g('Rappelle-toi un moment où tu t’es sentie entourée.', 'gratitude', 'Relire une gratitude'), g('Une prière ou un dhikr peut aussi être une présence.', 'invocations', 'Mes invocations')] },
  { id: 'submergee', label: 'Submergée', gestes: [g('Réduis les stimulations : silence, lumière douce, téléphone loin.', 'hsp', 'SOS surcharge'), g('Vide ta tête sur une page, puis choisis une seule chose à faire.', 'notes', 'Vide-tête'),
    g('Respire lentement six fois.', 'calme', 'Respirer'), g('Le reste peut attendre : dis non à une chose aujourd’hui.')] },
  { id: 'decouragee', label: 'Découragée', gestes: [g('Relis une petite victoire récente.', 'gratitude', 'Ma gratitude'), g('Choisis un pas minuscule, faisable en cinq minutes.'),
    g('Parle-toi comme à une amie.', 'tcc', 'Me parler avec bienveillance'), g('Repense à ce qui compte pour toi.', 'tcc', 'La cible de mes valeurs')] },
  { id: 'coupable', label: 'Coupable', gestes: [g('Sépare l’acte de la personne : tu as fait une erreur, tu n’es pas une erreur.'), g('Y a-t-il quelque chose à réparer ? Une excuse, un geste ?'),
    g('Examine la pensée « c’est ma faute ».', 'tcc', 'Colonnes de Beck'), g('L’istighfâr apaise le cœur et ouvre une page nouvelle.', 'invocations', 'Mes invocations')] },
  { id: 'jalouse', label: 'Jalouse', gestes: [g('Demande-toi ce que cette jalousie dit de ton envie profonde.'), g('Transforme l’envie en un pas pour toi.', 'tcc', 'La cible de mes valeurs'),
    g('Note trois choses que tu as déjà.', 'gratitude', 'Ma gratitude'), g('Éloigne-toi des réseaux un moment.')] },
  { id: 'vide', label: 'Vide, sans envie', gestes: [g('Fais une toute petite chose agréable, sans attendre l’envie.', 'tcc', 'Activation comportementale'), g('Sors à la lumière du jour quelques minutes.'),
    g('Mange et bois quelque chose.'), g('Parles-en à quelqu’un de confiance si ça dure.')] },
];
export const ressentiOf = (id: string) => RESSENTIS.find((r) => r.id === id);

/** Le cadre donné au coach IA (envoyé seulement quand je lui écris). */
export function coachContext(r: Ressenti, intensite: number, situation: string) {
  return ['Tu es un coach bien-être bienveillant pour Aïda (34 ans, Dakar, musulmane pratiquante). Elle vient d’ouvrir « Je me sens… » dans son app.',
    'Ton rôle : l’écouter, valider ce qu’elle ressent sans dramatiser, puis proposer 2 ou 3 pistes concrètes et faisables aujourd’hui (respiration, recadrage d’une pensée, petit geste, limite à poser, quelqu’un à contacter), et finir par une question douce.',
    'Réponds en français, chaleureusement, en 120 à 200 mots, avec des phrases courtes. Pas de diagnostic, pas de jugement, pas de leçon de morale.',
    'Tu peux évoquer la foi avec délicatesse (patience, confiance en Allah, dou’â) sans citer de verset ni de hadith précis.',
    'Si elle évoque de se faire du mal, un danger ou une détresse très forte, dis-lui avec douceur de contacter tout de suite une personne de confiance, un professionnel de santé ou les urgences.',
    'Ce qu’elle ressent : ' + r.label.toLowerCase() + ', intensité ' + intensite + ' sur 10.' + (situation.trim() ? ' Ce qui se passe : ' + situation.trim().slice(0, 800) : '')].join('\n');
}

export type RessentiData = { emotion: string; intensite: number; situation?: string; apres?: number; coach?: string };
/** Mes ressentis : les plus fréquents et l'évolution de l'intensité. */
export function bilanRessentis(entries: Entry[]) {
  const list = entries.filter((e) => e.kind === RESSENTI_KIND).map((e) => ({ entry: e, date: String(e.entry_date ?? ''), d: e.data as RessentiData }))
    .sort((a, b) => b.date.localeCompare(a.date) || b.entry.created_at.localeCompare(a.entry.created_at));
  const count = new Map<string, number>();
  for (const x of list) count.set(x.d.emotion, (count.get(x.d.emotion) ?? 0) + 1);
  const drops = list.filter((x) => typeof x.d.apres === 'number').map((x) => x.d.intensite - x.d.apres!);
  return { list, frequents: [...count.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3).map(([id, n]) => ({ label: ressentiOf(id)?.label ?? id, n })),
    baisse: drops.length ? Math.round((drops.reduce((a, b) => a + b, 0) / drops.length) * 10) / 10 : null };
}
