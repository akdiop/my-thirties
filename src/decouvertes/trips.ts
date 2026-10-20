import { daysBetween, type ISODate } from '@/agenda/dates';

export const TRIP_STATUS_LABEL = { idea: 'Envie', planned: 'Prévu', done: 'Vécu' } as const;
export type TripStatus = keyof typeof TRIP_STATUS_LABEL;

export const TRIP_ITEM_LABEL = { step: 'Itinéraire', booking: 'Réservations', idea: 'À voir, à faire' } as const;
export type TripItemKind = keyof typeof TRIP_ITEM_LABEL;

/** Préparatifs génériques : les conditions d’entrée et de santé sont à vérifier sur les sources officielles, jamais supposées. */
export const PREPARATION_ITEMS = [
  'Vérifier les conditions d’entrée (visa, durée de validité du passeport) sur le site officiel du pays',
  'Consulter les conseils aux voyageurs de son ministère des Affaires étrangères',
  'Vérifier les vaccins recommandés auprès d’un professionnel de santé',
  'Réserver le transport',
  'Réserver l’hébergement',
  'Assurance voyage',
  'Prévenir sa banque et prévoir un moyen de paiement',
  'Copie des documents dans un endroit sûr',
];

export const PACKING_ITEMS = [
  'Passeport ou carte d’identité',
  'Billets et réservations',
  'Chargeurs et adaptateur',
  'Trousse de toilette',
  'Médicaments habituels',
  'Tenues pour chaque jour',
  'Pyjama',
  'Chaussures confortables',
];

export function tripCountdown(t: { startDate: string | null; endDate: string | null }, today: ISODate) {
  if (!t.startDate) return null;
  if (today < t.startDate) {
    const d = daysBetween(today, t.startDate);
    return d === 1 ? 'Départ demain' : `Départ dans ${d} jours`;
  }
  if (!t.endDate || today <= t.endDate) return 'En voyage';
  return null;
}

export const tripNights = (t: { startDate: string | null; endDate: string | null }) => (t.startDate && t.endDate ? Math.max(0, daysBetween(t.startDate, t.endDate)) : null);
