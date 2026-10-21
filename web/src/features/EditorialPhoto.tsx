import { useEffect, useState } from 'react';
import { cloud } from '../lib/cloud';
import { WIKI_DESTINATIONS, WIKI_DISHES } from '../lib/editorialPhotos';
import type { PhotoItem } from '../lib/unsplashItems';

/** Évite les cartes, logos, drapeaux et illustrations présentés comme photos de lieux. */
const isPlacePhoto = (filename: string) =>
  !/(?:^|[_. -])(flag|drapeau|coat|arms|blason|emblem|logo|map|carte|locator|location|seal|collage|montage|diagram|icon|svg)(?:[_. -]|$)/i.test(filename)
  && !/\.(?:svg|png)$/i.test(filename);

const simplify = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/_/g, ' ').trim();

export type DestinationPhoto = { src: string; creditUrl: string };
/** Photo principale de pages Wikipédia (fr), chargées en une seule requête : { id: titre de page } → { id: photo }. */
function useWikiPhotos(titlesById: Record<string, string>): Record<string, DestinationPhoto> {
  const [images, setImages] = useState<Record<string, DestinationPhoto>>({});
  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({
      action: 'query', prop: 'pageimages', piprop: 'thumbnail', pithumbsize: '850',
      redirects: '1', format: 'json', origin: '*',
      titles: [...new Set(Object.values(titlesById))].join('|'),
    });
    fetch('https://fr.wikipedia.org/w/api.php?' + params, { signal: controller.signal })
      .then((response) => { if (!response.ok) throw new Error('Images indisponibles'); return response.json(); })
      .then((payload: { query?: { pages?: Record<string, { title: string; pageimage?: string; thumbnail?: { source: string } }>; redirects?: { from: string; to: string }[] } }) => {
        if (controller.signal.aborted) return;
        const redirects = new Map((payload.query?.redirects ?? []).map((r) => [simplify(r.from), simplify(r.to)]));
        const pages = Object.values(payload.query?.pages ?? {});
        const photos: Record<string, DestinationPhoto> = {};
        for (const [id, wikiTitle] of Object.entries(titlesById)) {
          const wanted = redirects.get(simplify(wikiTitle)) ?? simplify(wikiTitle);
          const page = pages.find((p) => simplify(p.title) === wanted);
          if (page?.thumbnail?.source?.startsWith('https://upload.wikimedia.org/') && page.pageimage && isPlacePhoto(page.pageimage)) {
            photos[id] = { src: page.thumbnail.source,
              creditUrl: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/' + encodeURIComponent(page.pageimage) };
          }
        }
        setImages(photos);
      })
      .catch(() => { /* Laisser le fond neutre si les photos sont indisponibles. */ });
    return () => controller.abort();
  }, [titlesById]);
  return images;
}

export const useDestinationPhotos = () => useWikiPhotos(WIKI_DESTINATIONS);
/** Photos des plats (clé = titre de page du plat), pour illustrer chaque recette par une vraie photo du plat. */
export const useDishPhotos = () => useWikiPhotos(WIKI_DISHES);

export type UnsplashPhoto = { src: string; author: string; authorUrl: string; photoUrl: string };
type Cache = Record<string, { p: UnsplashPhoto | null; at: number }>;
const UNSPLASH_CACHE = 'mt-unsplash-v2';
const readCache = (): Cache => { try { return JSON.parse(localStorage.getItem(UNSPLASH_CACHE) ?? '{}') as Cache; } catch { return {}; } };
// Une photo trouvée est gardée 14 jours sur l'appareil ; « aucune photo fiable » est redemandé après 3 jours.
const fresh = (c: Cache[string] | undefined) => Boolean(c && Date.now() - c.at < (c.p ? 14 : 3) * 86_400_000);
const inFlight = new Set<string>();

/** Photos Unsplash (via la fonction dish-photos, qui vérifie qu'elles correspondent et les garde en cache) : { clé: photo }. */
export function useUnsplash(items: Record<string, PhotoItem | null>): Record<string, UnsplashPhoto> {
  const keys = Object.keys(items).filter((k) => items[k]).sort().join('|');
  const pick = () => { const c = readCache(); return Object.fromEntries(keys.split('|').flatMap((k) => c[k]?.p ? [[k, c[k]!.p!]] : [])); };
  const [photos, setPhotos] = useState<Record<string, UnsplashPhoto>>(pick);
  useEffect(() => {
    setPhotos(pick());
    const cache = readCache();
    const missing = keys ? keys.split('|').filter((k) => !fresh(cache[k]) && !inFlight.has(k)).slice(0, 40) : [];
    if (!cloud || !missing.length) return;
    let active = true;
    missing.forEach((k) => inFlight.add(k));
    cloud.functions.invoke('dish-photos', { body: { items: Object.fromEntries(missing.map((k) => [k, items[k]])) } }).then(({ data, error }) => {
      if (error || !data?.photos) return;
      const next = readCache(), at = Date.now();
      for (const [k, p] of Object.entries(data.photos as Record<string, UnsplashPhoto>)) next[k] = { p, at };
      for (const k of (data.none ?? []) as string[]) next[k] = { p: null, at };
      try { localStorage.setItem(UNSPLASH_CACHE, JSON.stringify(next)); } catch { /* stockage indisponible */ }
      if (active) setPhotos(pick());
    }).catch(() => { /* photo Wikipédia ou visuel local en secours */ })
      .finally(() => missing.forEach((k) => inFlight.delete(k)));
    return () => { active = false; };
  }, [keys]);
  return photos;
}

/** Crédit obligatoire d'une photo Unsplash. */
export function UnsplashCredit({ photo }: { photo: UnsplashPhoto }) {
  return <span className="editorial-photo-credit">Photo <a href={photo.photoUrl} target="_blank" rel="noopener noreferrer">{photo.author}</a> · <a href="https://unsplash.com/?utm_source=my_thirties&utm_medium=referral" target="_blank" rel="noopener noreferrer">Unsplash</a></span>;
}

export function EditorialPhoto({ src, fallback, alt, className }: { src?: string; fallback?: string; alt: string; className: string }) {
  const [failed, setFailed] = useState(0);
  useEffect(() => setFailed(0), [src]);
  // Photo indisponible : visuel local s'il y en a un, sinon fond neutre (jamais une photo d'un autre lieu).
  const shown = failed === 0 && src ? src : failed <= 1 && fallback ? fallback : '';
  if (!shown) {
    return <div className={className + ' editorial-photo-placeholder'} role="img"
      aria-label="Photographie non disponible">
      <span>Photo non disponible</span>
    </div>;
  }
  return <img className={className} src={shown} alt={alt} loading="lazy"
    onError={() => setFailed(shown === src ? 1 : 2)} referrerPolicy="no-referrer" />;
}
