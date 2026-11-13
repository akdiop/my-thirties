import { Children, useEffect, useState } from 'react';
import { BookOpen, BookText, Check, Feather, HandHeart, Languages, Mountain, Settings2, Sparkles, Sun, Trophy } from 'lucide-react';
import { useWirdCount, WIRD_KIND } from './Wird';
import { afterEntry, currentAfterPrayer } from './AfterPrayer';
import { afterProgress, type AfterData } from '../lib/afterPrayer';
import { goalOf } from '../../supabase/functions/push-reminders/wird';
import { allGratitudes, GRAT_KIND, gratitudeToReread, type GratData } from '../lib/gratitude';
import { ARABE_KIND, arabicWordOfDay, streak, type ArabeData } from '../lib/arabe/jeux';
import { carnetWindow, pageOf, wishes } from '../lib/carnet';
import { inWindow } from '../../supabase/functions/push-reminders/carnet';
import type { Entry, EntryInput } from '../lib/cloud';
import { pathById } from '../lib/learning';
import { COURSE_LOADERS } from '../lib/langCourses';
import type { LangCourse } from '../lib/langCourses/types';
import { QURAN_PAGES } from '../lib/ramadan';
import { actsDone, DH_ACTS, DH_DAYS, DHUL_HIJJA_KIND, dhulHijjaStatus, type DhData } from '../lib/dhulHijja';
import { allahNameOfDay, challengesToday, QURAN_KIND, quranPlan, quranRead, tafsirOfDay, wordOfDay } from '../lib/todayLearning';
import { ouvrirCoran } from '../ui/CoranLien';

export type LearningTarget = 'passions' | 'challenges' | 'cours' | 'dhulhijja' | 'carnet' | 'carnet-signe' | 'wird' | 'apres' | 'arabe' | 'gratitude';

/** Accueil : ce que j'ai commencé et que je ne veux pas oublier aujourd'hui (défis, mot du jour, tafsir, lecture du Coran). */
export function TodayLearning({ entries, today, onOpen, onCreate, onUpdate }: {
  entries: Entry[]; today: string; onOpen: (t: LearningTarget) => void;
  onCreate: (i: EntryInput) => Promise<void>; onUpdate: (e: Entry, d: Record<string, unknown>) => Promise<void>;
}) {
  const [showAll, setShowAll] = useState(false);
  const challenges = challengesToday(entries, today);
  const paths = entries.filter((e) => e.kind === 'path' && pathById(e.data.pathId));
  const tafsir = tafsirOfDay(today);
  const name = allahNameOfDay(today);
  const wirds = entries.filter((e) => e.kind === WIRD_KIND);
  const after = currentAfterPrayer(entries);
  const afterP = afterProgress((afterEntry(entries, today)?.data ?? {}) as AfterData, after);
  const gMoment = new Date().getHours() < 14 ? 'matin' as const : 'soir' as const;
  const gDone = ((entries.find((e) => e.kind === GRAT_KIND && e.entry_date === today)?.data ?? {}) as GratData)[gMoment]?.filter((x) => x.trim()).length ?? 0;
  const reread = gratitudeToReread(allGratitudes(entries), today, true);
  const arabe = entries.find((e) => e.kind === ARABE_KIND);
  const arWord = arabe ? arabicWordOfDay(today) : null;
  const arStreak = arabe ? streak(arabe.data as ArabeData, today) : 0;
  const carnetOpen = wishes(entries).filter((w) => !w.done).length;
  const carnetNow = inWindow(carnetWindow(entries, today), today) && !pageOf(entries, today.slice(0, 7))?.data.thoughts;
  const dh = dhulHijjaStatus(today);
  const dhDay = dh && 'day' in dh && dh.day <= 10 ? dh.day : 0;
  const dhData = (dh ? entries.find((e) => e.kind === DHUL_HIJJA_KIND && Number(e.data.year) === dh.hijriYear)?.data ?? {} : {}) as DhData;
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

  const rows = Children.toArray((<>
      {dhDay > 0 && <button className="dl-row" onClick={() => onOpen('dhulhijja')}>
        <span className="dl-icon"><Mountain size={18} /></span>
        <span className="dl-text"><small>Dhu al-Hijja · jour {dhDay} sur 10 · {actsDone(dhData, dhDay)}/{DH_ACTS.length} actes</small>
          <strong>{DH_DAYS[dhDay - 1]!.theme}</strong>
          <span className="dl-point">{DH_DAYS[dhDay - 1]!.question}</span>
        </span>
      </button>}

      {wirds.map((w) => <WirdRow key={w.id} entry={w} onUpdate={onUpdate} onOpen={() => onOpen('wird')} />)}

      <div className="dl-row">
        <span className="dl-icon"><Sun size={18} /></span>
        <button className="dl-text" onClick={() => onOpen('apres')}><small>Après la prière</small>
          <strong>{afterP.complete === afterP.total ? 'Invocations d’après ' + after + ' récitées' : 'As-tu récité après ' + after + ' ?'}</strong>
          <span className="dl-point">{afterP.complete}/{afterP.total} · istighfâr, tasbîh 33, Âyat al-Kursî{after === 'Fajr' || after === 'Maghrib' ? ', al-Mu‘awwidhât 3 fois' : ''}</span></button>
      </div>

      <button className="dl-row" onClick={() => onOpen('gratitude')}>
        <span className="dl-icon"><HandHeart size={18} /></span>
        <span className="dl-text"><small>Ma gratitude · {gMoment === 'matin' ? 'ce matin' : 'ce soir'} · {gDone}/3</small>
          <strong>{gDone >= 3 ? 'Trois gratitudes notées, alhamdulillah' : gMoment === 'matin' ? 'Pour quoi es-tu reconnaissante ce matin ?' : 'Qu’est-ce que tu gardes de ta journée ?'}</strong>
          {reread && <span className="dl-point">À relire : « {reread.text.slice(0, 90)} »</span>}</span>
      </button>

      {arabe && arWord && <div className="dl-row">
        <span className="dl-icon"><Languages size={18} /></span>
        <button className="dl-text" onClick={() => onOpen('arabe')}><small>Mon arabe · mot du jour{arStreak > 1 ? ' · ' + arStreak + ' jours de suite' : ''}</small>
          <strong className="dl-word"><span lang="ar">{arWord.ar}</span> <em>{arWord.ph}</em></strong>
          <span className="dl-point">{arWord.fr}</span></button>
        <button className="dl-btn" onClick={() => onOpen('arabe')}>Jouer</button>
      </div>}

      {(carnetNow || carnetOpen > 0) && <div className="dl-row">
        <span className="dl-icon"><Feather size={18} /></span>
        <button className="dl-text" onClick={() => onOpen('carnet')}><small>Mon carnet</small>
          <strong>{carnetNow ? 'Ta page du mois t’attend' : carnetOpen + ' souhait' + (carnetOpen > 1 ? 's' : '') + ' en chemin'}</strong></button>
        {carnetOpen > 0 && <button className="dl-btn" onClick={() => onOpen('carnet-signe')}>Un signe ?</button>}
      </div>}

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
        <button className="dl-btn soft" aria-label="Lire dans le Coran" onClick={() => ouvrirCoran()}><BookOpen size={16} /></button>
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
  </>).props.children);
  const shown = showAll ? rows : rows.slice(0, 3);
  return <section className="today-learning" aria-label="Aujourd’hui, je n’oublie pas">
    <div className="soft-card dl-list">{shown}
      {rows.length > 3 && <button className="dl-more" onClick={() => setShowAll(!showAll)}>{showAll ? 'Réduire' : 'Voir les ' + (rows.length - 3) + ' autre' + (rows.length - 3 > 1 ? 's' : '')}</button>}
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

/** Objectif de dhikr sur l'accueil : compteur rapide sans quitter l'écran. */
function WirdRow({ entry, onUpdate, onOpen }: { entry: Entry; onUpdate: (e: Entry, d: Record<string, unknown>) => Promise<void>; onOpen: () => void }) {
  const { count, add } = useWirdCount(entry, onUpdate);
  const goal = goalOf(entry.data);
  return <div className="dl-row">
    <span className="dl-icon"><Sparkles size={18} /></span>
    <button className="dl-text" onClick={onOpen}><small>Dhikr du jour · {count >= goal ? 'objectif atteint' : count + ' sur ' + goal}</small>
      <strong>{entry.title}</strong></button>
    <button className="dl-btn" aria-label={'Ajouter 1, ' + count + ' sur ' + goal} onClick={() => add(1)}>+1</button>
    <button className="dl-btn soft" aria-label="Ajouter 10" onClick={() => add(10)}>+10</button>
  </div>;
}

