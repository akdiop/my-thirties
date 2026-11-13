/**
 * Mon thème astral : le ciel de naissance (enregistré dans mes données, jamais dans le code), les repères pour comprendre
 * (signes, planètes, maisons, aspects) et les lectures reformulées de mon thème Evozen.
 */
import type { Entry } from './cloud';

export const ASTRO_KIND = 'theme_astral';

export type SignId = 'belier' | 'taureau' | 'gemeaux' | 'cancer' | 'lion' | 'vierge' | 'balance' | 'scorpion' | 'sagittaire' | 'capricorne' | 'verseau' | 'poissons';
export type PlanetId = 'soleil' | 'lune' | 'mercure' | 'venus' | 'mars' | 'jupiter' | 'saturne' | 'uranus' | 'neptune' | 'pluton' | 'noeud_nord' | 'noeud_sud' | 'ascendant';
export type Element = 'Feu' | 'Terre' | 'Air' | 'Eau';
export type Mode = 'Cardinal' | 'Fixe' | 'Mutable';

export type Sign = { id: SignId; label: string; abbr: string; element: Element; mode: Mode; maitre: string; mots: string[]; essence: string; ombre: string };
export const SIGNS: Sign[] = [
  { id: 'belier', label: 'Bélier', abbr: 'Bél', element: 'Feu', mode: 'Cardinal', maitre: 'Mars', mots: ['élan', 'courage', 'initiative'], essence: 'L’énergie du commencement : oser, ouvrir la voie, agir vite.', ombre: 'Impatience, impulsivité.' },
  { id: 'taureau', label: 'Taureau', abbr: 'Tau', element: 'Terre', mode: 'Fixe', maitre: 'Vénus', mots: ['stabilité', 'sensualité', 'constance'], essence: 'Construire dans la durée, savourer, sécuriser ce qui compte.', ombre: 'Entêtement, peur du changement.' },
  { id: 'gemeaux', label: 'Gémeaux', abbr: 'Gém', element: 'Air', mode: 'Mutable', maitre: 'Mercure', mots: ['curiosité', 'échange', 'adaptation'], essence: 'Relier les idées et les gens, apprendre, communiquer avec légèreté.', ombre: 'Dispersion, nervosité.' },
  { id: 'cancer', label: 'Cancer', abbr: 'Can', element: 'Eau', mode: 'Cardinal', maitre: 'la Lune', mots: ['protection', 'sensibilité', 'racines'], essence: 'Prendre soin, créer un cocon, nourrir les liens du cœur.', ombre: 'Susceptibilité, repli.' },
  { id: 'lion', label: 'Lion', abbr: 'Lio', element: 'Feu', mode: 'Fixe', maitre: 'le Soleil', mots: ['rayonnement', 'générosité', 'confiance'], essence: 'Briller, créer, donner du cœur et inspirer.', ombre: 'Besoin d’admiration, orgueil.' },
  { id: 'vierge', label: 'Vierge', abbr: 'Vie', element: 'Terre', mode: 'Mutable', maitre: 'Mercure', mots: ['précision', 'service', 'amélioration'], essence: 'Analyser, organiser, rendre utile et soigner les détails.', ombre: 'Perfectionnisme, autocritique.' },
  { id: 'balance', label: 'Balance', abbr: 'Bal', element: 'Air', mode: 'Cardinal', maitre: 'Vénus', mots: ['harmonie', 'lien', 'justice'], essence: 'Chercher l’équilibre, la beauté et l’accord avec l’autre.', ombre: 'Indécision, peur du conflit.' },
  { id: 'scorpion', label: 'Scorpion', abbr: 'Sco', element: 'Eau', mode: 'Fixe', maitre: 'Pluton (et Mars)', mots: ['intensité', 'profondeur', 'transformation'], essence: 'Aller au fond des choses, se transformer, vivre avec intensité.', ombre: 'Contrôle, méfiance.' },
  { id: 'sagittaire', label: 'Sagittaire', abbr: 'Sag', element: 'Feu', mode: 'Mutable', maitre: 'Jupiter', mots: ['aventure', 'sens', 'optimisme'], essence: 'Explorer, comprendre le monde, viser loin avec foi et enthousiasme.', ombre: 'Excès, besoin de fuir les contraintes.' },
  { id: 'capricorne', label: 'Capricorne', abbr: 'Cap', element: 'Terre', mode: 'Cardinal', maitre: 'Saturne', mots: ['ambition', 'discipline', 'persévérance'], essence: 'Bâtir pas à pas, assumer ses responsabilités, viser le sommet.', ombre: 'Rigidité, dureté envers soi.' },
  { id: 'verseau', label: 'Verseau', abbr: 'Ver', element: 'Air', mode: 'Fixe', maitre: 'Uranus (et Saturne)', mots: ['liberté', 'originalité', 'collectif'], essence: 'Innover, penser autrement, servir le groupe et l’avenir.', ombre: 'Distance, indépendance excessive.' },
  { id: 'poissons', label: 'Poissons', abbr: 'Poi', element: 'Eau', mode: 'Mutable', maitre: 'Neptune (et Jupiter)', mots: ['intuition', 'compassion', 'imaginaire'], essence: 'Ressentir, rêver, se relier à plus grand que soi.', ombre: 'Flou, oubli de soi.' },
];
export const signOf = (id: string) => SIGNS.find((s) => s.id === id);
export const signIndex = (id: SignId) => SIGNS.findIndex((s) => s.id === id);

export type Planet = { id: PlanetId; label: string; abbr: string; domaine: string; question: string; perso: boolean };
export const PLANETS: Planet[] = [
  { id: 'soleil', label: 'Soleil', abbr: 'So', domaine: 'L’identité, la vitalité, ce qui me fait briller.', question: 'Qu’est-ce qui me donne de l’énergie et du sens ?', perso: true },
  { id: 'lune', label: 'Lune', abbr: 'Lu', domaine: 'Les émotions, les besoins profonds, ce qui me sécurise.', question: 'De quoi ai-je besoin pour me sentir bien ?', perso: true },
  { id: 'mercure', label: 'Mercure', abbr: 'Me', domaine: 'La pensée, la parole, l’apprentissage.', question: 'Comment est-ce que je pense et communique ?', perso: true },
  { id: 'venus', label: 'Vénus', abbr: 'Vé', domaine: 'L’amour, le goût, les plaisirs, la valeur que je me donne.', question: 'Comment est-ce que j’aime et j’aime être aimée ?', perso: true },
  { id: 'mars', label: 'Mars', abbr: 'Ma', domaine: 'L’action, le désir, la façon de se battre.', question: 'Comment est-ce que j’agis et je m’affirme ?', perso: true },
  { id: 'jupiter', label: 'Jupiter', abbr: 'Ju', domaine: 'L’expansion, la chance, la confiance, la sagesse.', question: 'Où est-ce que je grandis le plus facilement ?', perso: false },
  { id: 'saturne', label: 'Saturne', abbr: 'Sa', domaine: 'La structure, les limites, la maturité qui se gagne avec le temps.', question: 'Où dois-je construire avec patience ?', perso: false },
  { id: 'uranus', label: 'Uranus', abbr: 'Ur', domaine: 'Le changement, l’originalité, la liberté (planète de génération).', question: 'Où ai-je besoin d’innover ?', perso: false },
  { id: 'neptune', label: 'Neptune', abbr: 'Ne', domaine: 'Le rêve, l’intuition, la compassion (planète de génération).', question: 'Où suis-je inspirée, et où dois-je rester lucide ?', perso: false },
  { id: 'pluton', label: 'Pluton', abbr: 'Pl', domaine: 'La transformation profonde, le pouvoir, les renaissances.', question: 'Qu’est-ce qui me transforme ?', perso: false },
  { id: 'noeud_nord', label: 'Nœud nord', abbr: 'NN', domaine: 'La direction d’évolution, ce vers quoi grandir.', question: 'Vers quoi ai-je envie d’avancer ?', perso: false },
  { id: 'noeud_sud', label: 'Nœud sud', abbr: 'NS', domaine: 'Les acquis, la zone de confort à dépasser doucement.', question: 'Sur quels acquis m’appuyer sans m’y enfermer ?', perso: false },
  { id: 'ascendant', label: 'Ascendant', abbr: 'AS', domaine: 'La façon d’entrer en relation avec le monde, la première impression.', question: 'Comment est-ce que j’aborde la vie ?', perso: true },
];
export const planetOf = (id: string) => PLANETS.find((p) => p.id === id);

export type House = { n: number; nom: string; domaine: string };
export const HOUSES: House[] = [
  { n: 1, nom: 'Maison I', domaine: 'Soi, le corps, l’allure, la façon de se lancer.' },
  { n: 2, nom: 'Maison II', domaine: 'L’argent, les ressources, ce que je valorise, l’estime de soi.' },
  { n: 3, nom: 'Maison III', domaine: 'La communication, les apprentissages, l’entourage proche, les petits trajets.' },
  { n: 4, nom: 'Maison IV', domaine: 'Le foyer, la famille, les racines, la sécurité intérieure.' },
  { n: 5, nom: 'Maison V', domaine: 'La créativité, le plaisir, les loisirs, l’amour, les enfants.' },
  { n: 6, nom: 'Maison VI', domaine: 'Le travail au quotidien, les routines, la santé, le service.' },
  { n: 7, nom: 'Maison VII', domaine: 'Le couple, les associations, l’autre en face de moi.' },
  { n: 8, nom: 'Maison VIII', domaine: 'Les transformations, l’intimité, les ressources partagées.' },
  { n: 9, nom: 'Maison IX', domaine: 'Les voyages lointains, la foi, les études, la quête de sens.' },
  { n: 10, nom: 'Maison X', domaine: 'La carrière, la réputation, la vocation, les accomplissements.' },
  { n: 11, nom: 'Maison XI', domaine: 'Les amis, les réseaux, les projets collectifs, les espoirs.' },
  { n: 12, nom: 'Maison XII', domaine: 'L’intériorité, le repos, le spirituel, ce qui se vit en retrait.' },
];
export const ROMAN = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];

export type AspectType = { id: string; label: string; angle: number; nature: 'fluide' | 'tendu' | 'ajustement' | 'fusion'; sens: string };
export const ASPECTS: AspectType[] = [
  { id: 'conjonction', label: 'Conjonction', angle: 0, nature: 'fusion', sens: 'Deux énergies mêlées : elles agissent ensemble, pour le meilleur et le plus intense.' },
  { id: 'semi-sextile', label: 'Semi-sextile', angle: 30, nature: 'fluide', sens: 'Un petit lien facilitant, discret mais utile.' },
  { id: 'semi-carre', label: 'Semi-carré', angle: 45, nature: 'tendu', sens: 'Une friction légère qui pousse à ajuster et à agir.' },
  { id: 'sextile', label: 'Sextile', angle: 60, nature: 'fluide', sens: 'Une opportunité : les deux énergies coopèrent si on s’en sert.' },
  { id: 'carre', label: 'Carré', angle: 90, nature: 'tendu', sens: 'Un défi moteur : une tension qui fait grandir.' },
  { id: 'trigone', label: 'Trigone', angle: 120, nature: 'fluide', sens: 'Une facilité naturelle, un talent qui coule de source.' },
  { id: 'quinconce', label: 'Quinconce', angle: 150, nature: 'ajustement', sens: 'Deux besoins qui ne se comprennent pas d’emblée : il faut sans cesse réajuster.' },
  { id: 'opposition', label: 'Opposition', angle: 180, nature: 'tendu', sens: 'Deux pôles à équilibrer, souvent révélés à travers les autres.' },
];
export const ORB = 5;

export type Placement = { id: PlanetId; sign: SignId; deg: number; house?: number; retro?: boolean };
export type Chart = { label?: string; naissance?: string; placements: Placement[] };

/** Longitude écliptique (0 à 360°). */
export const lonOf = (p: Placement) => signIndex(p.sign) * 30 + p.deg;
export const degLabel = (deg: number) => { const d = Math.floor(deg), m = Math.round((deg - d) * 60); return String(m === 60 ? d + 1 : d).padStart(2, '0') + '°' + String(m === 60 ? 0 : m).padStart(2, '0'); };

/** Aspects du ciel de naissance, calculés à partir des positions (orbe de 5°), avec leur puissance (100 % = exact). */
export function aspectsOf(chart: Chart) {
  const ps = chart.placements.filter((p) => p.id !== 'noeud_sud');
  const out: { a: Placement; b: Placement; type: AspectType; orb: number; power: number }[] = [];
  for (let i = 0; i < ps.length; i++) for (let j = i + 1; j < ps.length; j++) {
    const a = ps[i]!, b = ps[j]!;
    if ((a.id === 'noeud_nord' && b.id === 'ascendant') || (b.id === 'noeud_nord' && a.id === 'ascendant')) continue;
    let d = Math.abs(lonOf(a) - lonOf(b)) % 360; if (d > 180) d = 360 - d;
    for (const t of ASPECTS) { const orb = Math.abs(d - t.angle); if (orb <= ORB) { out.push({ a, b, type: t, orb: Math.round(orb * 100) / 100, power: Math.round((1 - orb / ORB) * 100) }); break; } }
  }
  return out.sort((x, y) => y.power - x.power);
}

/** Équilibre des éléments et des modes (planètes personnelles et ascendant comptent double). */
export function balanceOf(chart: Chart) {
  const el: Record<Element, number> = { Feu: 0, Terre: 0, Air: 0, Eau: 0 }, mo: Record<Mode, number> = { Cardinal: 0, Fixe: 0, Mutable: 0 };
  for (const p of chart.placements) {
    if (p.id === 'noeud_nord' || p.id === 'noeud_sud') continue;
    const s = signOf(p.sign)!, w = planetOf(p.id)?.perso ? 2 : 1;
    el[s.element] += w; mo[s.mode] += w;
  }
  const top = <T extends string>(r: Record<T, number>) => (Object.entries(r) as [T, number][]).sort((a, b) => b[1] - a[1]);
  return { elements: top(el), modes: top(mo) };
}
/** Maisons les plus habitées. */
export function housesOf(chart: Chart) {
  const m = new Map<number, Placement[]>();
  for (const p of chart.placements) if (p.house && p.id !== 'ascendant' && p.id !== 'noeud_sud') m.set(p.house, [...(m.get(p.house) ?? []), p]);
  return [...m.entries()].sort((a, b) => b[1].length - a[1].length || a[0] - b[0]);
}

const SIGN_WORDS: Record<string, SignId> = { 'bélier': 'belier', taureau: 'taureau', 'gémeaux': 'gemeaux', cancer: 'cancer', lion: 'lion', vierge: 'vierge', balance: 'balance', scorpion: 'scorpion', sagittaire: 'sagittaire', capricorne: 'capricorne', verseau: 'verseau', poissons: 'poissons' };
const PLANET_WORDS: [string, PlanetId][] = [['Nœud nord', 'noeud_nord'], ['Nœud sud', 'noeud_sud'], ['Soleil', 'soleil'], ['Lune', 'lune'], ['Mercure', 'mercure'], ['Vénus', 'venus'], ['Mars', 'mars'], ['Jupiter', 'jupiter'], ['Saturne', 'saturne'], ['Uranus', 'uranus'], ['Neptune', 'neptune'], ['Pluton', 'pluton']];
const ROMAN_N: Record<string, number> = Object.fromEntries(ROMAN.map((r, i) => [r, i]).filter(([r]) => r));
/** Lit le tableau « Planètes du ciel de naissance » et l'ascendant d'un thème Evozen copié-collé. */
export function parseEvozen(text: string): Chart | null {
  const t = text.replace(/ /g, ' ').replace(/Noeud/g, 'Nœud'), placements: Placement[] = [];
  const signs = Object.keys(SIGN_WORDS).join('|');
  for (const [word, id] of PLANET_WORDS) {
    const m = new RegExp(word + '\\s+(R\\s+)?(' + signs + ')\\s+(\\d{1,2})°(\\d{2})\\s+(XII|XI|X|IX|VIII|VII|VI|V|IV|III|II|I)\\b', 'i').exec(t);
    if (m) placements.push({ id, sign: SIGN_WORDS[m[2]!.toLowerCase()]!, deg: Number(m[3]) + Number(m[4]) / 60, house: ROMAN_N[m[5]!.toUpperCase()], retro: Boolean(m[1]) });
  }
  const asc = new RegExp('Ascendant\\s+(' + signs + ')[\\s\\S]{0,80}?(\\d{1,2})°(\\d{2})', 'i').exec(t);
  if (asc) placements.push({ id: 'ascendant', sign: SIGN_WORDS[asc[1]!.toLowerCase()]!, deg: Number(asc[2]) + Number(asc[3]) / 60, house: 1 });
  const birth = /Né·?e? le ([^\n]+?)(?:\n|$)/.exec(t)?.[1]?.trim();
  return placements.filter((p) => p.id !== 'ascendant').length >= 5 ? { placements, naissance: birth } : null;
}

/** Mon thème enregistré (le plus récent). */
export function chartOf(entries: Entry[]): { entry: Entry; chart: Chart } | null {
  const e = entries.filter((x) => x.kind === ASTRO_KIND && !x.data.proche).sort((a, b) => b.updated_at.localeCompare(a.updated_at))[0];
  const ps = e && Array.isArray(e.data.placements) ? (e.data.placements as Placement[]).filter((p) => signOf(p.sign) && planetOf(p.id)) : [];
  return e && ps.length ? { entry: e, chart: { placements: ps, label: String(e.data.label ?? ''), naissance: String(e.data.naissance ?? '') } } : null;
}

/** Lecture d'un placement : l'essentiel, les forces, les points de vigilance, un conseil et une question pour mon journal. */
export type Lecture = { titre: string; essentiel: string; forces: string[]; vigilance: string[]; conseil: string; question: string; details?: { titre: string; texte: string }[] };

/** Lectures reformulées à partir de mon thème Evozen (signes, maisons, aspects). */
export const LECTURES: Record<string, Lecture> = {
  'ascendant-lion': { titre: 'Ascendant Lion', essentiel: 'Ta manière d’aborder le monde est chaleureuse et lumineuse : tu donnes confiance, on te remarque, on a envie de te suivre.',
    forces: ['Charisme naturel et assurance', 'Talent pour guider, motiver, inspirer (management, transmission, création)', 'Générosité et grand cœur, perçus tout de suite', 'En amour : loyale, passionnée, attentions marquantes'],
    vigilance: ['Prendre trop de place dans une conversation sans t’en rendre compte', 'Avoir du mal à recevoir une critique ou à montrer une faiblesse', 'Attendre beaucoup de reconnaissance et souffrir quand elle manque'],
    conseil: 'Ta force grandit quand tu acceptes tes limites et les retours sincères : l’humilité rend ton rayonnement encore plus juste.', question: 'Quand ai-je accepté une critique récemment, et qu’est-ce qu’elle m’a appris ?', details: [{ titre: 'Ce que tu dégages', texte: 'Signe de Feu, le Lion donne une présence qui galvanise : on t’admire, on te suit, tu insuffles courage et optimisme autour de toi.' }, { titre: 'Au travail', texte: 'Ton leadership naturel t’oriente vers des rôles où il faut guider, inspirer ou transmettre : management, arts, éducation. L’ambition ne te manque pas. Ton mantra pourrait être : « être un exemple de force et d’inspiration ».' }, { titre: 'En amour', texte: 'Passionnée et généreuse, tu es une partenaire enthousiaste et loyale, qui aime prouver son amour par de grands gestes et attend en retour admiration et affection visibles. Le besoin de reconnaissance, s’il prend trop de place, peut créer de la frustration.' }, { titre: 'Ce que voient tes proches', texte: 'On te perçoit chaleureuse, avec un grand cœur. Tes proches savent aussi qu’il t’est difficile d’accepter une critique ou de montrer une faiblesse.' }, { titre: 'Ta leçon intérieure', texte: 'Reconnaître tes limites et accueillir les critiques constructives te rendra encore plus forte.' }] },
  'soleil-capricorne': { titre: 'Soleil en Capricorne', essentiel: 'Au cœur de toi : la persévérance. Tu avances avec méthode et sens du devoir vers des objectifs ambitieux, souvent avec une maturité précoce.',
    forces: ['Discipline, patience, endurance', 'Fiabilité en amitié et en amour, relations solides et durables', 'Excellente gestion de projets complexes (gestion, finance, organisation)', 'Prudence financière et vision long terme'],
    vigilance: ['Obstination, difficulté à plier', 'Réserve qui peut sembler froide', 'Peur de manquer qui freine des décisions et fait passer à côté d’opportunités', 'Surmenage : ton endurance te pousse à trop en faire'],
    conseil: 'Garde ta rigueur, mais programme aussi le repos : moments de retrait, activités créatives, détente sortent ton énergie de la seule performance.', question: 'De quoi ai-je peur de manquer, et est-ce encore vrai aujourd’hui ?', details: [{ titre: 'Ton essence', texte: 'Signe de Terre cardinal gouverné par Saturne : discipline, persévérance et ambition, avec souvent une maturité qui apparaît très tôt dans la vie.' }, { titre: 'Amitié et amour', texte: 'Fidèle et dévouée, tu offres une stabilité rassurante : tes relations sont solides et durables. Tu cherches quelqu’un qui partage tes valeurs de fidélité et d’effort et qui te tire vers le haut. Ta réserve peut parfois passer pour de la froideur.' }, { titre: 'Travail', texte: 'Rigueur, organisation et efficacité sur des projets complexes ; ta persévérance te mène vers des postes à responsabilités. Gestion, finance et administration te conviennent naturellement.' }, { titre: 'Argent', texte: 'Prudente et économe, tu veux une sécurité financière durable. Le revers : une inquiétude de manquer qui peut freiner les décisions et faire passer à côté de belles occasions.' }, { titre: 'Santé et bien-être', texte: 'Belle endurance, à condition de ne pas te surmener. Les temps d’isolement choisis, les activités artistiques et des méthodes de relaxation originales te font du bien.' }] },
  'lune-gemeaux': { titre: 'Lune en Gémeaux', essentiel: 'Ton monde émotionnel a besoin de mouvement : apprendre, parler, découvrir te nourrit. Tu t’adaptes vite et tu jongles avec aisance.',
    forces: ['Agilité d’esprit et curiosité', 'Facilité à communiquer et à créer du lien', 'Polyvalence, capacité à mener plusieurs choses de front'],
    vigilance: ['Dispersion de l’énergie', 'Difficulté à rester concentrée longtemps', 'Tendance à papillonner plutôt qu’approfondir un engagement'],
    conseil: 'Choisis peu de choses et approfondis-les : ta curiosité devient une force immense quand elle a un fil conducteur.', question: 'Quel sujet ou quel lien ai-je envie d’approfondir plutôt que de survoler ?', details: [{ titre: 'Ton fonctionnement émotionnel', texte: 'Tu te sens bien quand tu découvres, explores des sujets variés et partages tes idées. Tu circules avec aisance dans les situations sociales et intellectuelles complexes.' }, { titre: 'Ce qui te freine', texte: 'La quête permanente de stimulation peut rendre difficile l’investissement de long terme, dans un projet comme dans une relation, et la concentration sur les tâches qui demandent une attention soutenue. Veille à l’image de légèreté que cela peut renvoyer.' }] },
  'mercure-capricorne': { titre: 'Mercure en Capricorne', essentiel: 'Tu penses de façon structurée, sérieuse et pragmatique : tu analyses en profondeur et proposes des solutions solides, fondées sur les faits.',
    forces: ['Perspicacité et esprit d’analyse', 'Décisions réfléchies, crédibles', 'Parole sobre et précise'],
    vigilance: ['Rigidité face aux idées nouvelles ou peu conventionnelles', 'Un regard critique qui peut intimider les autres'],
    conseil: 'Laisse une place aux idées qui ne rentrent pas dans ton cadre : écoute jusqu’au bout avant de juger.', question: 'Quelle idée ai-je écartée trop vite cette semaine ?', details: [{ titre: 'Ta façon de penser', texte: 'Sobriété et rigueur : face à un défi, tu analyses chaque aspect pour proposer des solutions solides. Dans les décisions importantes fondées sur des faits, ton pragmatisme fait la différence.' }, { titre: 'Le revers', texte: 'Rigueur et prudence peuvent devenir rigidité : rejeter une idée parce qu’elle ne rentre pas dans ton modèle, ou intimider les autres qui craignent ton jugement.' }] },
  'venus-sagittaire': { titre: 'Vénus en Sagittaire', essentiel: 'Tu aimes avec optimisme et goût de l’aventure : l’amour doit faire grandir les deux, ouvrir des horizons, rester joyeux.',
    forces: ['Gaieté, humour qui désamorce les tensions', 'Envie de partager découvertes, voyages, idées', 'Partenaire stimulante et généreuse'],
    vigilance: ['Besoin de liberté parfois lu comme un manque d’engagement', 'Enthousiasme qui fait oublier des nuances importantes', 'Chercher la nouveauté au détriment de la profondeur des liens existants'],
    conseil: 'Ménage des temps calmes et stables dans tes relations : la profondeur est aussi une aventure.', question: 'Quelle relation mérite que je lui offre plus de constance ?', details: [{ titre: 'Ta façon d’aimer', texte: 'Optimiste, tu cherches un épanouissement personnel et partagé. Tu es du genre à proposer une escapade surprise pour ouvrir de nouveaux horizons à deux, et à utiliser l’humour pour apaiser une discussion difficile.' }, { titre: 'Le partenaire qui te correspond', texte: 'Quelqu’un qui partage ta soif de découvertes et ta joie de vivre, ouvert, curieux, capable de te suivre dans tes aventures intellectuelles et physiques.' }, { titre: 'Points sensibles', texte: 'Ton besoin de liberté peut être lu comme une réticence à t’engager, voire de l’égoïsme ; ton enthousiasme peut te faire oublier des nuances essentielles ou la profondeur des liens déjà là.' }, { titre: 'Ce que tu apportes', texte: 'Ouverture et optimisme : tu es une partenaire enrichissante, un souffle d’air frais pour ceux qui t’entourent.' }] },
  'mars-capricorne': { titre: 'Mars en Capricorne', essentiel: 'Ton énergie est celle de l’alpiniste : déterminée, méthodique, capable de surmonter les obstacles avec sang-froid. On peut compter sur toi.',
    forces: ['Détermination et persévérance', 'Planification et efficacité', 'Grand sens des responsabilités, réussite sur le long terme'],
    vigilance: ['Rigidité et obstination', 'Difficulté à décrocher du travail, équilibre vie pro / perso fragile', 'Exigence envers toi-même qui crée stress et anxiété'],
    conseil: 'Ton ambition est un moteur ; le lâcher-prise est ton carburant. Planifie aussi tes pauses.', question: 'Qu’est-ce que je pourrais lâcher cette semaine sans que rien ne s’écroule ?', details: [{ titre: 'Ton énergie', texte: 'Mars, planète de l’action, dans le signe de la discipline : tu poursuis tes objectifs avec persévérance et méthode, tu surmontes les obstacles avec sang-froid, et ta motivation te conduit à la réussite sur le long terme.' }, { titre: 'Ce qui peut coincer', texte: 'Tu peux t’obstiner même en ayant tort, avoir du mal à déconnecter du travail (au détriment de ton bien-être et de ta vie amoureuse) et te juger trop sévèrement, ce qui nourrit stress et anxiété.' }] },
  'jupiter-vierge': { titre: 'Jupiter en Vierge (rétrograde)', essentiel: 'Ta chance vient du travail bien fait : modeste et réaliste, tu es la personne de confiance dont on suit les conseils.',
    forces: ['Sens du détail et organisation méthodique', 'Fiabilité, engagements tenus', 'Évolution par le service et l’amélioration continue'],
    vigilance: ['Perdre la vue d’ensemble à force de détails', 'Prudence qui fait rater des opportunités', 'Tout planifier au point de laisser peu de place à la spontanéité', 'Risque d’épuisement par excès de dévouement'],
    conseil: 'Accueille un peu d’imprévu : la souplesse multiplie ta chance.', question: 'Quand me suis-je autorisée à improviser pour la dernière fois ?', details: [{ titre: 'Ta chance', texte: 'Contrairement aux placements de Jupiter qui poussent à l’excès, le tien rend modeste et réaliste. On te fait confiance pour des conseils judicieux et des solutions réfléchies ; ton dévouement et ta quête de qualité te font grandir personnellement et professionnellement.' }, { titre: 'En amour et au travail', texte: 'Vouloir tout planifier peut empêcher la spontanéité et l’abandon, importants pour une vie sentimentale épanouie. Au travail, ton éthique et ton sens du service peuvent mener au surmenage.' }] },
  'saturne-verseau': { titre: 'Saturne en Verseau', essentiel: 'Tu sais rendre concrètes des idées neuves : originalité et méthode se combinent, tes projets ont le mérite d’aboutir.',
    forces: ['Créativité réaliste et organisée', 'Penser autrement tout en structurant', 'Capacité d’adaptation face au changement'],
    vigilance: ['Indépendance qui peut isoler', 'Paraître inflexible', 'Grande déception quand une idée est refusée'],
    conseil: 'Cherche le juste milieu entre tes idées et les réalités du terrain, et partage tes projets tôt pour embarquer les autres.', question: 'Quelle idée neuve pourrais-je transformer en premier petit pas concret ?', details: [{ titre: 'Innovation et discipline', texte: 'Tu associes des idées novatrices à une approche pratique : créativité, réalisme et organisation se rejoignent, et tes idées se concrétisent souvent.' }, { titre: 'Exemple en amour', texte: 'Tu peux imaginer des sorties ou surprises originales pour l’autre, tout en veillant à ce qu’elles soient réalisables dans votre emploi du temps commun.' }, { titre: 'Le revers', texte: 'Une indépendance qui peut isoler ou faire oublier ce que les proches demandent, une image d’inflexibilité, et une vraie déception quand une proposition est refusée (par exemple une nouvelle façon de faire au travail).' }] },
  'uranus-capricorne': { titre: 'Uranus en Capricorne', essentiel: 'Planète de génération : tu fais partie de ceux qui veulent moderniser les structures, réinventer les cadres.', forces: ['Esprit de réforme', 'Innovation pratique'], vigilance: ['Impatience face aux règles'], conseil: 'Change les choses de l’intérieur, étape par étape.', question: 'Quel cadre de ma vie aimerais-je moderniser ?' },
  'neptune-capricorne': { titre: 'Neptune en Capricorne', essentiel: 'Planète de génération : un idéal qui cherche à se concrétiser, des rêves qu’on veut rendre solides.', forces: ['Rêves réalistes', 'Sens du service'], vigilance: ['Idéaliser le travail ou la réussite'], conseil: 'Donne une forme concrète à tes rêves, sans leur demander d’être parfaits.', question: 'Quel rêve mérite un plan ?' },
  'pluton-scorpion': { titre: 'Pluton en Scorpion', essentiel: 'Planète de génération : intensité, goût de la vérité et des transformations profondes.', forces: ['Résilience', 'Profondeur'], vigilance: ['Tout ou rien'], conseil: 'Laisse les choses se transformer à leur rythme.', question: 'Qu’est-ce qui est en train de mourir pour renaître dans ma vie ?' },
  'soleil-m6': { titre: 'Soleil en maison VI', essentiel: 'Tu brilles dans le quotidien bien organisé : la précision, les routines utiles, le soin du corps et des autres te ressemblent.',
    forces: ['Organisation et efficacité au jour le jour', 'Intérêt sincère pour la santé et le bien-être', 'Habitudes saines qui te maintiennent en forme'],
    vigilance: ['Autocritique et sévérité envers les autres', 'Perfectionnisme et difficulté à lâcher les détails', 'Inquiétude excessive pour la santé'],
    conseil: 'Prends soin de toi sans t’alarmer : la douceur fait partie d’une bonne routine.', question: 'Qu’ai-je fait de bien aujourd’hui, même si ce n’était pas parfait ?', details: [{ titre: 'Au quotidien', texte: 'Tu gères ta journée avec méthode, ce qui te rend efficace, et tu adoptes volontiers des habitudes saines qui entretiennent ta forme.' }, { titre: 'Le revers', texte: 'Perfectionnisme et autocritique génèrent du stress ; la peur de tomber malade peut parfois tourner à l’angoisse.' }, { titre: 'Ce que tu apportes', texte: 'Ton sens de l’organisation et ton souci du bien-être des autres créent autour de toi un environnement harmonieux et efficace.' }] },
  'lune-m11': { titre: 'Lune en maison XI', essentiel: 'Tes amis sont une famille choisie : tu te ressources dans le collectif, tu es souvent la confidente et la conseillère du groupe.',
    forces: ['Liens d’amitié profonds', 'Désir de contribuer au bien commun, causes humanitaires', 'Sens du collectif'],
    vigilance: ['Sensibilité aux opinions et aux critiques du groupe', 'S’effacer pour rester en accord avec les autres', 'Porter trop de responsabilités pour les autres'],
    conseil: 'Reste fidèle à tes convictions au sein du groupe, et prends soin de toi autant que des autres.', question: 'Dans quel groupe est-ce que je m’efface, et pourquoi ?', details: [{ titre: 'Tes liens', texte: 'Tu te relies aux autres par des affinités émotionnelles profondes et tu trouves du réconfort dans les cercles d’amis ou les associations. Les amis sont pour toi une famille élargie.' }, { titre: 'Points de vigilance', texte: 'Être très sensible aux avis du groupe, renoncer à tes opinions pour rester en phase, et prendre trop de responsabilités pour le bien collectif, jusqu’à la surcharge.' }] },
  'mercure-m6': { titre: 'Mercure en maison VI', essentiel: 'Tu aimes résoudre, optimiser, améliorer les systèmes : ta pensée est taillée pour l’organisation et la santé te passionne.',
    forces: ['Sens du détail, planification', 'Plaisir à optimiser les processus', 'Curiosité pour la nutrition et le bien-être', 'Attention fine aux besoins de l’autre'],
    vigilance: ['Stress quand les choses ne se passent pas comme prévu', 'Attachement trop fort à la routine'],
    conseil: 'Prévois une marge d’imprévu dans tes plans.', question: 'Quelle routine pourrais-je assouplir sans perdre l’essentiel ?', details: [{ titre: 'Au travail', texte: 'Résoudre, optimiser, améliorer les systèmes en place : ton attitude minimise les erreurs et les malentendus, et tu atteins presque toujours tes objectifs.' }, { titre: 'En amour', texte: 'Tu portes une attention particulière aux besoins de ton partenaire.' }] },
  'mars-m5': { titre: 'Mars en maison V', essentiel: 'Ton énergie s’exprime dans la création, les loisirs actifs et l’amour passionné : tu vis avec une joie contagieuse.',
    forces: ['Enthousiasme et créativité', 'Goût des loisirs actifs et des projets créatifs', 'Amour vivant et passionné'],
    vigilance: ['Risques pris par goût de l’excitation (argent, relations)'],
    conseil: 'Avant de foncer, prends un temps pour mesurer les conséquences.', question: 'Quel loisir actif me rend vraiment vivante ?', details: [{ titre: 'Ta joie de vivre', texte: 'Énergie et créativité rayonnent : loisirs actifs, divertissements, nouvelles aventures et projets créatifs t’attirent. L’amour doit avoir de l’élan et de la passion.' }, { titre: 'Le revers', texte: 'La recherche d’excitation peut mener à des risques inconsidérés, financiers ou relationnels.' }] },
  'venus-m5': { titre: 'Vénus en maison V', essentiel: 'Charme, imagination et joie : tu crées facilement des liens affectueux et tu aimes jouer avec la vie, l’art, les rencontres.',
    forces: ['Charisme et aisance en société', 'Imagination débordante, expression artistique', 'Liens affectifs joyeux'],
    vigilance: ['Préférer la passion à la durée', 'Rechercher l’attention et les compliments au point de s’éloigner de soi'],
    conseil: 'Répartis ton énergie de plaisir pour garder du temps pour ce qui compte vraiment.', question: 'Qu’est-ce que je fais pour être vue, et qu’est-ce que je fais pour moi ?', details: [{ titre: 'Ton charme', texte: 'Charismatique et à l’aise en société, tu attires l’affection et l’attention, souvent au centre des moments sociaux. Tu t’exprimes par l’art, le jeu et l’amour : tu aimes jouer avec la vie.' }, { titre: 'Le revers', texte: 'La quête de plaisir peut détourner des aspects sérieux de la vie ; en amour, préférer la passion éphémère à la profondeur ; et chercher les compliments au point de t’éloigner de ta vraie nature.' }] },
  'jupiter-m2': { titre: 'Jupiter en maison II', essentiel: 'Tu as du flair pour améliorer tes revenus et repérer de bonnes opportunités financières.',
    forces: ['Bonne intuition pour investir', 'Capacité à créer des sources de revenus'],
    vigilance: ['Dépenses excessives ou risques pris trop vite'],
    conseil: 'Associe ton flair à ta prudence de Capricorne : un plan, un budget, puis l’audace.', question: 'Quelle opportunité financière mérite que je l’étudie sérieusement ?', details: [{ titre: 'Tes ressources', texte: 'La maison II parle de tes biens, de ton argent et de ce que tu valorises. Tu as du flair pour bien investir et trouver des gains supplémentaires : une touche de chance, une capacité à « transformer le plomb en or ».' }, { titre: 'Le revers', texte: 'Une tendance possible à l’excès ou à l’imprudence : dépenser trop, ou prendre des risques sans mesurer les conséquences.' }] },
  'saturne-m6': { titre: 'Saturne en maison VI', essentiel: 'Tu t’investis pleinement dans le travail et la santé, avec des journées organisées et un grand sens du devoir.',
    forces: ['Exigence d’excellence', 'Programmes réguliers (alimentation, sport)'],
    vigilance: ['Habitudes trop strictes et pression excessive', 'Difficulté à s’adapter aux changements'],
    conseil: 'Garde la discipline, mais autorise la souplesse face aux imprévus.', question: 'Où pourrais-je remplacer « il faut » par « j’ai envie » ?', details: [{ titre: 'Ton quotidien', texte: 'Tu t’investis pleinement dans ton travail, vises l’excellence, et prends soin de ta santé avec rigueur : journées organisées, horaires précis pour les repas ou le sport, parfois un programme strict.' }, { titre: 'Ton défi', texte: 'Trouver l’équilibre entre la discipline qui te réussit et une flexibilité face aux imprévus, pour éviter la pression et l’anxiété.' }] },
  'uranus-m6': { titre: 'Uranus en maison VI', essentiel: 'Tu réinventes ta façon de travailler et de prendre soin de toi : méthodes nouvelles, solutions originales.',
    forces: ['Solutions surprenantes', 'Ouverture aux nouvelles façons de travailler'],
    vigilance: ['Difficulté avec les horaires et protocoles imposés', 'Préférer l’alternatif au détriment de soins éprouvés'],
    conseil: 'Innove dans ton quotidien en gardant un socle stable.', question: 'Quelle nouvelle méthode ai-je envie d’essayer dans mon organisation ?', details: [{ titre: 'Au travail', texte: 'Toujours à la recherche de nouvelles méthodes, tu fais évoluer ta carrière de façon originale, peux être en avance sur ton temps dans tes façons de travailler, et résous les problèmes de manière surprenante. On te voit comme une personne qui apporte du changement.' }, { titre: 'Santé', texte: 'Un intérêt possible pour des pratiques non conventionnelles. À garder en complément, sans délaisser les soins éprouvés.' }, { titre: 'Le revers', texte: 'Difficulté avec les horaires et protocoles, tensions possibles avec la hiérarchie, et une forme d’instabilité dans le quotidien.' }] },
  'neptune-m6': { titre: 'Neptune en maison VI', essentiel: 'Compassion et intuition guident ton travail : tu perçois ce dont les autres ont besoin et tu aimes aider.',
    forces: ['Empathie au service des autres', 'Imagination qui embellit les tâches répétitives', 'Intuition pour le bien-être'],
    vigilance: ['Surcharge émotionnelle et épuisement', 'Difficulté à poser des limites entre travail et vie perso'],
    conseil: 'Fixe des limites claires et prends soin de toi avec la même ferveur que tu prends soin des autres.', question: 'Quelle limite ai-je besoin de poser cette semaine ?', details: [{ titre: 'Tes talents', texte: 'Les métiers d’empathie et de service te correspondent (santé, conseil, accompagnement). Ton imagination rend agréables même les tâches répétitives, et ton intuition éclaire tes décisions de santé.' }, { titre: 'Le revers', texte: 'Une grande sensibilité aux ambiances qui peut mener à la surcharge, une charge de travail acceptée par compassion, et la tentation de fuir une réalité décevante par des échappatoires. Des limites claires sont ta meilleure protection.' }] },
  'pluton-m4': { titre: 'Pluton en maison IV', essentiel: 'Le foyer est pour toi un lieu de transformation : tu prends la famille au sérieux et tu aimes comprendre son histoire.',
    forces: ['Engagement profond envers la famille', 'Envie de transformer la maison en lieu chaleureux', 'Curiosité pour les racines'],
    vigilance: ['Vouloir imposer ta vision du foyer idéal', 'Tensions si l’autre a d’autres attentes'],
    conseil: 'Fais de la maison un espace d’épanouissement pour chacun, en respectant la liberté de ceux qui y vivent.', question: 'Qu’est-ce qu’un foyer apaisé signifie pour moi, et pour ceux avec qui je vis ?', details: [{ titre: 'Ta famille', texte: 'Tu abordes la famille avec sérieux, aimes fouiller l’histoire familiale, et peux jouer un rôle dans la révélation de vérités du passé. Tu pourrais transformer une maison familiale en lieu chaleureux pour les tiens.' }, { titre: 'Le revers', texte: 'Défendre fermement ta vision du foyer idéal peut créer des conflits, y compris en couple si l’autre a d’autres attentes.' }] },
  'lune-quinconce-pluton': { titre: 'Lune en quinconce avec Pluton', essentiel: 'Des émotions parfois très intenses, avec des hauts et des bas, qui naissent souvent de peurs profondes.', forces: ['Grande profondeur émotionnelle'], vigilance: ['Réactions fortes sous la pression', 'Jalousie ou possessivité en amour'], conseil: 'Apprends à nommer et canaliser la colère, la peur ou la tristesse avant d’agir.', question: 'Quelle peur se cache derrière ma dernière réaction forte ?', details: [{ titre: 'En amour', texte: 'Une intensité affective forte, des hauts et des bas, parfois de la jalousie ou de la possessivité, nourries par des peurs ou de l’insécurité.' }, { titre: 'Au travail', texte: 'Des réactions émotionnelles fortes sous la pression, et parfois trop d’affect là où il faudrait du recul.' }] },
  'mercure-semi-sextile-saturne': { titre: 'Mercure en semi-sextile avec Saturne', essentiel: 'Pensée méthodique et disciplinée : tu construis tes idées sur des bases solides.', forces: ['Logique et patience', 'Talent pour la recherche, l’enseignement, l’écrit technique'], vigilance: ['Oublier la spontanéité'], conseil: 'Garde une place pour l’improvisation.', question: 'Qu’est-ce que j’ai envie d’apprendre en profondeur ?', details: [{ titre: 'Ta pensée', texte: 'Tu abordes les situations avec logique et patience, en construisant tes plans sur une base réaliste : la clarté de Mercure et la rigueur de Saturne réunies.' }] },
  'mercure-conjonction-uranus': { titre: 'Mercure conjoint Uranus', essentiel: 'Un esprit vif et original, qui trouve des idées surprenantes et captive son public.', forces: ['Pensée rapide et innovante', 'Soif de connaissances'], vigilance: ['Paroles parfois trop directes', 'Concentration difficile sur les tâches longues'], conseil: 'Découpe les tâches longues en petites étapes et laisse respirer tes mots avant de les dire.', question: 'Quelle idée originale ai-je envie de partager ?', details: [{ titre: 'Ton style', texte: 'Ta façon de communiquer est unique et captive en présentation, à l’écrit ou en conversation. Tu te nourris de lectures très variées, des avancées scientifiques aux idées futuristes. Approche parfois mal comprise dans les milieux très traditionnels.' }] },
  'mercure-semi-carre-pluton': { titre: 'Mercure en semi-carré avec Pluton', essentiel: 'Une tendance à soupçonner des intentions cachées, qui peut créer des malentendus.', forces: ['Esprit pénétrant'], vigilance: ['Méfiance et mauvaises interprétations'], conseil: 'Vérifie avant de conclure : demande plutôt que deviner.', question: 'Qu’ai-je interprété récemment sans le vérifier ?', details: [{ titre: 'En amour et au travail', texte: 'Mal interpréter les mots de l’autre ou soupçonner des intentions cachées, par insécurité ou peur de l’inconnu ; au travail, des informations mal comprises ou des idées difficiles à faire passer. Chercher l’origine de cette méfiance apaise beaucoup les échanges.' }] },
  'mars-semi-sextile-saturne': { titre: 'Mars en semi-sextile avec Saturne', essentiel: 'Ton énergie est disciplinée : tu planifies et tu tiens dans la durée, comme un programme de sport suivi semaine après semaine.', forces: ['Persévérance', 'Endurance face aux obstacles'], vigilance: ['Rigidité si le plan change'], conseil: 'Ton atout pour les habitudes : de petits pas réguliers.', question: 'Quel objectif mérite un programme régulier ?', details: [{ titre: 'Ton atout', texte: 'Tu canalises ton énergie avec discipline : tu ne te lances pas à l’aveugle, tu planifies et tu tiens, dans tous les domaines de ta vie.' }] },
  'mars-semi-carre-pluton': { titre: 'Mars en semi-carré avec Pluton', essentiel: 'Une énergie très puissante, qui peut mener à des luttes de pouvoir ou à une ambition dévorante.', forces: ['Intensité, magnétisme', 'Grande capacité de transformation'], vigilance: ['Relations passionnées mais conflictuelles', 'Contrôle et domination'], conseil: 'Réfléchis à ta façon d’utiliser le pouvoir : mise au service d’un but juste, cette énergie devient un atout.', question: 'Où ai-je besoin de contrôler, et que se passerait-il si je lâchais un peu ?', details: [{ titre: 'En amour', texte: 'Une attraction intense, presque magnétique, qui peut virer à la lutte de pouvoir ou au contrôle.' }, { titre: 'Au travail', texte: 'Une ambition dévorante qui peut provoquer des confrontations ou pousser à contourner les règles.' }] },
  'jupiter-trigone-uranus': { titre: 'Jupiter en trigone avec Uranus', essentiel: 'Ton aspect le plus fort : chance, optimisme et goût du nouveau. Tu vois des opportunités que d’autres ne voient pas.', forces: ['Accueillir le changement avec enthousiasme', 'Rencontres stimulantes', 'En avance sur ton temps'], vigilance: ['Optimisme excessif', 'Sous-estimer les contraintes pratiques'], conseil: 'Avant de te lancer, liste les risques réels : ta chance fera le reste.', question: 'Quelle opportunité inattendue ai-je envie de saisir ?', details: [{ titre: 'Ta chance', texte: 'Tu vois au-delà des conventions, tu recherches le changement et trouves du bonheur dans la nouveauté et tout ce qui stimule l’esprit ou le cœur. Tu tires le meilleur des circonstances, même inattendues.' }] },
  'jupiter-trigone-neptune': { titre: 'Jupiter en trigone avec Neptune', essentiel: 'Ambition et inspiration se rejoignent : tu sais transformer tes rêves en projets concrets, avec empathie.', forces: ['Concrétiser ses rêves', 'Intuition très fine', 'Ambition sensible aux autres', 'Créativité (photo, musique, écriture)'], vigilance: ['Idéaliser les gens ou les résultats'], conseil: 'Rêve grand, vérifie les faits.', question: 'Quel rêve créatif pourrais-je nourrir cette semaine ?', details: [{ titre: 'Ton talent', texte: 'Tu transformes tes idées inspirées en projets concrets, tu concilies empathie et ambition, et tu t’adaptes facilement aux idées nouvelles. Ton intuition est très fine : on ne peut pas te cacher grand-chose.' }] },
};
const aspectKey = (a: PlanetId, t: string, b: PlanetId) => a + '-' + t + '-' + b;
/** Lecture d'un placement en signe, en maison ou d'un aspect (dans un sens ou dans l'autre). */
export const lectureSigne = (p: Placement) => LECTURES[p.id + '-' + p.sign];
export const lectureMaison = (p: Placement) => (p.house ? LECTURES[p.id + '-m' + p.house] : undefined);
export const lectureAspect = (a: PlanetId, t: string, b: PlanetId) => LECTURES[aspectKey(a, t, b)] ?? LECTURES[aspectKey(b, t, a)];

/** Lecture générale quand mon thème Evozen ne la détaille pas : la planète, colorée par le signe. */
export function lectureGenerique(p: Placement): Lecture {
  const pl = planetOf(p.id)!, s = signOf(p.sign)!;
  return { titre: pl.label + ' en ' + s.label, essentiel: pl.domaine + ' Ici, cette énergie prend la couleur du ' + s.label + ' : ' + s.essence.charAt(0).toLowerCase() + s.essence.slice(1),
    forces: s.mots.map((m) => m.charAt(0).toUpperCase() + m.slice(1)), vigilance: [s.ombre], conseil: 'Observe comment ' + s.mots[0] + ' s’exprime dans ce domaine de ta vie.', question: pl.question };
}

/** La synthèse de mon thème, construite à partir de ses dominantes. */
export function syntheseOf(chart: Chart) {
  const get = (id: PlanetId) => chart.placements.find((p) => p.id === id);
  const so = get('soleil'), lu = get('lune'), as = get('ascendant'), b = balanceOf(chart), h = housesOf(chart);
  const trio = [so && 'Soleil en ' + signOf(so.sign)!.label, lu && 'Lune en ' + signOf(lu.sign)!.label, as && 'Ascendant ' + signOf(as.sign)!.label].filter(Boolean).join(' · ');
  const [el1, el2] = b.elements, [mo1] = b.modes, [h1] = h;
  return { trio, element: el1![0], element2: el2![0], mode: mo1![0], maison: h1 ? { n: h1[0], planetes: h1[1].map((p) => planetOf(p.id)!.label) } : null };
}

export const ELEMENT_SENS: Record<Element, string> = { Feu: 'élan, enthousiasme, confiance', Terre: 'concret, constance, sens pratique', Air: 'idées, échanges, liens', Eau: 'émotions, intuition, empathie' };
export const MODE_SENS: Record<Mode, string> = { Cardinal: 'initier, lancer les projets', Fixe: 'tenir, approfondir, stabiliser', Mutable: 's’adapter, transmettre, évoluer' };

/** Une clé du jour : un conseil de mon thème, qui change chaque jour. */
export function cleDuJour(chart: Chart, day: string) {
  const keys = chart.placements.flatMap((p) => [lectureSigne(p), lectureMaison(p)]).filter((l): l is Lecture => Boolean(l));
  if (!keys.length) return null;
  const n = Math.floor(Date.parse(day + 'T12:00:00Z') / 86_400_000);
  return keys[((n % keys.length) + keys.length) % keys.length]!;
}

/** Pistes concrètes tirées de mon thème, par domaine de vie. */
export const PISTES: { domaine: string; points: string[] }[] = [
  { domaine: 'Travail et organisation', points: ['Cinq planètes en maison VI : ton quotidien, tes routines et ta façon de travailler sont un terrain central.', 'Tes atouts : rigueur, méthode, solutions originales, sens du service.', 'Ton défi : garder de la souplesse et ne pas te surcharger par dévouement.'] },
  { domaine: 'Amour et relations', points: ['Ascendant Lion et Vénus en Sagittaire en maison V : chaleur, joie, passion, envie de partager des aventures.', 'Lune en maison XI : tes amis sont une famille choisie.', 'Ton défi : accepter la critique, offrir de la constance, apaiser les émotions intenses.'] },
  { domaine: 'Argent', points: ['Jupiter en maison II : du flair pour les opportunités.', 'Soleil en Capricorne : prudence et vision long terme.', 'Ton défi : ni peur de manquer, ni dépense impulsive : un budget, puis l’audace.'] },
  { domaine: 'Bien-être et santé', points: ['Intérêt naturel pour la santé, la nutrition et les routines saines.', 'Risque de surmenage et d’inquiétude : prévois de vrais temps de repos.', 'Des activités créatives et des moments de retrait te ressourcent.'] },
  { domaine: 'Croissance personnelle', points: ['Jupiter en trigone avec Uranus et Neptune : chance, intuition, idées neuves qui se concrétisent.', 'Mars en semi-sextile avec Saturne : de petits pas réguliers te mènent loin.', 'Mars et Lune en tension avec Pluton : apprendre à canaliser l’intensité et le besoin de contrôle.'] },
];

/* ---------- Cycles de la Lune (Meeus, Astronomical Algorithms, chap. 49) et Soleil ---------- */
const rad = (d: number) => (d * Math.PI) / 180;
/** Date (UTC) d'une nouvelle lune (phase 0) ou d'une pleine lune (phase 0.5) pour le lunaison k depuis janvier 2000. */
export function moonPhaseDate(k: number, phase: 0 | 0.5) {
  const kk = k + phase, T = kk / 1236.85, T2 = T * T;
  const M = rad(2.5534 + 29.1053567 * kk - 0.0000014 * T2), Mp = rad(201.5643 + 385.81693528 * kk + 0.0107582 * T2);
  const F = rad(160.7108 + 390.67050284 * kk - 0.0016118 * T2), Om = rad(124.7746 - 1.56375588 * kk + 0.0020672 * T2), E = 1 - 0.002516 * T - 0.0000074 * T2;
  const c = phase === 0 ? [-0.4072, 0.17241, 0.01608, 0.01039, 0.00739, -0.00514, 0.00208] : [-0.40614, 0.17302, 0.01614, 0.01043, 0.00734, -0.00515, 0.00209];
  const corr = c[0]! * Math.sin(Mp) + c[1]! * E * Math.sin(M) + c[2]! * Math.sin(2 * Mp) + c[3]! * Math.sin(2 * F) + c[4]! * E * Math.sin(Mp - M) + c[5]! * E * Math.sin(Mp + M) + c[6]! * E * E * Math.sin(2 * M)
    - 0.00111 * Math.sin(Mp - 2 * F) - 0.00057 * Math.sin(Mp + 2 * F) + 0.00056 * E * Math.sin(2 * Mp + M) - 0.00042 * Math.sin(3 * Mp) + 0.00042 * E * Math.sin(M + 2 * F)
    + 0.00038 * E * Math.sin(M - 2 * F) - 0.00024 * E * Math.sin(2 * Mp - M) - 0.00017 * Math.sin(Om);
  const jde = 2451550.09766 + 29.530588861 * kk + 0.00015437 * T2 + corr;
  return new Date((jde - 2440587.5) * 86_400_000 - 69_000);
}
/** Longitude écliptique apparente du Soleil (précision de l'ordre du centième de degré). */
export function sunLongitude(date: Date) {
  const T = ((date.getTime() / 86_400_000 + 2440587.5) - 2451545) / 36525;
  const L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T, M = rad(357.52911 + 35999.05029 * T - 0.0001537 * T * T);
  const C = (1.914602 - 0.004817 * T) * Math.sin(M) + (0.019993 - 0.000101 * T) * Math.sin(2 * M) + 0.000289 * Math.sin(3 * M);
  return (((L0 + C - 0.00569 - 0.00478 * Math.sin(rad(125.04 - 1934.136 * T))) % 360) + 360) % 360;
}
const signAt = (lon: number) => SIGNS[Math.floor(lon / 30) % 12]!;
export type Lunaison = { type: 'nouvelle' | 'pleine'; date: Date; sign: Sign; deg: number; touche: Placement[] };
/** Les nouvelles et pleines lunes à venir, avec leur signe et les planètes de mon thème qu'elles touchent (à moins de 5°). */
export function lunaisons(from: Date, count: number, chart?: Chart): Lunaison[] {
  let k = Math.floor((from.getTime() - Date.UTC(2000, 0, 6)) / (29.530588861 * 86_400_000)) - 1;
  const out: Lunaison[] = [];
  while (out.length < count && k < 100000) {
    for (const phase of [0, 0.5] as const) {
      const date = moonPhaseDate(k, phase);
      if (date < from) continue;
      const lon = (sunLongitude(date) + (phase ? 180 : 0)) % 360;
      const touche = (chart?.placements ?? []).filter((p) => p.id !== 'noeud_sud' && Math.min(Math.abs(lonOf(p) - lon), 360 - Math.abs(lonOf(p) - lon)) <= ORB);
      out.push({ type: phase ? 'pleine' : 'nouvelle', date, sign: signAt(lon), deg: lon % 30, touche });
    }
    k++;
  }
  return out.slice(0, count);
}

/* ---------- Anniversaire solaire ---------- */
const MONTHS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
/** Date de naissance lue dans « 17 janvier 1992 à 18h25… ». */
export function birthOf(chart: Chart) {
  const m = /(\d{1,2})\s+([a-zéû]+)\s+(\d{4})/i.exec(chart.naissance ?? '');
  const mo = m ? MONTHS.indexOf(m[2]!.toLowerCase()) : -1;
  return m && mo >= 0 ? { day: Number(m[1]), month: mo + 1, year: Number(m[3]) } : null;
}
/** Jours avant mon prochain anniversaire solaire (0 = aujourd'hui) et l'âge que j'aurai. */
export function solarReturn(chart: Chart, today: string) {
  const b = birthOf(chart);
  if (!b) return null;
  const y = Number(today.slice(0, 4)), at = (yy: number) => yy + '-' + String(b.month).padStart(2, '0') + '-' + String(b.day).padStart(2, '0');
  const next = at(y) >= today ? at(y) : at(y + 1);
  return { date: next, days: Math.round((Date.parse(next + 'T12:00:00Z') - Date.parse(today + 'T12:00:00Z')) / 86_400_000), age: Number(next.slice(0, 4)) - b.year };
}

/* ---------- Compatibilité avec un proche ---------- */
const COMPATIBLES: Record<Element, Element[]> = { Feu: ['Feu', 'Air'], Air: ['Air', 'Feu'], Terre: ['Terre', 'Eau'], Eau: ['Eau', 'Terre'] };
const PERSO: PlanetId[] = ['soleil', 'lune', 'mercure', 'venus', 'mars', 'ascendant'];
/** Affinités entre deux thèmes : éléments des points personnels et aspects majeurs entre nos planètes personnelles. */
export function synastry(me: Chart, other: Chart) {
  const get = (c: Chart, id: PlanetId) => c.placements.find((p) => p.id === id);
  const pairs = (['soleil', 'lune', 'ascendant', 'venus', 'mars'] as PlanetId[]).flatMap((id) => { const a = get(me, id), b = get(other, id); if (!a || !b) return [];
    const ea = signOf(a.sign)!.element, eb = signOf(b.sign)!.element; return [{ id, a, b, accord: COMPATIBLES[ea].includes(eb) }]; });
  const majors = ASPECTS.filter((t) => ['conjonction', 'sextile', 'carre', 'trigone', 'opposition'].includes(t.id));
  const aspects: { a: Placement; b: Placement; type: AspectType; power: number }[] = [];
  for (const a of me.placements.filter((p) => PERSO.includes(p.id))) for (const b of other.placements.filter((p) => PERSO.includes(p.id))) {
    let d = Math.abs(lonOf(a) - lonOf(b)) % 360; if (d > 180) d = 360 - d;
    for (const t of majors) { const orb = Math.abs(d - t.angle); if (orb <= ORB) { aspects.push({ a, b, type: t, power: Math.round((1 - orb / ORB) * 100) }); break; } }
  }
  return { pairs, aspects: aspects.sort((x, y) => y.power - x.power), score: pairs.filter((p) => p.accord).length };
}
/** Les thèmes de mes proches (même format, avec leur prénom). */
export const prochesCharts = (entries: Entry[]) => entries.filter((e) => e.kind === ASTRO_KIND && typeof e.data.proche === 'string' && e.data.proche)
  .map((e) => ({ entry: e, nom: String(e.data.proche), chart: { placements: ((e.data.placements as Placement[]) ?? []).filter((p) => signOf(p.sign) && planetOf(p.id)), naissance: String(e.data.naissance ?? '') } as Chart }));

/* ---------- Habitudes et outils inspirés de mon thème ---------- */
export type HabitIdea = { title: string; why: string; icon: string; freq: 'daily' | 'week'; n?: number; source: string };
export const HABITUDES_THEME: HabitIdea[] = [
  { title: 'Une vraie pause par jour', why: 'Pour que ma détermination ne devienne pas du surmenage.', icon: 'bed', freq: 'daily', source: 'Mars et Soleil en Capricorne, Saturne en maison VI' },
  { title: 'Une activité créative', why: 'Dessiner, écrire, danser, photographier : ma joie de vivre s’y exprime.', icon: 'palette', freq: 'week', n: 2, source: 'Vénus et Mars en maison V, Jupiter trigone Neptune' },
  { title: 'Appeler ou voir une amie', why: 'Mes amis sont ma famille choisie.', icon: 'heart', freq: 'week', n: 2, source: 'Lune en maison XI' },
  { title: 'Un moment calme sans écran', why: 'Me protéger de la surcharge et poser des limites.', icon: 'phoneOff', freq: 'daily', source: 'Neptune en maison VI' },
  { title: 'Faire le point sur mon budget', why: 'Allier mon flair et ma prudence : un plan, puis l’audace.', icon: 'target', freq: 'week', n: 1, source: 'Jupiter en maison II, Soleil en Capricorne' },
  { title: 'Un moment spontané', why: 'Laisser de la place à l’imprévu, là où je planifie tout.', icon: 'sprout', freq: 'week', n: 1, source: 'Jupiter en Vierge' },
  { title: 'Trois lignes sur ce que je ressens', why: 'Nommer et apaiser les émotions intenses avant d’agir.', icon: 'feather', freq: 'daily', source: 'Lune en quinconce avec Pluton' },
  { title: '20 minutes d’apprentissage approfondi', why: 'Donner un fil conducteur à ma curiosité.', icon: 'book', freq: 'daily', source: 'Lune en Gémeaux' },
];
export type TccLien = { vigilance: string; source: string; distorsion: string; outil: string; nom: string };
export const TCC_THEME: TccLien[] = [
  { vigilance: 'Perfectionnisme, sévérité envers moi', source: 'Soleil en maison VI, Mars en Capricorne', distorsion: 'Les « il faut », « je dois »', outil: 'Colonnes de Beck', nom: 'ar-Rahîm' },
  { vigilance: 'Peur de manquer', source: 'Soleil en Capricorne', distorsion: 'Erreur de voyance', outil: 'Trier une inquiétude', nom: 'ar-Razzâq' },
  { vigilance: 'Soupçonner des intentions cachées', source: 'Mercure en semi-carré avec Pluton', distorsion: 'Lecture de pensée', outil: 'Colonnes de Beck', nom: 'al-‘Alîm' },
  { vigilance: 'Émotions très intenses', source: 'Lune en quinconce avec Pluton', distorsion: 'Raisonnement émotionnel', outil: 'Analyse ABC', nom: 'as-Salâm' },
  { vigilance: 'Difficulté à recevoir une critique', source: 'Ascendant Lion', distorsion: 'Étiquetage', outil: 'Expérience comportementale', nom: 'al-Hakîm' },
  { vigilance: 'Surcharge, difficulté à poser des limites', source: 'Neptune en maison VI, Lune en maison XI', distorsion: 'Personnalisation', outil: 'Résolution de problèmes', nom: 'al-Wakîl' },
];

/** Le cadre donné au coach IA quand je lui pose une question sur mon thème (seulement à ma demande). */
export function coachTheme(chart: Chart, numero?: string) {
  const s = syntheseOf(chart);
  const pos = chart.placements.map((p) => planetOf(p.id)!.label + ' en ' + signOf(p.sign)!.label + (p.house ? ' (maison ' + ROMAN[p.house] + ')' : '')).join(', ');
  const cles = chart.placements.flatMap((p) => [lectureSigne(p), lectureMaison(p)]).filter((l): l is Lecture => Boolean(l)).map((l) => '- ' + l.titre + ' : ' + l.essentiel).join('\n');
  return ['Tu accompagnes Aïda (34 ans, Dakar, musulmane pratiquante) qui explore son thème astral comme un outil de connaissance de soi, sans fatalisme ni prédiction.',
    'Son thème : ' + s.trio + '. Positions : ' + pos + '. Dominante ' + s.element + ', mode ' + s.mode + (s.maison ? ', maison ' + ROMAN[s.maison.n] + ' la plus habitée' : '') + '.',
    'Lectures de son thème :', cles, numero ? 'Numérologie : ' + numero + '.' : '',
    'Réponds en français, chaleureusement, en 150 à 250 mots, avec des phrases courtes et des pistes concrètes pour sa vie de tous les jours. Pas de prédiction, pas de citation religieuse précise.'].filter(Boolean).join('\n');
}
