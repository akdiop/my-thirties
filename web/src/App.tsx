import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import type { Session } from '@supabase/supabase-js';
import {
  BookOpen, CalendarDays, ChevronRight, Coffee, Download,
  Heart, Home, LayoutGrid, Leaf, LogOut, Plus, Save, Settings, ShieldCheck, Trash2, UserRound, X,
} from 'lucide-react';
import { cloud, configured, createEntry, editEntry, getSession, isOwner, readEntries, removeEntry, restoreEntries, signIn, signOut, type Entry, type EntryInput, type ModuleId } from './lib/cloud';
import { downloadBackup, makeEncryptedBackup, parseEncryptedBackup } from './lib/backup';
import { moduleById, modules, type Module } from './modules';
import { validateRestore } from './lib/restore';
import { consolidateIngredients } from './lib/groceries';
import { BoosterPlan } from './features/BoosterPlan';
import { TravelTools } from './features/TravelTools';
import { EquilibriumInsights } from './features/EquilibriumInsights';
import { KitchenPlanner } from './features/KitchenPlanner';
import { PassionPath } from './features/PassionPath';
import { TravelPlanner } from './features/TravelPlanner';
import { PrayerPlanner } from './features/PrayerPlanner';
import { PersonalBrief } from './features/PersonalBrief';
import { RecipeIdeas } from './features/RecipeIdeas';
import { BalanceReview } from './features/BalanceReview';
import { AutomaticPrayerTimes } from './features/AutomaticPrayerTimes';
import { BrowserReminders } from './features/BrowserReminders';
import { PersonalAssistant } from './features/PersonalAssistant';
import { PrivacyCenter } from './features/PrivacyCenter';
import { MediaGallery } from './features/MediaGallery';
import { deleteEntryMedia } from './lib/mediaLibrary';
import { PersonalProfile, ProfileAvatar } from './features/PersonalProfile';
import { birthdayLine, PROFILE_KIND, readProfile } from './lib/profile';
import { PHOTO_KIND } from './lib/photos';
import { PhotoProvider } from './features/HeroPhoto';
import { SportHub } from './features/SportHub';
import { ChallengesBoard } from './features/ChallengesBoard';
import { Home as HomeScreen } from './screens/Home';
import { Agenda } from './screens/Agenda';
import { Wellbeing } from './screens/Wellbeing';
import { Spaces } from './screens/Spaces';
import { Calm } from './screens/Calm';
import { HealthTop } from './screens/HealthTop';
import { FinanceTop } from './screens/FinanceTop';
import { CuisineTop, EquilibreTop, SpiritTop, TravelTop, type CuisineTab, type EquilibreTab, type SpiritTab } from './screens/ModuleTops';
import { ScreenHeader, SectionTitle, Segmented } from './ui/kit';
import { GuidedField } from './ui/fields';
import { LearningPaths } from './features/LearningPaths';
import { SeriesTracker } from './features/SeriesTracker';
import { TravelSuggestions } from './features/TravelSuggestions';

type Screen = 'home' | 'agenda' | 'bienetre' | 'spaces' | 'settings' | 'calme' | 'assistant' | ModuleId;
type DataValue = string | Record<string, string> | { id: string; text: string; checked: boolean }[];
const today = () => new Date().toLocaleDateString('en-CA');
const value = (obj: Record<string, unknown>, key: string) => typeof obj[key] === 'string' ? obj[key] as string : '';
const humanDate = (date: string | null) => date ? new Date(date + 'T12:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) : '';
const safeLink = (v: unknown) => { try { const url = new URL(String(v)); return url.protocol === 'https:' ? url.href : null; } catch { return null; } };
const nav: { id: Screen; label: string; icon: typeof Home }[] = [
  { id: 'home', label: 'Accueil', icon: Home },
  { id: 'agenda', label: 'Agenda', icon: CalendarDays },
  { id: 'bienetre', label: 'Bien-être', icon: Leaf },
  { id: 'spaces', label: 'Espaces', icon: LayoutGrid },
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
      <div className="auth-brand"><span className="logo-mark">M<span>·</span></span><span>MY THIRTIES</span></div>
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

function Editor({ module, initial, preset, entries, onSave, onCancel, busy }: {
  module: Module; initial?: Entry; preset?: Preset; entries: Entry[]; onSave: (input: EntryInput, id?: string) => Promise<void>; onCancel: () => void; busy: boolean;
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
          <div className="editor-actions"><button type="button" className="button ghost" onClick={onCancel}>Annuler</button><button className="button primary" type="submit" disabled={busy}><Save size={16} /> {busy ? 'Enregistrement…' : 'Enregistrer'}</button></div>
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
    {module.id !== 'listes' && module.id !== 'challenges' && kind?.fields.filter((f) => f.type === 'textarea' && value(entry.data, f.id))
      .slice(0, 2).map((f) => <p key={f.id} className="entry-note"><strong>{f.label} : </strong>{value(entry.data, f.id)}</p>)}
  </article>;
}

function Profile({ email, entries, profileEntry, onSaveProfile, onLogout, onRestored }: { email: string; entries: Entry[]; profileEntry: Entry | undefined; onSaveProfile: (input: EntryInput, id?: string) => Promise<void>; onLogout: () => Promise<void>; onRestored: () => Promise<void> }) {
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
    if (!password) return setMessage('Saisis d’abord la phrase secrète de la sauvegarde.');
    setBusy(true);
    try {
      if (file.size > 8_000_000) throw new Error('Fichier trop volumineux.');
      const raw = await parseEncryptedBackup(await file.text(), password);
      const validated = validateRestore(raw);
      if (!window.confirm('Importer ' + validated.length + ' entrées ? Elles seront ajoutées aux données existantes, sans suppression. Une seconde importation créera des doublons.')) return;
      await restoreEntries(validated);
      await onRestored();
      setPassword(''); setConfirmation('');
      setMessage(validated.length + ' entrées restaurées.');
    } catch { setMessage('Restauration impossible : vérifie le fichier, la phrase secrète et le format.'); }
    finally { setBusy(false); }
  };
  const me = readProfile(profileEntry);
  const line = [me.city, birthdayLine(me.birthDate, new Date())].filter(Boolean).join(' · ');
  return <div className="profile-screen">
    <header className="profile-top">
      <ProfileAvatar profile={me} size={64} />
      <div><h1>{[me.firstName, me.lastName].filter(Boolean).join(' ') || 'Mon profil'}</h1><p>{line || email}</p></div>
    </header>
    {(me.hobbies.length > 0 || me.situation) && <div className="chip-row">{[me.situation, me.job, ...me.hobbies].filter(Boolean).slice(0, 8).map((t) => <span key={t} className="chip">{t}</span>)}</div>}
    <details className="group" open={!profileEntry}>
      <summary>Modifier mon profil</summary>
      <PersonalProfile key={profileEntry?.id ?? 'new'} entry={profileEntry} onSave={onSaveProfile} />
    </details>
    <p className="sec">Compte</p>
    <section className="panel form-stack">
      <h2>Compte personnel</h2><p>{email}</p>
      <p className="muted">La session est conservée dans l'onglet de navigation, pas dans un stockage de données personnel permanent.</p>
      <button className="button secondary" onClick={() => void onLogout()}><LogOut size={16} /> Se déconnecter</button>
    </section>
    <p className="sec">Mes données</p>
    <section className="panel form-stack">
      <h2>Sauvegarde chiffrée</h2><p>Un fichier AES-256-GCM, protégé par une phrase secrète, est généré sur ton appareil. Les données ne sont pas envoyées à un service d'export.</p>
      <label>Phrase secrète (12 caractères minimum)<input type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} /></label>
      <label>Confirmer la phrase secrète<input type="password" autoComplete="new-password" value={confirmation} onChange={(e) => setConfirmation(e.target.value)} /></label>
      <button className="button primary" disabled={busy || password.length < 12 || password !== confirmation} onClick={() => void exportData()}><Download size={17} /> {busy ? 'Chiffrement…' : 'Exporter mes données'}</button>
      <label>Restaurer une sauvegarde chiffrée (500 entrées maximum par fichier)
        <input type="file" accept=".json,application/json" disabled={busy} onChange={(e) => { const file = e.target.files?.[0]; void restoreFile(file); e.target.value = ''; }} />
      </label>
      <p className="fineprint">La restauration ajoute les entrées au compte. Elle ne supprime pas les données existantes et peut créer des doublons. Vérifie toujours ton fichier de sauvegarde.</p>
      {message && <p role="status">{message}</p>}
    </section>
    <p className="sec">Confidentialité et rappels</p>
    <PrivacyCenter />
    <BrowserReminders entries={entries} />
    <section className="panel"><h2>À propos de cette version</h2><p className="muted">Application web privée en cours de développement. L'export d'agenda est manuel ; les notifications web ne fonctionnent qu'avec la page ouverte. L'assistant IA nécessite un déploiement sécurisé et l'analyse vidéo reste expérimentale. La synchronisation iOS native est encore à réaliser.</p></section>
  </div>;
}

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [owner, setOwner] = useState<boolean | null>(null);
  const [screen, setScreen] = useState<Screen>('home');
  const [allEntries, setEntries] = useState<Entry[]>([]);
  const profileEntry = allEntries.find((e) => e.kind === PROFILE_KIND);
  const entries = useMemo(() => allEntries.filter((e) => e.kind !== PROFILE_KIND && e.kind !== PHOTO_KIND), [allEntries]);
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
  const [passionTab, setPassionTab] = useState<'parcours' | 'series' | 'libre'>('parcours');
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

  const refresh = useCallback(async () => {
    setLoading(true); setError('');
    try { setEntries(await readEntries()); }
    catch (e) { setError(e instanceof Error ? e.message : 'Impossible de charger les données.'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    if (!session) { setEntries([]); setOwner(null); return; }
    let active = true;
    isOwner().then((allowed) => { if (active) setOwner(allowed); })
      .catch(() => { if (active) setOwner(false); });
    return () => { active = false; };
  }, [session?.user.id]);

  useEffect(() => { if (owner) void refresh(); }, [owner, refresh]);

  const save = async (input: EntryInput, id?: string) => {
    setWorking(true);
    try {
      if (id) await editEntry(id, { title: input.title, entry_date: input.entry_date, data: input.data });
      else await createEntry(input);
      setEditor(null); await refresh();
    } finally { setWorking(false); }
  };
  const createFromTool = async (input: EntryInput) => {
    await createEntry(input);
    await refresh();
  };
  const updateData = async (entry: Entry, data: Record<string, unknown>) => {
    try { await editEntry(entry.id, { data }); await refresh(); }
    catch (e) { setError(e instanceof Error ? e.message : 'Mise à jour impossible.'); }
  };
  const remove = async (entry: Entry) => {
    if (!window.confirm('Supprimer définitivement « ' + entry.title + ' » ?')) return;
    try { await removeEntry(entry.id); await deleteEntryMedia(session!.user.id, entry.id).catch(() => setError('Entrée supprimée, mais ses médias locaux n’ont pas pu être nettoyés.')); await refresh(); }
    catch (e) { setError(e instanceof Error ? e.message : 'Suppression impossible.'); }
  };
  const createGroceries = async (title: string, items: string[]) => {
    try {
      await createEntry({ module: 'listes', kind: 'list', title, entry_date: null, data: {
        category: title.startsWith('Valise') ? 'Valise' : 'Courses', itemsText: items.join('\n'),
        items: items.map((text) => ({ id: crypto.randomUUID(), text, checked: false })),
      } });
      await refresh(); setScreen('listes');
    } catch (e) { setError(e instanceof Error ? e.message : 'Création impossible.'); }
  };

  if (!configured) return <main className="auth-layout"><section className="auth-card"><h1>Configuration nécessaire</h1><p>Configure un projet Supabase dédié et les variables VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY dans Vercel. Aucune donnée personnelle n'est chargée.</p></section></main>;
  if (!authReady) return <div className="loading">Chargement sécurisé…</div>;
  if (!session) return <Login onSignedIn={() => {}} />;
  if (owner === null) return <div className="loading">Vérification de l'accès…</div>;
  if (!owner) return <main className="auth-layout"><section className="auth-card"><h1>Accès non autorisé</h1><p>Ce compte n'est pas enregistré comme propriétaire de l'application.</p><button className="button secondary" onClick={() => void signOut()}>Se déconnecter</button></section></main>;

  const currentModule = modules.find((m) => m.id === screen);
  const allModuleEntries = currentModule ? entries.filter((e) => e.module === currentModule.id) : [];
  const moduleEntries = allModuleEntries.filter((e) => !search || e.title.toLowerCase().includes(search.toLowerCase()));
  const go = (next: Screen) => { setScreen(next); setSearch(''); window.scrollTo({ top: 0 }); };
  const openEntry = (e: Entry) => setEditor({ module: moduleById(e.module), initial: e });
  const addIn = (module: ModuleId, kind?: string, data?: Record<string, string>, title?: string) => setEditor({ module: moduleById(module), preset: kind ? { kind, data: data ?? {}, title } : undefined });
  const removeQuiet = async (entry: Entry) => { await removeEntry(entry.id); await refresh(); };

  const savePhoto = async (slot: string, image: string | null) => {
    const existing = photoEntries.find((e) => e.title === slot);
    try {
      if (!image) { if (existing) await removeEntry(existing.id); }
      else if (existing) await editEntry(existing.id, { data: { image } });
      else await createEntry({ module: 'quotidien', kind: PHOTO_KIND, title: slot, entry_date: null, data: { image } });
      await refresh();
    } catch (e) { setError(e instanceof Error ? e.message : 'Photo impossible à enregistrer.'); throw e; }
  };

  const entryList = currentModule && <section className="entries-section">
    <SectionTitle>Mes entrées <span className="count">{allModuleEntries.length}</span></SectionTitle>
    {allModuleEntries.length > 4 && <input className="search-field" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher dans cet espace…" />}
    <div className="entries">{moduleEntries.length ? moduleEntries.map((entry) =>
      <EntryCard key={entry.id} entry={entry} module={currentModule} onEdit={openEntry} onDelete={(e) => void remove(e)} onUpdate={updateData} />
    ) : <div className="empty-soft"><Coffee size={28} /><p>Un espace à remplir à ton rythme.</p><button className="button ghost" onClick={() => setEditor({ module: currentModule })}>Créer ma première entrée</button></div>}</div>
  </section>;

  const tabScreen = (['home', 'agenda', 'bienetre', 'spaces', 'settings'] as Screen[]).includes(screen);

  return <PhotoProvider value={{ photos, save: savePhoto }}><div className={'app' + (screen === 'calme' ? ' calm-mode' : '')}>
    <main className="phone">
      {error && <div role="alert" className="error-banner"><span>{error}</span><button onClick={() => setError('')} aria-label="Fermer l'erreur"><X size={17} /></button></div>}
      {loading && <div className="sync-status" role="status">Synchronisation…</div>}
      {screen === 'home' && <HomeScreen entries={entries} profileEntry={profileEntry} onGo={(s) => go(s as Screen)} onUpdate={updateData} onAdd={() => addIn('quotidien', 'task', { date: today() })} />}
      {screen === 'agenda' && <Agenda entries={entries} onAdd={() => addIn('quotidien', 'event', { date: today() })} onOpen={openEntry} onUpdate={updateData} />}
      {screen === 'bienetre' && <Wellbeing entries={entries} onGo={(s) => go(s as Screen)} onCreate={createFromTool} onUpdate={updateData} />}
      {screen === 'spaces' && <Spaces entries={entries} onGo={(s) => go(s as Screen)} onOpen={openEntry} />}
      {screen === 'calme' && <Calm onQuit={() => go('home')} onWrite={() => addIn('equilibre', 'emotion', { date: today() })} />}
      {screen === 'assistant' && <div className="screen"><ScreenHeader title="Assistant" onBack={() => go('home')} /><PersonalBrief entries={entries} onGo={go} /><PersonalAssistant entries={entries} /></div>}
      {screen === 'settings' && <div className="screen"><Profile email={session.user.email ?? ''} entries={allEntries} profileEntry={profileEntry} onSaveProfile={async (input, id) => { if (id) await editEntry(id, { title: input.title, data: input.data }); else await createEntry(input); await refresh(); }} onRestored={refresh} onLogout={async () => { await signOut(); setEntries([]); }} /></div>}
      {currentModule && <div className="screen">
        <ScreenHeader title={currentModule.name} onBack={() => go('spaces')}
          right={<button className="icon-btn" aria-label="Ajouter" onClick={() => setEditor({ module: currentModule })}><Plus size={24} /></button>} />
        {currentModule.id === 'quotidien' && <Agenda entries={entries} onAdd={() => addIn('quotidien', 'task', { date: today() })} onOpen={openEntry} onUpdate={updateData} embedded />}
        {currentModule.id === 'sante' && <HealthTop entries={allModuleEntries} onAdd={(kind) => addIn('sante', kind, { date: today() })} />}
        {currentModule.id === 'sport' && <SportHub entries={allModuleEntries} challengeEntries={entries.filter((e) => e.module === 'challenges')} onCreate={createFromTool} onGoChallenges={() => go('challenges')} />}
        {currentModule.id === 'challenges' && <ChallengesBoard entries={allModuleEntries} onCreate={createFromTool} onUpdate={updateData} />}
        {currentModule.id === 'finances' && <FinanceTop entries={allModuleEntries} onAdd={(kind) => addIn('finances', kind, { date: today() })} onOpen={openEntry} />}
        {currentModule.id === 'cuisine' && <><CuisineTop tab={cuisineTab} onTab={setCuisineTab} entries={allModuleEntries} />
          {cuisineTab === 'recettes' && <RecipeIdeas entries={allModuleEntries} onCreate={createFromTool} />}
          {cuisineTab === 'semaine' && <><KitchenPlanner entries={allModuleEntries} onCreate={createFromTool} onGenerate={createGroceries} /><KitchenTools entries={allModuleEntries} onGenerate={createGroceries} /></>}
          {cuisineTab === 'courses' && <div className="entries">{entries.filter((e) => e.module === 'listes' && String(e.data.category) === 'Courses').map((e) =>
            <EntryCard key={e.id} entry={e} module={moduleById('listes')} onEdit={openEntry} onDelete={(x) => void remove(x)} onUpdate={updateData} />)}
            {!entries.some((e) => e.module === 'listes' && String(e.data.category) === 'Courses') && <p className="muted">Planifie ta semaine puis génère tes courses.</p>}</div>}
        </>}
        {currentModule.id === 'decouvertes' && <><TravelTop tab={travelTab} onTab={setTravelTab} entries={allModuleEntries} onCreate={createFromTool} onAdd={(kind) => addIn('decouvertes', kind)} />
          {travelTab === 'destinations' && <TravelSuggestions entries={allModuleEntries} onCreate={createFromTool} />}
          {travelTab === 'voyage' && <><TravelPlanner entries={allModuleEntries} onUpdate={updateData} /><TravelTools entries={allModuleEntries} onGenerate={createGroceries} /></>}</>}
        {currentModule.id === 'equilibre' && <><EquilibreTop tab={equilibreTab} onTab={setEquilibreTab} entries={allModuleEntries}
            onAxis={(axis) => { const b = allModuleEntries.find((e) => e.kind === 'booster' && String(e.data.axis) === axis); if (b) { setEquilibreTab('booster'); } else addIn('equilibre', 'booster', { axis, days: '14' }, 'Booster · ' + axis); }}
            booster={<div className="entries">{allModuleEntries.filter((e) => e.kind === 'booster').map((e) => <EntryCard key={e.id} entry={e} module={currentModule} onEdit={openEntry} onDelete={(x) => void remove(x)} onUpdate={updateData} />)}</div>} />
          {equilibreTab === 'journal' && <><EquilibriumInsights entries={allModuleEntries} /><BalanceReview entries={allModuleEntries} onCreate={createFromTool} /></>}
          <button className="calm-pill" onClick={() => go('calme')}>J’ai besoin de me calmer</button></>}
        {currentModule.id === 'spiritualite' && <><SpiritTop tab={spiritTab} onTab={setSpiritTab} entries={allModuleEntries} onCreate={createFromTool} onRemove={removeQuiet} />
          {spiritTab === 'horaires' && <><AutomaticPrayerTimes entries={allModuleEntries} onCreate={createFromTool} /><PrayerPlanner entries={allModuleEntries} onCreate={createFromTool} />
            <p className="disclaimer"><BookOpen size={14} /> Les horaires automatiques nécessitent une connexion et une ville choisie. Les calculs peuvent varier selon les sources locales.</p></>}</>}
        {currentModule.id === 'passions' && <>
          <Segmented label="Passions" value={passionTab} onChange={setPassionTab} options={[{ value: 'parcours', label: 'Parcours' }, { value: 'series', label: 'Séries' }, { value: 'libre', label: 'Hobby libre' }]} />
          {passionTab === 'parcours' && <LearningPaths entries={allModuleEntries} onCreate={createFromTool} onUpdate={updateData} />}
          {passionTab === 'series' && <SeriesTracker entries={allModuleEntries} onUpdate={updateData} onAdd={() => addIn('passions', 'series', { status: 'À voir', seasons: '1', episodes: '10' })} />}
          {passionTab === 'libre' && <PassionPath entries={allModuleEntries} onUpdate={updateData} />}
        </>}
        {(['sport', 'cuisine', 'decouvertes', 'passions'] as const).includes(currentModule.id as 'sport' | 'cuisine' | 'decouvertes' | 'passions') && <MediaGallery ownerId={session.user.id} module={currentModule.id as 'sport' | 'cuisine' | 'decouvertes' | 'passions'} entries={allModuleEntries.map((e) => ({ id: e.id, title: e.title }))} />}
        {currentModule.id === 'sante' && <p className="disclaimer"><Heart size={14} /> Le suivi est informatif. Il ne constitue pas un diagnostic et ne remplace pas un professionnel de santé.</p>}
        {!(currentModule.id === 'spiritualite' && spiritTab === 'home') && currentModule.id !== 'challenges' && !(currentModule.id === 'passions' && passionTab !== 'libre') && entryList}
      </div>}
    </main>
    {(tabScreen || currentModule) && screen !== 'calme' && <nav className="tabbar" aria-label="Navigation principale">{nav.map(({ id, label, icon: Icon }) => {
      const on = screen === id || (id === 'spaces' && Boolean(currentModule));
      return <button key={id} className={on ? 'on' : ''} aria-current={on ? 'page' : undefined} onClick={() => go(id)}><Icon size={24} strokeWidth={on ? 2.2 : 1.6} /><span>{label}</span></button>;
    })}</nav>}
    {editor && <Editor key={(editor.initial?.id ?? editor.module.id) + (editor.preset?.kind ?? '')} module={editor.module} initial={editor.initial} preset={editor.preset} entries={entries} onSave={save} onCancel={() => setEditor(null)} busy={working} />}
  </div></PhotoProvider>;
}
