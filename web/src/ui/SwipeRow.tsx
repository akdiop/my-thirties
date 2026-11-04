import { useEffect, useId, useRef, useState, type ReactNode } from 'react';

export type SwipeAction = { label: string; icon?: ReactNode; tone?: 'danger' | 'accent' | 'neutral'; onClick: () => void };

const OPEN = 'mt-swipe-open';
const W = 76;

/** Ligne qu'on fait glisser vers la gauche pour révéler des actions (supprimer, épingler…), comme sur iPhone. */
export function SwipeRow({ actions, children, className }: { actions: SwipeAction[]; children: ReactNode; className?: string }) {
  const id = useId();
  const [x, setX] = useState(0);
  const [drag, setDrag] = useState(false);
  const start = useRef<{ x: number; y: number; base: number; axis: '' | 'x' | 'y' } | null>(null);
  const moved = useRef(false);
  const pos = useRef(0);
  const place = (v: number) => { pos.current = v; setX(v); };
  const max = actions.length * W;

  // Une seule ligne ouverte à la fois.
  useEffect(() => {
    const on = (e: Event) => { if ((e as CustomEvent<string>).detail !== id) place(0); };
    window.addEventListener(OPEN, on);
    return () => window.removeEventListener(OPEN, on);
  }, [id]);

  const onStart = (e: React.TouchEvent) => { const t = e.touches[0]!; start.current = { x: t.clientX, y: t.clientY, base: pos.current, axis: '' }; moved.current = false; };
  const onMove = (e: React.TouchEvent) => {
    const s = start.current; if (!s) return;
    const t = e.touches[0]!, dx = t.clientX - s.x, dy = t.clientY - s.y;
    if (!s.axis) { if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return; s.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y'; }
    if (s.axis !== 'x') return;
    moved.current = true; setDrag(true);
    place(Math.max(-max - 24, Math.min(0, s.base + dx)));
  };
  const onEnd = () => {
    const s = start.current; start.current = null; setDrag(false);
    if (!s || s.axis !== 'x') return;
    const open = pos.current < -max / 2;
    place(open ? -max : 0);
    if (open) window.dispatchEvent(new CustomEvent(OPEN, { detail: id }));
  };

  return <div className={'swipe' + (className ? ' ' + className : '')}>
    <div className="swipe-actions" style={{ width: max, visibility: x === 0 && !drag ? 'hidden' : 'visible' }} aria-hidden={x === 0}>
      {actions.map((a) => <button key={a.label} type="button" tabIndex={x === 0 ? -1 : 0} className={'swipe-btn ' + (a.tone ?? 'neutral')} onClick={() => { place(0); a.onClick(); }}>
        {a.icon}<span>{a.label}</span></button>)}
    </div>
    <div className={'swipe-content' + (drag ? ' dragging' : '')} style={{ transform: x ? `translateX(${x}px)` : undefined }}
      onTouchStart={onStart} onTouchMove={onMove} onTouchEnd={onEnd} onTouchCancel={onEnd}
      onClickCapture={(e) => { if (moved.current || x !== 0) { e.stopPropagation(); e.preventDefault(); moved.current = false; if (x !== 0) place(0); } }}>
      {children}
    </div>
  </div>;
}
