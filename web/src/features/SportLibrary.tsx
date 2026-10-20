import { useState } from 'react';

const lessons = {
  Tennis: [
    { name: 'Le service', text: 'Travaille une préparation stable, une prise confortable et un lancer régulier. Privilégie la précision avant la vitesse.' },
    { name: 'Le coup droit', text: 'Prépare tôt la raquette, oriente les épaules et cherche un contact équilibré. Reviens ensuite vers une position prête.' },
    { name: 'Le revers', text: 'En revers à une ou deux mains, veille à l’équilibre des appuis et à la fluidité du geste. Travaille lentement avant d’accélérer.' },
    { name: 'Le placement', text: 'Observe la trajectoire, déplace-toi par petits ajustements et récupère après la frappe. L’anticipation compte autant que la vitesse.' },
    { name: 'Comprendre le score', text: 'Les points d’un jeu sont annoncés 0, 15, 30, 40, puis jeu, avec les règles d’égalité et d’avantage selon le format.' },
  ],
  Pilates: [
    { name: 'Respiration et contrôle', text: 'Respire sans bloquer l’air. Favorise des mouvements précis et confortables plutôt que l’amplitude maximale.' },
    { name: 'Pilates au sol', text: 'Commence par des exercices de mobilité douce et de stabilité. Adapte l’amplitude à tes sensations.' },
    { name: 'Reformer', text: 'Le Reformer utilise un chariot et des ressorts. Les réglages et la technique doivent être montrés par un encadrant qualifié.' },
    { name: 'Alignement', text: 'Recherche une position confortable du bassin, des épaules et de la nuque. Arrête un exercice douloureux.' },
  ],
  Yoga: [
    { name: 'Hatha', text: 'Un rythme généralement posé, qui permet d’explorer les postures, la respiration et les transitions.' },
    { name: 'Yin', text: 'Des positions tenues avec douceur et soutiens si nécessaire. Évite de forcer dans les articulations.' },
    { name: 'Vinyasa', text: 'Un enchaînement de mouvements coordonnés à la respiration. Choisis un rythme qui te convient.' },
    { name: 'Restauratif', text: 'Des postures soutenues avec des accessoires pour favoriser le confort et la détente.' },
  ],
} as const;

type Discipline = keyof typeof lessons;

export function SportLibrary() {
  const [active, setActive] = useState<Discipline>('Tennis');
  return <section className="sport-library">
    <div className="section-row"><h2>Mon carnet d'apprentissage</h2></div>
    <div className="sport-tabs">{(Object.keys(lessons) as Discipline[]).map((d) =>
      <button key={d} className={active === d ? 'active' : ''} onClick={() => setActive(d)}>{d}</button>)}</div>
    <div className="lesson-grid">{lessons[active].map((lesson) =>
      <article className="lesson-card" key={lesson.name}><h3>{lesson.name}</h3><p>{lesson.text}</p></article>)}</div>
    <p className="fineprint">Conseils introductifs, sans analyse personnalisée ni diagnostic. Les démonstrations vidéo seront ajoutées après sélection de ressources vérifiées.</p>
  </section>;
}
