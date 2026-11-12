/**
 * Mon hypersensibilité : comprendre la haute sensibilité (concept d'Elaine Aron, « sensory processing sensitivity »),
 * repérer et prévenir la surcharge, poser ses limites, se recharger, et valoriser ses forces. Exercices à remplir et suivi.
 */
import type { Entry } from './cloud';
import type { Fiche, Outil } from './tcc';

export const HSP_KIND = 'hsp';

export const FICHES_HSP: Fiche[] = [
  { id: 'definition', titre: 'Ce qu’est la haute sensibilité', points: [
    'C’est un trait de tempérament, pas une maladie ni un trouble : le système nerveux traite les informations plus en profondeur.',
    'La psychologue Elaine Aron l’a décrit dans les années 1990 ; on estime qu’il concerne environ une personne sur cinq, autant d’hommes que de femmes.',
    'On le retrouve aussi chez de nombreuses espèces animales : c’est une stratégie de survie, observer avant d’agir.',
    'On ne « guérit » pas d’un tempérament : on apprend à le comprendre, à le protéger et à s’en servir.'] },
  { id: 'does', titre: 'Les 4 piliers (D.O.E.S.)', points: [
    'Profondeur de traitement : je réfléchis beaucoup, je fais des liens, je pèse longtemps mes décisions.',
    'Surstimulation : comme je traite tout en profondeur, je sature plus vite (bruit, monde, journées chargées).',
    'Émotions et empathie : je ressens fort, les miennes comme celles des autres, le positif comme le négatif.',
    'Sensibilité aux subtilités : je remarque les détails, les changements d’ambiance, les petits signaux.'] },
  { id: 'mythes', titre: 'Ce que l’hypersensibilité n’est pas', points: [
    'Ce n’est pas être fragile ni « trop » : c’est un fonctionnement différent, avec un coût et des richesses.',
    'Ce n’est pas forcément être introvertie : une partie des personnes très sensibles sont extraverties.',
    'Ce n’est pas un diagnostic : l’anxiété, un trauma ou un trouble de l’attention peuvent ressembler à certains aspects ; en cas de souffrance durable, un professionnel aide à faire la part des choses.',
    'Ce n’est pas un défaut à cacher : bien accompagnée, la sensibilité est souvent un atout.'] },
  { id: 'surcharge', titre: 'La surcharge et ses signaux', points: [
    'La surcharge arrive quand les stimulations dépassent ce que je peux traiter : elles s’additionnent au fil de la journée.',
    'Signaux fréquents : irritabilité, envie de fuir, larmes, mâchoire ou épaules serrées, maux de tête, difficulté à penser, besoin de silence.',
    'Le corps prévient avant l’explosion : apprendre ses premiers signes permet d’agir tôt.',
    'La règle : réduire les entrées (sons, lumière, monde, écrans) et donner du temps au système nerveux pour redescendre.'] },
  { id: 'emotions', titre: 'Émotions intenses', points: [
    'Ressentir fort n’est pas un problème ; être submergée sans outils, si.',
    'Nommer l’émotion et son intensité aide à reprendre la main.',
    'Une émotion passe par une vague : elle monte, culmine et redescend. Je n’ai pas à agir au sommet de la vague.',
    'Les larmes sont souvent une décharge, pas une faiblesse.'] },
  { id: 'eponge', titre: 'L’effet éponge', points: [
    'Je capte facilement les émotions des autres : je peux sortir d’un échange vidée ou triste sans savoir pourquoi.',
    'Se demander : « Est-ce à moi, ou est-ce que je l’ai attrapé chez quelqu’un ? »',
    'L’empathie n’oblige pas à porter : je peux comprendre une personne sans prendre son poids.',
    'Après un moment chargé, un sas de transition aide : quelques minutes seule, respirer, marcher, se laver les mains.'] },
  { id: 'limites', titre: 'Poser ses limites', points: [
    'Les personnes sensibles disent souvent oui pour éviter de décevoir, puis s’épuisent.',
    'Une limite protège ma relation à l’autre autant que moi : elle évite le ressentiment.',
    'Pas besoin de longue justification : une phrase courte, calme et aimable suffit.',
    'Je peux prendre un temps avant de répondre : « Je te redis demain. »'] },
  { id: 'recharge', titre: 'Se recharger', points: [
    'La recharge n’est pas une récompense après l’effort : c’est un besoin de base, à prévoir chaque jour.',
    'Ce qui recharge souvent : le calme, la nature, l’eau, la lumière douce, la musique choisie, le mouvement lent, la prière, la création.',
    'Prévoir des temps vides entre deux activités chargées, et une vraie pause après une journée sociale.',
    'Le sommeil est la recharge la plus puissante : protéger ses heures et son environnement de nuit.'] },
  { id: 'decisions', titre: 'Décisions et ruminations', points: [
    'Traiter en profondeur, c’est voir toutes les options… et parfois tourner en rond.',
    'Donne-toi un délai et deux ou trois critères qui comptent vraiment, puis décide.',
    'Une décision « assez bonne » vaut souvent mieux qu’une décision parfaite prise trop tard.',
    'Le soir, noter ce qui tourne dans la tête aide à le déposer jusqu’au lendemain.'] },
  { id: 'forces', titre: 'Les forces de la sensibilité', points: [
    'Intuition, sens du détail, créativité, profondeur dans les relations, conscience des besoins des autres, sens de la justice et de la beauté.',
    'Les personnes sensibles profitent aussi plus que les autres des bonnes conditions : un environnement favorable les fait s’épanouir.',
    'Repérer chaque jour un moment où ma sensibilité m’a servi change le regard que je porte sur elle.'] },
  { id: 'travail', titre: 'Au travail et au quotidien', points: [
    'Aménager ce qui est possible : casque ou bouchons, place plus calme, pauses courtes et régulières, blocs de travail sans notifications.',
    'Préparer les situations chargées : réunions, événements, voyages, avec un plan avant, pendant et après.',
    'Regrouper les tâches sociales et protéger des plages calmes.',
    'Dire ce dont j’ai besoin de façon simple : « Je travaille mieux dans le calme, je peux m’installer là ? »'] },
];

export const SIGNES = ['Irritabilité', 'Envie de fuir', 'Larmes', 'Tensions (mâchoire, épaules)', 'Maux de tête', 'Brouillard dans la tête', 'Cœur qui s’accélère', 'Besoin de silence', 'Fatigue soudaine', 'Hypersensibilité au bruit'];
export const DECLENCHEURS = ['Bruit', 'Foule', 'Lumière forte', 'Odeurs', 'Textures, vêtements', 'Écrans, notifications', 'Conflit', 'Émotions des autres', 'Imprévu', 'Journée trop remplie', 'Faim, fatigue', 'Pression, urgence', 'Critique'];
export const RECHARGES = ['Silence', 'Nature, marche', 'Prière, dhikr', 'Bain, douche', 'Lumière douce', 'Musique choisie', 'Sieste, repos', 'Écrire', 'Créer', 'Respiration', 'Moment seule', 'Thé, cuisine lente'];

/** SOS surcharge : quelques gestes simples, dans l'ordre. */
export const SOS_HSP = [
  { titre: 'Réduire les entrées', texte: 'Si tu peux : sors de la pièce, baisse la lumière, mets un casque ou des bouchons, éloigne le téléphone.' },
  { titre: 'Respirer lentement', texte: 'Inspire par le nez sur 4 temps, expire par la bouche sur 6 temps. Six fois. L’expiration longue calme le système nerveux.' },
  { titre: 'Revenir au corps', texte: 'Pose les pieds bien à plat, sens le poids du corps. Nomme 5 choses que tu vois, 4 que tu touches, 3 que tu entends, 2 que tu sens, 1 que tu goûtes.' },
  { titre: 'Nommer', texte: 'Dis-toi : « Je suis en surcharge. C’est mon système nerveux qui sature, ça va redescendre. »' },
  { titre: 'Une chose douce', texte: 'De l’eau, quelque chose de chaud entre les mains, un vêtement confortable, quelques minutes allongée, un dhikr à voix basse.' },
  { titre: 'Plus tard', texte: 'Quand c’est redescendu, note ce qui s’est passé dans « Journal de surcharge » pour repérer tes déclencheurs.' },
];

/** Phrases toutes prêtes, courtes et aimables. */
export const PHRASES = [
  { quand: 'Refuser une invitation', phrase: 'Merci d’avoir pensé à moi. Je ne peux pas cette fois.' },
  { quand: 'Gagner du temps', phrase: 'Je préfère y réfléchir. Je te réponds demain.' },
  { quand: 'Quitter un moment plus tôt', phrase: 'Je suis contente d’être venue. Je vais rentrer me reposer.' },
  { quand: 'Demander du calme', phrase: 'J’ai besoin de quelques minutes au calme, je reviens.' },
  { quand: 'Dire non à une demande de plus', phrase: 'Je n’ai pas la place en ce moment. Je ne veux pas le faire à moitié.' },
  { quand: 'Une conversation trop lourde', phrase: 'Je t’écoute, et là j’arrive au bout de ce que je peux porter aujourd’hui. On reprend demain ?' },
  { quand: 'Aménager le travail', phrase: 'Je me concentre mieux au calme. Est-ce que je peux m’installer là, ou mettre un casque ?' },
  { quand: 'Une remarque qui blesse', phrase: 'Ça m’a touchée. J’aimerais qu’on en parle autrement.' },
  { quand: 'Changer de sujet', phrase: 'Je préfère ne pas parler de ça maintenant.' },
];

const area = (id: string, label: string, hint?: string) => ({ id, label, hint, type: 'area' as const });
const slider = (id: string, label: string, max = 10, hint?: string) => ({ id, label, hint, type: 'slider' as const, max });

export const OUTILS_HSP: Outil[] = [
  { id: 'batterie', nom: 'Ma batterie du jour', but: 'Suivre mon énergie du matin au soir, et ce qui la vide ou la recharge.', avant: 'matin', apres: 'soir', fields: [
    slider('matin', 'Ma batterie ce matin'), { id: 'vide', label: 'Ce qui m’a vidée', type: 'multi', options: DECLENCHEURS },
    { id: 'recharge', label: 'Ce qui m’a rechargée', type: 'multi', options: RECHARGES }, slider('soir', 'Ma batterie ce soir'), area('note', 'Une note sur ma journée')] },
  { id: 'surcharge', nom: 'Journal de surcharge', but: 'Comprendre ce qui me sature et ce qui m’aide à redescendre.', avant: 'pic', apres: 'apres', fields: [
    area('situation', 'La situation', 'Où, quand, avec qui.'), { id: 'declencheurs', label: 'Les déclencheurs', type: 'multi', options: DECLENCHEURS },
    { id: 'signes', label: 'Les signaux de mon corps', type: 'multi', options: SIGNES }, slider('pic', 'Niveau de surcharge au plus fort'),
    area('fait', 'Ce que j’ai fait'), { id: 'aide', label: 'Ce qui m’a aidée', type: 'multi', options: RECHARGES }, slider('apres', 'Niveau de surcharge après'),
    area('prochaine', 'La prochaine fois, je pourrais…')] },
  { id: 'carte', nom: 'La carte de mes sens', but: 'Savoir précisément ce qui me dérange et ce qui m’apaise, sens par sens.', fields: [
    area('sons', 'Sons', 'Ce qui me gêne · ce qui m’apaise'), area('lumiere', 'Lumière et vue'), area('odeurs', 'Odeurs et goûts'),
    area('toucher', 'Toucher, textures, température'), area('social', 'Monde et interactions'), area('rythme', 'Rythme de la journée'),
    area('kit', 'Mon kit apaisant', 'Ce que je garde sur moi : casque, foulard, huile, chapelet, eau…')] },
  { id: 'evenement', nom: 'Préparer une situation chargée', but: 'Un plan avant, pendant et après pour un événement, une réunion, un voyage.', avant: 'avantNiveau', apres: 'apresNiveau', fields: [
    area('quoi', 'La situation qui m’attend'), slider('avantNiveau', 'Mon appréhension'), area('avant', 'Avant : comment je me prépare', 'Repos, repas, tenue confortable, trajet calme…'),
    area('pendant', 'Pendant : mes ancres et mes pauses', 'Où m’isoler quelques minutes, un geste discret pour respirer.'), area('sortie', 'Mon plan de sortie', 'L’heure à laquelle je peux partir, la phrase que je dirai.'),
    area('apres', 'Après : ma recharge prévue'), slider('apresNiveau', 'Après coup, comment ça s’est passé (10 = très bien)'), area('appris', 'Ce que j’en retiens')] },
  { id: 'eponge', nom: 'À moi ou pas à moi ?', but: 'Démêler mes émotions de celles que j’ai captées chez les autres.', avant: 'avant', apres: 'apres', fields: [
    area('situation', 'Après quel échange, quel moment ?'), area('ressens', 'Ce que je ressens'), slider('avant', 'Intensité'),
    area('amoi', 'Ce qui est à moi', 'Mes besoins, mes valeurs, mon histoire.'), area('pasamoi', 'Ce qui appartient à l’autre', 'Son humeur, ses choix, sa responsabilité.'),
    area('rendre', 'Ce que je lui rends symboliquement', '« Je te laisse ta colère, elle t’appartient. »'), area('sas', 'Mon sas de transition', 'Marcher, respirer, l’eau sur les mains, un dhikr.'), slider('apres', 'Intensité maintenant')] },
  { id: 'limite', nom: 'Poser une limite', but: 'Préparer une demande claire, calme et respectueuse.', fields: [
    area('situation', 'La situation'), area('besoin', 'Mon besoin', 'Repos, temps, respect, calme…'),
    area('faits', 'Les faits, sans jugement', '« Quand tu m’appelles après 22 h… »'), area('ressenti', 'Ce que je ressens', '« … je me sens épuisée. »'),
    area('demande', 'Ma demande', '« J’aimerais qu’on s’appelle plutôt avant 21 h. »'), area('consequence', 'Ce que ça apportera à notre relation'),
    { id: 'fait', label: 'Je l’ai dit', type: 'chips', options: ['Oui', 'Pas encore', 'Je l’ai écrit'] }, area('suite', 'Comment ça s’est passé')] },
  { id: 'recharge', nom: 'Mon plan de recharge', but: 'Prévoir mes temps de recharge au lieu d’attendre l’épuisement.', fields: [
    { id: 'quotidien', label: 'Chaque jour, au moins une', type: 'multi', options: RECHARGES }, area('quand', 'Quand dans ma journée', 'Matin, pause de midi, retour à la maison…'),
    area('semaine', 'Chaque semaine', 'Un vrai temps vide, un moment dans la nature…'), area('apresSocial', 'Après une journée sociale'),
    area('alerte', 'Mes signaux d’alerte', 'Quand je les vois, je protège ma recharge en priorité.'), area('soutien', 'Les personnes ou lieux qui me ressourcent')] },
  { id: 'decision', nom: 'Sortir de la rumination', but: 'Décider sans tourner en rond, ou déposer ce qui tourne le soir.', fields: [
    area('question', 'La décision ou la pensée qui tourne'), area('criteres', 'Les 2 ou 3 critères qui comptent vraiment'),
    area('options', 'Mes options', 'Une par ligne.'), area('assez', 'L’option « assez bonne »'), { id: 'delai', label: 'Je décide avant', type: 'text', hint: 'Une date ou une heure' },
    area('deposer', 'Ce que je dépose pour ce soir', 'Je le reprends demain, à tête reposée.')] },
  { id: 'forces', nom: 'Le journal de mes forces sensibles', but: 'Remarquer chaque jour un moment où ma sensibilité m’a servi.', fields: [
    area('moment', 'Le moment'), { id: 'force', label: 'La force en jeu', type: 'multi', options: ['Intuition', 'Sens du détail', 'Empathie', 'Créativité', 'Profondeur', 'Sens de la beauté', 'Sens de la justice', 'Conscience de l’autre'] },
    area('effet', 'Ce que ça a apporté'), area('merci', 'Ce que je me dis', '« Ma sensibilité m’a aidée aujourd’hui. »')] },
  { id: 'sommeil', nom: 'Protéger mon sommeil', but: 'Un soir apaisé pour un système nerveux qui récupère.', fields: [
    area('stimulations', 'Ce qui m’a stimulée ce soir', 'Écrans, discussion, travail tardif, lumière…'), area('rituel', 'Mon rituel du soir', 'Lumière baissée, douche, lecture, invocations du soir.'),
    area('vider', 'Ce que je vide de ma tête avant de dormir'), slider('qualite', 'Qualité de ma nuit (le lendemain)'), area('ajuster', 'Ce que j’ajuste')] },
  { id: 'bienveillance', nom: 'Me parler avec douceur', but: 'Remplacer « je suis trop sensible » par un regard juste.', fields: [
    area('critique', 'Ce que je me reproche'), area('juste', 'Ce qui est vrai aussi', 'Mon système nerveux traite plus, il a besoin de plus de pauses.'),
    area('amie', 'Ce que je dirais à une amie très sensible'), area('besoin', 'Ce dont j’ai besoin maintenant')] },
];
export const outilHsp = (id: string) => OUTILS_HSP.find((o) => o.id === id);

export function exercicesHsp(entries: Entry[]) {
  return entries.filter((e) => e.kind === HSP_KIND && outilHsp(String(e.data.outil)))
    .map((e) => ({ entry: e, outil: outilHsp(String(e.data.outil))!, date: String(e.entry_date ?? ''), values: (e.data.values ?? {}) as Record<string, unknown> }))
    .sort((a, b) => b.date.localeCompare(a.date));
}

const tally = (lists: unknown[]) => {
  const m = new Map<string, number>();
  for (const l of lists) for (const x of Array.isArray(l) ? (l as string[]) : []) m.set(x, (m.get(x) ?? 0) + 1);
  return [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4).map(([nom, n]) => ({ nom, n }));
};

/** Ce que mes fiches m'apprennent : batterie moyenne, déclencheurs fréquents, ce qui aide le plus, baisse de la surcharge. */
export function progresHsp(list: ReturnType<typeof exercicesHsp>) {
  const bat = list.filter((x) => x.outil.id === 'batterie');
  const avg = (v: number[]) => (v.length ? Math.round((v.reduce((a, b) => a + b, 0) / v.length) * 10) / 10 : null);
  const num = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) ? v : null);
  const soirs = bat.map((x) => num(x.values.soir)).filter((v): v is number => v !== null);
  const sur = list.filter((x) => x.outil.id === 'surcharge');
  const drops = sur.map((x) => { const a = num(x.values.pic), b = num(x.values.apres); return a !== null && b !== null ? a - b : null; }).filter((v): v is number => v !== null);
  return {
    total: list.length, batterieSoir: avg(soirs), baisse: avg(drops),
    declencheurs: tally([...sur.map((x) => x.values.declencheurs), ...bat.map((x) => x.values.vide)]),
    aide: tally([...sur.map((x) => x.values.aide), ...bat.map((x) => x.values.recharge)]),
    signes: tally(sur.map((x) => x.values.signes)),
  };
}
