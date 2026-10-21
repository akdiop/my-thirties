import { useEffect, useState } from 'react';
import { WIKI_DESTINATIONS, WIKI_DISHES } from '../lib/editorialPhotos';
import { RECIPE_PHOTO_LIBRARY } from '../recipes/recipePhotoLibrary';
import { CHALLENGE_THEME_PAGES, ENGLISH_DESTINATIONS } from '../lib/imageThemes';

/** Évite les cartes, logos, drapeaux et illustrations présentés comme photos de lieux. */
const isPlacePhoto = (filename: string) =>
  !/(?:^|[_. -])(flag|drapeau|coat|arms|blason|emblem|logo|map|carte|locator|location|seal|collage|montage|diagram|icon|svg)(?:[_. -]|$)/i.test(filename)
  && !/\.(?:svg|png)$/i.test(filename);

const simplify = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/_/g, ' ').trim();

export type DestinationPhoto = { src: string; creditUrl: string };
/** Photo principale de pages Wikipédia (fr), chargées en une seule requête : { id: titre de page } → { id: photo }. */
function useWikiPhotos(titlesById: Record<string, string>, lang: 'fr' | 'en' = 'fr'): Record<string, DestinationPhoto> {
  const [images, setImages] = useState<Record<string, DestinationPhoto>>({});
  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({
      action: 'query', prop: 'pageimages', piprop: 'thumbnail', pithumbsize: '850',
      redirects: '1', format: 'json', origin: '*',
      titles: [...new Set(Object.values(titlesById))].join('|'),
    });
    fetch('https://' + lang + '.wikipedia.org/w/api.php?' + params, { signal: controller.signal })
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
  }, [titlesById, lang]);
  return images;
}

/** Chaque destination est cherchée sur son article français puis anglais (même lieu identifié). */
export function useDestinationPhotos(): Record<string, DestinationPhoto> {
  const english = useWikiPhotos(ENGLISH_DESTINATIONS, 'en');
  const french = useWikiPhotos(WIKI_DESTINATIONS, 'fr');
  return { ...english, ...french };
}

/** Photos d'ambiance référencées par activité (sans recherche libre ou titre d'utilisateur). */
export const useChallengeThemePhotos = () => useWikiPhotos(CHALLENGE_THEME_PAGES, 'en');
/** Photos des plats (clé = titre de page du plat), pour illustrer chaque recette par une vraie photo du plat. */
export const useDishPhotos = () => useWikiPhotos(WIKI_DISHES);

/** Photographies sélectionnées individuellement et validées dans recipePhotoLibrary.ts.
 * Wikimedia Commons ne sert ici que les miniatures des fichiers préapprouvés.
 */
export function useVerifiedRecipePhotos(): Record<string, DestinationPhoto> {
  const [photos, setPhotos] = useState<Record<string, DestinationPhoto>>({});
  useEffect(() => {
    const controller = new AbortController();
    const verified = Object.entries(RECIPE_PHOTO_LIBRARY).filter(([, item]) => item.status === 'verified' && item.file);
    if (!verified.length) return;
    const params = new URLSearchParams({
      action: 'query', format: 'json', origin: '*', prop: 'imageinfo',
      iiprop: 'url|mime', iiurlwidth: '850',
      titles: verified.map(([, item]) => 'File:' + item.file).join('|'),
    });
    fetch('https://commons.wikimedia.org/w/api.php?' + params, { signal: controller.signal })
      .then((res) => { if (!res.ok) throw new Error('Miniatures indisponibles'); return res.json(); })
      .then((payload: { query?: { pages?: Record<string, { title: string; imageinfo?: { thumburl?: string; url?: string; mime?: string }[] }> } }) => {
        if (controller.signal.aborted) return;
        const pages = Object.values(payload.query?.pages ?? {});
        const approved: Record<string, DestinationPhoto> = {};
        for (const [id, item] of verified) {
          const page = pages.find((p) => simplify(p.title.replace(/^File:/i, '')) === simplify(item.file!));
          const info = page?.imageinfo?.[0];
          const src = info?.thumburl ?? info?.url;
          if (info?.mime?.startsWith('image/') && src?.startsWith('https://upload.wikimedia.org/')) {
            approved[id] = {
              src,
              creditUrl: 'https://commons.wikimedia.org/wiki/File:' + encodeURIComponent(item.file!.replace(/ /g, '_')),
            };
          }
        }
        setPhotos(approved);
      })
      .catch(() => { /* Aucun substitut : fond neutre. */ });
    return () => controller.abort();
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
