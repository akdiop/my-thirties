import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import type { Session } from '@supabase/supabase-js';
import {
  ArrowLeft, BookOpen, CalendarDays, ChevronRight, CircleHelp, Coffee, Download,
  Heart, Home, LayoutGrid, Leaf, LogOut, Plus, Save, Settings, ShieldCheck, Trash2, X,
} from 'lucide-react';
import { cloud, configured, createEntry, editEntry, getSession, isOwner, readEntries, removeEntry, restoreEntries, signIn, signOut, type Entry, type EntryInput, type ModuleId } from './lib/cloud';
import { downloadBackup, makeEncryptedBackup, parseEncryptedBackup } from './lib/backup';
import { moduleById, modules, type Field, type Module } from './modules';
import { validateRestore } from './lib/restore';
import { consolidateIngredients } from './lib/groceries';
import { CalendarBoard } from './features/CalendarBoard';
import { BoosterPlan } from './features/BoosterPlan';
import { SportLibrary } from './features/SportLibrary';
import { TravelTools } from './features/TravelTools';
import { FinanceInsights } from './features/FinanceInsights';
import { HealthOverview } from './features/HealthOverview';
import { EquilibriumInsights } from './features/EquilibriumInsights';
import { KitchenPlanner } from './features/KitchenPlanner';
import { PassionPath } from './features/PassionPath';
import { TravelPlanner } from './features/TravelPlanner';
import { PrayerPlanner } from './features/PrayerPlanner';
import { PersonalBrief } from './features/PersonalBrief';
import { RecipeIdeas } from './features/RecipeIdeas';
import { SportProgress } from './features/SportProgress';
import { ChallengeIdeas } from './features/ChallengeIdeas';
import { BalanceReview } from './features/BalanceReview';
import { AutomaticPrayerTimes } from './features/AutomaticPrayerTimes';
import { BrowserReminders } from './features/BrowserReminders';
import { PersonalAssistant } from './features/PersonalAssistant';
import { LocalVideoPose } from './features/LocalVideoPose';
import { PrivacyCenter } from './features/PrivacyCenter';
import { SportNotebook } from './features/SportNotebook';
import { MediaGallery } from './features/MediaGallery';
import { deleteEntryMedia } from './lib/mediaLibrary';
import { PersonalProfile, ProfileGreeting } from './features/PersonalProfile';
import { PROFILE_KIND } from './lib/profile';

type Screen = 'home' | 'spaces' | 'settings' | ModuleId;
type DataValue = string | Record<string, string> | { id: string; text: string; checked: boolean }[];
const today = () => new Date().toLocaleDateString('en-CA');
const value = (obj: Record<string, unknown>, key: string) => typeof obj[key] === 'string' ? obj[key] as string : '';
const humanDate = (date: string | null) => date ? new Date(date + 'T12:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) : '';
const money = (amount: number, currency: string) => new Intl.NumberFormat('fr-FR', { maximumFractionDigits: currency === 'XOF' ? 0 : 2 }).format(amount) + ' ' + currency;
const safeNumber = (v: unknown) => typeof v === 'string' || typeof v === 'number' ? Number(v) : NaN;
const safeLink = (v: unknown) => { try { const url = new URL(String(v)); return url.protocol === 'https:' ? url.href : null; } catch { return null; } };
const nav: { id: Screen; label: string; icon: typeof Home }[] = [
  { id: 'home', label: 'Accueil', icon: Home },
  { id: 'quotidien', label: 'Agenda', icon: CalendarDays },
  { id: 'equilibre', label: 'Bien-être', icon: Leaf },
  { id: 'spaces', label: 'Espaces', icon: LayoutGrid },
  { id: 'settings', label: 'Profil', icon: Settings },
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

function Editor({ module, initial, onSave, onCancel, busy }: {
  module: Module; initial?: Entry; onSave: (input: EntryInput, id?: string) => Promise<void>; onCancel: () => void; busy: boolean;
}) {
  const [kindId, setKindId] = useState(initial?.kind ?? module.kinds[0]!.id);
  const [title, setTitle] = useState(initial?.title ?? '');
  const [form, setForm] = useState<Record<string, DataValue>>(initial?.data as Record<string, DataValue> ?? {});
  const [error, setError] = useState('');
  const kind = module.kinds.find((k) => k.id === kindId) ?? module.kinds[0]!;
  const update = (id: string, val: string) => setForm((f) => ({ ...f, [id]: val }));
  const submit = async (event: FormEvent) => {
    event.preventDefault(); setError('');
    if (!title.trim()) return setError('Ajoute un titre.');
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
    try { await onSave({ module: module.id, kind: kind.id, title: title.trim(), entry_date: entryDate, data }, initial?.id); }
    catch (e) { setError(e instanceof Error ? e.message : 'Enregistrement impossible.'); }
  };
  return (
    <div className="modal-overlay" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) onCancel(); }}>
      <section className="editor" role="dialog" aria-modal="true" aria-label={initial ? 'Modifier une entrée' : 'Nouvelle entrée'}>
        <div className="editor-head"><h2>{initial ? 'Modifier' : 'Nouvelle entrée'}</h2><button className="icon-button" onClick={onCancel} aria-label="Fermer"><X size={20} /></button></div>
        <form onSubmit={submit} className="form-stack">
          <label>Type
            <select value={kindId} disabled={Boolean(initial)} onChange={(e) => { setKindId(e.target.value); setForm({}); }}>
              {module.kinds.map((k) => <option key={k.id} value={k.id}>{k.label}</option>)}
            </select>
          </label>
          <label>Titre<input autoFocus maxLength={180} required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Donner un nom…" /></label>
          {kind.fields.map((field) => <FieldInput key={field.id} field={field} current={String(form[field.id] ?? '')} onChange={(v) => update(field.id, v)} />)}
          {error && <p role="alert" className="error">{error}</p>}
          <div className="editor-actions"><button type="button" className="button ghost" onClick={onCancel}>Annuler</button><button className="button primary" type="submit" disabled={busy}><Save size={16} /> {busy ? 'Enregistrement…' : 'Enregistrer'}</button></div>
        </form>
      </section>
    </div>
  );
}

function FieldInput({ field, current, onChange }: { field: Field; current: string; onChange: (value: string) => void }) {
  return <label>{field.label}
    {field.type === 'textarea' ? <textarea rows={4} value={current} onChange={(e) => onChange(e.target.value)} placeholder={field.placeholder ?? ''} /> :
      field.type === 'select' ? <select value={current} onChange={(e) => onChange(e.target.value)}>
        <option value="">Choisir…</option>{field.options?.map((x) => <option key={x} value={x}>{x}</option>)}
      </select> :
      <input type={field.type} value={current} onChange={(e) => onChange(e.target.value)}
        step={field.type === 'number' ? 'any' : undefined} min={field.type === 'number' ? '0' : undefined}
        placeholder={field.placeholder ?? ''} />}
  </label>;
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

function FinanceSummary({ entries }: { entries: Entry[] }) {
  const totals = useMemo(() => {
    const sums: Record<string, { income: number; expense: number }> = {};
    for (const e of entries) {
      if (e.kind !== 'income' && e.kind !== 'expense') continue;
      const currency = value(e.data, 'currency') || 'XOF', n = safeNumber(e.data.amount);
      if (!Number.isFinite(n) || n < 0) continue;
      sums[currency] ??= { income: 0, expense: 0 };
      sums[currency][e.kind] += n;
    }
    return sums;
  }, [entries]);
  return <div className="finance-grid">
    {Object.entries(totals).map(([currency, totals]) =>
      <div className="stat-card" key={currency}>
        <span className="eyebrow">SOLDE · {currency}</span><strong>{money(totals.income - totals.expense, currency)}</strong>
        <span className="muted">Revenus {money(totals.income, currency)} · Dépenses {money(totals.expense, currency)}</span>
      </div>)}
    {!Object.keys(totals).length && <p className="muted">Ajoute un revenu ou une dépense pour voir ton bilan.</p>}
    <p className="fineprint">Chaque devise est calculée séparément, sans taux de change inventé.</p>
  </div>;
}

function CalmSpace() {
  const [open, setOpen] = useState(false);
  return <section className="calm-card">
    <div><span className="eyebrow">PAUSE DOUCE</span><h3>Besoin de te recentrer ?</h3><p>Un moment sans objectif ni performance.</p></div>
    <button className="button secondary" onClick={() => setOpen(!open)}>{open ? 'Fermer' : 'J’ai besoin de me calmer'}</button>
    {open && <div className="calm-guide">
      <p>Observe les sensations de tes pieds au sol et regarde autour de toi.</p>
      <p>Respire tranquillement, sans forcer. Tu peux prendre ton temps.</p>
      <p>Note ce que tu ressens dans ton journal, uniquement si tu en as envie.</p>
    </div>}
  </section>;
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
  return <div className="content-width">
    <span className="eyebrow">MON COMPTE</span><h1>Profil & confidentialité</h1>
    <PersonalProfile key={profileEntry?.id ?? 'new'} entry={profileEntry} onSave={onSaveProfile} />
    <section className="panel form-stack">
      <h2>Compte personnel</h2><p>{email}</p>
      <p className="muted">La session est conservée dans l'onglet de navigation, pas dans un stockage de données personnel permanent.</p>
      <button className="button secondary" onClick={() => void onLogout()}><LogOut size={16} /> Se déconnecter</button>
    </section>
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
  const entries = useMemo(() => allEntries.filter((e) => e.kind !== PROFILE_KIND), [allEntries]);
  const [loading, setLoading] = useState(false);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState('');
  const [editor, setEditor] = useState<{ module: Module; initial?: Entry } | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    let active = true;
    getSession().then((s) => { if (active) setSession(s); })
      .catch(() => { if (active) setSession(null); })
      .finally(() => { if (active) setAuthReady(true); });
    const sub = cloud?.auth.onAuthStateChange((_event, s) => { if (active) { setSession(s); setOwner(null); } });
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
  const moduleEntries = currentModule ? entries.filter((e) => e.module === currentModule.id && (e.title.toLowerCase().includes(search.toLowerCase()) || !search)) : [];
  const upcoming = entries.filter((e) => e.entry_date && e.entry_date >= today()).sort((a, b) => (a.entry_date ?? '').localeCompare(b.entry_date ?? '')).slice(0, 5);
  const go = (next: Screen) => { setScreen(next); setSearch(''); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><span className="logo-mark">M<span>·</span></span><div><strong>my thirties</strong><small>MY PERSONAL SPACE</small></div></div>
      <p className="sidebar-label">NAVIGATION</p>
      {nav.map(({ id, label, icon: Icon }) => <button key={id} className={'nav-link ' + (screen === id ? 'active' : '')} onClick={() => go(id)}><Icon size={19} />{label}</button>)}
      <p className="sidebar-label spaces-label">MES ESPACES</p>
      {modules.filter((m) => !['quotidien', 'equilibre'].includes(m.id)).map((m) => <button key={m.id} className={'nav-link small ' + (screen === m.id ? 'active' : '')} onClick={() => go(m.id)}><span className="nav-symbol">{m.symbol}</span>{m.name}</button>)}
      <div className="sidebar-bottom"><ShieldCheck size={17} /> Espace personnel privé</div>
    </aside>
    <div className="main-area">
      <header className="topbar"><span className="topbar-name">MY THIRTIES <span>·</span> MON ESPACE</span><span className="topbar-date">{new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</span></header>
      <main className="page">
        {error && <div role="alert" className="error-banner"><span>{error}</span><button onClick={() => setError('')} aria-label="Fermer l'erreur"><X size={17} /></button></div>}
        {loading && <div className="sync-status" role="status">Synchronisation…</div>}
        {screen === 'home' && <div className="content-width">
          <ProfileGreeting entry={profileEntry} onEdit={() => go('settings')} />
          <span className="eyebrow">TON ESPACE, TON RYTHME</span><h1>Une journée à la fois<span className="heading-dot">.</span></h1>
          <p className="lead">Organisation, bien-être et petits projets : tout ce qui compte, au même endroit.</p>
          <div className="home-hero">
            <div><span className="eyebrow">AUJOURD'HUI</span><h2>{new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</h2>
              <p>{upcoming.length ? upcoming.length + ' éléments à venir dans ton espace.' : 'Ton espace est prêt à accueillir tes projets.'}</p></div>
            <button className="button light" onClick={() => setEditor({ module: moduleById('quotidien') })}><Plus size={17} /> Ajouter une tâche</button>
          </div>
          <PersonalBrief entries={entries} onGo={go} />
          <PersonalAssistant entries={entries} />
          <div className="section-row"><h2>Mes prochains rendez-vous</h2><button className="text-button" onClick={() => go('quotidien')}>Voir l'agenda <ChevronRight size={15} /></button></div>
          <div className="upcoming">{upcoming.length ? upcoming.map((e) => <div className="upcoming-item" key={e.id}><span className="date-chip">{humanDate(e.entry_date)}</span><strong>{e.title}</strong><span className="muted">{moduleById(e.module).name}</span></div>) : <p className="muted">Aucun événement à venir.</p>}</div>
          <div className="section-row"><h2>Mes espaces</h2><button className="text-button" onClick={() => go('spaces')}>Tout voir <ChevronRight size={15} /></button></div>
          <div className="module-grid">{modules.map((m) => <button className="module-card" key={m.id} onClick={() => go(m.id)}><span className="module-symbol">{m.symbol}</span><strong>{m.name}</strong><small>{m.description}</small><ChevronRight className="module-arrow" size={16} /></button>)}</div>
        </div>}
        {screen === 'spaces' && <div className="content-width"><span className="eyebrow">MES UNIVERS</span><h1>Tous mes espaces</h1><p className="lead">Onze espaces pour accompagner tes projets et tes habitudes.</p><div className="module-grid">{modules.map((m) => <button className="module-card" key={m.id} onClick={() => go(m.id)}><span className="module-symbol">{m.symbol}</span><strong>{m.name}</strong><small>{m.description}</small><ChevronRight className="module-arrow" size={16} /></button>)}</div></div>}
        {screen === 'settings' && <Profile email={session.user.email ?? ''} entries={allEntries} profileEntry={profileEntry} onSaveProfile={async (input, id) => { if (id) await editEntry(id, { title: input.title, data: input.data }); else await createEntry(input); await refresh(); }} onRestored={refresh} onLogout={async () => { await signOut(); setEntries([]); }} />}
        {currentModule && <div className="content-width">
          <button className="back-link" onClick={() => go('spaces')}><ArrowLeft size={16} /> Mes espaces</button>
          <span className="eyebrow">MON ESPACE PERSONNEL</span>
          <div className="module-title-row"><div><h1>{currentModule.name}</h1><p className="lead">{currentModule.description}</p></div><button className="button primary" onClick={() => setEditor({ module: currentModule })}><Plus size={17} /> Ajouter</button></div>
          {currentModule.sensitive && <p className="privacy-hint"><ShieldCheck size={16} /> Espace personnel sensible : données accessibles uniquement au compte autorisé. Ne saisis pas d'informations réelles avant validation de la sécurité.</p>}
          {currentModule.id === 'equilibre' && <><CalmSpace /><EquilibriumInsights entries={moduleEntries} /><BalanceReview entries={moduleEntries} onCreate={createFromTool} /></>}
          {currentModule.id === 'sante' && <HealthOverview entries={moduleEntries} />}
          {currentModule.id === 'quotidien' && <CalendarBoard entries={moduleEntries} onUpdate={updateData} />}
          {currentModule.id === 'finances' && <><FinanceSummary entries={moduleEntries} /><FinanceInsights entries={moduleEntries} /></>}
          {currentModule.id === 'cuisine' && <><KitchenPlanner entries={moduleEntries} onCreate={createFromTool} onGenerate={createGroceries} /><KitchenTools entries={moduleEntries} onGenerate={createGroceries} /><RecipeIdeas entries={moduleEntries} onCreate={createFromTool} /></>}
          {currentModule.id === 'decouvertes' && <><TravelPlanner entries={moduleEntries} onUpdate={updateData} /><TravelTools entries={moduleEntries} onGenerate={createGroceries} /></>}
          {currentModule.id === 'sport' && <><SportLibrary /><SportProgress entries={moduleEntries} /><SportNotebook entries={moduleEntries} onCreate={createFromTool} /><LocalVideoPose /></>}
          {currentModule.id === 'challenges' && <ChallengeIdeas entries={moduleEntries} onCreate={createFromTool} />}
          {currentModule.id === 'passions' && <PassionPath entries={moduleEntries} onUpdate={updateData} />}
          {(['sport', 'cuisine', 'decouvertes', 'passions'] as const).includes(currentModule.id as 'sport' | 'cuisine' | 'decouvertes' | 'passions') && <MediaGallery ownerId={session.user.id} module={currentModule.id as 'sport' | 'cuisine' | 'decouvertes' | 'passions'} entries={moduleEntries.map((e) => ({ id: e.id, title: e.title }))} />}
          {currentModule.id === 'spiritualite' && <><AutomaticPrayerTimes entries={moduleEntries} onCreate={createFromTool} /><PrayerPlanner entries={moduleEntries} onCreate={createFromTool} /><p className="privacy-hint"><BookOpen size={16} /> Les horaires automatiques nécessitent une connexion et une ville choisie. Les calculs peuvent varier selon les sources locales.</p></>}
          {currentModule.id === 'sante' && <p className="privacy-hint"><Heart size={16} /> Le suivi est informatif. Il ne constitue pas un diagnostic et ne remplace pas un professionnel de santé.</p>}
          <div className="section-row"><h2>Mes entrées <span className="count">{moduleEntries.length}</span></h2></div>
          <label className="search-label">Rechercher dans cet espace<input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher par titre…" /></label>
          <div className="entries">{moduleEntries.length ? moduleEntries.map((entry) =>
            <EntryCard key={entry.id} entry={entry} module={currentModule} onEdit={(e) => setEditor({ module: currentModule, initial: e })} onDelete={(e) => void remove(e)} onUpdate={updateData} />
          ) : <div className="empty-state"><Coffee size={32} /><h3>Un espace à remplir à ton rythme</h3><p>Aucune entrée pour le moment.</p><button className="button secondary" onClick={() => setEditor({ module: currentModule })}>Créer ma première entrée</button></div>}</div>
        </div>}
      </main>
    </div>
    <nav className="mobile-nav" aria-label="Navigation principale">{nav.map(({ id, label, icon: Icon }) => <button key={id} className={screen === id ? 'active' : ''} onClick={() => go(id)}><Icon size={20} /><span>{label}</span></button>)}</nav>
    {editor && <Editor key={editor.initial?.id ?? editor.module.id} module={editor.module} initial={editor.initial} onSave={save} onCancel={() => setEditor(null)} busy={working} />}
    <div className="screen-reader-note"><CircleHelp size={14} /> Les changements sont enregistrés dans ton espace cloud privé.</div>
  </div>;
}
