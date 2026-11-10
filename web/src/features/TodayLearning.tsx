import { useEffect, useState } from 'react';
import { BookOpen, BookText, Check, Languages, Settings2, Sparkles, Trophy } from 'lucide-react';
import type { Entry, EntryInput } from '../lib/cloud';
import { pathById } from '../lib/learning';
import { COURSE_LOADERS } from '../lib/langCourses';
import type { LangCourse } from '../lib/langCourses/types';
import { QURAN_PAGES } from '../lib/ramadan';
import { allahNameOfDay, challengesToday, QURAN_KIND, quranPlan, quranRead, tafsirOfDay, wordOfDay } from '../lib/todayLearning';

export type LearningTarget = 'passions' | 'challenges' | 'cours';

/** Accueil : ce que j'ai commencé et que je ne veux pas oublier aujourd'hui (défis, mot du jour, tafsir, lecture du Coran). */
export function TodayLearning({ entries, today, onOpen, onCreate, onUpdate }: {
  entries: Entry[]; today: string; onOpen: (t: LearningTarget) => void;
  onCreate: (i: EntryInput) => Promise<void>; onUpdate: (e: Entry, d: Record<string, unknown>) => Promise<void>;
}) {
  const challenges = challengesToday(entries, today);
  const paths = entries.filter((e) => e.kind === 'path' && pathById(e.data.pathId));
  const tafsir = tafsirOfDay(today);
  const name = allahNameOfDay(today);
  const quran = entries.find((e) => e.kind === QURAN_KIND);
  const plan = quran ? quranPlan(quran.data, today) : null;

  const setupQuran = async () => {
    const page = Number(prompt('À quelle page du Coran en es-tu ? (1 à ' + QURAN_PAGES + ')', String(plan?.from ?? 1)));
    if (!Number.isFinite(page) || page < 1) return;
    const perDay = Number(prompt('Combien de pages par jour ?', String(plan?.perDay ?? 1)));
    if (!Number.isFinite(perDay) || perDay < 1) return;
    const data = { ...(quran?.data ?? {}), page: Math.min(QURAN_PAGES, Math.round(page)), perDay: Math.round(perDay), lastDone: '' };
    await (quran ? onUpdate(quran, data) : onCreate({ module: 'spiritualite', kind: QURAN_KIND, title: 'Lecture du Coran', entry_date: null, data }));
  };
  const markChallenge = (e: Entry, day: number) => {
    const progress = (e.data.progress && typeof e.data.progress === 'object' ? e.data.progress : {}) as Record<string, Record<string, unknown>>;
    return onUpdate(e, { ...e.data, progress: { ...progress, [day]: { ...(progress[String(day)] ?? {}), status: 'done' } } });
  };

  return <section className="today-learning" aria-label="Aujourd’hui, je n’oublie pas">
    <p className="eyebrow-s">Aujourd’hui, je n’oublie pas</p>
    <div className="soft-card dl-list">
      {challenges.map((c) => <div key={c.entry.id} className="dl-row">
        <span className="dl-icon"><Trophy size={18} /></span>
        <button className="dl-text" onClick={() => onOpen('challenges')}>
          <small>{c.entry.title.replace(/^Défi \d+ jours /, '')} · jour {c.day} sur {c.days}</small>
          <strong>{c.action ?? 'Jour de repos'}</strong>
        </button>
        {c.action && (c.done ? <span className="dl-done" aria-label="Fait"><Check size={16} strokeWidth={3} /></span>
          : <button className="dl-btn" onClick={() => void markChallenge(c.entry, c.day)}>Fait</button>)}
      </div>)}

      {paths.map((e) => <PathRow key={e.id} entry={e} today={today} onOpen={() => onOpen('passions')} />)}

      <div className="dl-row">
        <span className="dl-icon"><BookText size={18} /></span>
        {plan ? <button className="dl-text" onClick={() => void setupQuran()} aria-label="Régler ma lecture du Coran">
            <small>Lecture du Coran{Number(quran?.data.khatm) ? ' · ' + Number(quran?.data.khatm) + ' khatm' : ''}</small>
            <strong>{plan.from === plan.to ? 'Page ' + plan.from : 'Pages ' + plan.from + ' à ' + plan.to}</strong>
          </button>
          : <button className="dl-text" onClick={() => void setupQuran()}><small>Lecture du Coran</small><strong>Choisir ma page et mon rythme</strong></button>}
        {plan ? (plan.doneToday ? <span className="dl-done" aria-label="Lu aujourd’hui"><Check size={16} strokeWidth={3} /></span>
          : <button className="dl-btn" onClick={() => void onUpdate(quran!, quranRead(quran!.data, today))}>Lu</button>)
          : <button className="dl-btn" aria-label="Régler ma lecture du Coran" onClick={() => void setupQuran()}><Settings2 size={16} /></button>}
      </div>

      {name && <button className="dl-row" onClick={() => onOpen('cours')}>
        <span className="dl-icon"><Sparkles size={18} /></span>
        <span className="dl-text"><small>Nom d’Allah du jour · {name.n} sur 99</small>
          <strong className="dl-word"><span lang="ar">{name.ar}</span> <em>{name.tr}</em></strong>
          <span className="dl-point">{name.fr}</span>
        </span>
      </button>}

      {tafsir && <button className="dl-row tafsir" onClick={() => onOpen('cours')}>
        <span className="dl-icon"><BookOpen size={18} /></span>
        <span className="dl-text"><small>Tafsir du jour · {tafsir.lesson.replace('Tafsir d’', '')} · {tafsir.title}</small>
          {tafsir.arabic && <span className="dl-ar" lang="ar" dir="rtl">{tafsir.arabic}</span>}
          {tafsir.phonetic && <em>{tafsir.phonetic}</em>}
          {tafsir.french && <strong>{tafsir.french}</strong>}
          {tafsir.point && <span className="dl-point">{tafsir.point}</span>}
        </span>
      </button>}
    </div>
  </section>;
}

/** Parcours en cours : mot du jour pour une langue, sinon l'étape à travailler. */
function PathRow({ entry, today, onOpen }: { entry: Entry; today: string; onOpen: () => void }) {
  const p = pathById(entry.data.pathId)!;
  const [course, setCourse] = useState<LangCourse | null>(null);
  useEffect(() => { let on = true; void COURSE_LOADERS[p.id]?.().then((c) => { if (on) setCourse(c); }); return () => { on = false; }; }, [p.id]);
  const done = (entry.data.done && typeof entry.data.done === 'object' ? entry.data.done : {}) as Record<string, boolean>;
  const word = course ? wordOfDay(course, done, today) : undefined;
  const next = p.steps.findIndex((_, i) => !done[i]);
  const step = next === -1 ? null : p.steps[next];
  return <div className="dl-row">
    <span className="dl-icon"><Languages size={18} /></span>
    <button className="dl-text" onClick={onOpen}>
      <small>{p.title}{word ? ' · mot du jour' : step ? ' · étape ' + (next + 1) : ''}</small>
      {word ? <>
        <strong className="dl-word"><span lang={p.id.startsWith('lang-arabe') ? 'ar' : undefined}>{word[0]}</span> <em>{word[1]}</em></strong>
        <span className="dl-point">{word[2]}</span></>
        : <strong>{step ? step.title : 'Parcours terminé, bravo !'}</strong>}
    </button>
  </div>;
}
