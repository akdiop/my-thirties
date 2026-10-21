import { useEffect, useState } from 'react';
import { WIKI_DESTINATIONS } from '../lib/editorialPhotos';

const simplify = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/_/g, ' ').trim();

export function useDestinationPhotos(): Record<string, string> {
  const [images, setImages] = useState<Record<string, string>>({});
  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({
      action: 'query', prop: 'pageimages', piprop: 'thumbnail', pithumbsize: '850',
      redirects: '1', format: 'json', origin: '*',
      titles: Object.values(WIKI_DESTINATIONS).join('|'),
    });
    fetch('https://fr.wikipedia.org/w/api.php?' + params, { signal: controller.signal })
      .then((response) => { if (!response.ok) throw new Error('Images indisponibles'); return response.json(); })
      .then((payload: { query?: { pages?: Record<string, { title: string; thumbnail?: { source: string } }>; redirects?: { from: string; to: string }[] } }) => {
        if (controller.signal.aborted) return;
        const redirects = new Map((payload.query?.redirects ?? []).map((r) => [simplify(r.from), simplify(r.to)]));
        const pages = Object.values(payload.query?.pages ?? {});
        const photos: Record<string, string> = {};
        for (const [id, wikiTitle] of Object.entries(WIKI_DESTINATIONS)) {
          const wanted = redirects.get(simplify(wikiTitle)) ?? simplify(wikiTitle);
          const page = pages.find((p) => simplify(p.title) === wanted);
          if (page?.thumbnail?.source?.startsWith('https://upload.wikimedia.org/')) photos[id] = page.thumbnail.source;
        }
        setImages(photos);
      })
      .catch(() => { /* Image d'ambiance locale conservée en cas d'indisponibilité. */ });
    return () => controller.abort();
  }, []);
  return images;
}

export function EditorialPhoto({ src, fallback, alt, className }: { src: string; fallback: string; alt: string; className: string }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
  return <img className={className} src={failed ? fallback : src} alt={alt} loading="lazy"
    onError={() => setFailed(true)} referrerPolicy="no-referrer" />;
}
