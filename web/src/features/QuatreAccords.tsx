import { useState } from 'react';
import type { Entry } from '../lib/cloud';
import { askAssistant } from '../lib/assistant';
import { useIntegrationPrefs } from '../lib/integrations';
import { ACCORDS, ACCORDS_COMPRENDRE, ACCORDS_SOURCE, accordDeLaSemaine, type Accord } from '../lib/quatreAccords';
import { DAILY_KIND, isoOf } from '../lib/rituals';
import { DISTORSIONS } from '../lib/tcc';
import { AvecCoran, ouvrirJardin } from '../ui/CoranLien';

/** Ce que j'ai répondu à « As-tu honoré ton accord ? » ces sept derniers jours, dans Mon jour. */
function bilanSemaine(entries: Entry[], today: string) {
  const from = isoOf(new Date(Date.parse(today + 'T12:00:00') - 6 * 86_400_000));
  return entries.filter((e) => e.kind === DAILY_KIND && e.entry_date && e.entry_date >= from && e.entry_date <= today && typeof e.data.accord === 'string' && e.data.accord)
    .map((e) => e.entry_date + ' : ' + String(e.data.accord) + (typeof e.data.accordNote === 'string' && e.data.accordNote ? ' (' + e.data.accordNote.slice(0, 200) + ')' : ''));
}

/** Les Quatre Accords toltèques : l'accord de la semaine, chaque accord relié à un piège de pensée et à l'islam, le coach, et les idées du livre. */
export function QuatreAccords({ entries = [] }: { entries?: Entry[] }) {
  const today = isoOf(new Date()), semaine = accordDeLaSemaine(today);
  return <section className="ritual-card accords">
    <p className="ritual-label">Les Quatre Accords toltèques</p>
    <div className="accord-semaine"><small className="ritual-label">Mon accord de la semaine</small><strong>{semaine.n}. {semaine.titre}</strong><span className="muted small">{semaine.question}</span></div>
    <CoachAccord accord={semaine} bilan={bilanSemaine(entries, today)} />
    {ACCORDS.map((a) => { const d = DISTORSIONS.find((x) => x.id === a.piege);
      return <details key={a.n} className="astro-q"><summary><strong>{a.n}. {a.titre}</strong></summary>
        <ul className="astro-list">{a.sens.map((p) => <li key={p}>{p}</li>)}</ul>
        <p className="ritual-label">En pratique</p><ul className="astro-list">{a.pratique.map((p) => <li key={p}>{p}</li>)}</ul>
        {d && <p className="tcc-q">Le piège de pensée proche, en TCC : {d.nom}. {d.question}</p>}
        <p className="ritual-label">En islam</p><p className="fiche-pt"><AvecCoran texte={a.islam.texte} /></p>
        {a.islam.jardin && <button type="button" className="link-btn small" onClick={() => ouvrirJardin(a.islam.jardin![0])}>Le Jardin des vertueux, chapitre {a.islam.jardin[0]} : {a.islam.jardin[1]}</button>}
        <p className="ritual-label">Pour moi</p><p className="fiche-pt">{a.question}</p></details>; })}
    <details className="astro-q"><summary><strong>Comprendre le livre</strong></summary>
      {ACCORDS_COMPRENDRE.map((x) => <div key={x.titre} className="astro-detail"><p className="ritual-label">{x.titre}</p><ul className="astro-list">{x.points.map((p) => <li key={p}>{p}</li>)}</ul></div>)}</details>
    <p className="fineprint">{ACCORDS_SOURCE}. Les rapprochements avec l’islam sont proposés par l’app.</p>
  </section>;
}

function CoachAccord({ accord, bilan }: { accord: Accord; bilan: string[] }) {
  const { prefs } = useIntegrationPrefs();
  const [answer, setAnswer] = useState(''), [asking, setAsking] = useState(false), [error, setError] = useState('');
  if (!prefs.assistant) return null;
  const ask = async () => {
    setAsking(true); setError('');
    const context = ['Accord de la semaine (Les Quatre Accords toltèques) : ' + accord.titre, 'Ce qu’il veut dire : ' + accord.sens.join(' '), 'En pratique : ' + accord.pratique.join(' '),
      bilan.length ? 'Mes réponses de la semaine à « As-tu honoré ton accord ? » : ' + bilan.join(' ; ') : 'Pas encore de réponse cette semaine.'].join('\n');
    try { setAnswer(await askAssistant('Aide-moi à vivre cet accord cette semaine : une idée concrète et douce, adaptée à ce que j’ai vécu.', { context })); }
    catch { setError('Le coach n’a pas pu répondre. Réessaie dans un moment.'); } finally { setAsking(false); }
  };
  return <div className="form-stack">
    <button className="button secondary small" disabled={asking} onClick={() => void ask()}>{asking ? 'Le coach réfléchit…' : 'M’aider à vivre cet accord'}</button>
    {error && <p className="fineprint" role="alert">{error}</p>}
    {answer && <p className="coach-answer">{answer}</p>}
  </div>;
}
