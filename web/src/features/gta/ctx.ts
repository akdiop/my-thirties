import type { GtaImages } from './images';
import type { Rect } from './mapGrid';
import type { GtaProgress } from './progress';

export type GtaTab = 'accueil' | 'missions' | 'carte' | 'argent' | 'astuces' | 'galerie' | 'collections';
export type MapFocus = { rect: Rect; label: string; key: number };
/** Ce que chaque onglet reçoit : la progression, la façon de la modifier, les images locales et la navigation interne. */
export type GtaCtx = {
  p: GtaProgress;
  update: (fn: (p: GtaProgress) => GtaProgress) => void;
  images: GtaImages;
  today: string;
  go: (tab: GtaTab) => void;
  openMission: (id: string) => void;
  openMoney: (id: string) => void;
  showOnMap: (rect: Rect, label: string) => void;
};
