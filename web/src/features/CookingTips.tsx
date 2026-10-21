import { useState } from 'react';
import { ExternalLink, Play, Plus, Trash2 } from 'lucide-react';
import type { Entry } from '../lib/cloud';
import { SectionTitle } from '../ui/kit';

/** Gestes de base : une astuce écrite et une recherche de vidéos YouTube en français (pas de vidéo imposée). */
const TIPS: { theme: string; title: string; tip: string; search: string }[] = [
  { theme: 'Couteau', title: 'Émincer un oignon sans pleurer', tip: 'Garde la racine pour tenir l’oignon, couteau bien aiguisé, et passe-le 10 minutes au frais avant.', search: 'émincer un oignon technique chef' },
  { theme: 'Couteau', title: 'Tenir son couteau et ses doigts', tip: 'Prise en pince sur la lame, doigts de l’autre main repliés en griffe : le couteau glisse contre les phalanges.', search: 'tenir un couteau de cuisine griffe technique' },
  { theme: 'Couteau', title: 'Ciseler les herbes', tip: 'Herbes bien sèches, roulées en petit fagot, puis coupées finement d’un seul passage : sinon elles noircissent.', search: 'ciseler persil coriandre technique' },
  { theme: 'Couteau', title: 'Aiguiser son couteau', tip: 'Angle d’environ 15 à 20°, mêmes passages des deux côtés ; le fusil entretient le fil, la pierre l’aiguise.', search: 'aiguiser couteau pierre à aiguiser débutant' },
  { theme: 'Cuissons', title: 'Riz parfait à la casserole', tip: 'Rince le riz jusqu’à ce que l’eau soit claire, compte environ 1,5 volume d’eau, couvercle fermé, puis 10 minutes de repos hors du feu.', search: 'cuire le riz à la casserole méthode absorption' },
  { theme: 'Cuissons', title: 'Saisir une viande ou un poisson', tip: 'Poêle très chaude, produit bien sec et à température ambiante, et on ne le bouge pas tant qu’il n’est pas doré.', search: 'saisir viande poêle réaction de maillard' },
  { theme: 'Cuissons', title: 'Œuf poché', tip: 'Œuf très frais, eau frémissante (pas bouillante) avec un trait de vinaigre, environ 3 minutes.', search: 'oeuf poché technique facile' },
  { theme: 'Cuissons', title: 'Légumes rôtis bien dorés', tip: 'Four très chaud (200-220 °C), légumes en une seule couche, sans les entasser, et un peu d’huile.', search: 'légumes rôtis au four croustillants astuces' },
  { theme: 'Cuissons', title: 'Caraméliser des oignons', tip: 'Feu doux, une pincée de sel, et de la patience : 30 à 40 minutes en remuant de temps en temps (base du yassa).', search: 'oignons caramélisés technique lente' },
  { theme: 'Sauces', title: 'Vinaigrette et émulsion', tip: 'Moutarde d’abord, puis l’huile en filet en fouettant : la moutarde aide à lier.', search: 'vinaigrette émulsion moutarde technique' },
  { theme: 'Sauces', title: 'Rattraper une sauce trop salée ou trop liquide', tip: 'Trop liquide : réduire à découvert. Trop salée : allonger avec de l’eau, du lait de coco ou de la crème.', search: 'rattraper sauce trop salée trop liquide astuces' },
  { theme: 'Sauces', title: 'Faire une béchamel sans grumeaux', tip: 'Roux beurre-farine cuit 1 à 2 minutes, puis lait versé petit à petit en fouettant sans arrêt.', search: 'béchamel sans grumeaux technique' },
  { theme: 'Pâtisserie', title: 'Monter des blancs en neige', tip: 'Bol propre et sans gras, pas une trace de jaune, une pincée de sel ; commencer doucement puis accélérer.', search: 'monter blancs en neige ferme astuces' },
  { theme: 'Pâtisserie', title: 'Pâte à crêpes sans grumeaux', tip: 'Verser le liquide petit à petit au centre de la farine en fouettant, puis laisser reposer la pâte.', search: 'pâte à crêpes sans grumeaux astuce' },
  { theme: 'Pâtisserie', title: 'Peser et mesurer juste', tip: 'En pâtisserie, la balance prime sur les cuillères ; le four doit être préchauffé avant d’enfourner.', search: 'bases pâtisserie débutant erreurs à éviter' },
  { theme: 'Organisation', title: 'Batch cooking du dimanche', tip: 'Cuire 1 féculent, 1 protéine et 2 légumes en même temps, puis assembler différemment dans la semaine.', search: 'batch cooking semaine organisation débutant' },
  { theme: 'Organisation', title: 'Congeler sans perdre le goût', tip: 'Laisser refroidir avant de fermer, portions plates dans des sacs, étiquette avec la date.', search: 'congeler plats cuisinés astuces conservation' },
  { theme: 'Organisation', title: 'Mise en place', tip: 'Tout couper et préparer avant d’allumer le feu : la cuisson devient calme et rapide.', search: 'mise en place cuisine organisation chef' },
];
const THEMES = ['Tout', ...new Set(TIPS.map((t) => t.theme))];
const ytSearch = (q: string) => 'https://www.youtube.com/results?search_query=' + encodeURIComponent(q);

/** Identifiant d'une vidéo YouTube (watch, youtu.be, shorts, embed), sinon null. */
export function youtubeId(url: string): string | null {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^(www|m)\./, '');
    const id = host === 'youtu.be' ? u.pathname.slice(1) : host === 'youtube.com' || host === 'youtube-nocookie.com'
      ? u.searchParams.get('v') ?? u.pathname.match(/^\/(?:shorts|embed|live)\/([^/?]+)/)?.[1] ?? '' : '';
    return /^[\w-]{11}$/.test(id) ? id : null;
  } catch { return null; }
}
const safeUrl = (v: unknown) => { try { const u = new URL(String(v)); return u.protocol === 'https:' ? u.href : null; } catch { return null; } };

export function CookingTips({ entries, onAdd, onRemove }: { entries: Entry[]; onAdd: () => void; onRemove: (e: Entry) => Promise<void> }) {
  const [theme, setTheme] = useState('Tout');
  const [playing, setPlaying] = useState('');
  const mine = entries.filter((e) => e.kind === 'video');
  return <section className="tool-card cooking-tips">
    <SectionTitle>Mes vidéos astuces <span className="count">{mine.length}</span></SectionTitle>
    <p className="muted">Colle le lien d’une vidéo (YouTube, Instagram, TikTok…) pour la garder ici. Les vidéos YouTube se regardent directement dans l’app.</p>
    <button className="button secondary" onClick={onAdd}><Plus size={16} /> Ajouter une vidéo</button>
    <div className="video-list">{mine.map((e) => {
      const url = safeUrl(e.data.url), id = url ? youtubeId(url) : null;
      return <article key={e.id} className="video-card">
        {id && (playing === e.id
          ? <iframe className="video-frame" src={'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0'} title={e.title}
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />
          : <button className="video-thumb" onClick={() => setPlaying(e.id)} aria-label={'Lire ' + e.title}>
              <img src={'https://i.ytimg.com/vi/' + id + '/hqdefault.jpg'} alt="" loading="lazy" referrerPolicy="no-referrer" /><span><Play size={26} /></span></button>)}
        <div className="video-meta"><strong>{e.title}</strong>{typeof e.data.theme === 'string' && e.data.theme && <small>{e.data.theme}</small>}
          {typeof e.data.notes === 'string' && e.data.notes && <p>{e.data.notes}</p>}</div>
        <div className="button-group">
          {url && !id && <a className="button ghost" href={url} target="_blank" rel="noopener noreferrer"><ExternalLink size={15} /> Ouvrir</a>}
          <button className="button ghost" onClick={() => { if (confirm('Supprimer « ' + e.title + ' » ?')) void onRemove(e); }}><Trash2 size={15} /> Supprimer</button>
        </div>
      </article>;
    })}</div>

    <SectionTitle>Les gestes de base</SectionTitle>
    <div className="chip-row">{THEMES.map((t) => <button key={t} className={'chip' + (t === theme ? ' on' : '')} onClick={() => setTheme(t)}>{t}</button>)}</div>
    <div className="tip-list">{TIPS.filter((t) => theme === 'Tout' || t.theme === theme).map((t) => <article key={t.title} className="tip-card">
      <strong>{t.title}</strong><p>{t.tip}</p>
      <a className="link-btn" href={ytSearch(t.search)} target="_blank" rel="noopener noreferrer"><Play size={14} /> Voir des vidéos sur YouTube ↗</a>
    </article>)}</div>
  </section>;
}
