import { useState } from 'react';
import './PandaCompanion.css';
import { Heart, Pencil, Sparkles } from 'lucide-react';
import type { Entry, EntryInput } from '../lib/cloud';
import { PANDA_KIND, PANDA_ACTIONS, PANDA_LEVELS, pandaProgress, readPandaData, type PandaAction, type PandaData } from '../lib/panda';

const today = () => new Date().toLocaleDateString('en-CA');

export function PandaIllustration({ level, small = false }: { level: number; small?: boolean }) {
  return <svg className={'panda-illustration' + (small ? ' small' : '')} viewBox="0 0 320 300" role="img" aria-label={'Panda compagnon, étape ' + (level + 1)}>
    <ellipse cx="160" cy="276" rx="90" ry="14" fill="#8d7461" opacity=".13" />
    {level >= 2 && <><path d="M55 260q-32-30-16-66q24 2 39 31" fill="#C5A47C" opacity=".5" /><path d="M270 254q34-25 22-61q-26 1-40 30" fill="#C5A47C" opacity=".5" /></>}
    <ellipse cx="160" cy="210" rx="85" ry="74" fill="#302926" />
    <ellipse cx="160" cy="210" rx="59" ry="62" fill="#FFF8F0" />
    <ellipse cx="96" cy="251" rx="33" ry="23" fill="#302926" transform="rotate(-15 96 251)" />
    <ellipse cx="224" cy="251" rx="33" ry="23" fill="#302926" transform="rotate(15 224 251)" />
    <ellipse cx="80" cy="64" rx="35" ry="39" fill="#302926" transform="rotate(-18 80 64)" />
    <ellipse cx="240" cy="64" rx="35" ry="39" fill="#302926" transform="rotate(18 240 64)" />
    <ellipse cx="160" cy="122" rx="105" ry="100" fill="#FFF9F1" stroke="#e6dbcf" strokeWidth="2" />
    <ellipse cx="117" cy="119" rx="29" ry="39" fill="#302926" transform="rotate(16 117 119)" />
    <ellipse cx="203" cy="119" rx="29" ry="39" fill="#302926" transform="rotate(-16 203 119)" />
    <ellipse cx="121" cy={level === 0 ? 128 : 123} rx="7" ry={level === 0 ? 5 : 9} fill="#fffaf5" />
    <ellipse cx="199" cy={level === 0 ? 128 : 123} rx="7" ry={level === 0 ? 5 : 9} fill="#fffaf5" />
    <ellipse cx="123" cy="120" rx="2.6" ry="3.2" fill="#fff" opacity=".9" />
    <ellipse cx="201" cy="120" rx="2.6" ry="3.2" fill="#fff" opacity=".9" />
    <ellipse cx="160" cy="155" rx="14" ry="10" fill="#302926" />
    <path d="M160 165v9m0 0q-12 13-23 1m23-1q12 13 23 1" fill="none" stroke="#302926" strokeWidth="3.5" strokeLinecap="round" />
    <ellipse cx="87" cy="158" rx="14" ry="8" fill="#C98D81" opacity=".28" />
    <ellipse cx="233" cy="158" rx="14" ry="8" fill="#C98D81" opacity=".28" />
    {level >= 1 && <><path d="M94 183q66 26 132 0l-10 25q-56 21-112 1z" fill={level >= 3 ? '#B58968' : '#D7B89D'} /><path d="M206 195l24 58l-23 5l-24-52" fill={level >= 3 ? '#B58968' : '#D7B89D'} /></>}
    {level >= 3 && <path d="M140 201q20 14 40 0" fill="none" stroke="#F0D6A5" strokeWidth="4" strokeLinecap="round" />}
    {level >= 4 && <><path d="M142 28q-4-18 4-25l14 10l15-10q7 8 4 25" fill="#C9A66E" /><circle cx="160" cy="13" r="4" fill="#FFF8F0" /></>}
    {level >= 2 && <><path d="M45 175l4-11l4 11l11 4l-11 4l-4 11l-4-11l-11-4z" fill="#C9A66E" /><circle cx="272" cy="97" r="5" fill="#C9A66E" opacity=".8" /></>}
  </svg>;
}

type Props = {
  entries: Entry[];
  onCreate: (input: EntryInput) => Promise<void>;
  onUpdate: (entry: Entry, data: Record<string, unknown>) => Promise<void>;
};

export function PandaCompanion({ entries, onCreate, onUpdate }: Props) {
  const pandaEntry = entries.find((e) => e.kind === PANDA_KIND);
  const panda = pandaEntry ? readPandaData(pandaEntry.data) : null;
  const progress = panda ? pandaProgress(panda, entries) : null;
  const [draftName, setDraftName] = useState('Mochi');
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const currentDay = today();

  const persist = async (changes: PandaData) => {
    if (!pandaEntry) return;
    const newProgress = pandaProgress(changes, entries);
    await onUpdate(pandaEntry, { ...changes, bestLevel: Math.max(changes.bestLevel, newProgress.level) });
  };
  const run = async (fn: () => Promise<void>) => {
    if (busy) return;
    setBusy(true); setError('');
    try { await fn(); } catch { setError('Enregistrement impossible. Vérifie ta connexion et réessaie.'); }
    finally { setBusy(false); }
  };
  const adopt = () => run(() => onCreate({
    module: 'equilibre', kind: PANDA_KIND, title: 'Mon panda',
    entry_date: null, data: { name: draftName.trim().slice(0, 24) || 'Mochi',
      adoptedAt: currentDay, moments: [], linkHabits: false, bestLevel: 0 },
  }));
  const care = (action: PandaAction) => {
    if (!panda) return;
    if (panda.moments.some((m) => m.day === currentDay && m.action === action)) return;
    void run(() => persist({ ...panda, moments: [...panda.moments, { day: currentDay, action }] }));
  };

  return <section className="panda-page">
    <div className="panda-world">
      <div className="panda-world-orb orb-one" /><div className="panda-world-orb orb-two" />
      <span className="eyebrow">MON COMPAGNON</span>
      <h2>{panda ? panda.name : 'Un panda à adopter'}</h2>
      <PandaIllustration level={progress?.level ?? 0} />
      <p className="panda-message">{panda
        ? (progress?.level === 0 ? 'Chaque petit moment compte.' : 'Je grandis à ton rythme, pas à celui des autres.')
        : 'Un compagnon qui t’accompagne avec douceur, sans objectif imposé.'}</p>
    </div>
    {!panda ? <div className="panda-panel">
      <h3>Bienvenue dans ton jardin</h3>
      <p>Donne un nom à ton panda. Il évoluera grâce aux gestes de bien-être que tu choisis de noter. Pas de pénalité pour les jours de repos ou les pauses.</p>
      <label>Son prénom<input value={draftName} maxLength={24} onChange={(e) => setDraftName(e.target.value)} placeholder="Mochi" /></label>
      <button className="button primary" disabled={busy} onClick={() => void adopt()}>{busy ? 'Adoption…' : 'Adopter mon panda'}</button>
    </div> : <>
      <div className="panda-panel">
        <div className="panda-heading"><div><span className="eyebrow">ÉVOLUTION</span><h3>{PANDA_LEVELS[progress!.level].name}</h3></div><span className="panda-stage">Étape {progress!.level + 1} / 5</span></div>
        <p>{PANDA_LEVELS[progress!.level].text}</p>
        <div className="panda-track" role="progressbar" aria-label="Progression du panda" aria-valuenow={progress!.points} aria-valuemin={0} aria-valuemax={progress!.next ?? Math.max(30, progress!.points)}>
          <div style={{ width: progress!.next ? Math.min(100, 100 * progress!.points / progress!.next) + '%' : '100%' }} />
        </div>
        <p className="panda-small">{progress!.next ? progress!.points + ' petits moments · prochaine étape à ' + progress!.next : 'Dernière étape atteinte. Ton panda continue de t’accompagner.'}</p>
        <p className="panda-small">{progress!.days} journée(s) de découvertes ensemble. Rien ne se perd si tu prends une pause.</p>
      </div>
      <div className="panda-panel">
        <h3><Heart size={18} /> Un geste pour moi aujourd’hui</h3>
        <p>Choisis ce qui t’a fait du bien, sans obligation. Chaque geste peut être noté une fois par jour.</p>
        <div className="panda-actions">{PANDA_ACTIONS.map((action) => {
          const done = panda.moments.some((m) => m.day === currentDay && m.action === action.id);
          return <button key={action.id} type="button" className={'panda-care' + (done ? ' done' : '')} disabled={busy || done} onClick={() => care(action.id)}>
            <span>{done ? '✓ ' : '+ '}{action.title}</span><small>{done ? 'Déjà noté aujourd’hui' : action.description}</small>
          </button>;
        })}</div>
      </div>
      <div className="panda-panel">
        <h3><Sparkles size={18} /> Grandir ensemble</h3>
        <p>Tu peux aussi relier les jours où tu as déjà noté un sommeil, une humeur, une gratitude, une activité ou un moment de créativité. Seule la présence d’une entrée compte, jamais son contenu ni ton état émotionnel.</p>
        <label className="panda-toggle"><input type="checkbox" checked={panda.linkHabits} disabled={busy}
          onChange={(e) => void run(() => persist({ ...panda, linkHabits: e.target.checked }))} />
          Prendre en compte mes activités enregistrées</label>
        <p className="panda-small">{panda.linkHabits ? progress!.linkedDays + ' journée(s) supplémentaires prises en compte.' : 'Désactivé par défaut. À toi de choisir.'}</p>
        {editing ? <form className="panda-rename" onSubmit={(e) => { e.preventDefault(); void run(async () => { await persist({ ...panda, name: draftName.trim().slice(0, 24) || panda.name }); setEditing(false); }); }}>
          <label>Prénom<input value={draftName} maxLength={24} onChange={(e) => setDraftName(e.target.value)} /></label>
          <button className="button secondary" type="submit" disabled={busy}>Enregistrer</button>
        </form> : <button className="button ghost" onClick={() => { setDraftName(panda.name); setEditing(true); }}><Pencil size={16} /> Renommer mon panda</button>}
      </div>
    </>}
    {error && <p role="alert" className="error">{error}</p>}
    <p className="panda-small">Ce compagnon est un jeu de bien-être, pas un diagnostic ni une évaluation de ta valeur. Les journées difficiles et le repos font partie de l’aventure.</p>
  </section>;
}
