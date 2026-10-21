import { createContext, useContext, useState, type ReactNode } from 'react';
import { Camera } from 'lucide-react';
import { shrinkHero } from '../lib/photos';
import { defaultVisual, visualBackground } from '../lib/visuals';
import type { DestinationPhoto } from './EditorialPhoto';
import { templateById } from '../lib/challenges';
import { challengePhotoTheme } from '../lib/imageThemes';

type Photos = { photos: Record<string, string>; save: (slot: string, image: string | null) => Promise<void> };

export const PhotoContext = createContext<Photos>({ photos: {}, save: async () => {} });
/** Seul le tableau des défis charge les photographies communes ; pas une requête par carte. */
export const ChallengeImageContext = createContext<Record<string, DestinationPhoto>>({});

export const PhotoProvider = ({ value, children }: { value: Photos; children: ReactNode }) =>
  <PhotoContext.Provider value={value}>{children}</PhotoContext.Provider>;

/** Ambiances par défaut aux couleurs de la palette, utilisées tant qu'aucune photo n'a été choisie. */
const TONES: Record<string, string> = {
  caramel: 'linear-gradient(135deg,#d6b89f 0%,#c09072 45%,#6b3f2e 100%)',
  sauge: 'linear-gradient(135deg,#dfe3d3 0%,#8f9f7a 50%,#5e7a5f 100%)',
  sable: 'linear-gradient(135deg,#f1e9df 0%,#e9dccf 40%,#d4b483 100%)',
  chocolat: 'linear-gradient(135deg,#c09072 0%,#6b3f2e 55%,#3c2116 100%)',
};

export function HeroPhoto({ slot, tone = 'caramel', label, children, compact, curatedPhoto }: { slot: string; tone?: keyof typeof TONES; label: string; children?: ReactNode; compact?: boolean; curatedPhoto?: DestinationPhoto }) {
  const { photos, save } = useContext(PhotoContext);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const image = photos[slot];
  const challengeImages = useContext(ChallengeImageContext);
  const challenge = slot.startsWith('challenge-') ? templateById(slot.slice('challenge-'.length)) : undefined;
  const themeId = challenge ? challengePhotoTheme(challenge.category, challenge.discipline, challenge.title) : undefined;
  const illustration = !image && themeId ? challengeImages[themeId] : undefined;
  // Une vraie photo sportive locale prime sur l'illustration encyclopédique du thème.
  const exactSport = challenge && ['Pilates', 'Yoga', 'Tennis'].includes(challenge.discipline);
  const visual = image ? undefined : defaultVisual(slot);
  const useLocal = Boolean(visual && (!challenge || exactSport));
  const pick = async (file: File | undefined) => {
    if (!file) return;
    setBusy(true); setError('');
    try { await save(slot, await shrinkHero(file)); }
    catch (e) { setError(e instanceof Error ? e.message : 'Photo impossible à enregistrer.'); }
    finally { setBusy(false); }
  };
  const style = image ? { backgroundImage: `url(${image})` }
    : useLocal && visual ? { backgroundImage: `${visualBackground(visual)}, ${TONES[tone]}`, backgroundPosition: `${visual.position}, center` }
    : curatedPhoto ? { backgroundImage: `url("${curatedPhoto.src}"), ${TONES[tone]}`, backgroundPosition: 'center' }
    : illustration ? { backgroundImage: `url("${illustration.src}"), ${TONES[tone]}`, backgroundPosition: 'center' }
    : visual ? { backgroundImage: `${visualBackground(visual)}, ${TONES[tone]}`, backgroundPosition: `${visual.position}, center` }
    : { backgroundImage: TONES[tone] };
  return <div className={'hero-photo' + (compact ? ' compact' : '')} style={style}>
    {!image && !visual && !illustration && !curatedPhoto && <span className="hero-watermark" aria-hidden="true">{label}</span>}
    <div className="hero-shade">{children}</div>
    {!image && curatedPhoto && <a className="hero-theme-credit" href={curatedPhoto.creditUrl}
      target="_blank" rel="noopener noreferrer" title="Photographie de référence, pas une photo personnelle">
      Source photo · Wikimedia Commons ↗
    </a>}
    {!image && !curatedPhoto && !useLocal && illustration && <a className="hero-theme-credit" href={illustration.creditUrl}
      target="_blank" rel="noopener noreferrer" title="Photographie d'ambiance liée au thème, pas à ton activité personnelle">
      Photo d'ambiance · Wikimedia Commons ↗
    </a>}
    <label className="hero-change" title={'Changer la photo : ' + label}>
      <Camera size={15} /> <span>{busy ? '…' : image ? 'Changer' : 'Ma photo'}</span>
      <input type="file" accept="image/*" className="visually-hidden" disabled={busy} onChange={(e) => { void pick(e.target.files?.[0]); e.target.value = ''; }} />
    </label>
    {image && <button className="hero-remove" onClick={() => void save(slot, null)} aria-label={'Retirer la photo : ' + label}>×</button>}
    {error && <p className="hero-error" role="alert">{error}</p>}
  </div>;
}
