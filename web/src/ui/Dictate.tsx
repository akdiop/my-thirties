import { useRef, useState } from 'react';
import { Mic, MicOff } from 'lucide-react';

type Rec = { lang: string; interimResults: boolean; continuous: boolean; start: () => void; stop: () => void;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null; onerror: ((e: { error: string }) => void) | null; onend: (() => void) | null };
const Ctor = () => (typeof window === 'undefined' ? undefined : (window as unknown as { SpeechRecognition?: new () => Rec; webkitSpeechRecognition?: new () => Rec }).SpeechRecognition
  ?? (window as unknown as { webkitSpeechRecognition?: new () => Rec }).webkitSpeechRecognition);
export const dictationSupported = () => Boolean(Ctor());

/** Bouton micro : dicte du texte avec la reconnaissance vocale du téléphone et l'ajoute au champ. Caché si l'appareil ne la propose pas. */
export function Dictate({ onText, label = 'Dicter' }: { onText: (text: string) => void; label?: string }) {
  const [on, setOn] = useState(false);
  const [err, setErr] = useState('');
  const rec = useRef<Rec | null>(null);
  const C = Ctor();
  if (!C) return null;
  const start = () => {
    setErr('');
    const r = new C(); rec.current = r;
    r.lang = 'fr-FR'; r.interimResults = false; r.continuous = false;
    r.onresult = (e) => { const t = Array.from(e.results).map((x) => x[0]?.transcript ?? '').join(' ').trim(); if (t) onText(t); };
    r.onerror = (e) => setErr(e.error === 'not-allowed' ? 'Autorise le micro pour dicter.' : 'Dictée indisponible ici : utilise le micro du clavier.');
    r.onend = () => setOn(false);
    try { r.start(); setOn(true); } catch { setErr('Dictée indisponible ici : utilise le micro du clavier.'); }
  };
  return <span className="dictate">
    <button type="button" className={'icon-btn dictate-btn' + (on ? ' on' : '')} aria-pressed={on} aria-label={on ? 'Arrêter la dictée' : label}
      onClick={() => (on ? rec.current?.stop() : start())}>{on ? <MicOff size={18} /> : <Mic size={18} />}</button>
    {on && <small className="dictate-hint">Je t’écoute…</small>}
    {err && <small className="dictate-hint">{err}</small>}
  </span>;
}

/** Ajoute un texte dicté à la fin d'un texte existant. */
export const appendText = (prev: string, add: string) => (prev.trim() ? prev.replace(/\s*$/, ' ') : '') + add;
