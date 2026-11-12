import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { BrandLockup } from './ui/BrandMark';
import type { Session } from '@supabase/supabase-js';
import {
  CalendarDays, LayoutGrid, ChevronRight, Coffee, Download, Heart,
  Home, LogOut, Plus, Save, Settings, ShieldCheck, Trash2, UserRound, X,
} from 'lucide-react';
import { cloud, configured, sendCreate, sendEdit, sendRemove, createEntry, editEntry, getSession, isOwner, readEntries, removeEntry, restoreEntries, signIn, signOut, type Entry, type EntryInput, type ModuleId } from './lib/cloud';
import { downloadBackup, makeEncryptedBackup, parseEncryptedBackup } from './lib/backup';
import { ensureMonthlyBackup, parsePlainBackup } from './lib/autoBackup';
import { LIST_TEMPLATES, templateItems } from './lib/listTemplates';
import { moduleById, modules, type Module } from './modules';
import { newOnly, validateRestore } from './lib/restore';
import { useThemeClock, useThemeMode, NIGHT_FROM, NIGHT_TO, type ThemeMode } from './lib/theme';
import { consolidateIngredients, groceryTitle, mergeGroceryItems, weekGroceryItems, weekStart, type ListItem } from './lib/groceries';
import { deleteEntryMedia } from './lib/mediaLibrary';
import { ProfileAvatar } from './features/PersonalProfile';
import { birthdayLine, PROFILE_KIND, readProfile } from './lib/profile';
import { PHOTO_KIND } from './lib/photos';
import { PhotoProvider } from './features/HeroPhoto';
import { Home as HomeScreen } from './screens/Home';
import { wordOfMonth } from './lib/carnet';
import type { CuisineTab, EquilibreTab, SpiritTab } from './screens/ModuleTops';
import { ScreenHeader, SectionTitle, Segmented } from './ui/kit';
import { GuidedField } from './ui/fields';
import { HIDDEN_KIND, HiddenProvider, readHidden, useHidden, type Hidden } from './lib/hidden';
import { HABIT_KIND, RITUAL_KINDS } from './lib/rituals';
import { BUDGETS_KIND } from './lib/money';
import { TodayCard } from './features/TodayCard';
import { ListCard } from './features/ListCard';
import { togglePrayer } from './lib/wellbeing';
import { HomeRituals } from './screens/HomeRituals';
import { LockGate } from './features/LockGate';
import { removeLock } from './lib/journalLock';
import { applyOutbox, flushOutbox, pendingCount } from './lib/outbox';
import { clearOffline, isNetworkError, knownOwner, loadOffline, rememberOwner, saveOffline } from './lib/offline';
import { Sparkles } from 'lucide-react';
import { useIntegrationCloudSync } from './lib/integrations';

// Écrans chargés à la demande : l'app s'ouvre plus vite.
const Agenda = lazy(() => import('./screens/Agenda').then((m) => ({ default: m.Agenda })));
const Wellbeing = lazy(() => import('./screens/Wellbeing').then((m) => ({ default: m.Wellbeing })));
const Spaces = lazy(() => import('./screens/Spaces').then((m) => ({ default: m.Spaces })));
const Calm = lazy(() => import('./screens/Calm').then((m) => ({ default: m.Calm })));
const HealthTop = lazy(() => import('./screens/HealthTop').then((m) => ({ default: m.HealthTop })));
const FinanceTop = lazy(() => import('./screens/FinanceTop').then((m) => ({ default: m.FinanceTop })));
const CuisineTop = lazy(() => import('./screens/ModuleTops').then((m) => ({ default: m.CuisineTop })));
const EquilibreTop = lazy(() => import('./screens/ModuleTops').then((m) => ({ default: m.EquilibreTop })));
const SpiritTop = lazy(() => import('./screens/ModuleTops').then((m) => ({ default: m.SpiritTop })));
const TravelTop = lazy(() => import('./screens/ModuleTops').then((m) => ({ default: m.TravelTop })));
const MonthlyBackups = lazy(() => import('./features/MonthlyBackups').then((m) => ({ default: m.MonthlyBackups })));
const Qibla = lazy(() => import('./features/Qibla').then((m) => ({ default: m.Qibla })));
const PersonalProfile = lazy(() => import('./features/PersonalProfile').then((m) => ({ default: m.PersonalProfile })));
const BoosterPlan = lazy(() => import('./features/BoosterPlan').then((m) => ({ default: m.BoosterPlan })));
const RecipeView = lazy(() => import('./features/RecipeView').then((m) => ({ default: m.RecipeView })));
const TravelTools = lazy(() => import('./features/TravelTools').then((m) => ({ default: m.TravelTools })));
const EquilibriumInsights = lazy(() => import('./features/EquilibriumInsights').then((m) => ({ default: m.EquilibriumInsights })));
const KitchenPlanner = lazy(() => import('./features/KitchenPlanner').then((m) => ({ default: m.KitchenPlanner })));
const PassionPath = lazy(() => import('./features/PassionPath').then((m) => ({ default: m.PassionPath })));
const Carnet = lazy(() => import('./screens/Carnet').then((m) => ({ default: m.Carnet })));
const Gratitude = lazy(() => import('./screens/Gratitude').then((m) => ({ default: m.Gratitude })));
const Transformation = lazy(() => import('./screens/Transformation').then((m) => ({ default: m.Transformation })));
const PassionIdeas = lazy(() => import('./features/PassionIdeas').then((m) => ({ default: m.PassionIdeas })));
const TravelPlanner = lazy(() => import('./features/TravelPlanner').then((m) => ({ default: m.TravelPlanner })));
const PersonalBrief = lazy(() => import('./features/PersonalBrief').then((m) => ({ default: m.PersonalBrief })));
const RecipeIdeas = lazy(() => import('./features/RecipeIdeas').then((m) => ({ default: m.RecipeIdeas })));
const BalanceReview = lazy(() => import('./features/BalanceReview').then((m) => ({ default: m.BalanceReview })));
const AutomaticPrayerTimes = lazy(() => import('./features/AutomaticPrayerTimes').then((m) => ({ default: m.AutomaticPrayerTimes })));
const PersonalAssistant = lazy(() => import('./features/PersonalAssistant').then((m) => ({ default: m.PersonalAssistant })));
const PrivacyCenter = lazy(() => import('./features/PrivacyCenter').then((m) => ({ default: m.PrivacyCenter })));
const SportHub = lazy(() => import('./features/SportHub').then((m) => ({ default: m.SportHub })));
const ChallengesBoard = lazy(() => import('./features/ChallengesBoard').then((m) => ({ default: m.ChallengesBoard })));
const Compass = lazy(() => import('./screens/Compass').then((m) => ({ default: m.Compass })));
const Focus = lazy(() => import('./screens/Focus').then((m) => ({ default: m.Focus })));
const Sleep = lazy(() => import('./screens/Sleep').then((m) => ({ default: m.Sleep })));
const Meditate = lazy(() => import('./screens/Meditate').then((m) => ({ default: m.Meditate })));
const Supplements = lazy(() => import('./screens/Supplements').then((m) => ({ default: m.Supplements })));
const Relatives = lazy(() => import('./screens/Relatives').then((m) => ({ default: m.Relatives })));
const Reading = lazy(() => import('./screens/Reading').then((m) => ({ default: m.Reading })));
const Wishes = lazy(() => import('./screens/Wishes').then((m) => ({ default: m.Wishes })));
const Duas = lazy(() => import('./features/Duas').then((m) => ({ default: m.Duas })));
const PandaScreen = lazy(() => import('./features/panda/PandaScreen').then((m) => ({ default: m.PandaScreen })));
const LearningPaths = lazy(() => import('./features/LearningPaths').then((m) => ({ default: m.LearningPaths })));
const SeriesTracker = lazy(() => import('./features/SeriesTracker').then((m) => ({ default: m.SeriesTracker })));
const TravelSuggestions = lazy(() => import('./features/TravelSuggestions').then((m) => ({ default: m.TravelSuggestions })));
const CookingTips = lazy(() => import('./features/CookingTips').then((m) => ({ default: m.CookingTips })));
const WeekLunches = lazy(() => import('./features/WeekLunches').then((m) => ({ default: m.WeekLunches })));
const MyDay = lazy(() => import('./screens/MyDay').then((m) => ({ default: m.MyDay })));
const Habits = lazy(() => import('./screens/Habits').then((m) => ({ default: m.Habits })));
const Notes = lazy(() => import('./screens/Notes').then((m) => ({ default: m.Notes })));
const Review = lazy(() => import('./screens/Review').then((m) => ({ default: m.Review })));
const NotificationSettings = lazy(() => import('./features/Notifications').then((m) => ({ default: m.NotificationSettings })));
const JournalSettings = lazy(() => import('./features/JournalSettings').then((m) => ({ default: m.JournalSettings })));
const IphoneCalendar = lazy(() => import('./features/IphoneCalendar').then((m) => ({ default: m.IphoneCalendar })));

type Screen = 'home' | 'agenda' | 'bienetre' | 'spaces' | 'settings' | 'calme' | 'assistant' | 'myday' | 'habits' | 'notes' | 'bilan' | 'parametres' | 'boussole' | 'focus' | 'sommeil' | 'mediter' | 'complements' | 'proches' | 'lectures' | 'envies' | 'panda' | 'transformation' | 'carnet' | 'gratitude' | ModuleId;
type DataValue = string | Record<string, string> | { id: string; text: string; checked: boolean }[];
const today = () => new Date().toLocaleDateString('en-CA');
const value = (obj: Record<string, unknown>, key: string) => typeof obj[key] === 'string' ? obj[key] as string : '';
const humanDate = (date: string | null) => date ? new Date(date + 'T12:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) : '';
const safeLink = (v: unknown) => { try { const url = new URL(String(v)); return url.protocol === 'https:' ? url.href : null; } catch { return null; } };
const nav: { id: Screen; label: string; icon: typeof Home }[] = [
  { id: 'home', label: 'Accueil', icon: Home },
  { id: 'habits', label: 'Habitudes', icon: Heart },
  { id: 'myday', label: 'Mon jour', icon: Sparkles },
  { id: 'spaces', label: 'Espaces', icon: LayoutGrid },
  { id: 'agenda', label: 'Agenda', icon: CalendarDays },
  { id: 'settings', label: 'Profil', icon: UserRound },
];

function Login({ onSignedIn }: { onSignedIn: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  async function submit(event: FormEvent) {
    event.preventDefault();
    setPending(true); setError('');
    try { await signIn(email.trim(), password); onSignedIn(); }
    catch { setError('Connexion impossible. Vérifiez vos identifiants et les paramètres du compte.'); }
    finally { setPending(false); }
  }
  return (
    <main className="auth-layout">
      <div className="auth-brand"><BrandLockup /></div>
      <section className="auth-card">
        <span className="eyebrow">ESPACE PERSONNEL</span>
        <h1>Tout ce qui compte,<br /><em>au même endroit.</em></h1>
        <p>Un espace privé pour organiser tes journées, prendre soin de toi et avancer à ton rythme.</p>
        <form onSubmit={submit} className="form-stack">
          <label>Adresse e-mail<input type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} /></label>
          <label>Mot de passe<input type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} /></label>
          {error && <p className="error" role="alert">{error}</p>}
          <button className="button primary" type="submit" disabled={pending}>{pending ? 'Connexion…' : 'Entrer dans mon espace'} <ChevronRight size={18} /></button>
        </form>
        <p className="fineprint"><ShieldCheck size={15} /> Accès réservé au compte personnel autorisé.</p>
      </section>
    </main>
  );
}

type Preset = { kind: string; data: Record<string, string>; title?: string };

function Editor({ module, initial, preset, entries, onSave, onCancel, onDelete, busy }: {
  module: Module; initial?: Entry; preset?: Preset; entries: Entry[]; onSave: (input: EntryInput, id?: string) => Promise<void>; onCancel: () => void; onDelete?: (e: Entry) => Promise<void>; busy: boolean;
}) {
  const [kindId, setKindId] = useState(initial?.kind ?? (preset && module.kinds.some((k) => k.id === preset.kind) ? preset.kind : module.kinds.find((k) => !k.hidden)!.id));
  const [title, setTitle] = useState(initial?.title ?? preset?.title ?? '');
  const [form, setForm] = useState<Record<string, DataValue>>(initial?.data as Record<string, DataValue> ?? { date: today(), start: today(), ...(preset?.data ?? {}) });
  const [error, setError] = useState('');
  const kind = module.kinds.find((k) => k.id === kindId) ?? module.kinds[0]!;
  const update = (id: string, val: string) => setForm((f) => ({ ...f, [id]: val }));
  const submit = async (event: FormEvent) => {
    event.preventDefault(); setError('');
    const flat = Object.fromEntries(Object.entries(form).map(([k, v]) => [k, typeof v === 'string' ? v : ''])) as Record<string, string>;
    const finalTitle = title.trim() || kind.title?.(flat).trim().replace(/\s·\s*$/, '') || '';
    if (!finalTitle) return setError('Ajoute un titre.');
    const missing = kind.fields.find((f) => !f.optional && ['chips', 'select'].includes(f.type) && f.id !== 'frequency' && !flat[f.id] && ['mood', 'prayer', 'category', 'axis', 'status', 'emotion'].includes(f.id));
    if (missing) return setError('Choisis : ' + missing.label.toLowerCase() + '.');
    const data: Record<string, unknown> = { ...form };
    if (module.id === 'listes') {
      const previous = Array.isArray(form.items) ? form.items as { id: string; text: string; checked: boolean }[] : [];
      const lines = String(form.itemsText ?? '').split('\n').map((x) => x.trim()).filter(Boolean);
      data.items = lines.map((text, index) => ({
        id: previous.find((x, j) => x.text === text && lines.slice(0, index).filter((v) => v === text).length === previous.slice(0, j).filter((v) => v.text === text).length)?.id ?? crypto.randomUUID(),
        text, checked: previous.find((x, j) => x.text === text && lines.slice(0, index).filter((v) => v === text).length === previous.slice(0, j).filter((v) => v.text === text).length)?.checked ?? false,
      }));
    }
    if (module.id === 'challenges' && !initial) data.progress = {};
    const entryDate = typeof data.date === 'string' && data.date ? data.date
      : typeof data.start === 'string' && data.start ? data.start : null;
    try { await onSave({ module: module.id, kind: kind.id, title: finalTitle, entry_date: entryDate, data }, initial?.id); }
    catch (e) { setError(e instanceof Error ? e.message : 'Enregistrement impossible.'); }
  };
  return (
    <div className="modal-overlay" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) onCancel(); }}>
      <section className="editor" role="dialog" aria-modal="true" aria-label={initial ? 'Modifier une entrée' : 'Nouvelle entrée'}>
        <div className="editor-head"><h2>{initial ? 'Modifier' : module.name}</h2><button className="icon-button" onClick={onCancel} aria-label="Fermer"><X size={20} /></button></div>
        <form onSubmit={submit} className="form-stack">
          {module.kinds.filter((k) => !k.hidden).length > 1 && !initial && <div className="gchips kinds" role="radiogroup" aria-label="Type">
            {module.kinds.filter((k) => !k.hidden).map((k) => <button type="button" key={k.id} role="radio" aria-checked={k.id === kindId} className={'gchip' + (k.id === kindId ? ' on' : '')}
              onClick={() => { setKindId(k.id); setForm({ date: today(), start: today(), ...(preset?.kind === k.id ? preset.data : {}) }); }}>{k.label}</button>)}
          </div>}
          <label className="gfield">{kind.title ? 'Titre (facultatif)' : 'Titre'}
            <input maxLength={180} value={title} onChange={(e) => setTitle(e.target.value)}
              placeholder={kind.title ? (kind.title(Object.fromEntries(Object.entries(form).map(([k, v]) => [k, typeof v === 'string' ? v : '']))).replace(/\s·\s*$/, '') || 'Rempli automatiquement') : 'Donner un nom…'} /></label>
          {kind.fields.map((field) => {
            const linked = field.id === 'recipe' && kind.id === 'meal'
              ? entries.filter((e) => e.module === 'cuisine' && e.kind === 'recipe').map((e) => e.title)
              : field.id === 'hobby' && kind.id === 'practice'
                ? entries.filter((e) => e.module === 'passions' && e.kind === 'hobby').map((e) => e.title)
                : [];
            const options = linked.length ? [...new Set([...(field.options ?? []), ...linked])] : field.options;
            return <GuidedField key={kind.id + field.id} field={{ ...field, options }} value={String(form[field.id] ?? '')} onChange={(v) => update(field.id, v)} />;
          })}
          {error && <p role="alert" className="error">{error}</p>}
          <div className="editor-actions">{initial && onDelete && <button type="button" className="button ghost danger editor-delete" onClick={() => void onDelete(initial)}><Trash2 size={16} /> Supprimer</button>}<button type="button" className="button ghost" onClick={onCancel}>Annuler</button><button className="button primary" type="submit" disabled={busy}><Save size={16} /> {busy ? 'Enregistrement…' : 'Enregistrer'}</button></div>
        </form>
      </section>
    </div>
  );
}

function ChallengeCalendar({ entry, onUpdate }: { entry: Entry; onUpdate: (entry: Entry, data: Record<string, unknown>) => Promise<void> }) {
  const days = Math.min(30, Math.max(7, Number(entry.data.days) || 30));
  const [selected, setSelected] = useState(1);
  const [notes, setNotes] = useState('');
  const progress = (entry.data.progress && typeof entry.data.progress === 'object' ? entry.data.progress : {}) as Record<string, { status: string; notes?: string }>;
  const done = Object.values(progress).filter((p) => p.status === 'done').length;
  const rest = Object.values(progress).filter((p) => p.status === 'rest').length;
  const current = progress[String(selected)] ?? { status: 'not_done', notes: '' };
  async function mark(status: string) {
    await onUpdate(entry, { ...entry.data, progress: { ...progress, [selected]: { ...current, status } } });
  }
  async function saveNotes() {
    await onUpdate(entry, { ...entry.data, progress: { ...progress, [selected]: { ...current, notes } } });
  }
  return (
    <div className="challenge-panel">
      <div className="section-row"><h3>{entry.title}</h3><span className="pill sage">{done} réalisés · {rest} repos</span></div>
      <div className="progress-track"><div style={{ width: (100 * done / days) + '%' }} /></div>
      <p className="muted">Les jours manqués n'effacent pas tes progrès. Prévois des journées de récupération.</p>
      <div className="challenge-grid">
        {Array.from({ length: days }, (_, i) => {
          const day = i + 1, state = progress[String(day)]?.status ?? 'not_done';
          return <button key={day} className={'challenge-day ' + state + (selected === day ? ' selected' : '')}
            onClick={() => { setSelected(day); setNotes(progress[String(day)]?.notes ?? ''); }}
            aria-label={'Jour ' + day + ' : ' + (state === 'done' ? 'réalisé' : state === 'rest' ? 'repos' : 'non réalisé')}>
            <strong>{day}</strong><small>{state === 'done' ? '✓' : state === 'rest' ? '—' : '·'}</small>
          </button>;
        })}
      </div>
      <div className="challenge-controls">
        <strong>Jour {selected}</strong>
        <div className="button-group">
          <button className={current.status === 'done' ? 'button primary' : 'button ghost'} onClick={() => void mark('done')}>Réalisé</button>
          <button className={current.status === 'rest' ? 'button secondary' : 'button ghost'} onClick={() => void mark('rest')}>Repos</button>
          <button className={current.status === 'not_done' ? 'button secondary' : 'button ghost'} onClick={() => void mark('not_done')}>Non réalisé</button>
        </div>
        <label>Exercices, adaptation ou ressenti
          <textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Programme du jour (facultatif)" />
        </label>
        <button className="button secondary" onClick={() => void saveNotes()}>Enregistrer la note</button>
      </div>
    </div>
  );
}

function Checklist({ entry, onUpdate }: { entry: Entry; onUpdate: (entry: Entry, data: Record<string, unknown>) => Promise<void> }) {
  const items = Array.isArray(entry.data.items) ? entry.data.items as { id: string; text: string; checked: boolean }[] : [];
  return <div className="checklist">{items.map((item, i) =>
    <label key={item.id ?? i} className="checklist-item">
      <input type="checkbox" checked={item.checked} onChange={(e) => void onUpdate(entry, {
        ...entry.data, items: items.map((x, j) => j === i ? { ...x, checked: e.target.checked } : x),
      })} />
      <span className={item.checked ? 'checked' : ''}>{item.text}</span>
    </label>
  )}</div>;
}

function KitchenTools({ entries, onGenerate }: { entries: Entry[]; onGenerate: (title: string, items: string[]) => Promise<void> }) {
  const recipes = entries.filter((e) => e.kind === 'recipe');
  const [selected, setSelected] = useState<string[]>([]);
  const [servings, setServings] = useState<Record<string, number>>({});
  if (!recipes.length) return null;
  const generate = async () => {
    const ingredients = consolidateIngredients(recipes.filter((r) => selected.includes(r.id)).map((r) => {
      const base = Number(r.data.portions) || 1;
      const desired = servings[r.id] || base;
      return { lines: value(r.data, 'ingredients'), multiplier: desired / base };
    }));
    if (ingredients.length) await onGenerate('Courses pour mes recettes', ingredients);
    setSelected([]);
  };
  return <div className="tool-card">
    <h3>Ma liste de courses</h3><p className="muted">Sélectionne des recettes pour regrouper leurs ingrédients.</p>
    {recipes.map((r) => <label className="checklist-item" key={r.id}><input type="checkbox" checked={selected.includes(r.id)}
      onChange={(e) => setSelected((v) => e.target.checked ? [...v, r.id] : v.filter((id) => id !== r.id))} />{r.title}</label>)}
    {recipes.filter((r) => selected.includes(r.id)).map((r) => <label key={r.id} className="serving-label">
      Portions souhaitées pour {r.title}
      <input type="number" min="1" max="50" step="1" value={servings[r.id] ?? (Number(r.data.portions) || 1)}
        onChange={(e) => setServings((v) => ({ ...v, [r.id]: Number(e.target.value) }))} />
    </label>)}
    <button className="button secondary" disabled={!selected.length} onClick={() => void generate()}>Créer la liste de courses</button>
    <p className="fineprint">Les unités g/kg et ml/cl/l sont regroupées. Vérifie les ingrédients sans quantité reconnue.</p>
  </div>;
}

function EntryCard({ entry, module, onEdit, onDelete, onUpdate }: {
  entry: Entry; module: Module; onEdit: (e: Entry) => void; onDelete: (e: Entry) => void;
  onUpdate: (entry: Entry, data: Record<string, unknown>) => Promise<void>;
}) {
  if (module.id === 'listes' && entry.kind === 'list') return <ListCard entry={entry} onUpdate={onUpdate} onEdit={onEdit} onDelete={onDelete} />;
  const kind = module.kinds.find((k) => k.id === entry.kind);
  const detail = kind?.fields.filter((f) => f.type !== 'textarea' && f.id !== 'date').slice(0, 3)
    .map((f) => value(entry.data, f.id)).filter(Boolean).join(' · ');
  return <article className="entry-card">
    <div className="entry-head">
      <div><span className="pill">{kind?.label ?? entry.kind}</span><h3>{entry.title}</h3>
        <p className="muted">{humanDate(entry.entry_date)} {detail ? ' · ' + detail : ''}</p></div>
      <div className="entry-actions">
        <button aria-label={'Modifier ' + entry.title} className="icon-button" onClick={() => onEdit(entry)}><Settings size={17} /></button>
        <button aria-label={'Supprimer ' + entry.title} className="icon-button danger" onClick={() => onDelete(entry)}><Trash2 size={17} /></button>
      </div>
    </div>
    {(module.id === 'sport' || module.id === 'challenges') && safeLink(entry.data.video) && <p className="entry-note"><a href={safeLink(entry.data.video)!} target="_blank" rel="noopener noreferrer">Ouvrir la vidéo pédagogique ↗</a></p>}
    {module.id === 'listes' && <Checklist entry={entry} onUpdate={onUpdate} />}
    {module.id === 'equilibre' && entry.kind === 'booster' && <BoosterPlan entry={entry} onUpdate={onUpdate} />}
    {module.id === 'challenges' && <ChallengeCalendar key={entry.id} entry={entry} onUpdate={onUpdate} />}
    {entry.kind === 'recipe' && <RecipeView entry={entry} />}
    {module.id !== 'listes' && module.id !== 'challenges' && entry.kind !== 'recipe' && kind?.fields.filter((f) => f.type === 'textarea' && value(entry.data, f.id))
      .slice(0, 2).map((f) => <p key={f.id} className="entry-note"><strong>{f.label} : </strong>{value(entry.data, f.id)}</p>)}
  </article>;
}

/** Suggestions masquées dans les espaces, à rétablir une par une. */
function HiddenSuggestions() {
  const { items, restore } = useHidden();
  if (!items.length) return null;
  const label: Record<string, string> = { path: 'Parcours', challenge: 'Défi', destination: 'Destination', recipe: 'Recette' };
  return <><p className="sec">Suggestions masquées</p>
    <section className="panel form-stack">
      <p className="muted">Elles n’apparaissent plus dans les espaces. Rétablis celles qui t’intéressent de nouveau.</p>
      {items.map((x) => <div key={x.id} className="path-item"><span className="row-text"><strong>{x.label}</strong><small>{label[x.id.split(':')[0]] ?? 'Suggestion'}</small></span>
        <button className="button ghost" onClick={() => void restore([x.id])}>Rétablir</button></div>)}
    </section></>;
}

function Appearance() {
  const [mode, setMode] = useThemeMode();
  const opts: { value: ThemeMode; label: string; sub: string }[] = [
    { value: 'auto', label: 'Sombre le soir', sub: 'Automatiquement de ' + NIGHT_FROM + ' h à ' + NIGHT_TO + ' h' },
    { value: 'jour', label: 'Toujours clair', sub: 'Palette Version douce' },
    { value: 'nuit', label: 'Toujours sombre', sub: 'Plus doux pour les yeux' }];
  return <section className="panel form-stack">
    <h2>Thème</h2>
    {opts.map((o) => <label key={o.value} className="checklist-item theme-opt"><input type="radio" name="theme" checked={mode === o.value} onChange={() => setMode(o.value)} /><span><strong>{o.label}</strong><small className="muted"> · {o.sub}</small></span></label>)}
    <details><summary>Raccourcis sur l’icône de l’app</summary>
      <p className="muted small">Sur Android et sur ordinateur, un appui long (ou clic droit) sur l’icône propose : Mon jour, Ajouter une dépense, Mes habitudes, Mon assistant.</p>
      <p className="muted small">Sur iPhone, Apple ne permet pas encore ces raccourcis pour les apps installées depuis Safari. Astuce : dans l’app Raccourcis, crée un raccourci « Ouvrir l’URL » avec l’adresse de l’app suivie de <code>?ecran=depense</code> (ou <code>myday</code>, <code>habits</code>, <code>assistant</code>), puis ajoute-le à l’écran d’accueil. Il s’ouvre dans Safari.</p>
    </details>
  </section>;
}

function Profile({ view, onSettings, email, entries, profileEntry, onSaveProfile, onLogout, onRestored }: { view: 'profile' | 'settings'; onSettings: () => void; email: string; entries: Entry[]; profileEntry: Entry | undefined; onSaveProfile: (input: EntryInput, id?: string) => Promise<void>; onLogout: () => Promise<void>; onRestored: () => Promise<void> }) {
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const exportData = async () => {
    setMessage('');
    if (password.length < 12 || password !== confirmation) return setMessage('Saisis deux fois la même phrase secrète (12 caractères minimum).');
    setBusy(true);
    try {
      const encrypted = await makeEncryptedBackup(entries, password);
      downloadBackup(encrypted); setPassword(''); setConfirmation('');
      setMessage('Sauvegarde chiffrée générée. Conserve le fichier et la phrase secrète séparément.');
    } catch (e) { setMessage(e instanceof Error ? e.message : 'Export impossible.'); }
    finally { setBusy(false); }
  };
  const restoreFile = async (file: File | undefined) => {
    if (!file) return;
    setMessage('');
    const text = file.size <= 16_000_000 ? await file.text() : '';
    const plain = parsePlainBackup(text);
    if (!plain && !password) return setMessage('Saisis d’abord la phrase secrète de la sauvegarde.');
    setBusy(true);
    try {
      if (!text) throw new Error('Fichier trop volumineux.');
      const raw = plain ?? await parseEncryptedBackup(text, password);
      const validated = validateRestore(raw);
      const fresh = newOnly(validated, entries);
      if (!fresh.length) { setMessage('Tout est déjà là : aucune entrée à restaurer.'); return; }
      if (!window.confirm('Restaurer ' + fresh.length + ' entrée' + (fresh.length > 1 ? 's' : '') + ' ? ' + (validated.length - fresh.length ? (validated.length - fresh.length) + ' déjà présentes seront ignorées. ' : '') + 'Rien n’est supprimé.')) return;
      await restoreEntries(fresh, (n) => setMessage('Restauration… ' + n + ' / ' + fresh.length));
      await onRestored();
      setPassword(''); setConfirmation('');
      setMessage(fresh.length + ' entrées restaurées.');
    } catch { setMessage('Restauration impossible : vérifie le fichier, la phrase secrète et le format.'); }
    finally { setBusy(false); }
  };
  const me = readProfile(profileEntry);
  const line = [me.city, birthdayLine(me.birthDate, new Date())].filter(Boolean).join(' · ');
  if (view === 'profile') return <div className="profile-screen">
    <header className="profile-top">
      <ProfileAvatar profile={me} size={64} />
      <div><h1>{[me.firstName, me.lastName].filter(Boolean).join(' ') || 'Mon profil'}</h1><p>{line || email}</p></div>
    </header>
    {(me.hobbies.length > 0 || me.situation) && <div className="chip-row">{[me.situation, me.job, ...me.hobbies].filter(Boolean).slice(0, 8).map((t) => <span key={t} className="chip">{t}</span>)}</div>}
    <details className="group" open={!profileEntry}>
      <summary>Modifier mon profil</summary>
      <PersonalProfile key={profileEntry?.id ?? 'new'} entry={profileEntry} onSave={onSaveProfile} />
    </details>
    <button className="settings-link" onClick={onSettings}><Settings size={20} /><span><strong>Paramètres</strong><small>Notifications, journal, calendriers, données, intégrations</small></span><ChevronRight size={18} /></button>
    <section className="panel form-stack">
      <h2>Compte personnel</h2><p>{email}</p>
      <button className="button secondary" onClick={() => void onLogout()}><LogOut size={16} /> Se déconnecter</button>
    </section>
  </div>;
  return <div className="profile-screen settings-screen">
    <ScreenHeader title="Paramètres" onBack={onSettings} />
    <p className="sec">Apparence</p>
    <Appearance />
    <p className="sec">Notifications</p>
    <NotificationSettings />
    <p className="sec">Journal</p>
    <JournalSettings />
    <p className="sec">Calendriers</p>
    <IphoneCalendar onImported={() => void onRestored()} />
    <HiddenSuggestions />
    <p className="sec">Compte</p>
    <section className="panel form-stack">
      <h2>Compte personnel</h2><p>{email}</p>
      <p className="muted">Tu restes connectée sur cet appareil jusqu’à ce que tu te déconnectes.</p>
      <button className="button secondary" onClick={() => void onLogout()}><LogOut size={16} /> Se déconnecter</button>
    </section>
    <p className="sec">Mes données</p>
    <MonthlyBackups entries={entries} />
    <section className="panel form-stack">
      <h2>Sauvegarde chiffrée</h2><p>Un fichier AES-256-GCM, protégé par une phrase secrète, est généré sur ton appareil. Les données ne sont pas envoyées à un service d'export.</p>
      <label>Phrase secrète (12 caractères minimum)<input type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} /></label>
      <label>Confirmer la phrase secrète<input type="password" autoComplete="new-password" value={confirmation} onChange={(e) => setConfirmation(e.target.value)} /></label>
      <button className="button primary" disabled={busy || password.length < 12 || password !== confirmation} onClick={() => void exportData()}><Download size={17} /> {busy ? 'Chiffrement…' : 'Exporter mes données'}</button>
      <label>Restaurer une sauvegarde (mensuelle, ou chiffrée avec la phrase secrète ci-dessus)
        <input type="file" accept=".json,application/json" disabled={busy} onChange={(e) => { const file = e.target.files?.[0]; void restoreFile(file); e.target.value = ''; }} />
      </label>
      <p className="fineprint">La restauration ajoute seulement ce qui manque : rien n’est supprimé, et ce qui existe déjà est ignoré (pas de doublons). Pratique pour passer sur un nouveau téléphone.</p>
      {message && <p role="status">{message}</p>}
    </section>
    <p className="sec">Intégrations et confidentialité</p>
    <PrivacyCenter />
    <section className="panel"><h2>À propos de cette version</h2><p className="muted">Application privée. Les rappels arrivent même app fermée une fois les notifications activées sur cet appareil. L’assistant ne voit que ce que tu coches. Les sauvegardes chiffrées se restaurent sans doublons.</p></section>
  </div>;
}

/** Après l'ouverture, on charge en arrière-plan les écrans principaux pour qu'ils s'ouvrent sans attente. */
function preloadScreens() {
  const run = () => { void import('./screens/Agenda'); void import('./screens/Wellbeing'); void import('./screens/Spaces'); void import('./screens/ModuleTops');
    void import('./screens/HealthTop'); void import('./screens/FinanceTop'); void import('./features/PersonalProfile'); void import('./screens/Calm'); };
  if (typeof window.requestIdleCallback === 'function') window.requestIdleCallback(run, { timeout: 4000 }); else setTimeout(run, 2500);
}

export default function App() {
  useEffect(() => { preloadScreens(); }, []);
  useThemeClock();
  const [session, setSession] = useState<Session | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [owner, setOwner] = useState<boolean | null>(null);
  const [screen, setScreen] = useState<Screen>('home');
  const [allEntries, setEntries] = useState<Entry[]>([]);
  const profileEntry = allEntries.find((e) => e.kind === PROFILE_KIND);
  const entries = useMemo(() => allEntries.filter((e) => e.kind !== PROFILE_KIND && e.kind !== PHOTO_KIND && e.kind !== HIDDEN_KIND && !RITUAL_KINDS.includes(e.kind)), [allEntries]);
  const ritualEntries = useMemo(() => allEntries.filter((e) => e.kind !== PROFILE_KIND && e.kind !== PHOTO_KIND && e.kind !== HIDDEN_KIND), [allEntries]);
  const [assistantIdea, setAssistantIdea] = useState('');
  const [pendingExpense, setPendingExpense] = useState(false);
  const [carnetSign, setCarnetSign] = useState(0);
  const [dayTarget, setDayTarget] = useState<{ date?: string; part?: 'matin' | 'soir'; n: number }>({ n: 0 });
  // Lien ouvert depuis une notification : ?ecran=myday&moment=soir, ?ecran=habits…
  useEffect(() => {
    const q = new URLSearchParams(window.location.search), target = q.get('ecran');
    if (!target) return;
    if (['myday', 'habits', 'bilan', 'agenda', 'notes', 'boussole', 'focus', 'sommeil', 'mediter', 'complements', 'assistant', 'proches', 'lectures', 'envies', 'panda', 'transformation', 'carnet', 'gratitude'].includes(target)) {
      if (target === 'myday') setDayTarget((t) => ({ part: q.get('moment') === 'soir' ? 'soir' : 'matin', n: t.n + 1 }));
      if (target === 'assistant') setAssistantIdea(q.get('idee') ?? '');
      setScreen(target as Screen);
    }
    if (target === 'depense') setPendingExpense(true);
    if (target === 'spiritualite') setScreen('spiritualite' as Screen);
    window.history.replaceState(null, '', window.location.pathname);
  }, []);
  const photoEntries = useMemo(() => allEntries.filter((e) => e.kind === PHOTO_KIND), [allEntries]);
  const photos = useMemo(() => Object.fromEntries(photoEntries.flatMap((e) =>
    typeof e.data.image === 'string' && /^data:image\/jpeg;base64,/.test(e.data.image) ? [[e.title, e.data.image]] : [])), [photoEntries]);
  const [loading, setLoading] = useState(false);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState('');
  const [editor, setEditor] = useState<{ module: Module; initial?: Entry; preset?: Preset } | null>(null);
  const [cuisineTab, setCuisineTab] = useState<CuisineTab>('recettes');
  const [travelTab, setTravelTab] = useState<'destinations' | 'voyage'>('destinations');
  const [equilibreTab, setEquilibreTab] = useState<EquilibreTab>('axes');
  const [spiritTab, setSpiritTab] = useState<SpiritTab>('home');
  const [passionTab, setPassionTab] = useState<'parcours' | 'series' | 'libre' | 'idees'>('parcours');
  const [search, setSearch] = useState('');
  const userIdRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    let active = true;
    getSession().then((s) => { if (active) { userIdRef.current = s?.user.id; setSession(s); } })
      .catch(() => { if (active) setSession(null); })
      .finally(() => { if (active) setAuthReady(true); });
    // Supabase renvoie un événement à chaque retour sur l'onglet : on ne revérifie l'accès que si le compte change.
    const sub = cloud?.auth.onAuthStateChange((_event, s) => {
      if (!active) return;
      if (s?.user.id !== userIdRef.current) setOwner(null);
      userIdRef.current = s?.user.id;
      setSession(s);
    });
    return () => { active = false; sub?.data.subscription.unsubscribe(); };
  }, []);

  const [offline, setOffline] = useState<string | null>(null);
  const [synced, setSynced] = useState(false);
  // Suppressions en attente d'« Annuler » : masquées tout de suite, effacées pour de bon 5 secondes plus tard.
  const undoRef = useRef<{ entry: Entry; timer: number } | null>(null);
  const [undoEntry, setUndoEntry] = useState<Entry | null>(null);
  const visible = (list: Entry[]) => list.filter((e) => e.id !== undoRef.current?.entry.id);
  const refresh = useCallback(async () => {
    setLoading(true); setError('');
    try {
      // Retour du réseau : on envoie d'abord ce qui a été écrit hors connexion.
      if (pendingCount()) await flushOutbox({ create: sendCreate, edit: sendEdit, remove: sendRemove });
      const all = await readEntries(); saveOffline(all); setEntries(visible(applyOutbox(all))); setOffline(null); setSynced(true);
    }
    catch (e) {
      const copy = isNetworkError(e) ? loadOffline() : null;
      if (copy) { setEntries(visible(applyOutbox(copy.entries))); setOffline(copy.at); }
      else setError(e instanceof Error ? e.message : 'Impossible de charger les données.');
    }
    finally { setLoading(false); }
  }, []);
  // Retour du réseau : on recharge les données à jour.
  useEffect(() => { const on = () => { if (offline || pendingCount()) void refresh(); }; window.addEventListener('online', on); return () => window.removeEventListener('online', on); }, [offline, refresh]);
  // Sauvegarde automatique du mois (une fois, en silence, dès que les données sont chargées en ligne).
  const backedUp = useRef(false);
  useEffect(() => {
    if (backedUp.current || owner !== true || offline || allEntries.length < 5) return;
    backedUp.current = true;
    void ensureMonthlyBackup(allEntries.filter((e) => e.kind !== PHOTO_KIND && !e.id.startsWith('local-')));
  }, [owner, offline, allEntries]);
  const [pending, setPending] = useState(pendingCount);
  useEffect(() => { const on = () => setPending(pendingCount()); window.addEventListener('mt-outbox', on); return () => window.removeEventListener('mt-outbox', on); }, []);

  useEffect(() => {
    if (!session) { setEntries([]); setOwner(null); return; }
    let active = true;
    isOwner().then((allowed) => { if (active) { setOwner(allowed); rememberOwner(allowed); } })
      .catch((e) => { if (active) setOwner(isNetworkError(e) && knownOwner() ? true : false); });
    return () => { active = false; };
  }, [session?.user.id]);

  useEffect(() => { if (owner) void refresh(); }, [owner, refresh]);

  /** Met à jour la liste « Courses · semaine du … » des semaines touchées par un repas planifié. */
  const syncGroceries = async (dates: (string | null | undefined)[]) => {
    const weeks = [...new Set(dates.filter((d): d is string => Boolean(d)).map(weekStart))];
    if (!weeks.length) return;
    try {
      const all = await readEntries();
      for (const week of weeks) {
        const fresh = weekGroceryItems(all, week);
        const list = all.find((e) => e.module === 'listes' && e.data.autoWeek === week);
        if (!list && !fresh.length) continue;
        const existing = Array.isArray(list?.data.items) ? list.data.items as ListItem[] : [];
        const previousAuto = Array.isArray(list?.data.autoTexts) ? list.data.autoTexts as string[] : [];
        const items = mergeGroceryItems(existing, previousAuto, fresh, () => crypto.randomUUID());
        const data = { ...(list?.data ?? {}), category: 'Courses', autoWeek: week, autoTexts: fresh, items, itemsText: items.map((i) => i.text).join('\n') };
        if (list) await editEntry(list.id, { data });
        else await createEntry({ module: 'listes', kind: 'list', title: groceryTitle(week), entry_date: null, data });
      }
    } catch (e) { setError(e instanceof Error ? e.message : 'Liste de courses non mise à jour.'); }
  };
  const isMeal = (x: { module: string; kind: string }) => x.module === 'cuisine' && x.kind === 'meal';

  const save = async (input: EntryInput, id?: string) => {
    setWorking(true);
    try {
      const before = id ? entries.find((e) => e.id === id) : undefined;
      if (id) await editEntry(id, { title: input.title, entry_date: input.entry_date, data: input.data });
      else await createEntry(input);
      if (isMeal(input)) await syncGroceries([input.entry_date, before?.entry_date]);
      setEditor(null); await refresh();
    } finally { setWorking(false); }
  };
  const createFromTool = async (input: EntryInput) => {
    await createEntry(input);
    if (isMeal(input)) await syncGroceries([input.entry_date]);
    await refresh();
  };
  // Dépenses récurrentes : chaque mois, une dépense est ajoutée automatiquement le jour prévu (une seule fois par mois).
  const recurringDone = useRef(new Set<string>());
  useEffect(() => {
    const now = today(), month = now.slice(0, 7), dayNow = Number(now.slice(8, 10));
    const todo = allEntries.filter((r) => r.kind === 'recurring' && (Number(r.data.day) || 1) <= dayNow && !recurringDone.current.has(r.id + month)
      && !allEntries.some((e) => e.kind === 'expense' && e.data.recurringId === r.id && String(e.entry_date ?? '').startsWith(month)));
    if (!todo.length) return;
    todo.forEach((r) => recurringDone.current.add(r.id + month));
    void (async () => {
      for (const r of todo) {
        const date = month + '-' + String(Math.min(28, Number(r.data.day) || 1)).padStart(2, '0');
        await createEntry({ module: 'finances', kind: 'expense', title: r.title, entry_date: date,
          data: { date, amount: r.data.amount, currency: r.data.currency, category: r.data.category, payment: r.data.payment, note: 'Dépense récurrente', recurringId: r.id } });
      }
      await refresh();
    })();
  }, [allEntries]); // eslint-disable-line react-hooks/exhaustive-deps
  const hiddenEntry = allEntries.find((e) => e.kind === HIDDEN_KIND);
  const hidden = useMemo<Hidden>(() => {
    const items = readHidden(hiddenEntry);
    const write = async (next: typeof items) => {
      const input = { title: 'Suggestions masquées', data: { items: next } };
      try {
        if (hiddenEntry) await editEntry(hiddenEntry.id, input);
        else await createEntry({ module: 'quotidien', kind: HIDDEN_KIND, entry_date: null, ...input });
        await refresh();
      } catch { setError('Impossible d’enregistrer ce choix.'); }
    };
    return { items, ids: new Set(items.map((x) => x.id)),
      hide: (id, label) => write([...items.filter((x) => x.id !== id), { id, label }]),
      restore: (ids) => write(items.filter((x) => !ids.includes(x.id))) };
  }, [hiddenEntry, refresh]);
  const updateData = async (entry: Entry, data: Record<string, unknown>) => {
    try { await editEntry(entry.id, { data }); await refresh(); }
    catch (e) { setError(e instanceof Error ? e.message : 'Mise à jour impossible.'); }
  };
  const remove = async (entry: Entry): Promise<boolean> => {
    if (undoRef.current) { window.clearTimeout(undoRef.current.timer); void erase(undoRef.current.entry); }
    setEntries((list) => list.filter((e) => e.id !== entry.id));
    const timer = window.setTimeout(() => { undoRef.current = null; setUndoEntry(null); void erase(entry); }, 5000);
    undoRef.current = { entry, timer }; setUndoEntry(entry);
    return true;
  };
  const drop = async (entry: Entry) => { await remove(entry); };
  const undoRemove = () => {
    if (!undoRef.current) return;
    window.clearTimeout(undoRef.current.timer); undoRef.current = null; setUndoEntry(null); void refresh();
  };
  const erase = async (entry: Entry): Promise<boolean> => {
    try { await removeEntry(entry.id); await deleteEntryMedia(session!.user.id, entry.id).catch(() => setError('Entrée supprimée, mais ses médias locaux n’ont pas pu être nettoyés.')); if (isMeal(entry)) await syncGroceries([entry.entry_date]); await refresh(); return true; }
    catch (e) { setError(e instanceof Error ? e.message : 'Suppression impossible.'); return false; }
  };
  // Si l'app passe en arrière-plan pendant le délai, la suppression est faite tout de suite.
  const eraseRef = useRef(erase); eraseRef.current = erase;
  useEffect(() => {
    const flush = () => { if (document.visibilityState === 'hidden' && undoRef.current) { window.clearTimeout(undoRef.current.timer); void eraseRef.current(undoRef.current.entry); undoRef.current = null; setUndoEntry(null); } };
    document.addEventListener('visibilitychange', flush);
    return () => document.removeEventListener('visibilitychange', flush);
  }, []);
  const createGroceries = async (title: string, items: string[]) => {
    try {
      await createEntry({ module: 'listes', kind: 'list', title, entry_date: null, data: {
        category: title.startsWith('Valise') ? 'Valise' : 'Courses', itemsText: items.join('\n'),
        items: items.map((text) => ({ id: crypto.randomUUID(), text, checked: false })),
      } });
      await refresh(); setScreen('listes');
    } catch (e) { setError(e instanceof Error ? e.message : 'Création impossible.'); }
  };

  // Raccourci « Ajouter une dépense » : ouvre directement le formulaire une fois connectée.
  useEffect(() => { if (pendingExpense && owner) { setPendingExpense(false); setScreen('finances'); setEditor({ module: moduleById('finances'), preset: { kind: 'expense', data: { date: today() } } }); } }, [pendingExpense, owner]);
  if (!configured) return <main className="auth-layout"><section className="auth-card"><h1>Configuration nécessaire</h1><p>Configure un projet Supabase dédié et les variables VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY dans Vercel. Aucune donnée personnelle n'est chargée.</p></section></main>;
  useIntegrationCloudSync(allEntries, synced, createFromTool, updateData);
  if (!authReady) return <div className="loading">Chargement sécurisé…</div>;
  if (!session) return <Login onSignedIn={() => {}} />;
  if (owner === null) return <div className="loading">Vérification de l'accès…</div>;
  if (!owner) return <main className="auth-layout"><section className="auth-card"><h1>Accès non autorisé</h1><p>Ce compte n'est pas enregistré comme propriétaire de l'application.</p><button className="button secondary" onClick={() => void signOut()}>Se déconnecter</button></section></main>;

  const currentModule = modules.find((m) => m.id === screen);
  const allModuleEntries = currentModule ? entries.filter((e) => e.module === currentModule.id) : [];
  // En spiritualité, la liste ne garde que le journal (prières cochées, horaires et dhikr ont leurs propres écrans).
  const listedEntries = allModuleEntries.filter((e) => !(e.module === 'spiritualite' && (e.kind === 'dhikr' || e.kind === 'ramadan' || e.kind === 'dhul_hijja' || e.kind === 'wird' || e.kind === 'apres_priere' || e.kind === 'arabe_jeux' || e.kind.startsWith('prayer'))) && e.kind !== BUDGETS_KIND);
  const moduleEntries = listedEntries.filter((e) => !search || e.title.toLowerCase().includes(search.toLowerCase()));
  const go = (next: Screen) => { setScreen(next); setSearch(''); window.scrollTo({ top: 0 }); };
  const openEntry = (e: Entry) => setEditor({ module: moduleById(e.module), initial: e });
  const addIn = (module: ModuleId, kind?: string, data?: Record<string, string>, title?: string) => setEditor({ module: moduleById(module), preset: kind ? { kind, data: data ?? {}, title } : undefined });
  const removeQuiet = async (entry: Entry) => { await removeEntry(entry.id); if (isMeal(entry)) await syncGroceries([entry.entry_date]); await refresh(); };

  const savePhoto = async (slot: string, image: string | null) => {
    const existing = photoEntries.find((e) => e.title === slot);
    try {
      if (!image) { if (existing) await removeEntry(existing.id); }
      else if (existing) await editEntry(existing.id, { data: { image } });
      else await createEntry({ module: 'quotidien', kind: PHOTO_KIND, title: slot, entry_date: null, data: { image } });
      await refresh();
    } catch (e) { setError(e instanceof Error ? e.message : 'Photo impossible à enregistrer.'); throw e; }
  };

  // Liste brute : visible seulement là où elle est le contenu (listes, hobbies, journal spirituel) ; ailleurs, historique replié.
  const listTitle = currentModule?.id === 'spiritualite' ? 'Mon journal spirituel' : currentModule?.id === 'listes' ? 'Mes listes' : currentModule?.id === 'passions' ? 'Mes hobbies' : '';
  const listBody = currentModule && <>
    {listedEntries.length > 4 && <input className="search-field" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher dans cet espace…" />}
    <div className="entries">{moduleEntries.length ? moduleEntries.map((entry) =>
      <EntryCard key={entry.id} entry={entry} module={currentModule} onEdit={openEntry} onDelete={(e) => void remove(e)} onUpdate={updateData} />
    ) : <div className="empty-soft"><Coffee size={28} /><p>Un espace à remplir à ton rythme.</p><button className="button ghost" onClick={() => setEditor({ module: currentModule })}>Créer ma première entrée</button></div>}</div></>;
  const entryList = currentModule && (listTitle
    ? <section className="entries-section"><SectionTitle>{listTitle} <span className="count">{listedEntries.length}</span></SectionTitle>{listBody}</section>
    : currentModule.id === 'quotidien' || !listedEntries.length ? null
    : <details className="history-fold"><summary>Historique <span className="count">{listedEntries.length}</span></summary>{listBody}</details>);

  const tabScreen = (['home', 'agenda', 'bienetre', 'spaces', 'settings', 'myday', 'habits', 'notes', 'bilan', 'parametres', 'boussole', 'focus', 'sommeil', 'mediter', 'complements'] as Screen[]).includes(screen);
  const openDay = (date?: string, part?: 'matin' | 'soir') => { setDayTarget((t) => ({ date, part, n: t.n + 1 })); go('myday'); };
  const editFull = async (id: string, patch: { title: string; data: Record<string, unknown> }) => { await editEntry(id, patch); await refresh(); };

  return <HiddenProvider value={hidden}><PhotoProvider value={{ photos, save: savePhoto }}><Suspense fallback={<div className="screen-loading" aria-busy="true">Chargement…</div>}><div className={'app' + (screen === 'calme' ? ' calm-mode' : '')}>
    <main className="phone">
      {offline && <div className="offline-banner" role="status">Hors connexion · tu consultes la copie du {new Date(offline).toLocaleString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}. Tes ajouts sont gardés et partiront au retour du réseau ; le journal intime attend la connexion.</div>}
      {!offline && pending > 0 && <div className="offline-banner" role="status">{pending} changement{pending > 1 ? 's' : ''} en attente d’envoi…</div>}
      {undoEntry && <div className="undo-toast" role="status"><span>« {undoEntry.title.slice(0, 40)} » supprimé</span><button onClick={undoRemove}>Annuler</button></div>}
      {error && <div role="alert" className="error-banner"><span>{error}</span><button onClick={() => setError('')} aria-label="Fermer l'erreur"><X size={17} /></button></div>}
      {loading && <div className="sync-status" role="status">Synchronisation…</div>}
      {screen === 'home' && <HomeScreen word={wordOfMonth(ritualEntries, today())} todayCard={<TodayCard entries={entries} habits={ritualEntries.filter((e) => e.kind === HABIT_KIND)} onUpdate={updateData} onTogglePrayer={(name, on, day) => void togglePrayer(entries, name, on, createFromTool, removeQuiet, day)} onOpenHabits={() => go('habits')} onOpenAgenda={() => go('agenda')} />} rituals={<HomeRituals entries={ritualEntries} onGo={(t) => go(t)} onLearn={(t) => { if (t === 'wird' || t === 'apres' || t === 'arabe') { setSpiritTab(t); go('spiritualite'); return; } if (t === 'gratitude') { go('gratitude'); return; } if (t === 'carnet' || t === 'carnet-signe') { setCarnetSign(t === 'carnet-signe' ? (n) => n + 1 : 0); go('carnet'); return; } if (t === 'passions') setPassionTab('parcours'); if (t === 'cours' || t === 'dhulhijja') setSpiritTab(t); go(t === 'cours' || t === 'dhulhijja' ? 'spiritualite' : t as Screen); }} onOpenDay={(part) => openDay(undefined, part)} onCreate={createFromTool} onUpdate={updateData} />} entries={entries} profileEntry={profileEntry} onGo={(s) => go(s as Screen)} onUpdate={updateData} onAdd={() => addIn('quotidien', 'task', { date: today() })} onQuickAdd={(title) => createFromTool({ module: 'quotidien', kind: 'task', title, entry_date: today(), data: { date: today(), priority: 'Haute' } })} />}
      {screen === 'myday' && <LockGate><MyDay key={dayTarget.n} entries={ritualEntries} initialDate={dayTarget.date} initialPart={dayTarget.part} onCreate={createFromTool} onUpdate={updateData} /></LockGate>}
      {screen === 'habits' && <Habits entries={ritualEntries} onCreate={createFromTool} onUpdate={updateData} onRemove={drop} onEdit={editFull} />}
      {screen === 'notes' && <LockGate><Notes entries={ritualEntries} onCreate={createFromTool} onEdit={editFull} onRemove={drop} onOpenDay={openDay} /></LockGate>}
      {screen === 'bilan' && <LockGate><ScreenHeader title="" onBack={() => go('home')} /><Review entries={ritualEntries} birthDate={readProfile(profileEntry).birthDate} /></LockGate>}
      {screen === 'boussole' && <><ScreenHeader title="" onBack={() => go('home')} /><Compass entries={ritualEntries} profileEntry={profileEntry} onCreate={createFromTool} onUpdate={updateData} onRemove={drop} onEditProfile={() => go('settings')} onOpenCarnet={() => go('carnet')} /></>}
      {screen === 'focus' && <><ScreenHeader title="" onBack={() => go('home')} /><Focus entries={ritualEntries} onCreate={createFromTool} /></>}
      {screen === 'sommeil' && <><ScreenHeader title="" onBack={() => go('home')} /><Sleep entries={ritualEntries} onCreate={createFromTool} onUpdate={updateData} onRemove={remove} /></>}
      {screen === 'complements' && <><ScreenHeader title="" onBack={() => go('home')} /><Supplements entries={ritualEntries} onCreate={createFromTool} onUpdate={updateData} onRemove={drop} onEdit={editFull} /></>}
      {screen === 'proches' && <><ScreenHeader title="" onBack={() => go('home')} /><Relatives entries={ritualEntries} onCreate={createFromTool} onUpdate={updateData} onEdit={editFull} onRemove={drop} /></>}
      {screen === 'lectures' && <><ScreenHeader title="" onBack={() => go('home')} /><Reading entries={ritualEntries} onCreate={createFromTool} onUpdate={updateData} onRemove={drop} /></>}
      {screen === 'panda' && <><ScreenHeader title="" onBack={() => go('home')} /><PandaScreen entries={ritualEntries} profileEntry={profileEntry} onCreate={createFromTool} onUpdate={updateData} onGo={(x) => go(x as Screen)} /></>}
      {screen === 'gratitude' && <><ScreenHeader title="" onBack={() => go('home')} /><Gratitude entries={ritualEntries} onCreate={createFromTool} onUpdate={updateData} /></>}
      {screen === 'carnet' && <LockGate><ScreenHeader title="" onBack={() => go('home')} /><Carnet key={carnetSign} entries={ritualEntries} onCreate={createFromTool} onUpdate={updateData} onRemove={drop} signFirst={carnetSign > 0} /></LockGate>}
      {screen === 'transformation' && <><ScreenHeader title="" onBack={() => go('home')} /><Transformation entries={ritualEntries} onCreate={createFromTool} onUpdate={updateData} onGo={(t) => go(t as Screen)} /></>}
      {screen === 'envies' && <><ScreenHeader title="" onBack={() => go('home')} /><Wishes entries={ritualEntries} onCreate={createFromTool} onUpdate={updateData} onRemove={drop} onEdit={editFull} /></>}
      {screen === 'mediter' && <><ScreenHeader title="" onBack={() => go('home')} /><Meditate entries={ritualEntries} onCreate={createFromTool} /></>}
      {screen === 'agenda' && <Agenda entries={entries} onAdd={() => addIn('quotidien', 'event', { date: today() })} onOpen={openEntry} onUpdate={updateData} onCreate={createFromTool} onRemove={remove} onImported={() => void refresh()} />}
      {screen === 'bienetre' && <Wellbeing entries={entries} onGo={(s) => go(s as Screen)} onCreate={createFromTool} onUpdate={updateData} />}
      {screen === 'spaces' && <Spaces entries={entries} onGo={(s) => go(s as Screen)} onOpen={openEntry} />}
      {screen === 'calme' && <Calm onQuit={() => go('home')} onWrite={() => addIn('equilibre', 'emotion', { date: today() })} />}
      {screen === 'assistant' && <div className="screen"><ScreenHeader title="Assistant" onBack={() => go('home')} /><PersonalBrief entries={entries} onGo={go} /><PersonalAssistant key={assistantIdea} entries={ritualEntries} onCreate={createFromTool} initialIdea={assistantIdea} /></div>}
      {screen === 'settings' && <div className="screen"><Profile view="profile" onSettings={() => go('parametres')} email={session.user.email ?? ''} entries={allEntries} profileEntry={profileEntry} onSaveProfile={async (input, id) => { if (id) await editEntry(id, { title: input.title, data: input.data }); else await createEntry(input); await refresh(); }} onRestored={refresh} onLogout={async () => { removeLock(); clearOffline(); await signOut(); setEntries([]); }} /></div>}
      {screen === 'parametres' && <div className="screen"><Profile view="settings" onSettings={() => go('settings')} email={session.user.email ?? ''} entries={allEntries} profileEntry={profileEntry} onSaveProfile={async (input, id) => { if (id) await editEntry(id, { title: input.title, data: input.data }); else await createEntry(input); await refresh(); }} onRestored={refresh} onLogout={async () => { removeLock(); clearOffline(); await signOut(); setEntries([]); }} /></div>}
      {currentModule && <div className="screen">
        <ScreenHeader title={currentModule.name} onBack={() => go('spaces')}
          right={<button className="icon-btn" aria-label="Ajouter" onClick={() => setEditor({ module: currentModule })}><Plus size={24} /></button>} />
        {currentModule.id === 'quotidien' && <Agenda entries={entries} onAdd={() => addIn('quotidien', 'task', { date: today() })} onOpen={openEntry} onUpdate={updateData} onCreate={createFromTool} onRemove={remove} embedded />}
        {currentModule.id === 'sante' && <HealthTop entries={allModuleEntries} onAdd={(kind) => addIn('sante', kind, { date: today() })} />}
        {currentModule.id === 'sport' && <SportHub entries={allModuleEntries} challengeEntries={entries.filter((e) => e.module === 'challenges')} onCreate={createFromTool} onGoChallenges={() => go('challenges')} />}
        {currentModule.id === 'challenges' && <ChallengesBoard entries={allModuleEntries} onCreate={createFromTool} onUpdate={updateData} onQuit={removeQuiet} />}
        {currentModule.id === 'finances' && <FinanceTop entries={allModuleEntries} onAdd={(kind) => addIn('finances', kind, { date: today() })} onOpen={openEntry} onUpdate={updateData} onCreate={createFromTool} />}
        {currentModule.id === 'cuisine' && <><CuisineTop tab={cuisineTab} onTab={setCuisineTab} entries={allModuleEntries} />
          {cuisineTab === 'recettes' && <RecipeIdeas entries={allModuleEntries} onCreate={createFromTool} />}
          {cuisineTab === 'semaine' && <><KitchenPlanner entries={allModuleEntries} onCreate={createFromTool} onRemove={removeQuiet} /><KitchenTools entries={allModuleEntries} onGenerate={createGroceries} /></>}
          {cuisineTab === 'midis' && <WeekLunches entries={entries} onCreate={createFromTool} />}
          {cuisineTab === 'astuces' && <CookingTips entries={allModuleEntries} onAdd={() => addIn('cuisine', 'video', { theme: 'Cuissons' })} onRemove={drop} />}
          {cuisineTab === 'courses' && <div className="entries">{entries.filter((e) => e.module === 'listes' && String(e.data.category) === 'Courses').map((e) =>
            <EntryCard key={e.id} entry={e} module={moduleById('listes')} onEdit={openEntry} onDelete={(x) => void remove(x)} onUpdate={updateData} />)}
            {!entries.some((e) => e.module === 'listes' && String(e.data.category) === 'Courses') && <p className="muted">Planifie ta semaine puis génère tes courses.</p>}</div>}
        </>}
        {currentModule.id === 'decouvertes' && <><TravelTop tab={travelTab} onTab={setTravelTab} entries={allModuleEntries} onCreate={createFromTool} onAdd={(kind) => addIn('decouvertes', kind)} />
          {travelTab === 'destinations' && <TravelSuggestions entries={allModuleEntries} onCreate={createFromTool} />}
          {travelTab === 'voyage' && <><TravelPlanner entries={allModuleEntries} onUpdate={updateData} /><TravelTools entries={allModuleEntries} onGenerate={createGroceries} /></>}</>}
        {currentModule.id === 'equilibre' && <><EquilibreTop tab={equilibreTab} onTab={setEquilibreTab} entries={allModuleEntries}
            onAxis={(axis) => { const b = allModuleEntries.find((e) => e.kind === 'booster' && String(e.data.axis) === axis); if (b) { setEquilibreTab('booster'); } else addIn('equilibre', 'booster', { axis, days: '14' }, 'Booster · ' + axis); }}
            onQuest={(title) => void createFromTool({ module: 'equilibre', kind: 'booster', title, entry_date: today(), data: { axis: title, days: '28', progress: {} } }).then(() => setEquilibreTab('booster'))}
            booster={<div className="entries">{allModuleEntries.filter((e) => e.kind === 'booster').map((e) => <EntryCard key={e.id} entry={e} module={currentModule} onEdit={openEntry} onDelete={(x) => void remove(x)} onUpdate={updateData} />)}</div>} />
          {equilibreTab === 'journal' && <><EquilibriumInsights entries={allModuleEntries} /><BalanceReview entries={allModuleEntries} onCreate={createFromTool} /></>}
          <button className="calm-pill" onClick={() => go('calme')}>J’ai besoin de me calmer</button></>}
        {currentModule.id === 'spiritualite' && <><SpiritTop tab={spiritTab} onTab={setSpiritTab} entries={allModuleEntries} onCreate={createFromTool} onUpdate={updateData} onRemove={removeQuiet} />
          {spiritTab === 'invocations' && <Duas entries={ritualEntries} onCreate={createFromTool} onUpdate={updateData} />}
          {spiritTab === 'qibla' && <Qibla entries={allModuleEntries} />}
          {spiritTab === 'horaires' && <AutomaticPrayerTimes entries={allModuleEntries} onCreate={createFromTool} onUpdate={updateData} onRemove={removeQuiet} />}</>}
        {currentModule.id === 'passions' && <>
          <Segmented label="Passions" value={passionTab} onChange={setPassionTab} options={[{ value: 'parcours', label: 'Parcours' }, { value: 'series', label: 'Séries' }, { value: 'libre', label: 'Hobbies' }, { value: 'idees', label: 'Idées' }]} />
          {passionTab === 'parcours' && <LearningPaths entries={allModuleEntries} onCreate={createFromTool} onUpdate={updateData} onRemove={removeQuiet} />}
          {passionTab === 'series' && <SeriesTracker entries={allModuleEntries} onUpdate={updateData} onCreate={createFromTool} onRemove={remove} onAdd={() => addIn('passions', 'series', { status: 'À voir', seasons: '1', episodes: '10' })} />}
          {passionTab === 'libre' && <PassionPath entries={allModuleEntries} onUpdate={updateData} />}
          {passionTab === 'idees' && <PassionIdeas entries={allModuleEntries} onCreate={createFromTool} />}
        </>}
        {currentModule.id === 'listes' && <section className="list-templates"><p className="eyebrow-s">Modèles</p>
          {LIST_TEMPLATES.map((t) => <button key={t.id} className="row-plain template-row" onClick={() => void createGroceries(t.title, templateItems(t))}>
            <span><strong>{t.title}</strong><small className="muted">{t.hint} · {templateItems(t).length} articles</small></span><Plus size={18} /></button>)}</section>}
        {(currentModule.id !== 'spiritualite' || spiritTab === 'journal') && currentModule.id !== 'challenges' && !(currentModule.id === 'passions' && passionTab !== 'libre') && entryList}
      </div>}
    </main>
    {(tabScreen || currentModule) && screen !== 'calme' && <nav className="tabbar" aria-label="Navigation principale">{nav.map(({ id, label, icon: Icon }) => {
      const on = screen === id || (id === 'spaces' && Boolean(currentModule));
      return <button key={id} className={on ? 'on' : ''} aria-current={on ? 'page' : undefined} onClick={() => go(id)}><Icon size={24} strokeWidth={on ? 2.2 : 1.6} /><span>{label}</span></button>;
    })}</nav>}
    {editor && <Editor key={(editor.initial?.id ?? editor.module.id) + (editor.preset?.kind ?? '')} module={editor.module} initial={editor.initial} preset={editor.preset} entries={entries} onSave={save} onCancel={() => setEditor(null)} onDelete={async (e) => { if (await remove(e)) setEditor(null); }} busy={working} />}
  </div></Suspense></PhotoProvider></HiddenProvider>;
}
