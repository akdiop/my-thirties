import { useState } from 'react';
import { Camera, Plus, Save, Trash2 } from 'lucide-react';
import type { Entry, EntryInput } from '../lib/cloud';
import { birthdayLine, EMPTY_PROFILE, PROFILE_KIND, readProfile, shrinkPhoto, SITUATIONS, type ProfileData } from '../lib/profile';

export function ProfileAvatar({ profile, size = 72 }: { profile: ProfileData; size?: number }) {
  const initial = profile.firstName.trim().charAt(0).toUpperCase() || 'M';
  return profile.photo
    ? <img className="profile-avatar" src={profile.photo} alt="" width={size} height={size} style={{ width: size, height: size }} />
    : <span className="profile-avatar placeholder" style={{ width: size, height: size, fontSize: size * 0.42 }} aria-hidden="true">{initial}</span>;
}

export function ProfileGreeting({ entry, onEdit }: { entry: Entry | undefined; onEdit: () => void }) {
  const p = readProfile(entry);
  const line = birthdayLine(p.birthDate, new Date());
  return <button className="profile-greeting" onClick={onEdit}>
    <ProfileAvatar profile={p} size={52} />
    <span><strong>{p.firstName ? 'Bonjour ' + p.firstName : 'Personnalise ton profil'}</strong>
      <small>{line || 'Photo, date de naissance, hobbies…'}</small></span>
  </button>;
}

export function PersonalProfile({ entry, onSave }: { entry: Entry | undefined; onSave: (input: EntryInput, id?: string) => Promise<void> }) {
  const initial = entry ? readProfile(entry) : EMPTY_PROFILE;
  const [p, setP] = useState<ProfileData>(initial);
  const [tags, setTags] = useState({ hobbies: initial.hobbies, languages: initial.languages, values: initial.values });
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const set = <K extends keyof ProfileData>(key: K, value: ProfileData[K]) => setP({ ...p, [key]: value });
  const today = new Date().toLocaleDateString('en-CA');

  const pickPhoto = async (file: File | undefined) => {
    if (!file) return;
    setMessage('');
    try { set('photo', await shrinkPhoto(file)); }
    catch (e) { setMessage(e instanceof Error ? e.message : 'Photo impossible à charger.'); }
  };

  const save = async () => {
    setBusy(true); setMessage('');
    const data: ProfileData = { ...p, hobbies: tags.hobbies, languages: tags.languages, values: tags.values };
    try {
      await onSave({ module: 'quotidien', kind: PROFILE_KIND, title: 'Mon profil', entry_date: null, data }, entry?.id);
      setMessage('Profil enregistré.');
    } catch (e) { setMessage(e instanceof Error ? e.message : 'Enregistrement impossible.'); }
    finally { setBusy(false); }
  };

  const line = birthdayLine(p.birthDate, new Date());

  return <section className="panel form-stack profile-panel">
    <h2>Mon profil</h2>
    <div className="profile-head">
      <ProfileAvatar profile={p} size={96} />
      <div className="profile-photo-actions">
        <label className="button ghost"><Camera size={16} /> {p.photo ? 'Changer la photo' : 'Ajouter une photo'}
          <input type="file" accept="image/*" className="visually-hidden" onChange={(e) => { void pickPhoto(e.target.files?.[0]); e.target.value = ''; }} />
        </label>
        {p.photo && <button className="button ghost" onClick={() => set('photo', '')}><Trash2 size={16} /> Retirer</button>}
        <p className="fineprint">La photo est réduite sur ton appareil puis enregistrée dans ton espace privé.</p>
      </div>
    </div>
    <div className="profile-grid">
      <label>Prénom<input value={p.firstName} maxLength={60} onChange={(e) => set('firstName', e.target.value)} autoComplete="given-name" /></label>
      <label>Nom (facultatif)<input value={p.lastName} maxLength={60} onChange={(e) => set('lastName', e.target.value)} autoComplete="family-name" /></label>
      <label>Date de naissance<input type="date" value={p.birthDate} max={today} onChange={(e) => set('birthDate', e.target.value)} /></label>
      <label>Situation<select value={p.situation} onChange={(e) => set('situation', e.target.value)}><option value="">—</option>{SITUATIONS.map((s) => <option key={s}>{s}</option>)}</select></label>
      <label>Ville<input value={p.city} maxLength={80} onChange={(e) => set('city', e.target.value)} placeholder="Dakar, Paris…" /></label>
      <label>Pays<input value={p.country} maxLength={80} onChange={(e) => set('country', e.target.value)} /></label>
      <label>Métier ou activité<input value={p.job} maxLength={120} onChange={(e) => set('job', e.target.value)} /></label>
      <label>Enfants (facultatif)<input value={p.children} maxLength={200} onChange={(e) => set('children', e.target.value)} placeholder="Prénoms, âges…" /></label>
    </div>
    {line && <p className="profile-birthday">{line}</p>}
    <ChipPicker label="Mes hobbies" options={HOBBIES} value={tags.hobbies} onChange={(v) => setTags({ ...tags, hobbies: v })} />
    <ChipPicker label="Langues parlées" options={LANGUES} value={tags.languages} onChange={(v) => setTags({ ...tags, languages: v })} />
    <ChipPicker label="Ce qui compte pour moi" options={VALEURS} value={tags.values} onChange={(v) => setTags({ ...tags, values: v })} />
    <label>Mon intention pour mes trente ans<textarea value={p.intention} maxLength={500} rows={3} onChange={(e) => set('intention', e.target.value)} placeholder="Ce que je veux construire, vivre, apprendre…" /></label>
    <button className="button primary" disabled={busy} onClick={() => void save()}><Save size={17} /> {busy ? 'Enregistrement…' : 'Enregistrer mon profil'}</button>
    {message && <p role="status">{message}</p>}
  </section>;
}

const HOBBIES = ['Tennis', 'Padel', 'Pilates', 'Yoga', 'Workout', 'Course', 'Marche', 'Danse', 'Natation', 'Cuisine', 'Pâtisserie', 'Lecture', 'Écriture', 'Voyages', 'Photographie', 'Musique', 'Cinéma', 'Séries', 'Mode', 'Beauté', 'Déco', 'Jardinage', 'Dessin', 'Bénévolat', 'Podcasts'];
const LANGUES = ['Français', 'Wolof', 'Anglais', 'Espagnol', 'Arabe', 'Pulaar', 'Sérère', 'Diola', 'Portugais', 'Italien', 'Allemand'];
const VALEURS = ['Famille', 'Foi', 'Liberté', 'Santé', 'Amour', 'Amitié', 'Indépendance', 'Réussite', 'Paix intérieure', 'Bienveillance', 'Authenticité', 'Créativité', 'Sécurité', 'Aventure', 'Équilibre', 'Transmission'];

/** Choix à cocher, avec la possibilité d'ajouter son propre choix. */
function ChipPicker({ label, options, value, onChange }: { label: string; options: string[]; value: string[]; onChange: (v: string[]) => void }) {
  const [other, setOther] = useState('');
  const all = [...options, ...value.filter((v) => !options.includes(v))];
  const toggle = (o: string) => onChange(value.includes(o) ? value.filter((v) => v !== o) : [...value, o]);
  const add = () => {
    const t = other.trim().slice(0, 40);
    if (t && !value.includes(t)) onChange([...value, t]);
    setOther('');
  };
  return <fieldset className="chip-picker">
    <legend>{label}</legend>
    <div className="chip-row">{all.map((o) => <button type="button" key={o} className={'chip' + (value.includes(o) ? ' on' : '')} aria-pressed={value.includes(o)} onClick={() => toggle(o)}>{o}</button>)}</div>
    <div className="chip-other">
      <input value={other} maxLength={40} onChange={(e) => setOther(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); add(); } }} placeholder="Autre…" aria-label={label + ' : ajouter un autre choix'} />
      <button type="button" className="button secondary" disabled={!other.trim()} onClick={add}><Plus size={16} /> Ajouter</button>
    </div>
  </fieldset>;
}
