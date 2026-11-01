import { useState } from 'react';
import { Check, ExternalLink } from 'lucide-react';
import type { Entry } from '../lib/cloud';

export type VideoEmbed = { platform: 'TikTok' | 'Instagram' | 'YouTube'; embed: string | null; url: string };

/** Reconnaît un lien TikTok, Instagram ou YouTube et prépare sa version intégrable (quand elle est possible). */
export function videoEmbed(raw: string): VideoEmbed | null {
  let u: URL;
  try { u = new URL(raw.trim()); } catch { return null; }
  if (u.protocol !== 'https:') return null;
  const host = u.hostname.replace(/^www\.|^m\./, '');
  if (host.endsWith('tiktok.com')) {
    const id = u.pathname.match(/\/video\/(\d+)/)?.[1];
    // Les liens courts (vm.tiktok.com/…) ne donnent pas l'identifiant : on propose seulement de l'ouvrir.
    return { platform: 'TikTok', embed: id ? 'https://www.tiktok.com/embed/v2/' + id : null, url: u.href };
  }
  if (host === 'instagram.com') {
    const m = u.pathname.match(/^\/(p|reel|reels|tv)\/([\w-]+)/);
    return { platform: 'Instagram', embed: m ? `https://www.instagram.com/${m[1] === 'reels' ? 'reel' : m[1]}/${m[2]}/embed` : null, url: u.href };
  }
  if (host === 'youtu.be' || host === 'youtube.com') {
    const id = host === 'youtu.be' ? u.pathname.slice(1) : u.searchParams.get('v') ?? u.pathname.match(/^\/(shorts|embed)\/([\w-]+)/)?.[2];
    return { platform: 'YouTube', embed: id && /^[\w-]{6,20}$/.test(id) ? 'https://www.youtube-nocookie.com/embed/' + id + '?rel=0' : null, url: u.href };
  }
  return null;
}

const lines = (v: unknown) => String(v ?? '').split('\n').map((l) => l.replace(/^\s*(?:[-•*]|\d+[.)])\s*/, '').trim()).filter(Boolean);

/** Fiche recette : vidéo intégrée, ingrédients à cocher pendant les courses ou la cuisine, étapes numérotées. */
export function RecipeView({ entry }: { entry: Entry }) {
  const ingredients = lines(entry.data.ingredients);
  const steps = lines(entry.data.steps);
  const video = typeof entry.data.video === 'string' && entry.data.video ? videoEmbed(entry.data.video) : null;
  const [got, setGot] = useState<Record<number, boolean>>({});
  const [showVideo, setShowVideo] = useState(false);
  if (!ingredients.length && !steps.length && !video) return null;
  return <div className="recipe-view">
    {video && (video.embed
      ? showVideo
        ? <div className={'recipe-video ' + video.platform.toLowerCase()}><iframe src={video.embed} title={'Vidéo ' + entry.title} allow="encrypted-media; picture-in-picture; fullscreen" loading="lazy" referrerPolicy="strict-origin-when-cross-origin" /></div>
        : <button className="button secondary" onClick={() => setShowVideo(true)}>Voir la vidéo {video.platform}</button>
      : null)}
    {video && <a className="link-btn recipe-link" href={video.url} target="_blank" rel="noopener noreferrer"><ExternalLink size={14} /> Ouvrir sur {video.platform}</a>}
    {ingredients.length > 0 && <section><h4>Ingrédients</h4>
      <ul className="recipe-ingredients">{ingredients.map((l, i) => <li key={i}>
        <button className={got[i] ? 'on' : ''} aria-pressed={Boolean(got[i])} onClick={() => setGot({ ...got, [i]: !got[i] })}>
          <span className="tick">{got[i] ? <Check size={14} strokeWidth={3} /> : null}</span><span>{l}</span></button>
      </li>)}</ul></section>}
    {steps.length > 0 && <section><h4>Étapes</h4>
      <ol className="recipe-steps">{steps.map((l, i) => <li key={i}><span className="num">{i + 1}</span><p>{l}</p></li>)}</ol></section>}
  </div>;
}
