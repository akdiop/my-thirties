import { useEffect, useState } from 'react';
import { WIKI_DESTINATIONS, WIKI_DISHES } from '../lib/editorialPhotos';

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

export function EditorialPhoto({ src, fallback, alt, className }: { src: string; fallback: string; alt: string; className: string }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
  if (!src || failed) {
    return <div className={className + ' editorial-photo-placeholder'} role="img"
      aria-label="Photographie de cette destination non disponible">
      <span>Photo de la destination non disponible</span>
    </div>;
  }
  return <img className={className} src={src} alt={alt} loading="lazy"
    onError={() => setFailed(true)} referrerPolicy="no-referrer" />;
}
