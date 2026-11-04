import { useRef, useState } from 'react';
import { Mic, MicOff } from 'lucide-react';

type Result = ArrayLike<{ transcript: string }> & { isFinal?: boolean };
type Rec = { lang: string; interimResults: boolean; continuous: boolean; start: () => void; stop: () => void;
  onresult: ((e: { resultIndex?: number; results: ArrayLike<Result> }) => void) | null; onerror: ((e: { error: string }) => void) | null; onend: (() => void) | null };
const Ctor = () => (typeof window === 'undefined' ? undefined : (window as unknown as { SpeechRecognition?: new () => Rec; webkitSpeechRecognition?: new () => Rec }).SpeechRecognition
  ?? (window as unknown as { webkitSpeechRecognition?: new () => Rec }).webkitSpeechRecognition);
export const dictationSupported = () => Boolean(Ctor());

const MESSAGES: Record<string, string> = {
  'not-allowed': 'Autorise le micro pour dicter (Réglages › Safari › Micro).',
  'service-not-allowed': 'L’iPhone bloque la dictée ici : utilise le micro du clavier.',
  'no-speech': 'Je n’ai rien entendu, réessaie en parlant près du micro.',
  'audio-capture': 'Le micro n’est pas disponible.',
};

/** Bouton micro : dicte du texte avec la reconnaissance vocale du téléphone et l'ajoute au champ. Caché si l'appareil ne la propose pas. */
export function Dictate({ onText, label = 'Dicter' }: { onText: (text: string) => void; label?: string }) {
  const [on, setOn] = useState(false);
  const [err, setErr] = useState('');
  const [live, setLive] = useState('');
  const rec = useRef<Rec | null>(null);
  const C = Ctor();
  if (!C) return null;
  const start = () => {
    setErr(''); setLive('');
    const r = new C(); rec.current = r;
    // Sur iPhone, les résultats arrivent de façon fiable seulement en mode continu avec résultats intermédiaires.
    r.lang = 'fr-FR'; r.interimResults = true; r.continuous = true;
    let text = '';
    r.onresult = (e) => {
      const parts = Array.from(e.results).map((x) => (x[0]?.transcript ?? '').trim()).filter(Boolean);
      // Certains iPhone renvoient des résultats cumulés (chaque phrase reprend la précédente) : on garde alors la dernière.
      const cumulative = parts.length > 1 && parts.every((p, i) => i === 0 || p.startsWith(parts[i - 1]!));
      text = (cumulative ? parts[parts.length - 1]! : parts.join(' ')).replace(/\s+/g, ' ').trim();
      setLive(text);
    };
    r.onerror = (e) => setErr(MESSAGES[e.error] ?? 'Dictée indisponible ici : utilise le micro du clavier.');
    // Le texte est ajouté au champ quand l'écoute s'arrête (bouton ou silence).
    r.onend = () => { setOn(false); setLive(''); if (text) onText(text); text = ''; };
    try { r.start(); setOn(true); } catch { setErr('Dictée indisponible ici : utilise le micro du clavier.'); }
  };
  return <span className="dictate">
    <button type="button" className={'icon-btn dictate-btn' + (on ? ' on' : '')} aria-pressed={on} aria-label={on ? 'Arrêter et ajouter le texte' : label}
      onClick={() => (on ? rec.current?.stop() : start())}>{on ? <MicOff size={18} /> : <Mic size={18} />}</button>
    {on && <small className="dictate-hint">{live ? '« ' + live + ' »' : 'Je t’écoute… touche le micro quand tu as fini.'}</small>}
    {err && <small className="dictate-hint">{err}</small>}
  </span>;
}

/** Ajoute un texte dicté à la fin d'un texte existant. */
export const appendText = (prev: string, add: string) => (prev.trim() ? prev.replace(/\s*$/, ' ') : '') + add;
