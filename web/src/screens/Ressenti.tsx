import { useMemo, useState } from 'react';
import { ChevronRight, Send, Sparkles } from 'lucide-react';
import type { Entry, EntryInput } from '../lib/cloud';
import { askAssistant, type Turn } from '../lib/assistant';
import { useIntegrationPrefs } from '../lib/integrations';
import { bilanRessentis, coachContext, RESSENTI_KIND, RESSENTIS, ressentiOf, type Cible, type RessentiData } from '../lib/ressenti';
import { isoOf } from '../lib/rituals';

type Props = { entries: Entry[]; onCreate: (i: EntryInput) => Promise<void>; onGo: (c: Cible) => void };
const frDay = (iso: string) => new Date(iso + 'T12:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });

/** « Je me sens… » : nommer, quelques gestes tout de suite, un coach IA si je veux, et garder une trace. */
export function Ressenti({ entries, onCreate, onGo }: Props) {
  const [emotion, setEmotion] = useState(''), [intensite, setIntensite] = useState(6), [situation, setSituation] = useState('');
  const [thread, setThread] = useState<Turn[]>([]), [msg, setMsg] = useState(''), [busy, setBusy] = useState(false), [error, setError] = useState('');
  const [apres, setApres] = useState<number | null>(null), [saved, setSaved] = useState(false);
  const { prefs } = useIntegrationPrefs();
  const r = ressentiOf(emotion);
  const bilan = useMemo(() => bilanRessentis(entries), [entries]);

  const ask = async (text: string) => {
    if (!r || busy || text.trim().length < 2) return;
    setBusy(true); setError('');
    try {
      const answer = await askAssistant(text, { history: thread, context: thread.length ? undefined : coachContext(r, intensite, situation) });
      setThread([...thread, { role: 'user', content: text }, { role: 'assistant', content: answer }]); setMsg('');
    } catch { setError('Le coach n’est pas disponible pour l’instant. Les gestes ci-dessus restent là pour toi.'); }
    finally { setBusy(false); }
  };
  const save = async () => {
    if (!r) return;
    const data: RessentiData = { emotion: r.id, intensite, ...(situation.trim() ? { situation: situation.trim() } : {}), ...(apres !== null ? { apres } : {}),
      ...(thread.length ? { coach: thread.filter((t) => t.role === 'assistant').map((t) => t.content).join('\n\n').slice(0, 4000) } : {}) };
    await onCreate({ module: 'equilibre', kind: RESSENTI_KIND, title: 'Je me sens ' + r.label.toLowerCase(), entry_date: isoOf(new Date()), data });
    setSaved(true);
  };

  if (!r) return <div className="screen ressenti">
    <header className="tab-head"><h1>Je me sens…</h1><p>Mettre un mot dessus, c’est déjà un premier pas.</p></header>
    <div className="ress-grid">{RESSENTIS.map((x) => <button key={x.id} className="ress-btn" onClick={() => setEmotion(x.id)}>{x.label}</button>)}</div>
    {bilan.list.length > 0 && <section className="soft-card">
      <p className="ritual-label">Mes derniers ressentis</p>
      {bilan.frequents.length > 0 && <p className="muted small">Le plus souvent : {bilan.frequents.map((f) => f.label.toLowerCase() + ' (' + f.n + ')').join(', ')}{bilan.baisse !== null ? ' · l’intensité baisse en moyenne de ' + bilan.baisse + ' après coup' : ''}.</p>}
      {bilan.list.slice(0, 6).map((x) => <p key={x.entry.id} className="fiche-pt">{frDay(x.date)} · {ressentiOf(x.d.emotion)?.label ?? x.d.emotion} {x.d.intensite}/10{typeof x.d.apres === 'number' ? ' → ' + x.d.apres + '/10' : ''}{x.d.situation ? ' · ' + x.d.situation.slice(0, 60) : ''}</p>)}
    </section>}
  </div>;

  return <div className="screen ressenti">
    <button className="link-btn back-link" onClick={() => { setEmotion(''); setThread([]); setSaved(false); setApres(null); }}>‹ Je me sens…</button>
    <header className="tab-head"><h1>Je me sens {r.label.toLowerCase()}</h1><p>C’est normal de le ressentir. On regarde ça ensemble.</p></header>
    <section className="soft-card form-stack">
      <label className="tcc-slider">Intensité <strong>{intensite}/10</strong><input type="range" min={0} max={10} value={intensite} onChange={(e) => setIntensite(Number(e.target.value))} /></label>
      <label>Ce qui se passe <small className="muted">si tu veux</small><textarea rows={3} value={situation} onChange={(e) => setSituation(e.target.value)} /></label>
    </section>
    <section className="soft-card"><p className="ritual-label">Tout de suite</p>
      {r.gestes.map((x) => <div key={x.texte} className="ress-geste"><p>{x.texte}</p>
        {x.cible && <button className="link-btn small" onClick={() => onGo(x.cible!)}>{x.libelle} <ChevronRight size={14} /></button>}</div>)}
    </section>
    <section className="soft-card form-stack ress-coach">
      <p className="ritual-label"><Sparkles size={15} /> Mon coach bien-être</p>
      {!prefs.assistant ? <p className="privacy-hint">Le coach utilise l’assistant IA. Active-le dans Profil → Centre de confidentialité pour lui parler.</p>
        : <>
          {thread.map((t, i) => <div key={i} className={'ress-msg ' + t.role}>{t.content.split('\n').filter((l) => l.trim() && !/^ACTIONS\s*:/.test(l.trim())).map((l, k) => <p key={k}>{l}</p>)}</div>)}
          {!thread.length && <button className="button primary" disabled={busy} onClick={() => void ask('Je me sens ' + r.label.toLowerCase() + '. Aide-moi.')}>{busy ? 'Le coach réfléchit…' : 'Parler à mon coach'}</button>}
          {thread.length > 0 && <div className="tq-add"><input value={msg} maxLength={1000} placeholder="Réponds au coach…" onChange={(e) => setMsg(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') void ask(msg); }} />
            <button className="tq-plus" disabled={busy || msg.trim().length < 2} aria-label="Envoyer" onClick={() => void ask(msg)}><Send size={18} /></button></div>}
          {error && <p className="muted small">{error}</p>}
        </>}
    </section>
    <section className="soft-card form-stack">
      <label className="tcc-slider">Et maintenant, l’intensité <strong>{apres === null ? '·' : apres + '/10'}</strong><input type="range" min={0} max={10} value={apres ?? intensite} onChange={(e) => setApres(Number(e.target.value))} /></label>
      {saved ? <p className="muted">Gardé dans tes ressentis. Prends soin de toi.</p> : <button className="button secondary" onClick={() => void save()}>Garder une trace</button>}
    </section>
  </div>;
}
