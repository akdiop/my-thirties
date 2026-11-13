import { ACCORDS, ACCORDS_COMPRENDRE, ACCORDS_SOURCE, accordDeLaSemaine } from '../lib/quatreAccords';
import { DISTORSIONS } from '../lib/tcc';
import { isoOf } from '../lib/rituals';

/** Les Quatre Accords toltèques : l'accord de la semaine, chaque accord relié à un piège de pensée, et les idées du livre. */
export function QuatreAccords() {
  const semaine = accordDeLaSemaine(isoOf(new Date()));
  return <section className="ritual-card accords">
    <p className="ritual-label">Les Quatre Accords toltèques</p>
    <div className="accord-semaine"><small className="ritual-label">Mon accord de la semaine</small><strong>{semaine.n}. {semaine.titre}</strong><span className="muted small">{semaine.question}</span></div>
    {ACCORDS.map((a) => { const d = DISTORSIONS.find((x) => x.id === a.piege);
      return <details key={a.n} className="astro-q"><summary><strong>{a.n}. {a.titre}</strong></summary>
        <ul className="astro-list">{a.sens.map((p) => <li key={p}>{p}</li>)}</ul>
        <p className="ritual-label">En pratique</p><ul className="astro-list">{a.pratique.map((p) => <li key={p}>{p}</li>)}</ul>
        {d && <p className="tcc-q">Le piège de pensée proche, en TCC : {d.nom}. {d.question}</p>}
        <p className="ritual-label">Pour moi</p><p className="fiche-pt">{a.question}</p></details>; })}
    <details className="astro-q"><summary><strong>Comprendre le livre</strong></summary>
      {ACCORDS_COMPRENDRE.map((x) => <div key={x.titre} className="astro-detail"><p className="ritual-label">{x.titre}</p><ul className="astro-list">{x.points.map((p) => <li key={p}>{p}</li>)}</ul></div>)}</details>
    <p className="fineprint">{ACCORDS_SOURCE}.</p>
  </section>;
}
