import { createContext, useContext, useState, type ReactNode } from 'react';
import { Camera } from 'lucide-react';
import { shrinkHero } from '../lib/photos';
import { organicArt } from '../lib/organic';

type Photos = { photos: Record<string, string>; save: (slot: string, image: string | null) => Promise<void> };

export const PhotoContext = createContext<Photos>({ photos: {}, save: async () => {} });

export const PhotoProvider = ({ value, children }: { value: Photos; children: ReactNode }) =>
  <PhotoContext.Provider value={value}>{children}</PhotoContext.Provider>;

/** Ambiances par défaut aux couleurs de la palette, utilisées tant qu'aucune photo n'a été choisie. */
const TONES: Record<string, string> = {
  caramel: 'linear-gradient(135deg,#c6bfb0 0%,#b5ae9d 45%,#7e7254 100%)',
  sauge: 'linear-gradient(135deg,#dfe3d3 0%,#a9b8a2 50%,#5f7a59 100%)',
  sable: 'linear-gradient(135deg,#ebe8e1 0%,#e4e0d8 40%,#c7c0b0 100%)',
  chocolat: 'linear-gradient(135deg,#b5ae9d 0%,#7e7254 55%,#3a3833 100%)',
};

export function HeroPhoto({ slot, label, children, compact }: { slot: string; tone?: keyof typeof TONES; label: string; children?: ReactNode; compact?: boolean }) {
  const { photos, save } = useContext(PhotoContext);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const image = photos[slot];
  const pick = async (file: File | undefined) => {
    if (!file) return;
    setBusy(true); setError('');
    try { await save(slot, await shrinkHero(file)); }
    catch (e) { setError(e instanceof Error ? e.message : 'Photo impossible à enregistrer.'); }
    finally { setBusy(false); }
  };
  // Ma photo si j'en ai choisi une, sinon le visuel « formes organiques » propre à ce sujet.
  const style = image ? { backgroundImage: `url(${image})` } : { backgroundImage: organicArt(slot) };
  return <div className={'hero-photo' + (compact ? ' compact' : '') + (image ? '' : ' organic')} style={style}>
    <div className="hero-shade">{children}</div>
    <label className="hero-change" title={'Changer la photo : ' + label}>
      <Camera size={15} /> <span>{busy ? '…' : image ? 'Changer' : 'Ma photo'}</span>
      <input type="file" accept="image/*" className="visually-hidden" disabled={busy} onChange={(e) => { void pick(e.target.files?.[0]); e.target.value = ''; }} />
    </label>
    {image && <button className="hero-remove" onClick={() => void save(slot, null)} aria-label={'Retirer la photo : ' + label}>×</button>}
    {error && <p className="hero-error" role="alert">{error}</p>}
  </div>;
}
