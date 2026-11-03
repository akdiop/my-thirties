import { useEffect, useRef, useState } from 'react';
import { Compass as CompassIcon } from 'lucide-react';
import type { Entry } from '../lib/cloud';
import { readSettings } from '../lib/prayertimes';

const KAABA = { lat: 21.4225, lon: 39.8262 };
const rad = (d: number) => (d * Math.PI) / 180;

/** Direction de la Qibla en degrés depuis le nord géographique. */
export function qiblaBearing(lat: number, lon: number) {
  const dl = rad(KAABA.lon - lon);
  const y = Math.sin(dl), x = Math.cos(rad(lat)) * Math.tan(rad(KAABA.lat)) - Math.sin(rad(lat)) * Math.cos(dl);
  return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
}
export function distanceToMakkah(lat: number, lon: number) {
  const a = Math.sin(rad(KAABA.lat - lat) / 2) ** 2 + Math.cos(rad(lat)) * Math.cos(rad(KAABA.lat)) * Math.sin(rad(KAABA.lon - lon) / 2) ** 2;
  return Math.round(6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

type OrientationCtor = { requestPermission?: () => Promise<'granted' | 'denied'> };

/** Boussole : la flèche indique la Qibla ; le cadran tourne avec le téléphone (iPhone : autorisation demandée une fois). */
export function Qibla({ entries }: { entries: Entry[] }) {
  const saved = readSettings(entries)?.settings;
  const [heading, setHeading] = useState<number | null>(null);
  const [state, setState] = useState<'idle' | 'on' | 'denied' | 'unsupported'>('idle');
  const aligned = useRef(false);
  const qibla = saved ? qiblaBearing(saved.lat, saved.lon) : null;

  useEffect(() => {
    if (state !== 'on') return;
    const onIos = (e: DeviceOrientationEvent & { webkitCompassHeading?: number }) => { if (typeof e.webkitCompassHeading === 'number') setHeading(e.webkitCompassHeading); };
    const onAbs = (e: DeviceOrientationEvent) => { if (e.absolute && typeof e.alpha === 'number') setHeading((360 - e.alpha) % 360); };
    window.addEventListener('deviceorientation', onIos as EventListener);
    window.addEventListener('deviceorientationabsolute', onAbs as EventListener);
    return () => { window.removeEventListener('deviceorientation', onIos as EventListener); window.removeEventListener('deviceorientationabsolute', onAbs as EventListener); };
  }, [state]);

  const start = async () => {
    if (typeof DeviceOrientationEvent === 'undefined') { setState('unsupported'); return; }
    const ctor = DeviceOrientationEvent as unknown as OrientationCtor;
    try { if (typeof ctor.requestPermission === 'function' && (await ctor.requestPermission()) !== 'granted') { setState('denied'); return; } setState('on'); }
    catch { setState('denied'); }
  };

  if (!saved || qibla === null) return <section className="soft-card qibla"><strong>Direction de la Qibla</strong>
    <p className="muted small">Indique d’abord ta position dans « Horaires des prières ».</p></section>;

  const diff = heading === null ? null : ((qibla - heading + 540) % 360) - 180;
  const facing = diff !== null && Math.abs(diff) <= 5;
  if (facing && !aligned.current) { aligned.current = true; navigator.vibrate?.(60); } else if (!facing) aligned.current = false;

  return <section className="soft-card qibla">
    <strong>Direction de la Qibla</strong>
    <p className="muted small">{saved.place.split(',')[0] || 'Ma position'} · {Math.round(qibla)}° depuis le nord · La Mecque à {distanceToMakkah(saved.lat, saved.lon).toLocaleString('fr-FR')} km</p>
    <div className={'qibla-dial' + (facing ? ' facing' : '')} aria-hidden="true">
      <div className="qibla-rose" style={{ transform: `rotate(${-(heading ?? 0)}deg)` }}>
        <span className="n">N</span><span className="e">E</span><span className="s">S</span><span className="w">O</span>
        <div className="qibla-needle" style={{ transform: `rotate(${qibla}deg)` }}><span className="kaaba" /></div>
      </div>
      <span className="qibla-top" />
    </div>
    {state === 'on' && heading !== null && <p className={'qibla-status' + (facing ? ' ok' : '')} role="status">
      {facing ? 'Tu es face à la Qibla' : diff! > 0 ? `Tourne à droite de ${Math.round(diff!)}°` : `Tourne à gauche de ${Math.round(-diff!)}°`}</p>}
    {state === 'on' && heading === null && <p className="muted small center">Bouge doucement le téléphone en forme de 8 pour calibrer la boussole.</p>}
    {state === 'idle' && <button className="button primary wide" onClick={() => void start()}><CompassIcon size={16} /> Activer la boussole</button>}
    {state === 'denied' && <p className="muted small">Boussole refusée. Sans elle, la flèche indique la Qibla quand le haut du téléphone pointe vers le nord.</p>}
    {state === 'unsupported' && <p className="muted small">Pas de boussole sur cet appareil : la flèche indique la Qibla quand le haut pointe vers le nord.</p>}
  </section>;
}
