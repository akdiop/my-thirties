/** Cours complet d'une langue : une fiche d'écriture, puis un cours par étape du parcours (même ordre que LANG_STEPS). */
export type Triple = [original: string, prononciation: string, francais: string];
export type LangLesson = {
  /** Explications et grammaire de l'étape. */
  lesson: string[];
  /** Mot, prononciation à la française, traduction. */
  vocab: Triple[];
  /** Orthographe, accents, caractères à connaître pour cette étape. */
  writing?: string[];
  phrases: Triple[];
  /** Dialogue à lire puis à jouer : chaque réplique avec sa prononciation et sa traduction. */
  dialogue?: Triple[];
  /** Petit texte de lecture, phrase par phrase. */
  reading?: { title: string; lines: Triple[] };
};
export type LangCourse = {
  script?: { title: string; points: string[]; table?: Triple[] };
  lessons: LangLesson[];
};
