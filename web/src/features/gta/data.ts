import raw from './data/gta_vi_data.json';
import rawMoney from './data/money_locations.json';
import rawGallery from './data/gallery.json';
import type { GalleryAsset, Location, Mission, MissionReward, MoneyLocation, Questline } from './types';

const str = (v: unknown) => typeof v === 'string';
const num = (v: unknown) => typeof v === 'number' && Number.isFinite(v);
const strs = (v: unknown) => Array.isArray(v) && v.every(str);

/** Garde seulement les entrées conformes au schéma attendu ; les autres sont signalées et écartées. */
function keep<T>(list: unknown, ok: (x: Record<string, unknown>) => boolean, label: string): T[] {
  if (!Array.isArray(list)) { console.warn('GTA VI : ' + label + ' absent'); return []; }
  const out = list.filter((x): x is Record<string, unknown> => Boolean(x) && typeof x === 'object' && ok(x as Record<string, unknown>));
  if (out.length !== list.length) console.warn('GTA VI : ' + (list.length - out.length) + ' entrée(s) ' + label + ' écartée(s)');
  return out as T[];
}

export const isMission = (x: Record<string, unknown>) => str(x.id) && num(x.chapter) && num(x.order) && str(x.title) && str(x.description_fr) && str(x.region)
  && typeof x.time_sensitive === 'boolean' && (x.reward_usd_verified === null || num(x.reward_usd_verified)) && strs(x.guide_steps_fr) && strs(x.tags);
export const isMoneyLocation = (x: Record<string, unknown>) => str(x.id) && str(x.title) && num(x.chapter_min) && strs(x.steps) && strs(x.sources)
  && (x.amount_cash_reported === null || num(x.amount_cash_reported)) && (x.amount_other_nominal === null || num(x.amount_other_nominal)) && typeof x.codes === 'object';

const ref = raw as unknown as Record<string, unknown>;

export const DATA_VERSION = String(ref.data_version ?? '');
export const DATA_DISCLAIMER = String(ref.disclaimer ?? '');
export const SOURCE_URLS = strs(ref.source_urls) ? (ref.source_urls as string[]) : [];

export const MISSIONS: Mission[] = keep<Mission>(ref.missions, isMission, 'missions').sort((a, b) => a.chapter - b.chapter || a.order - b.order);
export const QUESTLINES: Questline[] = keep<Questline>(ref.questlines, (x) => str(x.character) && str(x.activities), 'arcs');
export const LOCATIONS: Location[] = keep<Location>(ref.places, (x) => str(x.name) && str(x.grid_row_approx) && str(x.grid_col_approx), 'lieux');
export const REWARDS: MissionReward[] = keep<MissionReward>(ref.money, (x) => str(x.title) && num(x.amount_usd) && typeof x.verified === 'boolean', 'récompenses');

const money = rawMoney as unknown as Record<string, unknown>;
export const MONEY_UNIT = String(money.money_unit ?? 'GTA$');
export const MONEY_WARNING = String(money.warning ?? '');
export const MONEY_PLACES: MoneyLocation[] = keep<MoneyLocation>(money.places, isMoneyLocation, 'caches');

/** La galerie fusionne le registre du kit : `file` (ajout Pelican Valley) devient `local_file`, `caption` sert de libellé. */
export const GALLERY: GalleryAsset[] = (rawGallery as Record<string, unknown>[]).map((g) => ({
  id: String(g.id), label: String(g.label ?? (g.id === 'pelican-swamps-overview' ? 'Marais de Pelican Valley' : g.caption ?? g.id)), category: String(g.category ?? (g.precision ? 'découpage de carte' : 'carte')),
  local_file: str(g.local_file) ? String(g.local_file) : str(g.file) ? String(g.file) : undefined,
  external_url: str(g.external_url) ? String(g.external_url) : undefined,
  rights: String(g.rights ?? ''), source: str(g.source) ? String(g.source) : undefined,
  caption: str(g.caption) ? String(g.caption) : undefined, precision: str(g.precision) ? String(g.precision) : undefined,
}));

export const CHAPTERS = [1, 2, 3, 4, 5] as const;

/** Une mission est « vérifiée » seulement si sa fiche individuelle a été contrôlée. */
export const missionVerified = (m: Mission) => m.status_verification === 'vérifié sur fiche individuelle';
export const missionMissable = (m: Mission) => m.time_sensitive || m.tags.includes('risque de manquer');
export const missionOptional = (m: Mission) => m.type === 'facultative';

/** Zone approximative de la carte pour une région de mission (aucune coordonnée précise n'est déduite). */
export const REGION_PLACE: Record<string, string> = { 'Key Lento et les Keys': 'Key Lento', 'Port Gellhorn / Kelly County': 'Port Gellhorn', 'Vice City': 'Vice City' };

/** Récompense annoncée pour une mission : celle de la liste des gains, sinon le champ de la fiche ; vérifiée seulement si la source le dit. */
export function rewardOf(m: Mission): { amount: number; verified: boolean; source: string } | null {
  const listed = REWARDS.find((r) => m.title === r.title || m.title.startsWith(r.title + ' ') || m.title.includes('] ' + r.title));
  if (listed) return { amount: listed.amount_usd, verified: listed.verified, source: listed.source };
  if (m.reward_usd_verified !== null) return { amount: m.reward_usd_verified, verified: missionVerified(m), source: m.source_detail_url ?? m.source_index };
  return null;
}

export const SIDE_CHARACTERS = QUESTLINES.map((q) => q.character);
