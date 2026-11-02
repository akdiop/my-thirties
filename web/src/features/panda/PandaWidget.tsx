import { useMemo } from 'react';
import { Heart } from 'lucide-react';
import type { Entry } from '../../lib/cloud';
import { isoOf } from '../../lib/rituals';
import { Bar } from '../../ui/kit';
import { MESSAGES, PANDA_KIND, pick } from './data';
import { eventsFrom, progress, readState } from './engine';
import { PandaCharacter } from './PandaCharacter';
import { assetUrl } from './assets';

/** Le panda calculé à partir de mes données (lecture seule, aucune écriture ici). */
export function usePanda(entries: Entry[]) {
  const entry = entries.find((e) => e.kind === PANDA_KIND);
  const s = readState(entry?.data);
  const today = isoOf(new Date());
  const events = useMemo(() => eventsFrom(entries, s.prefs, today), [entries, s.prefs, today]);
  const pr = progress(events, s);
  return { entry, s, pr, today, events };
}

/** Widget permanent du tableau de bord. */
export function PandaWidget({ entries, onOpen }: { entries: Entry[]; onOpen: () => void }) {
  const { entry, s, pr, today } = usePanda(entries);
  const h = new Date().getHours();
  return <button className={'panda-card' + (s.prefs.animationsEnabled ? '' : ' no-anim')} onClick={onOpen} aria-label="Ouvrir Mon Panda">
    <span className="panda-card-art"><PandaCharacter size={72} level={pr.level.n} outfit={s.outfit} mood={h >= 22 || h < 6 ? 'sleepy' : 'happy'} /></span>
    <span className="panda-card-body">
      <small className="eyebrow">MON COMPAGNON</small>
      <strong>{entry ? s.name + ' · ' + pr.level.name : 'Adopte ton bébé panda'}</strong>
      {entry && <span className="panda-card-bar">{assetUrl('icon_coeur') ? <img src={assetUrl('icon_coeur')} alt="" className="pill-icon" /> : <Heart size={14} />}<Bar value={pr.span ? pr.into / pr.span : 1} tone="caramel" /><small>Niv. {pr.level.n}</small></span>}
      <small className="panda-bubble-mini">{entry ? pick(MESSAGES.hello, Number(today.replace(/-/g, ''))) : 'Un compagnon doux qui grandit avec toi.'}</small>
    </span>
  </button>;
}

