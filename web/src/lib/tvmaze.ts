/**
 * Base de séries TVmaze (api.tvmaze.com : gratuite, sans clé, ouverte aux navigateurs).
 * Seul le titre recherché est envoyé ; rien de personnel.
 */
export type ShowHit = { id: number; name: string; year: string; network: string; image: string; genres: string[]; language: string };
export type ShowDetails = { seasonEpisodes: number[]; status: string };

const API = 'https://api.tvmaze.com';
const GENRES: Record<string, string> = {
  Drama: 'Drame', Comedy: 'Comédie', Thriller: 'Thriller', Crime: 'Policier', Romance: 'Romance', Fantasy: 'Fantastique',
  'Science-Fiction': 'Science-fiction', Documentary: 'Documentaire', Anime: 'Animation', Children: 'Animation',
};
const safeImg = (u: unknown) => typeof u === 'string' && u.startsWith('https://static.tvmaze.com/') ? u : '';

export async function searchShows(query: string, signal?: AbortSignal): Promise<ShowHit[]> {
  const res = await fetch(API + '/search/shows?q=' + encodeURIComponent(query.trim()), { signal });
  if (!res.ok) throw new Error('Recherche indisponible.');
  const list = await res.json() as { show: any }[];
  return list.slice(0, 8).map(({ show }) => ({
    id: Number(show.id), name: String(show.name ?? '').slice(0, 170), year: String(show.premiered ?? '').slice(0, 4),
    network: String(show.webChannel?.name ?? show.network?.name ?? ''), image: safeImg(show.image?.medium),
    genres: [...new Set((show.genres ?? []).map((g: string) => GENRES[g]).filter(Boolean))] as string[], language: String(show.language ?? ''),
  })).filter((s) => s.id && s.name);
}

/** Nombre d'épisodes de chaque saison déjà annoncée (les saisons sans épisodes connus sont ignorées). */
export async function showDetails(id: number): Promise<ShowDetails> {
  const [seasons, show] = await Promise.all([fetch(API + '/shows/' + id + '/seasons').then((r) => r.json()), fetch(API + '/shows/' + id).then((r) => r.json())]);
  const seasonEpisodes = (seasons as { number: number; episodeOrder: number | null }[])
    .filter((s) => s.number > 0 && Number(s.episodeOrder) > 0).map((s) => Number(s.episodeOrder));
  return { seasonEpisodes, status: String(show?.status ?? '') };
}

/** Plateforme de la liste de l'app si la série y est diffusée d'origine (sinon à choisir). */
export function platformOf(network: string, platforms: string[]) {
  const n = network.toLowerCase();
  if (n.includes('netflix')) return 'Netflix';
  if (n.includes('prime')) return 'Prime Video';
  if (n.includes('disney')) return 'Disney+';
  if (n.includes('apple')) return 'Apple TV+';
  if (n.includes('canal')) return 'Canal+';
  if (n === 'max' || n.includes('hbo')) return 'Max';
  if (n.includes('youtube')) return 'YouTube';
  return platforms.includes(network) ? network : '';
}
