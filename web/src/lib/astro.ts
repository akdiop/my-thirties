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
  const e = entries.filter((x) => x.kind === ASTRO_KIND).sort((a, b) => b.updated_at.localeCompare(a.updated_at))[0];
  const ps = e && Array.isArray(e.data.placements) ? (e.data.placements as Placement[]).filter((p) => signOf(p.sign) && planetOf(p.id)) : [];
  return e && ps.length ? { entry: e, chart: { placements: ps, label: String(e.data.label ?? ''), naissance: String(e.data.naissance ?? '') } } : null;
}

/** Lecture d'un placement : l'essentiel, les forces, les points de vigilance, un conseil et une question pour mon journal. */
export type Lecture = { titre: string; essentiel: string; forces: string[]; vigilance: string[]; conseil: string; question: string };

/** Lectures reformulées à partir de mon thème Evozen (signes, maisons, aspects). */
export const LECTURES: Record<string, Lecture> = {
  'ascendant-lion': { titre: 'Ascendant Lion', essentiel: 'Ta manière d’aborder le monde est chaleureuse et lumineuse : tu donnes confiance, on te remarque, on a envie de te suivre.',
    forces: ['Charisme naturel et assurance', 'Talent pour guider, motiver, inspirer (management, transmission, création)', 'Générosité et grand cœur, perçus tout de suite', 'En amour : loyale, passionnée, attentions marquantes'],
    vigilance: ['Prendre trop de place dans une conversation sans t’en rendre compte', 'Avoir du mal à recevoir une critique ou à montrer une faiblesse', 'Attendre beaucoup de reconnaissance et souffrir quand elle manque'],
    conseil: 'Ta force grandit quand tu acceptes tes limites et les retours sincères : l’humilité rend ton rayonnement encore plus juste.', question: 'Quand ai-je accepté une critique récemment, et qu’est-ce qu’elle m’a appris ?' },
  'soleil-capricorne': { titre: 'Soleil en Capricorne', essentiel: 'Au cœur de toi : la persévérance. Tu avances avec méthode et sens du devoir vers des objectifs ambitieux, souvent avec une maturité précoce.',
    forces: ['Discipline, patience, endurance', 'Fiabilité en amitié et en amour, relations solides et durables', 'Excellente gestion de projets complexes (gestion, finance, organisation)', 'Prudence financière et vision long terme'],
    vigilance: ['Obstination, difficulté à plier', 'Réserve qui peut sembler froide', 'Peur de manquer qui freine des décisions et fait passer à côté d’opportunités', 'Surmenage : ton endurance te pousse à trop en faire'],
    conseil: 'Garde ta rigueur, mais programme aussi le repos : moments de retrait, activités créatives, détente sortent ton énergie de la seule performance.', question: 'De quoi ai-je peur de manquer, et est-ce encore vrai aujourd’hui ?' },
  'lune-gemeaux': { titre: 'Lune en Gémeaux', essentiel: 'Ton monde émotionnel a besoin de mouvement : apprendre, parler, découvrir te nourrit. Tu t’adaptes vite et tu jongles avec aisance.',
    forces: ['Agilité d’esprit et curiosité', 'Facilité à communiquer et à créer du lien', 'Polyvalence, capacité à mener plusieurs choses de front'],
    vigilance: ['Dispersion de l’énergie', 'Difficulté à rester concentrée longtemps', 'Tendance à papillonner plutôt qu’approfondir un engagement'],
    conseil: 'Choisis peu de choses et approfondis-les : ta curiosité devient une force immense quand elle a un fil conducteur.', question: 'Quel sujet ou quel lien ai-je envie d’approfondir plutôt que de survoler ?' },
  'mercure-capricorne': { titre: 'Mercure en Capricorne', essentiel: 'Tu penses de façon structurée, sérieuse et pragmatique : tu analyses en profondeur et proposes des solutions solides, fondées sur les faits.',
    forces: ['Perspicacité et esprit d’analyse', 'Décisions réfléchies, crédibles', 'Parole sobre et précise'],
    vigilance: ['Rigidité face aux idées nouvelles ou peu conventionnelles', 'Un regard critique qui peut intimider les autres'],
    conseil: 'Laisse une place aux idées qui ne rentrent pas dans ton cadre : écoute jusqu’au bout avant de juger.', question: 'Quelle idée ai-je écartée trop vite cette semaine ?' },
  'venus-sagittaire': { titre: 'Vénus en Sagittaire', essentiel: 'Tu aimes avec optimisme et goût de l’aventure : l’amour doit faire grandir les deux, ouvrir des horizons, rester joyeux.',
    forces: ['Gaieté, humour qui désamorce les tensions', 'Envie de partager découvertes, voyages, idées', 'Partenaire stimulante et généreuse'],
    vigilance: ['Besoin de liberté parfois lu comme un manque d’engagement', 'Enthousiasme qui fait oublier des nuances importantes', 'Chercher la nouveauté au détriment de la profondeur des liens existants'],
    conseil: 'Ménage des temps calmes et stables dans tes relations : la profondeur est aussi une aventure.', question: 'Quelle relation mérite que je lui offre plus de constance ?' },
  'mars-capricorne': { titre: 'Mars en Capricorne', essentiel: 'Ton énergie est celle de l’alpiniste : déterminée, méthodique, capable de surmonter les obstacles avec sang-froid. On peut compter sur toi.',
    forces: ['Détermination et persévérance', 'Planification et efficacité', 'Grand sens des responsabilités, réussite sur le long terme'],
    vigilance: ['Rigidité et obstination', 'Difficulté à décrocher du travail, équilibre vie pro / perso fragile', 'Exigence envers toi-même qui crée stress et anxiété'],
    conseil: 'Ton ambition est un moteur ; le lâcher-prise est ton carburant. Planifie aussi tes pauses.', question: 'Qu’est-ce que je pourrais lâcher cette semaine sans que rien ne s’écroule ?' },
  'jupiter-vierge': { titre: 'Jupiter en Vierge (rétrograde)', essentiel: 'Ta chance vient du travail bien fait : modeste et réaliste, tu es la personne de confiance dont on suit les conseils.',
    forces: ['Sens du détail et organisation méthodique', 'Fiabilité, engagements tenus', 'Évolution par le service et l’amélioration continue'],
    vigilance: ['Perdre la vue d’ensemble à force de détails', 'Prudence qui fait rater des opportunités', 'Tout planifier au point de laisser peu de place à la spontanéité', 'Risque d’épuisement par excès de dévouement'],
    conseil: 'Accueille un peu d’imprévu : la souplesse multiplie ta chance.', question: 'Quand me suis-je autorisée à improviser pour la dernière fois ?' },
  'saturne-verseau': { titre: 'Saturne en Verseau', essentiel: 'Tu sais rendre concrètes des idées neuves : originalité et méthode se combinent, tes projets ont le mérite d’aboutir.',
    forces: ['Créativité réaliste et organisée', 'Penser autrement tout en structurant', 'Capacité d’adaptation face au changement'],
    vigilance: ['Indépendance qui peut isoler', 'Paraître inflexible', 'Grande déception quand une idée est refusée'],
    conseil: 'Cherche le juste milieu entre tes idées et les réalités du terrain, et partage tes projets tôt pour embarquer les autres.', question: 'Quelle idée neuve pourrais-je transformer en premier petit pas concret ?' },
  'uranus-capricorne': { titre: 'Uranus en Capricorne', essentiel: 'Planète de génération : tu fais partie de ceux qui veulent moderniser les structures, réinventer les cadres.', forces: ['Esprit de réforme', 'Innovation pratique'], vigilance: ['Impatience face aux règles'], conseil: 'Change les choses de l’intérieur, étape par étape.', question: 'Quel cadre de ma vie aimerais-je moderniser ?' },
  'neptune-capricorne': { titre: 'Neptune en Capricorne', essentiel: 'Planète de génération : un idéal qui cherche à se concrétiser, des rêves qu’on veut rendre solides.', forces: ['Rêves réalistes', 'Sens du service'], vigilance: ['Idéaliser le travail ou la réussite'], conseil: 'Donne une forme concrète à tes rêves, sans leur demander d’être parfaits.', question: 'Quel rêve mérite un plan ?' },
  'pluton-scorpion': { titre: 'Pluton en Scorpion', essentiel: 'Planète de génération : intensité, goût de la vérité et des transformations profondes.', forces: ['Résilience', 'Profondeur'], vigilance: ['Tout ou rien'], conseil: 'Laisse les choses se transformer à leur rythme.', question: 'Qu’est-ce qui est en train de mourir pour renaître dans ma vie ?' },
  'soleil-m6': { titre: 'Soleil en maison VI', essentiel: 'Tu brilles dans le quotidien bien organisé : la précision, les routines utiles, le soin du corps et des autres te ressemblent.',
    forces: ['Organisation et efficacité au jour le jour', 'Intérêt sincère pour la santé et le bien-être', 'Habitudes saines qui te maintiennent en forme'],
    vigilance: ['Autocritique et sévérité envers les autres', 'Perfectionnisme et difficulté à lâcher les détails', 'Inquiétude excessive pour la santé'],
    conseil: 'Prends soin de toi sans t’alarmer : la douceur fait partie d’une bonne routine.', question: 'Qu’ai-je fait de bien aujourd’hui, même si ce n’était pas parfait ?' },
  'lune-m11': { titre: 'Lune en maison XI', essentiel: 'Tes amis sont une famille choisie : tu te ressources dans le collectif, tu es souvent la confidente et la conseillère du groupe.',
    forces: ['Liens d’amitié profonds', 'Désir de contribuer au bien commun, causes humanitaires', 'Sens du collectif'],
    vigilance: ['Sensibilité aux opinions et aux critiques du groupe', 'S’effacer pour rester en accord avec les autres', 'Porter trop de responsabilités pour les autres'],
    conseil: 'Reste fidèle à tes convictions au sein du groupe, et prends soin de toi autant que des autres.', question: 'Dans quel groupe est-ce que je m’efface, et pourquoi ?' },
  'mercure-m6': { titre: 'Mercure en maison VI', essentiel: 'Tu aimes résoudre, optimiser, améliorer les systèmes : ta pensée est taillée pour l’organisation et la santé te passionne.',
    forces: ['Sens du détail, planification', 'Plaisir à optimiser les processus', 'Curiosité pour la nutrition et le bien-être', 'Attention fine aux besoins de l’autre'],
    vigilance: ['Stress quand les choses ne se passent pas comme prévu', 'Attachement trop fort à la routine'],
    conseil: 'Prévois une marge d’imprévu dans tes plans.', question: 'Quelle routine pourrais-je assouplir sans perdre l’essentiel ?' },
  'mars-m5': { titre: 'Mars en maison V', essentiel: 'Ton énergie s’exprime dans la création, les loisirs actifs et l’amour passionné : tu vis avec une joie contagieuse.',
    forces: ['Enthousiasme et créativité', 'Goût des loisirs actifs et des projets créatifs', 'Amour vivant et passionné'],
    vigilance: ['Risques pris par goût de l’excitation (argent, relations)'],
    conseil: 'Avant de foncer, prends un temps pour mesurer les conséquences.', question: 'Quel loisir actif me rend vraiment vivante ?' },
  'venus-m5': { titre: 'Vénus en maison V', essentiel: 'Charme, imagination et joie : tu crées facilement des liens affectueux et tu aimes jouer avec la vie, l’art, les rencontres.',
    forces: ['Charisme et aisance en société', 'Imagination débordante, expression artistique', 'Liens affectifs joyeux'],
    vigilance: ['Préférer la passion à la durée', 'Rechercher l’attention et les compliments au point de s’éloigner de soi'],
    conseil: 'Répartis ton énergie de plaisir pour garder du temps pour ce qui compte vraiment.', question: 'Qu’est-ce que je fais pour être vue, et qu’est-ce que je fais pour moi ?' },
  'jupiter-m2': { titre: 'Jupiter en maison II', essentiel: 'Tu as du flair pour améliorer tes revenus et repérer de bonnes opportunités financières.',
    forces: ['Bonne intuition pour investir', 'Capacité à créer des sources de revenus'],
    vigilance: ['Dépenses excessives ou risques pris trop vite'],
    conseil: 'Associe ton flair à ta prudence de Capricorne : un plan, un budget, puis l’audace.', question: 'Quelle opportunité financière mérite que je l’étudie sérieusement ?' },
  'saturne-m6': { titre: 'Saturne en maison VI', essentiel: 'Tu t’investis pleinement dans le travail et la santé, avec des journées organisées et un grand sens du devoir.',
    forces: ['Exigence d’excellence', 'Programmes réguliers (alimentation, sport)'],
    vigilance: ['Habitudes trop strictes et pression excessive', 'Difficulté à s’adapter aux changements'],
    conseil: 'Garde la discipline, mais autorise la souplesse face aux imprévus.', question: 'Où pourrais-je remplacer « il faut » par « j’ai envie » ?' },
  'uranus-m6': { titre: 'Uranus en maison VI', essentiel: 'Tu réinventes ta façon de travailler et de prendre soin de toi : méthodes nouvelles, solutions originales.',
    forces: ['Solutions surprenantes', 'Ouverture aux nouvelles façons de travailler'],
    vigilance: ['Difficulté avec les horaires et protocoles imposés', 'Préférer l’alternatif au détriment de soins éprouvés'],
    conseil: 'Innove dans ton quotidien en gardant un socle stable.', question: 'Quelle nouvelle méthode ai-je envie d’essayer dans mon organisation ?' },
  'neptune-m6': { titre: 'Neptune en maison VI', essentiel: 'Compassion et intuition guident ton travail : tu perçois ce dont les autres ont besoin et tu aimes aider.',
    forces: ['Empathie au service des autres', 'Imagination qui embellit les tâches répétitives', 'Intuition pour le bien-être'],
    vigilance: ['Surcharge émotionnelle et épuisement', 'Difficulté à poser des limites entre travail et vie perso'],
    conseil: 'Fixe des limites claires et prends soin de toi avec la même ferveur que tu prends soin des autres.', question: 'Quelle limite ai-je besoin de poser cette semaine ?' },
  'pluton-m4': { titre: 'Pluton en maison IV', essentiel: 'Le foyer est pour toi un lieu de transformation : tu prends la famille au sérieux et tu aimes comprendre son histoire.',
    forces: ['Engagement profond envers la famille', 'Envie de transformer la maison en lieu chaleureux', 'Curiosité pour les racines'],
    vigilance: ['Vouloir imposer ta vision du foyer idéal', 'Tensions si l’autre a d’autres attentes'],
    conseil: 'Fais de la maison un espace d’épanouissement pour chacun, en respectant la liberté de ceux qui y vivent.', question: 'Qu’est-ce qu’un foyer apaisé signifie pour moi, et pour ceux avec qui je vis ?' },
  'lune-quinconce-pluton': { titre: 'Lune en quinconce avec Pluton', essentiel: 'Des émotions parfois très intenses, avec des hauts et des bas, qui naissent souvent de peurs profondes.', forces: ['Grande profondeur émotionnelle'], vigilance: ['Réactions fortes sous la pression', 'Jalousie ou possessivité en amour'], conseil: 'Apprends à nommer et canaliser la colère, la peur ou la tristesse avant d’agir.', question: 'Quelle peur se cache derrière ma dernière réaction forte ?' },
  'mercure-semi-sextile-saturne': { titre: 'Mercure en semi-sextile avec Saturne', essentiel: 'Pensée méthodique et disciplinée : tu construis tes idées sur des bases solides.', forces: ['Logique et patience', 'Talent pour la recherche, l’enseignement, l’écrit technique'], vigilance: ['Oublier la spontanéité'], conseil: 'Garde une place pour l’improvisation.', question: 'Qu’est-ce que j’ai envie d’apprendre en profondeur ?' },
  'mercure-conjonction-uranus': { titre: 'Mercure conjoint Uranus', essentiel: 'Un esprit vif et original, qui trouve des idées surprenantes et captive son public.', forces: ['Pensée rapide et innovante', 'Soif de connaissances'], vigilance: ['Paroles parfois trop directes', 'Concentration difficile sur les tâches longues'], conseil: 'Découpe les tâches longues en petites étapes et laisse respirer tes mots avant de les dire.', question: 'Quelle idée originale ai-je envie de partager ?' },
  'mercure-semi-carre-pluton': { titre: 'Mercure en semi-carré avec Pluton', essentiel: 'Une tendance à soupçonner des intentions cachées, qui peut créer des malentendus.', forces: ['Esprit pénétrant'], vigilance: ['Méfiance et mauvaises interprétations'], conseil: 'Vérifie avant de conclure : demande plutôt que deviner.', question: 'Qu’ai-je interprété récemment sans le vérifier ?' },
  'mars-semi-sextile-saturne': { titre: 'Mars en semi-sextile avec Saturne', essentiel: 'Ton énergie est disciplinée : tu planifies et tu tiens dans la durée, comme un programme de sport suivi semaine après semaine.', forces: ['Persévérance', 'Endurance face aux obstacles'], vigilance: ['Rigidité si le plan change'], conseil: 'Ton atout pour les habitudes : de petits pas réguliers.', question: 'Quel objectif mérite un programme régulier ?' },
  'mars-semi-carre-pluton': { titre: 'Mars en semi-carré avec Pluton', essentiel: 'Une énergie très puissante, qui peut mener à des luttes de pouvoir ou à une ambition dévorante.', forces: ['Intensité, magnétisme', 'Grande capacité de transformation'], vigilance: ['Relations passionnées mais conflictuelles', 'Contrôle et domination'], conseil: 'Réfléchis à ta façon d’utiliser le pouvoir : mise au service d’un but juste, cette énergie devient un atout.', question: 'Où ai-je besoin de contrôler, et que se passerait-il si je lâchais un peu ?' },
  'jupiter-trigone-uranus': { titre: 'Jupiter en trigone avec Uranus', essentiel: 'Ton aspect le plus fort : chance, optimisme et goût du nouveau. Tu vois des opportunités que d’autres ne voient pas.', forces: ['Accueillir le changement avec enthousiasme', 'Rencontres stimulantes', 'En avance sur ton temps'], vigilance: ['Optimisme excessif', 'Sous-estimer les contraintes pratiques'], conseil: 'Avant de te lancer, liste les risques réels : ta chance fera le reste.', question: 'Quelle opportunité inattendue ai-je envie de saisir ?' },
  'jupiter-trigone-neptune': { titre: 'Jupiter en trigone avec Neptune', essentiel: 'Ambition et inspiration se rejoignent : tu sais transformer tes rêves en projets concrets, avec empathie.', forces: ['Concrétiser ses rêves', 'Intuition très fine', 'Ambition sensible aux autres', 'Créativité (photo, musique, écriture)'], vigilance: ['Idéaliser les gens ou les résultats'], conseil: 'Rêve grand, vérifie les faits.', question: 'Quel rêve créatif pourrais-je nourrir cette semaine ?' },
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
