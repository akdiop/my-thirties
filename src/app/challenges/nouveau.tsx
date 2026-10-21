import { router } from 'expo-router';
import { useMemo, useState } from 'react';

import { buildPlan, CHALLENGE_TEMPLATES, UNIT_LABEL, type ChallengeUnit } from '@/challenges/challenges';
import { Chips } from '@/components/form/Chips';
import { DateField } from '@/components/form/DateTimeField';
import { Field, TextField } from '@/components/form/Field';
import { Stepper } from '@/components/form/Scale';
import { AppText, Button, Card, Screen } from '@/components/ui';
import { useMutate } from '@/hooks/useData';
import { useToday } from '@/hooks/useToday';
import { useTheme } from '@/theme/ThemeProvider';

export default function NewChallenge() {
  const today = useToday();
  const { c } = useTheme();
  const mutate = useMutate();
  const [templateId, setTemplateId] = useState<string>('squats');
  const [start, setStart] = useState(today);
  const [title, setTitle] = useState('');
  const [exercise, setExercise] = useState('');
  const [unit, setUnit] = useState<ChallengeUnit>('reps');
  const [startValue, setStartValue] = useState(10);
  const [step, setStep] = useState(2);
  const [restEvery, setRestEvery] = useState(4);
  const custom = templateId === 'custom';
  const template = CHALLENGE_TEMPLATES.find((t) => t.id === templateId);

  const preview = useMemo(
    () => (custom ? buildPlan({ start: startValue, step, stepEvery: 2, restEvery, days: 30 }) : template ? buildPlan(template) : []),
    [custom, template, startValue, step, restEvery],
  );
  const max = Math.max(...preview, 0);

  const create = () => {
    const id = mutate(({ well }) =>
      custom
        ? well.startCustomChallenge({ title: title || `${exercise} 30 jours`, exercise, unit, start: startValue, step, stepEvery: 2, restEvery, days: 30, sets: 1 }, start)
        : well.startChallenge(templateId, start),
    );
    router.replace({ pathname: '/challenges/[id]', params: { id } });
  };

  return (
    <Screen title="Nouveau challenge" back footer={<Button label="Commencer" disabled={custom && !exercise.trim()} onPress={create} />}>
      <Field label="Programme">
        <Chips label="Programme" options={[...CHALLENGE_TEMPLATES.map((t) => ({ value: t.id, label: t.title })), { value: 'custom', label: 'Personnalisé' }]} value={templateId} onChange={setTemplateId} />
      </Field>
      {custom ? (
        <>
          <TextField label="Exercice" value={exercise} onChangeText={setExercise} placeholder="Fentes, corde à sauter…" maxLength={60} />
          <TextField label="Nom du challenge (facultatif)" value={title} onChangeText={setTitle} maxLength={60} />
          <Field label="Unité">
            <Chips label="Unité" options={(Object.keys(UNIT_LABEL) as ChallengeUnit[]).map((u) => ({ value: u, label: UNIT_LABEL[u] }))} value={unit} onChange={setUnit} />
          </Field>
          <Field label="Départ">
            <Stepper label="Départ" value={startValue} onChange={setStartValue} min={1} max={200} />
          </Field>
          <Field label="Progression tous les 2 jours actifs">
            <Stepper label="Progression" value={step} onChange={setStep} min={0} max={20} />
          </Field>
          <Field label="Un jour de repos tous les">
            <Stepper label="Repos tous les" value={restEvery} onChange={setRestEvery} min={2} max={7} suffix="jours" />
          </Field>
        </>
      ) : null}
      <Field label="Début">
        <DateField label="Début" value={start} onChange={(d) => d && setStart(d)} />
      </Field>
      <Card tone="sand" style={{ gap: 6 }}>
        <AppText style={{ fontFamily: 'Inter_600SemiBold' }}>Aperçu du programme</AppText>
        <AppText>
          {preview.filter((v) => v > 0).length} séances, {preview.filter((v) => v === 0).length} jours de repos, jusqu’à {max} {UNIT_LABEL[custom ? unit : (template?.unit ?? 'reps')]}
          {template && !custom && template.sets > 1 ? ` (${template.sets} séries)` : ''}.
        </AppText>
        {custom && max > 150 ? <AppText color={c.danger}>Volume élevé : réduisez la progression pour éviter les blessures.</AppText> : null}
      </Card>
    </Screen>
  );
}
