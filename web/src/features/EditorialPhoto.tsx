import { useEffect, useState } from 'react';
import { cloud } from '../lib/cloud';
import { UNSPLASH_QUERIES, WIKI_DESTINATIONS, WIKI_DISHES } from '../lib/editorialPhotos';

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
const UNSPLASH_CACHE = 'mt-unsplash-dishes-v1';
/** Photos Unsplash des plats (via la fonction dish-photos, qui garde les résultats en cache) : { plat: photo }. */
export function useUnsplashDishes(): Record<string, UnsplashPhoto> {
  const [photos, setPhotos] = useState<Record<string, UnsplashPhoto>>(() => {
    try { const c = JSON.parse(localStorage.getItem(UNSPLASH_CACHE) ?? 'null'); return c && Date.now() - c.at < 7 * 86_400_000 ? c.photos : {}; } catch { return {}; }
  });
  useEffect(() => {
    if (!cloud || Object.keys(photos).length) return;
    let active = true;
    cloud.functions.invoke('dish-photos', { body: { queries: UNSPLASH_QUERIES } }).then(({ data, error }) => {
      if (!active || error || !data?.photos) return;
      setPhotos(data.photos);
      try { localStorage.setItem(UNSPLASH_CACHE, JSON.stringify({ at: Date.now(), photos: data.photos })); } catch { /* stockage indisponible */ }
    }).catch(() => { /* Wikipédia puis visuel local en secours */ });
    return () => { active = false; };
  }, []);
  return photos;
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
