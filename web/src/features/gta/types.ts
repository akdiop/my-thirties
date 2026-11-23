/** Référentiel GTA VI (données du kit fourni par Aïda, jamais modifiées par la progression). */
export type Mission = {
  id: string;
  chapter: number;
  order: number;
  title: string;
  type: string;
  description_fr: string;
  region: string;
  time_sensitive: boolean;
  character: string;
  reward_usd_verified: number | null;
  source_index: string;
  confidence: string;
  location_details_fr: string;
  missable_reward_notes_fr: string;
  detail_level: string;
  verified_scope: string | null;
  status_verification: string;
  source_detail_url: string | null;
  verification_date: string;
  region_general_hint: string;
  guide_steps_fr: string[];
  spoiler_level: string;
  map_grid_ref: string | null;
  map_precision: string;
  money_type: string;
  tags: string[];
};

export type Questline = { character: string; chapter: string; activities: string; note: string };

export type Location = { name: string; grid_row_approx: string; grid_col_approx: string; context: string; first_chapter_relevant: number; precision: string };

/** Récompense de mission listée dans le kit (montant annoncé, vérifié ou non). */
export type MissionReward = { title: string; amount_usd: number; type: string; chapter: number; location: string; verified: boolean; source: string; note?: string };

export type MoneyLocation = {
  id: string;
  title: string;
  region: string;
  chapter_min: number;
  category: string;
  amount_cash_reported: number | null;
  amount_other_nominal: number | null;
  amount_is_estimate: boolean;
  grid: string;
  difficulty: string;
  access: string;
  landmarks: string[];
  steps: string[];
  codes: Record<string, string>;
  notes: string[];
  verification: string;
  sources: string[];
};

export type GalleryAsset = {
  id: string;
  label: string;
  category: string;
  local_file?: string;
  external_url?: string;
  rights: string;
  source?: string;
  caption?: string;
  precision?: string;
};

/** Détails d'une fiche individuelle PowerPyx, traduits et reformulés (data/powerpyx_fr.json). */
export type MissionDetail = { lieu: string; donneur: string; condition: string; perso: string; recompense: string; synopsis?: string; etapes: string[]; url: string; montant: number | null; manquable: boolean };
/** Mission annexe (Strangers & Freaks, arcs de personnages) absente de l'index du kit. */
export type SideMission = MissionDetail & { id: string; arc: string; titre: string; chapitre: number; synopsis: string };
