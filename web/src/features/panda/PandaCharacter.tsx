import type { ItemId } from './data';
import type { PandaMood } from './types';
type OutfitId = string;

export type Mood = PandaMood;
const INK = '#6B4433', CREAM = '#FFF9F2', BLUSH = '#F3BFA9', CARAMEL = '#C98A55', SAND = '#E9C79A';

/** Le panda en 2D (style planche : contour chocolat, visage crème, joues rosées). Animations douces en CSS. */
export function PandaCharacter({ mood = 'idle', outfit = 'aucune', level = 1, size = 180, party = false }: { mood?: Mood; outfit?: OutfitId; level?: number; size?: number; party?: boolean }) {
  const closed = mood === 'happy' || mood === 'sleepy' || mood === 'proud' || mood === 'tea' || mood === 'calm' || mood === 'playful';
  const grow = 0.82 + level * 0.036;
  return <svg className={'panda-art mood-' + mood} viewBox="0 0 200 220" width={size} height={size * 1.1} role="img" aria-label="Mon panda">
    <g transform={`translate(100 210) scale(${grow}) translate(-100 -210)`}>
      <ellipse cx="100" cy="212" rx="62" ry="7" fill="#000" opacity=".08" />
      <g className="panda-body">
        {/* corps */}
        <path d="M52 150 Q50 205 100 206 Q150 205 148 150 Q140 112 100 112 Q60 112 52 150Z" fill={CREAM} stroke={INK} strokeWidth="4" />
        <ellipse cx="64" cy="190" rx="22" ry="17" fill={INK} />
        <ellipse cx="136" cy="190" rx="22" ry="17" fill={INK} />
        {/* bras */}
        <g className="panda-arms">
          <ellipse cx="66" cy="148" rx="15" ry="22" fill={INK} transform="rotate(20 66 148)" />
          <ellipse cx="134" cy="148" rx="15" ry="22" fill={INK} transform="rotate(-20 134 148)" />
        </g>
        {mood === 'reading' && <g><path d="M72 150 L100 156 L128 150 L128 176 L100 182 L72 176Z" fill={CARAMEL} stroke={INK} strokeWidth="3" /><path d="M100 156 V182" stroke={INK} strokeWidth="2" /><path d="M110 164 q4 -4 7 0 q-3 5 -7 8 q-4 -3 -7 -8 q3 -4 7 0Z" fill={SAND} /></g>}
        {mood === 'tea' && <g><rect x="88" y="150" width="24" height="22" rx="5" fill={CREAM} stroke={INK} strokeWidth="3" /><path d="M96 158 q4 -4 8 0 q-4 6 -8 0Z" fill={CARAMEL} /><path className="steam" d="M96 142 q-4 -6 0 -12 M104 142 q4 -6 0 -12" stroke={INK} strokeWidth="2" fill="none" opacity=".5" /></g>}
        {mood === 'eating' && <g className="bamboo-snack"><rect x="92" y="96" width="9" height="62" rx="4" fill="#9CB27A" stroke="#5F7A45" strokeWidth="2" /><path d="M92 118 h9 M92 138 h9" stroke="#5F7A45" strokeWidth="2" /><path d="M101 104 q14 -6 18 2 q-10 4 -18 -2Z" fill="#9CB27A" /></g>}
      </g>
      <g className="panda-head">
        <circle cx="54" cy="44" r="20" fill={INK} />
        <circle cx="146" cy="44" r="20" fill={INK} />
        <path d="M30 86 Q28 36 100 34 Q172 36 170 86 Q170 128 100 128 Q30 128 30 86Z" fill={CREAM} stroke={INK} strokeWidth="4" />
        {/* taches des yeux */}
        <ellipse cx="72" cy="82" rx="15" ry="19" fill={INK} transform="rotate(25 72 82)" />
        <ellipse cx="128" cy="82" rx="15" ry="19" fill={INK} transform="rotate(-25 128 82)" />
        {closed ? <g stroke={CREAM} strokeWidth="3.5" fill="none" strokeLinecap="round">
            {mood === 'happy' || mood === 'playful' ? <><path d="M64 84 q8 -9 16 0" /><path d="M120 84 q8 -9 16 0" /></> : <><path d="M64 82 q8 7 16 0" /><path d="M120 82 q8 7 16 0" /></>}
          </g>
          : <g className="panda-eyes"><circle cx="74" cy="80" r="5.5" fill={CREAM} /><circle cx="126" cy="80" r="5.5" fill={CREAM} /></g>}
        <ellipse cx="54" cy="104" rx="10" ry="6" fill={BLUSH} />
        <ellipse cx="146" cy="104" rx="10" ry="6" fill={BLUSH} />
        <ellipse cx="100" cy="96" rx="6" ry="4.5" fill={INK} />
        {mood === 'surprised' ? <ellipse cx="100" cy="108" rx="5" ry="6.5" fill="#D9776A" stroke={INK} strokeWidth="3" />
          : mood === 'happy' || mood === 'eating' || mood === 'playful'
          ? <path d="M90 104 q10 14 20 0Z" fill="#D9776A" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
          : mood === 'sleepy' ? <ellipse cx="100" cy="107" rx="3" ry="4" fill={INK} />
          : <path d="M89 103 q5.5 7 11 0 q5.5 7 11 0" stroke={INK} strokeWidth="3.5" fill="none" strokeLinecap="round" />}
        {/* tenues */}
        {outfit === 'noeud' && <g transform="translate(140 34)"><path d="M0 0 l-14 -9 v18Z M0 0 l14 -9 v18Z" fill="#E8A3A0" stroke={INK} strokeWidth="2.5" /><circle r="4" fill="#C9706C" /></g>}
        {outfit === 'bandana' && <path d="M38 62 Q100 40 162 62 L160 72 Q100 52 40 72Z" fill="#C38380" stroke={INK} strokeWidth="2.5" />}
        {outfit === 'chapeau' && <g><ellipse cx="100" cy="40" rx="72" ry="12" fill={SAND} stroke={INK} strokeWidth="3" /><path d="M64 40 Q66 10 100 10 Q134 10 136 40Z" fill={SAND} stroke={INK} strokeWidth="3" /><path d="M65 32 H135" stroke="#C38380" strokeWidth="5" /></g>}
        {outfit === 'couronne' && <g>{[52, 72, 92, 112, 132, 150].map((x, i) => <circle key={x} cx={x} cy={i % 2 ? 36 : 40} r="7" fill={['#F3BFA9', '#E9C79A', '#C9D8C5'][i % 3]} stroke={INK} strokeWidth="2" />)}</g>}
        {outfit === 'lunettes' && <g fill="none" stroke="#3a2a24" strokeWidth="3"><circle cx="74" cy="82" r="13" /><circle cx="126" cy="82" r="13" /><path d="M87 82 h26" /></g>}
        {party && <g><path d="M100 0 L82 38 H118Z" fill="#C38380" stroke={INK} strokeWidth="3" /><circle cx="100" cy="0" r="5" fill={SAND} /></g>}
      </g>
      {outfit === 'echarpe' && <g><path d="M56 122 Q100 140 144 122 L146 134 Q100 152 54 134Z" fill="#9FB5AA" stroke={INK} strokeWidth="3" /><path d="M120 134 l6 30 l12 -4 l-8 -28Z" fill="#9FB5AA" stroke={INK} strokeWidth="3" /></g>}
      {mood === 'sleepy' && <g className="zzz" fill={INK} fontFamily="inherit" fontWeight="700"><text x="150" y="40" fontSize="16">z</text><text x="162" y="26" fontSize="20">z</text><text x="176" y="10" fontSize="24">Z</text></g>}
      {mood === 'curious' && <text className="sparkle" x="160" y="40" fontSize="30" fontWeight="700" fill="#C98A55">?</text>}
      {mood === 'surprised' && <g stroke="#C98A55" strokeWidth="4" strokeLinecap="round"><path d="M24 30 l10 10 M40 18 l4 14 M160 18 l-4 14 M176 30 l-10 10" /></g>}
      {mood === 'playful' && <g className="ball"><circle cx="168" cy="190" r="14" fill="#E8A3A0" stroke={INK} strokeWidth="3" /><path d="M156 186 q12 8 24 0" stroke={INK} strokeWidth="2" fill="none" /></g>}
      {mood === 'proud' && <path className="sparkle" d="M168 30 l4 10 l10 4 l-10 4 l-4 10 l-4 -10 l-10 -4 l10 -4Z" fill={SAND} stroke={CARAMEL} strokeWidth="2" />}
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
