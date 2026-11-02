import { useEffect, useRef, useState } from 'react';
import { Camera, Mic, Square, X } from 'lucide-react';
import { compressPhoto, deleteMedia, mediaUrl, uploadMedia, type Media } from '../lib/media';

/** Photos et mémos vocaux d'une note, stockés de façon privée. */
export function NoteMedia({ folder, media, onChange }: { folder: string; media: Media[]; onChange: (m: Media[]) => void }) {
  const [busy, setBusy] = useState(''), [error, setError] = useState('');
  const [rec, setRec] = useState<MediaRecorder | null>(null), [secs, setSecs] = useState(0);
  const chunks = useRef<Blob[]>([]), started = useRef(0);

  useEffect(() => { if (!rec) return; const i = setInterval(() => { const s = Math.floor((Date.now() - started.current) / 1000); setSecs(s); if (s >= 180) rec.stop(); }, 500); return () => clearInterval(i); }, [rec]);

  const addPhoto = async (file: File | undefined) => {
    if (!file) return;
    setBusy('photo'); setError('');
    try { const path = await uploadMedia(folder, await compressPhoto(file), 'photo'); onChange([...media, { path, type: 'photo' }]); }
    catch (e) { setError(e instanceof Error ? e.message : 'Photo impossible à ajouter.'); }
    finally { setBusy(''); }
  };
  const startRec = async () => {
    setError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const type = ['audio/mp4', 'audio/webm;codecs=opus', 'audio/webm'].find((t) => MediaRecorder.isTypeSupported?.(t));
      const r = new MediaRecorder(stream, type ? { mimeType: type } : undefined);
      chunks.current = [];
      r.ondataavailable = (ev) => { if (ev.data.size) chunks.current.push(ev.data); };
      r.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const dur = Math.max(1, Math.round((Date.now() - started.current) / 1000));
        setRec(null); setBusy('audio');
        try { const blob = new Blob(chunks.current, { type: r.mimeType || 'audio/mp4' }); const path = await uploadMedia(folder, blob, 'audio'); onChange([...media, { path, type: 'audio', secs: dur }]); }
        catch (e) { setError(e instanceof Error ? e.message : 'Mémo impossible à enregistrer.'); }
        finally { setBusy(''); }
      };
      started.current = Date.now(); setSecs(0); r.start(); setRec(r);
    } catch { setError('Micro inaccessible. Autorise le micro pour My Thirties dans les réglages de l’iPhone.'); }
  };
  const remove = async (m: Media) => {
    if (!confirm(m.type === 'photo' ? 'Retirer cette photo ?' : 'Retirer ce mémo vocal ?')) return;
    onChange(media.filter((x) => x.path !== m.path));
    try { await deleteMedia([m.path]); } catch { /* le fichier sera ignoré */ }
  };

  return <div className="note-media">
    {media.length > 0 && <div className="media-grid">{media.map((m) => <MediaItem key={m.path} m={m} onRemove={() => void remove(m)} />)}</div>}
    <div className="button-group">
      <label className="button ghost small"><Camera size={16} /> {busy === 'photo' ? 'Envoi…' : 'Photo'}
        <input type="file" accept="image/*" className="visually-hidden" disabled={Boolean(busy)} onChange={(e) => { void addPhoto(e.target.files?.[0]); e.target.value = ''; }} /></label>
      {rec ? <button className="button primary small" onClick={() => rec.stop()}><Square size={14} /> Arrêter · {Math.floor(secs / 60)}:{String(secs % 60).padStart(2, '0')}</button>
        : <button className="button ghost small" disabled={Boolean(busy) || typeof MediaRecorder === 'undefined'} onClick={() => void startRec()}><Mic size={16} /> {busy === 'audio' ? 'Envoi…' : 'Mémo vocal'}</button>}
    </div>
    {error && <p className="error" role="alert">{error}</p>}
  </div>;
}

function MediaItem({ m, onRemove }: { m: Media; onRemove: () => void }) {
  const [url, setUrl] = useState('');
  useEffect(() => { let on = true; void mediaUrl(m.path).then((u) => { if (on) setUrl(u); }); return () => { on = false; }; }, [m.path]);
  return <div className={'media-item ' + m.type}>
    {m.type === 'photo' ? (url ? <img src={url} alt="Photo de la note" loading="lazy" /> : <span className="media-ph" />)
      : <div className="media-audio"><Mic size={16} />{url ? <audio controls preload="none" src={url} /> : <span>Chargement…</span>}{m.secs ? <small>{Math.floor(m.secs / 60)}:{String(m.secs % 60).padStart(2, '0')}</small> : null}</div>}
    <button className="media-x" aria-label="Retirer" onClick={onRemove}><X size={14} /></button>
  </div>;
}
