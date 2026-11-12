import { useState } from 'react';
import { CloudRain, Flame, Moon, Wind, X } from 'lucide-react';
import { BREATHS, GUIDED, SOS, type SosKey } from '../lib/meditation';
import { unlockSound } from '../lib/sound';
import { BreathPlayer, GuidedPlayer } from '../features/MeditationPlayers';

/** « J’ai besoin de me calmer » : un SOS à trois choix, puis une respiration et un exercice adaptés. */
export function Calm({ onQuit, onWrite, gratitude }: { onQuit: () => void; onWrite: () => void; gratitude?: string }) {
  const [sos, setSos] = useState<SosKey | 'respirer' | null>(null);
  const [stage, setStage] = useState<'breath' | 'guided'>('breath');
  const plan = sos && sos !== 'respirer' ? SOS[sos] : null;
  const breath = BREATHS.find((b) => b.id === (plan?.breath ?? 'apaisante'))!;
  const guided = plan ? GUIDED.find((g) => g.id === plan.guided) : undefined;
  return <div className="calm-screen">
    <div className="calm-top"><button className="quit-btn" onClick={onQuit}><X size={18} /> Quitter</button></div>
    {!sos ? <>
      <p className="calm-title">Tu es en sécurité.<br />De quoi as-tu besoin ?</p>
      <div className="sos-grid">
        <button onClick={() => { unlockSound(); setSos('angoisse'); }}><CloudRain size={26} /><strong>Angoisse</strong><small>Ralentir et revenir au présent</small></button>
        <button onClick={() => { unlockSound(); setSos('colere'); }}><Flame size={26} /><strong>Colère</strong><small>Laisser redescendre la pression</small></button>
        <button onClick={() => { unlockSound(); setSos('insomnie'); }}><Moon size={26} /><strong>Insomnie</strong><small>Détendre le corps pour dormir</small></button>
        <button onClick={() => { unlockSound(); setSos('respirer'); }}><Wind size={26} /><strong>Juste respirer</strong><small>Six respirations lentes</small></button>
      </div>
    </> : <>
      <p className="calm-title">{plan ? plan.title : 'Respirons ensemble'}</p>
      {plan && <p className="calm-sub wide">{plan.intro}</p>}
      {stage === 'breath' ? <BreathPlayer key={breath.id} breath={breath} onDone={() => { if (guided) setStage('guided'); }} />
        : guided && <GuidedPlayer guided={guided} />}
      <div className="calm-chips">
        {guided && stage === 'breath' && <button onClick={() => setStage('guided')}>Passer à l’exercice</button>}
        <button onClick={() => { setSos(null); setStage('breath'); }}>Changer</button>
      </div>
    </>}
    {gratitude && <div className="calm-grat"><small>Une gratitude d’un autre jour</small><p>{gratitude}</p></div>}
    <button className="calm-note" onClick={onWrite}>Écrire ce que je ressens (facultatif)</button>
  </div>;
}
