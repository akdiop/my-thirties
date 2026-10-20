import type { Entry } from '../lib/cloud';

export function BoosterPlan({ entry, onUpdate }: {
  entry: Entry;
  onUpdate: (entry: Entry, data: Record<string, unknown>) => Promise<void>;
}) {
  const days = [7, 14, 30].includes(Number(entry.data.days)) ? Number(entry.data.days) : 30;
  const progress = (entry.data.progress && typeof entry.data.progress === 'object'
    ? entry.data.progress : {}) as Record<string, boolean>;
  const completed = Object.values(progress).filter(Boolean).length;
  const toggle = async (day: number) => onUpdate(entry, {
    ...entry.data, progress: { ...progress, [day]: !progress[String(day)] },
  });
  return <div className="booster-panel">
    <p className="muted">Programme personnel : {String(entry.data.axis || 'Mon équilibre')} · {days} jours</p>
    <p className="fineprint">Une petite pratique facultative par jour. Tu peux faire une pause, sans perdre tes acquis.</p>
    <div className="progress-track"><div style={{ width: (completed / days * 100) + '%' }} /></div>
    <div className="booster-grid">{Array.from({ length: days }, (_, i) =>
      <button key={i} className={'booster-day ' + (progress[String(i + 1)] ? 'done' : '')}
        onClick={() => void toggle(i + 1)} aria-pressed={Boolean(progress[String(i + 1)])}
        aria-label={'Jour ' + (i + 1) + (progress[String(i + 1)] ? ' accompli' : ' à réaliser')}>
        {progress[String(i + 1)] ? '✓' : i + 1}
      </button>)}</div>
    <p className="fineprint">{completed} jour(s) cochés. Un bilan personnel peut être ajouté dans ton journal émotionnel.</p>
  </div>;
}
