import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode, type WheelEvent } from 'react';
import { Minus, Plus, RotateCcw } from 'lucide-react';
import type { Rect } from './mapGrid';

type View = { s: number; x: number; y: number };
type Props = { src: string; alt: string; children?: ReactNode; focus?: Rect | null; onTap?: (xPct: number, yPct: number) => void; hint?: ReactNode; className?: string };

const MAX = 8;

/** Visionneuse d'image avec zoom tactile (pincer), déplacement au doigt, molette, double-tap et clavier. Les calques enfants sont positionnés en % de l'image. */
export function ZoomView({ src, alt, children, focus, onTap, hint, className }: Props) {
  const box = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [ratio, setRatio] = useState(0);
  const [view, setView] = useState<View>({ s: 1, x: 0, y: 0 });
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const gesture = useRef<{ dist: number; view: View; mid: { x: number; y: number } } | null>(null);
  const tap = useRef<{ x: number; y: number; t: number; moved: boolean } | null>(null);
  const lastTap = useRef(0);

  useEffect(() => {
    const el = box.current; if (!el) return;
    const ro = new ResizeObserver(() => setSize({ w: el.clientWidth, h: el.clientHeight }));
    ro.observe(el); setSize({ w: el.clientWidth, h: el.clientHeight });
    return () => ro.disconnect();
  }, []);

  const imgH = size.w * (ratio || 1);
  const minScale = size.w && imgH ? Math.min(1, size.h / imgH) : 1;
  const clampView = (v: View): View => {
    const s = Math.min(MAX, Math.max(minScale, v.s));
    const w = size.w * s, h = imgH * s;
    const x = w <= size.w ? (size.w - w) / 2 : Math.min(0, Math.max(size.w - w, v.x));
    const y = h <= size.h ? (size.h - h) / 2 : Math.min(0, Math.max(size.h - h, v.y));
    return { s, x, y };
  };
  const fit = () => setView(clampView({ s: minScale, x: 0, y: 0 }));
  useEffect(() => { if (ratio && size.w) fit(); }, [ratio, size.w, size.h]); // eslint-disable-line react-hooks/exhaustive-deps

  /** Centre la vue sur un rectangle (en %) avec une marge. */
  useEffect(() => {
    if (!focus || !ratio || !size.w) return;
    const fw = (focus.w / 100) * size.w, fh = (focus.h / 100) * imgH;
    const s = Math.min(MAX, Math.max(minScale, Math.min(size.w / (fw * 2.2), size.h / (fh * 2.2))));
    const cx = ((focus.x + focus.w / 2) / 100) * size.w * s, cy = ((focus.y + focus.h / 2) / 100) * imgH * s;
    setView(clampView({ s, x: size.w / 2 - cx, y: size.h / 2 - cy }));
  }, [focus, ratio, size.w, size.h]); // eslint-disable-line react-hooks/exhaustive-deps

  const zoomAt = (factor: number, px: number, py: number) => setView((v) => {
    const s = Math.min(MAX, Math.max(minScale, v.s * factor)), k = s / v.s;
    return clampView({ s, x: px - (px - v.x) * k, y: py - (py - v.y) * k });
  });
  const local = (e: { clientX: number; clientY: number }) => { const r = box.current!.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };

  const down = (e: PointerEvent<HTMLDivElement>) => {
    box.current?.setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, local(e));
    if (pointers.current.size === 1) tap.current = { ...local(e), t: Date.now(), moved: false };
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()] as [{ x: number; y: number }, { x: number; y: number }];
      gesture.current = { dist: Math.hypot(a.x - b.x, a.y - b.y), view, mid: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 } };
      if (tap.current) tap.current.moved = true;
    }
  };
  const move = (e: PointerEvent<HTMLDivElement>) => {
    const prev = pointers.current.get(e.pointerId); if (!prev) return;
    const p = local(e); pointers.current.set(e.pointerId, p);
    if (pointers.current.size === 2 && gesture.current) {
      const [a, b] = [...pointers.current.values()] as [{ x: number; y: number }, { x: number; y: number }];
      const g = gesture.current, mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
      const s = Math.min(MAX, Math.max(minScale, g.view.s * (Math.hypot(a.x - b.x, a.y - b.y) / (g.dist || 1)))), k = s / g.view.s;
      setView(clampView({ s, x: mid.x - (g.mid.x - g.view.x) * k, y: mid.y - (g.mid.y - g.view.y) * k }));
    } else if (pointers.current.size === 1) {
      if (tap.current && Math.hypot(p.x - tap.current.x, p.y - tap.current.y) > 6) tap.current.moved = true;
      setView((v) => clampView({ ...v, x: v.x + p.x - prev.x, y: v.y + p.y - prev.y }));
    }
  };
  const up = (e: PointerEvent<HTMLDivElement>) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) gesture.current = null;
    const t = tap.current;
    if (pointers.current.size === 0 && t && !t.moved && Date.now() - t.t < 350) {
      const now = Date.now();
      if (now - lastTap.current < 300) { zoomAt(2, t.x, t.y); lastTap.current = 0; }
      else {
        lastTap.current = now;
        if (onTap) onTap(((t.x - view.x) / (size.w * view.s)) * 100, ((t.y - view.y) / (imgH * view.s)) * 100);
      }
    }
    if (pointers.current.size === 0) tap.current = null;
  };
  const wheel = (e: WheelEvent<HTMLDivElement>) => { const p = local(e); zoomAt(e.deltaY < 0 ? 1.15 : 1 / 1.15, p.x, p.y); };
  const key = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = 60, c = { x: size.w / 2, y: size.h / 2 };
    const map: Record<string, () => void> = {
      ArrowLeft: () => setView((v) => clampView({ ...v, x: v.x + step })), ArrowRight: () => setView((v) => clampView({ ...v, x: v.x - step })),
      ArrowUp: () => setView((v) => clampView({ ...v, y: v.y + step })), ArrowDown: () => setView((v) => clampView({ ...v, y: v.y - step })),
      '+': () => zoomAt(1.3, c.x, c.y), '=': () => zoomAt(1.3, c.x, c.y), '-': () => zoomAt(1 / 1.3, c.x, c.y), '0': fit,
    };
    if (map[e.key]) { e.preventDefault(); map[e.key]!(); }
  };

  return <div ref={box} className={'g-map' + (className ? ' ' + className : '')} tabIndex={0} role="application" aria-roledescription="carte zoomable"
    aria-label={alt + '. Pincer ou utiliser + et − pour zoomer, glisser ou les flèches pour se déplacer.'}
    onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} onWheel={wheel} onKeyDown={key}>
    <div className="g-map-inner" style={{ width: size.w || '100%', transform: `translate(${view.x}px, ${view.y}px) scale(${view.s})` }}>
      <img src={src} alt={alt} draggable={false} onLoad={(e) => setRatio(e.currentTarget.naturalHeight / e.currentTarget.naturalWidth)} />
      {ratio > 0 && <div className="g-overlay" style={{ ['--g-scale' as string]: String(view.s) }}>{children}</div>}
    </div>
    <div className="g-map-tools">
      <button type="button" className="g-icon" aria-label="Zoomer" onPointerDown={(e) => e.stopPropagation()} onClick={() => zoomAt(1.4, size.w / 2, size.h / 2)}><Plus size={18} /></button>
      <button type="button" className="g-icon" aria-label="Dézoomer" onPointerDown={(e) => e.stopPropagation()} onClick={() => zoomAt(1 / 1.4, size.w / 2, size.h / 2)}><Minus size={18} /></button>
      <button type="button" className="g-icon" aria-label="Voir toute l’image" onPointerDown={(e) => e.stopPropagation()} onClick={fit}><RotateCcw size={16} /></button>
    </div>
    {hint && <div className="g-map-hint" onPointerDown={(e) => e.stopPropagation()}>{hint}</div>}
  </div>;
}
