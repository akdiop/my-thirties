import { useEffect, useRef, useState } from 'react';

type Point = { x: number; y: number; visibility?: number };
const pairs = [[11,12],[11,13],[13,15],[12,14],[14,16],[11,23],[12,24],[23,24],[23,25],[25,27],[24,26],[26,28]] as const;

export function LocalVideoPose() {
  const [videoUrl, setVideoUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [status, setStatus] = useState('');
  const [active, setActive] = useState(false);
  const [busy, setBusy] = useState(false);
  const video = useRef<HTMLVideoElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const model = useRef<{ detectForVideo: (video: HTMLVideoElement, timestamp: number) => { landmarks: Point[][] }; close: () => void } | null>(null);
  const frame = useRef(0);
  const lastFrame = useRef(0);
  const running = useRef(false);
  const fileRef = useRef<HTMLInputElement>(null);
  useEffect(() => () => { running.current = false; cancelAnimationFrame(frame.current); model.current?.close(); }, []);
  useEffect(() => () => { if (videoUrl) URL.revokeObjectURL(videoUrl); }, [videoUrl]);
  const choose = (file?: File) => {
    running.current = false; cancelAnimationFrame(frame.current);
    model.current?.close(); model.current = null; setActive(false); setStatus('');
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    if (!file) { setVideoUrl(''); setFileName(''); return; }
    if (!file.type.startsWith('video/') || file.size > 150 * 1024 * 1024) {
      setVideoUrl(''); setFileName(''); setStatus('Choisis une vidéo de moins de 150 Mo.'); return;
    }
    setVideoUrl(URL.createObjectURL(file)); setFileName(file.name);
  };
  const analyze = async () => {
    if (!video.current || !canvas.current || !videoUrl || busy) return;
    setBusy(true); setStatus('');
    try {
      const { FilesetResolver, PoseLandmarker } = await import('@mediapipe/tasks-vision');
      const vision = await FilesetResolver.forVisionTasks('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22/wasm');
      const pose = await PoseLandmarker.createFromOptions(vision, {
        baseOptions: { modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task', delegate: 'CPU' },
        runningMode: 'VIDEO', numPoses: 1,
      });
      model.current = pose; running.current = true; setActive(true);
      const draw = (time: number) => {
        if (!running.current || !video.current || !canvas.current || !model.current) return;
        const v = video.current, c = canvas.current;
        if (v.videoWidth && v.videoHeight) {
          if (c.width !== v.videoWidth || c.height !== v.videoHeight) { c.width = v.videoWidth; c.height = v.videoHeight; }
          if (time - lastFrame.current >= 150 && v.readyState >= 2) {
            lastFrame.current = time;
            const ctx = c.getContext('2d');
            if (ctx) {
              ctx.clearRect(0, 0, c.width, c.height);
              try {
                const result = model.current.detectForVideo(v, time);
                for (const points of result.landmarks) {
                  ctx.strokeStyle = '#91e0c4'; ctx.lineWidth = Math.max(3, c.width / 250);
                  for (const [a,b] of pairs) {
                    if (!points[a] || !points[b] || (points[a].visibility ?? 1) < .45 || (points[b].visibility ?? 1) < .45) continue;
                    ctx.beginPath(); ctx.moveTo(points[a].x * c.width, points[a].y * c.height);
                    ctx.lineTo(points[b].x * c.width, points[b].y * c.height); ctx.stroke();
                  }
                  ctx.fillStyle = '#ffffff';
                  for (const p of points) if ((p.visibility ?? 1) >= .45) {
                    ctx.beginPath(); ctx.arc(p.x * c.width, p.y * c.height, Math.max(2, c.width / 250), 0, Math.PI * 2); ctx.fill();
                  }
                }
              } catch { setStatus('Analyse interrompue : le format ou la vidéo ne sont peut-être pas compatibles.'); running.current = false; }
            }
          }
        }
        if (running.current) frame.current = requestAnimationFrame(draw);
      };
      frame.current = requestAnimationFrame(draw);
    } catch { setStatus('Le modèle de détection n’a pas pu être chargé sur cet appareil. Vérifie la connexion ou essaie un navigateur récent.'); }
    finally { setBusy(false); }
  };
  const stop = () => {
    running.current = false; cancelAnimationFrame(frame.current); model.current?.close(); model.current = null;
    canvas.current?.getContext('2d')?.clearRect(0, 0, canvas.current.width, canvas.current.height);
    setActive(false);
  };
  return <section className="tool-card">
    <h3>Observation vidéo des mouvements</h3>
    <p className="muted">Choisis une vidéo de tennis, de Pilates ou de yoga pour afficher les points de posture détectés par un modèle sur ton appareil. C'est un outil d'observation, pas encore une évaluation fiable de la technique.</p>
    <label>Vidéo personnelle<input ref={fileRef} type="file" accept="video/*" onChange={(e) => { choose(e.target.files?.[0]); e.target.value = ''; }} /></label>
    {videoUrl && <div className="video-analysis">
      <div className="video-stage"><video ref={video} src={videoUrl} controls playsInline preload="metadata" aria-label={'Vidéo ' + fileName} />
        <canvas ref={canvas} aria-hidden="true" /></div>
      <div className="button-group">{active ? <button className="button secondary" onClick={stop}>Arrêter l'observation</button>
        : <button className="button secondary" disabled={busy} onClick={() => void analyze()}>{busy ? 'Chargement du modèle…' : 'Activer les points de posture'}</button>}
        <button className="button ghost" onClick={() => { stop(); choose(); if (fileRef.current) fileRef.current.value = ''; }}>Retirer la vidéo</button></div>
    </div>}
    {status && <p role="status">{status}</p>}
    <p className="fineprint">Confidentialité : le fichier vidéo reste local dans ton navigateur et n'est pas enregistré dans My Thirties ni envoyé à un serveur. Le logiciel de détection et son modèle sont téléchargés depuis des serveurs externes à l'activation. Aucune correction automatique ou recommandation médicale n'est produite. Ne filme que les personnes qui ont donné leur accord.</p>
  </section>;
}
