import { refCoran } from '../lib/coran';

export const OUVRIR_CORAN = 'my30:ouvrir-coran';
/** Ouvre l'écran du Coran, au verset demandé ou sur l'accueil du Coran. */
export const ouvrirCoran = (at?: [number, number]) => window.dispatchEvent(new CustomEvent(OUVRIR_CORAN, { detail: at ?? null }));

export const OUVRIR_JARDIN = 'my30:ouvrir-jardin';
/** Ouvre le Jardin des vertueux au chapitre demandé. */
export const ouvrirJardin = (c: number) => window.dispatchEvent(new CustomEvent(OUVRIR_JARDIN, { detail: c }));

const REF = /(Coran \d{1,3}:\d{1,3}(?:-\d{1,3})?)/;

/** Affiche un texte dont chaque référence « Coran X:Y » ouvre le verset. */
export function AvecCoran({ texte }: { texte: string }) {
  const parts = texte.split(REF);
  if (parts.length === 1) return <>{texte}</>;
  return <>{parts.map((p, i) => { const r = i % 2 ? refCoran(p) : null;
    return r ? <button key={i} type="button" className="coran-lien" onClick={(ev) => { ev.stopPropagation(); ouvrirCoran(r); }}>{p}</button> : p; })}</>;
}
