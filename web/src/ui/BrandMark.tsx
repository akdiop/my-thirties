import { useId } from 'react';

/** Logo My Thirties : cercle peint d'un seul geste, jamais tout à fait fermé, avec « 30 » écrit à la main. */
export function BrandMark({ size = 44, tile = false }: { size?: number; tile?: boolean }) {
  const id = useId().replace(/:/g, '');
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true" className="brand-mark">
      <defs>
        <filter id={`brush${id}`} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves={2} seed={9} />
          <feDisplacementMap in="SourceGraphic" scale={3.4} />
        </filter>
      </defs>
      {tile && <rect width="100" height="100" rx="23" fill="#E7E3DB" />}
      <g filter={`url(#brush${id})`}>
        <circle cx="50" cy="50" r="31" fill="none" stroke="#B08A6E" strokeWidth="8" strokeLinecap="round" strokeDasharray="176 19" transform="rotate(-70 50 50)" />
        <circle cx="51" cy="49" r="35.5" fill="none" stroke="#B08A6E" strokeWidth="1.2" strokeLinecap="round" strokeDasharray="90 133" transform="rotate(-40 50 50)" opacity="0.7" />
      </g>
      <text x="50" y="60" textAnchor="middle" fontFamily="'Homemade Apple', cursive" fontSize="24" fill="#5F5A4F">30</text>
    </svg>
  );
}

/** Logo complet : la marque et « my thirties » écrit à la main. */
export function BrandLockup({ size = 52 }: { size?: number }) {
  return (
    <div className="brand-lockup">
      <BrandMark size={size} />
      <span className="brand-word">my thirties</span>
    </div>
  );
}
