import { useMemo, useState } from 'react';
import type { Entry } from '../lib/cloud';

const exercises: Record<string, { prompt: string; reflection: string }> = {
  'Anxiété': { prompt: 'Observe cinq éléments autour de toi, puis écris ce que tu peux faire aujourd’hui, à ton rythme.', reflection: 'Qu’est-ce qui t’a aidée à retrouver un peu de calme ?' },
  'Nervosité': { prompt: 'Prends un moment pour nommer la sensation et repérer ce qui l’a déclenchée, sans te juger.', reflection: 'Quel petit geste a rendu la situation plus confortable ?' },
  'Impulsivité': { prompt: 'Avant de répondre à une situation délicate, essaie de noter ce que tu voudrais vraiment exprimer.', reflection: 'As-tu pu choisir une réponse plus proche de tes intentions ?' },
  'Patience': { prompt: 'Choisis une situation où tu peux ralentir volontairement et observer ton ressenti.', reflection: 'Qu’as-tu remarqué en prenant ton temps ?' },
  'Confiance en soi': { prompt: 'Note une compétence ou une action dont tu es satisfaite, même si elle paraît ordinaire.', reflection: 'Qu’est-ce que cette expérience dit de tes ressources ?' },
  'Gestion des conflits': { prompt: 'Reformule un désaccord avec des mots qui décrivent les faits et ton besoin.', reflection: 'Quelle formulation te paraît à la fois claire et respectueuse ?' },
  'Lâcher-prise': { prompt: 'Sépare sur une page ce qui dépend de toi de ce qui ne dépend pas de toi.', reflection: 'Quelle chose peux-tu laisser en suspens aujourd’hui ?' },
  'Affirmation de soi': { prompt: 'Entraîne-toi à formuler une demande simple avec « je » et sans te justifier excessivement.', reflection: 'Comment te sens-tu après avoir clarifié ton besoin ?' },
};

export function EquilibriumInsights({ entries }: { entries: Entry[] }) {
  const [show, setShow] = useState(false);
  const journal = entries.filter((e) => e.kind === 'emotion');
  const patterns = useMemo(() => {
    const counts = new Map<string, number>();
    for (const entry of journal) {
      const emotion = String(entry.data.emotion || '').trim().toLocaleLowerCase('fr-FR');
      if (emotion) counts.set(emotion, (counts.get(emotion) ?? 0) + 1);
    }
    return [...counts].sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [journal]);
  return <section className="equilibrium-insights">
    <div className="tool-card"><div className="section-row"><h3>Mon journal, en perspective</h3>
      <button className="text-button" onClick={() => setShow((v) => !v)}>{show ? 'Masquer' : 'Voir mes tendances'}</button></div>
      {show && <>{patterns.length ? <div className="emotion-tags">{patterns.map(([emotion, count]) =>
        <span className="pill sage" key={emotion}>{emotion} · {count} note(s)</span>)}</div>
        : <p className="muted">Tu pourras voir ici les émotions que tu as choisi de noter.</p>}
        <p className="fineprint">Ce résumé décrit uniquement les mots de ton journal. Il ne juge pas tes réactions et ne pose aucun diagnostic.</p></>}</div>
    <div className="tool-card"><h3>Mes pistes de développement personnel</h3>
      <p className="muted">Des exercices facultatifs à adapter selon ton humeur et tes besoins.</p>
      <div className="lesson-grid">{Object.entries(exercises).map(([axis, item]) =>
        <article key={axis} className="lesson-card"><h3>{axis}</h3><p>{item.prompt}</p>
          <p className="fineprint">Pour ton bilan : {item.reflection}</p></article>)}</div></div>
  </section>;
}
