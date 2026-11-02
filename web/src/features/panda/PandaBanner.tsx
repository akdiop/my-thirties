import { assetUrl } from './assets';

/** Bannière illustrée du panda en tête d'un espace (rien si l'image n'est pas encore livrée). */
export function PandaBanner({ name, alt }: { name: string; alt: string }) {
  const src = assetUrl('banner_' + name);
  return src ? <img className="panda-banner" src={src} alt={alt} loading="lazy" decoding="async" /> : null;
}
