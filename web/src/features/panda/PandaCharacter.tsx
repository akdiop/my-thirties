import type { ItemId } from './data';
import type { PandaMood } from './types';
import { assetUrl } from './assets';
type OutfitId = string;

export type Mood = PandaMood;
const INK = '#6B4433', CREAM = '#FFF9F2', CARAMEL = '#C98A55', SAND = '#E9C79A';

const FUR = '#6E4A3C', LINE = '#4A3128', FACE = '#FBEADB', PAD = '#C08A5E', SCARF = '#9AA77E', EYE = '#3B2620';

/** Le panda en 2D, d'après la planche validée : visage crème pêche, grandes taches, yeux brillants, foulard sauge, coussinets caramel. */
export function PandaCharacter({ mood = 'idle', outfit = 'aucune', level = 1, size = 180, party = false }: { mood?: Mood; outfit?: OutfitId; level?: number; size?: number; party?: boolean }) {
  // Images livrées : panda_<expression> + calques acc_<tenue> / acc_fete, tous sur le même cadre 1024×1126.
  const img = assetUrl('panda_' + mood) || (mood !== 'idle' ? assetUrl('panda_idle') : '');
  if (img) {
    const grow = 0.84 + level * 0.032, layers = [outfit !== 'aucune' ? assetUrl('acc_' + outfit) : '', party ? assetUrl('acc_fete') : ''].filter(Boolean);
    return <span className={'panda-art panda-img mood-' + mood} style={{ width: size, height: size * 1.1 }} role="img" aria-label="Mon panda">
      <span className="panda-body" style={{ transform: `scale(${grow})` }}><img src={img} alt="" draggable={false} />{layers.map((l) => <img key={l} src={l} alt="" draggable={false} />)}</span>
    </span>;
  }
  const shut = mood === 'sleepy' || mood === 'calm' || mood === 'tea' || mood === 'proud';
  const joy = mood === 'happy' || mood === 'playful';
  const wave = mood === 'happy' || mood === 'playful';
  const grow = 0.84 + level * 0.032;
  return <svg className={'panda-art mood-' + mood} viewBox="0 0 200 220" width={size} height={size * 1.1} role="img" aria-label="Mon panda">
    <g transform={`translate(100 212) scale(${grow}) translate(-100 -212)`}>
      <ellipse cx="100" cy="212" rx="60" ry="6" fill="#000" opacity=".07" />
      <g className="panda-body">
        <ellipse cx="100" cy="164" rx="58" ry="47" fill={FACE} stroke={LINE} strokeWidth="3.5" />
        <ellipse cx="100" cy="196" rx="40" ry="10" fill="#EBD5C2" opacity=".7" />
        {/* bras */}
        <g className="panda-arms">
          <path d="M54 134 Q36 160 50 186 Q63 193 70 178 Q72 156 76 138Z" fill={FUR} stroke={LINE} strokeWidth="3" strokeLinejoin="round" />
          {!wave && <path d="M146 134 Q164 160 150 186 Q137 193 130 178 Q128 156 124 138Z" fill={FUR} stroke={LINE} strokeWidth="3" strokeLinejoin="round" />}
        </g>
        {/* pattes et coussinets */}
        {[64, 136].map((x) => <g key={x}><ellipse cx={x} cy="196" rx="24" ry="20" fill={FUR} stroke={LINE} strokeWidth="3" />
          <ellipse cx={x} cy="200" rx="10" ry="8.5" fill={PAD} /><circle cx={x - 10} cy="188" r="3.6" fill={PAD} /><circle cx={x} cy="185" r="3.6" fill={PAD} /><circle cx={x + 10} cy="188" r="3.6" fill={PAD} /></g>)}
        {mood === 'reading' && <g><path d="M72 150 L100 156 L128 150 L128 176 L100 182 L72 176Z" fill={CARAMEL} stroke={LINE} strokeWidth="3" /><path d="M100 156 V182" stroke={LINE} strokeWidth="2" /><path d="M110 164 q4 -4 7 0 q-3 5 -7 8 q-4 -3 -7 -8 q3 -4 7 0Z" fill={SAND} /></g>}
        {mood === 'tea' && <g><rect x="88" y="150" width="24" height="22" rx="5" fill={FACE} stroke={LINE} strokeWidth="3" /><path d="M96 158 q4 -4 8 0 q-4 6 -8 0Z" fill={CARAMEL} /><path className="steam" d="M96 142 q-4 -6 0 -12 M104 142 q4 -6 0 -12" stroke={LINE} strokeWidth="2" fill="none" opacity=".5" /></g>}
      </g>
      <g className="panda-head">
        <circle cx="48" cy="40" r="22" fill={FUR} stroke={LINE} strokeWidth="3.5" />
        <circle cx="152" cy="40" r="22" fill={FUR} stroke={LINE} strokeWidth="3.5" />
        <path d="M24 84 Q22 30 100 28 Q178 30 176 84 Q176 128 100 130 Q24 128 24 84Z" fill={FACE} stroke={LINE} strokeWidth="3.5" />
        {/* grandes taches des yeux */}
        <ellipse cx="68" cy="82" rx="21" ry="17" fill={FUR} transform="rotate(-18 68 82)" />
        <ellipse cx="132" cy="82" rx="21" ry="17" fill={FUR} transform="rotate(18 132 82)" />
        {shut ? <g stroke={FACE} strokeWidth="3.5" fill="none" strokeLinecap="round"><path d="M60 82 q8 7 16 0" /><path d="M124 82 q8 7 16 0" /></g>
          : joy ? <g stroke={EYE} strokeWidth="3.5" fill="none" strokeLinecap="round"><path d="M60 84 q8 -10 16 0" /><path d="M124 84 q8 -10 16 0" /></g>
          : <g className="panda-eyes"><circle cx="70" cy="82" r="8.5" fill={EYE} /><circle cx="130" cy="82" r="8.5" fill={EYE} /><circle cx="73" cy="78.5" r="2.8" fill="#fff" /><circle cx="133" cy="78.5" r="2.8" fill="#fff" /></g>}
        <ellipse cx="46" cy="106" rx="12" ry="8" fill="#F3B9A3" />
        <ellipse cx="154" cy="106" rx="12" ry="8" fill="#F3B9A3" />
        <path d="M94 95 q6 -4 12 0 q-1 6 -6 7 q-5 -1 -6 -7Z" fill={EYE} />
        {mood === 'surprised' ? <ellipse cx="100" cy="112" rx="5" ry="6" fill="#D9776A" stroke={LINE} strokeWidth="2.5" />
          : joy || mood === 'eating' ? <path d="M90 106 q10 15 20 0Z" fill="#D9776A" stroke={LINE} strokeWidth="2.5" strokeLinejoin="round" />
          : mood === 'sleepy' ? <ellipse cx="100" cy="110" rx="3" ry="3.5" fill={EYE} />
          : <path d="M90 105 q5 6 10 0 q5 6 10 0" stroke={EYE} strokeWidth="3" fill="none" strokeLinecap="round" />}
        {/* tenues de tête */}
        {outfit === 'noeud' && <g transform="translate(148 30)"><path d="M0 0 l-14 -9 v18Z M0 0 l14 -9 v18Z" fill="#E8A3A0" stroke={LINE} strokeWidth="2.5" /><circle r="4" fill="#C9706C" /></g>}
        {outfit === 'bandana' && <path d="M32 60 Q100 36 168 60 L166 70 Q100 48 34 70Z" fill="#C38380" stroke={LINE} strokeWidth="2.5" />}
        {outfit === 'chapeau' && <g><ellipse cx="100" cy="36" rx="74" ry="12" fill={SAND} stroke={LINE} strokeWidth="3" /><path d="M62 36 Q64 6 100 6 Q136 6 138 36Z" fill={SAND} stroke={LINE} strokeWidth="3" /><path d="M63 28 H137" stroke="#C38380" strokeWidth="5" /></g>}
        {outfit === 'couronne' && <g>{[48, 70, 92, 112, 132, 154].map((x, i) => <circle key={x} cx={x} cy={i % 2 ? 32 : 36} r="7" fill={['#F3BFA9', '#E9C79A', '#C9D8C5'][i % 3]} stroke={LINE} strokeWidth="2" />)}</g>}
        {outfit === 'lunettes' && <g fill="none" stroke={EYE} strokeWidth="3"><circle cx="70" cy="82" r="15" /><circle cx="130" cy="82" r="15" /><path d="M85 82 h30" /></g>}
        {party && <g><path d="M100 -6 L82 32 H118Z" fill="#C38380" stroke={LINE} strokeWidth="3" /><circle cx="100" cy="-6" r="5" fill={SAND} /></g>}
      </g>
      {wave && <g className="wave-arm"><path d="M146 138 Q176 124 190 98 Q190 84 178 84 Q168 108 140 124Z" fill={FUR} stroke={LINE} strokeWidth="3" strokeLinejoin="round" /></g>}
      {/* foulard sauge noué en feuilles (signature du panda) ; l'écharpe le remplace en hiver */}
      {outfit === 'echarpe'
        ? <g><path d="M56 124 Q100 142 144 124 L146 136 Q100 154 54 136Z" fill="#C9A08C" stroke={LINE} strokeWidth="3" /><path d="M120 136 l6 30 l12 -4 l-8 -28Z" fill="#C9A08C" stroke={LINE} strokeWidth="3" /></g>
        : <g><path d="M60 124 Q100 138 140 124 L138 132 Q100 146 62 132Z" fill={SCARF} stroke={LINE} strokeWidth="2.5" />
          <path d="M100 134 q-16 -2 -20 10 q12 6 20 -10Z" fill={SCARF} stroke={LINE} strokeWidth="2.5" /><path d="M100 134 q16 -2 20 10 q-12 6 -20 -10Z" fill={SCARF} stroke={LINE} strokeWidth="2.5" />
          <path d="M100 134 q-6 10 0 18 q6 -8 0 -18Z" fill={SCARF} stroke={LINE} strokeWidth="2.5" /></g>}
      {mood === 'eating' && <g className="bamboo-snack"><rect x="122" y="92" width="10" height="62" rx="4" fill="#9CB27A" stroke="#5F7A45" strokeWidth="2" transform="rotate(-18 127 123)" /><path d="M118 112 l10 -3 M124 132 l10 -3" stroke="#5F7A45" strokeWidth="2" /><path d="M126 96 q14 -10 20 -2 q-10 6 -20 2Z" fill="#9CB27A" stroke="#5F7A45" strokeWidth="1.5" /><ellipse cx="128" cy="150" rx="11" ry="9" fill={FUR} stroke={LINE} strokeWidth="2.5" /></g>}
      {mood === 'sleepy' && <g className="zzz" fill={LINE} fontFamily="inherit" fontWeight="700"><text x="150" y="40" fontSize="16">z</text><text x="162" y="26" fontSize="20">z</text><text x="176" y="10" fontSize="24">Z</text></g>}
      {(joy || mood === 'proud') && <g className="sparkle" stroke="#7E8F5E" strokeWidth="4" strokeLinecap="round"><path d="M6 60 l10 4 M12 42 l8 8 M20 26 l4 10" /></g>}
      {mood === 'curious' && <text className="sparkle" x="160" y="40" fontSize="30" fontWeight="700" fill={CARAMEL}>?</text>}
      {mood === 'surprised' && <g stroke={CARAMEL} strokeWidth="4" strokeLinecap="round"><path d="M24 30 l10 10 M40 18 l4 14 M160 18 l-4 14 M176 30 l-10 10" /></g>}
      {mood === 'playful' && <g className="ball"><circle cx="30" cy="196" r="13" fill="#E8A3A0" stroke={LINE} strokeWidth="3" /><path d="M18 192 q12 8 24 0" stroke={LINE} strokeWidth="2" fill="none" /></g>}
    </g>
  </svg>;
}

/** Objets de la maison, dessinés simplement et posés à leur place dans la scène. */
export function ItemArt({ id, books = 0 }: { id: ItemId; books?: number }) {
  switch (id) {
    case 'tapis': return <ellipse cx="200" cy="262" rx="150" ry="22" fill="#E9C79A" stroke={INK} strokeWidth="3" />;
    case 'coussin': return <g><ellipse cx="300" cy="248" rx="44" ry="18" fill={SAND} stroke={INK} strokeWidth="3" /><path d="M262 244 q38 -10 76 0" stroke={INK} strokeWidth="2" fill="none" opacity=".4" /></g>;
    case 'plante': return <g><path d="M40 250 h30 l-4 26 h-22Z" fill={CARAMEL} stroke={INK} strokeWidth="3" /><path d="M55 250 q-18 -30 -6 -54 M55 250 q14 -28 4 -58 M55 250 q22 -16 26 -40" stroke="#6F8A6A" strokeWidth="6" fill="none" strokeLinecap="round" /></g>;
    case 'panier': return <g><path d="M300 236 q0 30 50 30 q50 0 50 -30Z" fill="#C98A55" stroke={INK} strokeWidth="3" transform="translate(-40 0)" /></g>;
    case 'yoga': return <rect x="120" y="268" width="160" height="12" rx="6" fill="#9FB5AA" stroke={INK} strokeWidth="3" />;
    case 'etagere': return <g><rect x="292" y="60" width="90" height="10" rx="3" fill={CARAMEL} stroke={INK} strokeWidth="3" /><rect x="292" y="110" width="90" height="10" rx="3" fill={CARAMEL} stroke={INK} strokeWidth="3" />
      {Array.from({ length: Math.min(12, Math.max(2, books)) }, (_, i) => <rect key={i} x={296 + (i % 6) * 14} y={(i < 6 ? 30 : 80)} width="11" height="30" rx="2" fill={['#C38380', '#9FB5AA', '#E9C79A', '#8C6257'][i % 4]} stroke={INK} strokeWidth="2" />)}</g>;
    case 'lampe': return <g><path d="M30 120 h40 l-8 -28 h-24Z" fill="#F7E3C3" stroke={INK} strokeWidth="3" /><path d="M50 120 v60" stroke={INK} strokeWidth="4" /><circle className="glow" cx="50" cy="110" r="34" fill="#FFE9B8" opacity=".35" /></g>;
    case 'theiere': return <g><rect x="330" y="200" width="56" height="8" rx="3" fill={CARAMEL} stroke={INK} strokeWidth="3" /><path d="M342 200 q0 -22 16 -22 q16 0 16 22Z" fill={CREAM} stroke={INK} strokeWidth="3" /><path d="M374 190 q10 -2 10 8" stroke={INK} strokeWidth="3" fill="none" /></g>;
    case 'valise': return <g><rect x="330" y="222" width="52" height="36" rx="6" fill="#C38380" stroke={INK} strokeWidth="3" /><path d="M346 222 v-8 h20 v8" stroke={INK} strokeWidth="3" fill="none" /><circle cx="344" cy="240" r="5" fill="#F7E3C3" /><rect x="354" y="236" width="20" height="8" rx="2" fill="#9FB5AA" /></g>;
    case 'carnet_unused' as never: return <g><rect x="324" y="228" width="34" height="26" rx="3" fill="#E8A3A0" stroke={INK} strokeWidth="3" /><path d="M341 236 q3 -3 6 0 q-3 5 -6 7 q-3 -2 -6 -7 q3 -3 6 0Z" fill={CREAM} /></g>;
    case 'guirlande': return <g><path d="M20 30 Q200 80 380 30" stroke={INK} strokeWidth="2" fill="none" />{[50, 100, 150, 200, 250, 300, 350].map((x, i) => <circle key={x} className="twinkle" style={{ animationDelay: i * 0.3 + 's' }} cx={x} cy={30 + Math.sin((x - 20) / 360 * Math.PI) * 25} r="5" fill="#FFE2A0" stroke={INK} strokeWidth="1.5" />)}</g>;
    case 'tableau': return <g><rect x="160" y="40" width="80" height="56" rx="4" fill="#F3EBE7" stroke={INK} strokeWidth="3" /><path d="M172 84 l18 -20 l14 12 l10 -8 l14 16Z" fill="#9FB5AA" /><circle cx="222" cy="58" r="6" fill={SAND} /></g>;
    case 'bonsai': return <g><path d="M346 160 h40 l-4 16 h-32Z" fill={CARAMEL} stroke={INK} strokeWidth="3" /><path d="M366 160 q-4 -14 6 -24" stroke={INK} strokeWidth="4" fill="none" /><ellipse cx="364" cy="132" rx="22" ry="12" fill="#7E9478" stroke={INK} strokeWidth="2" /></g>;
    default: return null;
  }
}

/** Objets du jardin (visible à partir du niveau 4). */
export function GardenArt({ id }: { id: ItemId }) {
  switch (id) {
    case 'fleurs': return <g>{[30, 60, 90, 330, 360].map((x, i) => <g key={x}><path d={`M${x} 150 v-18`} stroke="#6F8A6A" strokeWidth="3" /><circle cx={x} cy="128" r="7" fill={['#F3BFA9', '#E9C79A', '#E8A3A0'][i % 3]} stroke={INK} strokeWidth="2" /></g>)}</g>;
    case 'lanterne': return <g><path d="M60 150 v-40" stroke={INK} strokeWidth="3" /><rect x="50" y="88" width="20" height="24" rx="5" fill="#FFE2A0" stroke={INK} strokeWidth="3" className="glow" /></g>;
    case 'balancoire': return <g><path d="M300 60 v70 M340 60 v70 M290 60 h60" stroke={INK} strokeWidth="3" /><rect x="296" y="130" width="48" height="6" rx="3" fill={CARAMEL} stroke={INK} strokeWidth="2" /></g>;
    case 'fontaine': return <g><ellipse cx="200" cy="146" rx="40" ry="10" fill="#C9D8D2" stroke={INK} strokeWidth="3" /><path className="water" d="M200 140 q-14 -34 0 -40 q14 6 0 40" fill="#C9D8D2" stroke={INK} strokeWidth="2" /></g>;
    default: return null;
  }
}
