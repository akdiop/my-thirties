import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { ImagePlus, Play, Trash2 } from 'lucide-react';
import { addMedia, deleteMedia, listMedia, MAX_MEDIA_SIZE, type MediaModule, type MediaRecord } from '../lib/mediaLibrary';

type Props = {
  ownerId: string;
  module: MediaModule;
  entries: { id: string; title: string }[];
};

const LABEL: Record<MediaModule, string> = {
  sport: 'Photos et vidéos de mes séances',
  cuisine: 'Photos de mes plats et tutoriels',
  decouvertes: 'Mes souvenirs de voyage',
  passions: 'Mes créations et inspirations',
};

function Preview({ item }: { item: MediaRecord }) {
  const [url, setUrl] = useState('');
  useEffect(() => {
    const next = URL.createObjectURL(item.blob);
    setUrl(next);
    return () => { URL.revokeObjectURL(next); setUrl(''); };
  }, [item.blob]);
  if (!url) return <div className="media-preview" aria-label="Chargement du média" />;
  return item.type.startsWith('video/')
    ? <video className="media-preview" src={url} controls playsInline preload="metadata" aria-label={item.name} />
    : <img className="media-preview" src={url} alt={item.name} loading="lazy" />;
}

export function MediaGallery({ ownerId, module, entries }: Props) {
  const [items, setItems] = useState<MediaRecord[]>([]);
  const [entryId, setEntryId] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const input = useRef<HTMLInputElement>(null);

  const refresh = async () => setItems(await listMedia(ownerId, module));
  useEffect(() => {
    let active = true;
    listMedia(ownerId, module).then((rows) => { if (active) setItems(rows); }).catch(() => {
      if (active) setMessage('Impossible de lire la galerie locale sur cet appareil.');
    });
    return () => { active = false; };
  }, [ownerId, module]);

  async function importFiles(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = '';
    if (!files.length) return;
    setBusy(true); setMessage('');
    let added = 0;
    try {
      for (const file of files) {
        await addMedia(ownerId, module, entryId || null, file);
        added++;
      }
      setMessage(added + ' média(s) enregistré(s) sur cet appareil.');
    } catch (error) {
      setMessage((added ? added + ' média(s) enregistré(s). ' : '') + (error instanceof Error ? error.message : 'Import impossible.'));
    } finally {
      await refresh().catch(() => setMessage('Impossible d’actualiser la galerie.'));
      setBusy(false);
    }
  }

  async function remove(id: string) {
    if (!window.confirm('Supprimer ce fichier de la galerie locale ?')) return;
    setBusy(true); setMessage('');
    try { await deleteMedia(ownerId, id); await refresh(); }
    catch { setMessage('Suppression impossible.'); }
    finally { setBusy(false); }
  }

  return <section className="tool-card media-gallery">
    <h3>{LABEL[module]}</h3>
    <p className="muted">Ajoute des images ou des vidéos depuis ton appareil. Tu peux les rattacher à une entrée existante.</p>
    <div className="media-controls">
      <label>Associer à
        <select value={entryId} onChange={(e) => setEntryId(e.target.value)}>
          <option value="">Galerie générale de cet espace</option>
          {entries.map((entry) => <option key={entry.id} value={entry.id}>{entry.title}</option>)}
        </select>
      </label>
      <input ref={input} type="file" accept="image/jpeg,image/png,image/webp,image/heic,image/heif,video/mp4,video/webm,video/quicktime" multiple hidden aria-label="Importer des photos ou vidéos" onChange={(e) => void importFiles(e)} />
      <button className="button secondary" disabled={busy} onClick={() => input.current?.click()}><ImagePlus size={17} /> {busy ? 'Import…' : 'Ajouter des photos / vidéos'}</button>
    </div>
    {message && <p role="status">{message}</p>}
    {items.length ? <div className="media-grid">{items.map((item) => (
      <article key={item.id} className="media-tile">
        <Preview item={item} />
        <div className="media-tile-info">
          <div><strong title={item.name}>{item.type.startsWith('video/') ? <Play size={12} aria-hidden /> : null}{item.name}</strong>
            <small>{entries.find((e) => e.id === item.entryId)?.title ?? 'Galerie générale'} · {(item.size / 1048576).toFixed(1)} Mo</small>
          </div>
          <button className="icon-button danger" disabled={busy} aria-label={'Supprimer ' + item.name} onClick={() => void remove(item.id)}><Trash2 size={16} /></button>
        </div>
      </article>
    ))}</div> : <p className="muted">Aucun média pour le moment.</p>}
    <p className="fineprint">Confidentialité : fichiers conservés uniquement dans ce navigateur (IndexedDB), sans envoi à Supabase. Ils ne sont pas chiffrés par My Thirties, ne sont pas synchronisés entre appareils et ne figurent pas dans les sauvegardes. Un nettoyage du navigateur peut les effacer. Formats acceptés selon le navigateur ; 40 Mo maximum par fichier ({Math.round(MAX_MEDIA_SIZE / 1048576)} Mo).</p>
  </section>;
}
