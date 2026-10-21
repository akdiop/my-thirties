import { createContext, useContext, useState, type ReactNode } from 'react';
import { Camera } from 'lucide-react';
import { shrinkHero } from '../lib/photos';
import { defaultVisual, visualBackground } from '../lib/visuals';

type Photos = { photos: Record<string, string>; save: (slot: string, image: string | null) => Promise<void> };

export const PhotoContext = createContext<Photos>({ photos: {}, save: async () => {} });

export const PhotoProvider = ({ value, children }: { value: Photos; children: ReactNode }) =>
  <PhotoContext.Provider value={value}>{children}</PhotoContext.Provider>;

/** Ambiances par défaut aux couleurs de la palette, utilisées tant qu'aucune photo n'a été choisie. */
const TONES: Record<string, string> = {
  caramel: 'linear-gradient(135deg,#d6b89f 0%,#c09072 45%,#6b3f2e 100%)',
  sauge: 'linear-gradient(135deg,#dfe3d3 0%,#8f9f7a 50%,#5e7a5f 100%)',
  sable: 'linear-gradient(135deg,#f1e9df 0%,#e9dccf 40%,#d4b483 100%)',
  chocolat: 'linear-gradient(135deg,#c09072 0%,#6b3f2e 55%,#3c2116 100%)',
};

export function HeroPhoto({ slot, tone = 'caramel', label, children, compact }: { slot: string; tone?: keyof typeof TONES; label: string; children?: ReactNode; compact?: boolean }) {
  const { photos, save } = useContext(PhotoContext);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const image = photos[slot];
  // Priorité : ma photo › visuel de la maquette › dégradé de la palette.
  const visual = image ? undefined : defaultVisual(slot);
  const pick = async (file: File | undefined) => {
    if (!file) return;
    setBusy(true); setError('');
    try { await save(slot, await shrinkHero(file)); }
    catch (e) { setError(e instanceof Error ? e.message : 'Photo impossible à enregistrer.'); }
    finally { setBusy(false); }
  };
  const style = image ? { backgroundImage: `url(${image})` }
    : visual ? { backgroundImage: `${visualBackground(visual)}, ${TONES[tone]}`, backgroundPosition: `${visual.position}, center` }
    : { backgroundImage: TONES[tone] };
  return <div className={'hero-photo' + (compact ? ' compact' : '')} style={style}>
    {!image && !visual && <span className="hero-watermark" aria-hidden="true">{label}</span>}
    <div className="hero-shade">{children}</div>
    <label className="hero-change" title={'Changer la photo : ' + label}>
      <Camera size={15} /> <span>{busy ? '…' : image ? 'Changer' : 'Ma photo'}</span>
      <input type="file" accept="image/*" className="visually-hidden" disabled={busy} onChange={(e) => { void pick(e.target.files?.[0]); e.target.value = ''; }} />
    </label>
    {image && <button className="hero-remove" onClick={() => void save(slot, null)} aria-label={'Retirer la photo : ' + label}>×</button>}
    {error && <p className="hero-error" role="alert">{error}</p>}
  </div>;
}
