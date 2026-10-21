import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, View } from 'react-native';

import { SelectField } from '@/components/form/SelectField';
import { Field, TextField } from '@/components/form/Field';
import { Scale } from '@/components/form/Scale';
import { Button, Screen } from '@/components/ui';
import { EMOTIONS, OUTCOMES, STRATEGIES } from '@/equilibre/emotions';
import { useData, useMutate } from '@/hooks/useData';

export default function Emotion() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const isNew = id === 'nouveau';
  const mutate = useMutate();
  const existing = useData(({ well }) => (isNew ? undefined : well.getEmotion(id)), [id]);
  const [emotion, setEmotion] = useState<string>(existing?.emotion ?? 'Anxiété');
  const [intensity, setIntensity] = useState<number | null>(existing?.intensity ?? 5);
  const [fields, setFields] = useState({
    situation: existing?.situation ?? '',
    trigger: existing?.trigger ?? '',
    thoughts: existing?.thoughts ?? '',
    reaction: existing?.reaction ?? '',
    notes: existing?.notes ?? '',
  });
  const [strategy, setStrategy] = useState<string | null>(existing?.strategy ?? null);
  const [outcome, setOutcome] = useState<string | null>(existing?.outcome ?? null);
  const set = (k: keyof typeof fields) => (v: string) => setFields({ ...fields, [k]: v });
  const clean = (v: string) => v.trim() || null;

  const save = () => {
    mutate(({ well }) =>
      well.saveEmotion(
        {
          at: existing?.at ?? new Date().toISOString(),
          emotion,
          intensity: intensity ?? 0,
          situation: clean(fields.situation),
          trigger: clean(fields.trigger),
          thoughts: clean(fields.thoughts),
          reaction: clean(fields.reaction),
          strategy,
          outcome,
          notes: clean(fields.notes),
        },
        isNew ? undefined : id,
      ),
    );
    router.back();
  };

  return (
    <Screen
      title="Journal émotionnel"
      subtitle="Tout est facultatif"
      back
      footer={
        <View style={{ gap: 10 }}>
          <Button label="Enregistrer" onPress={save} />
          {existing ? (
            <Button
              label="Supprimer"
              variant="danger"
              onPress={() =>
                Alert.alert('Supprimer cette entrée ?', undefined, [
                  { text: 'Annuler', style: 'cancel' },
                  {
                    text: 'Supprimer',
                    style: 'destructive',
                    onPress: () => {
                      mutate(({ well }) => well.deleteEmotion(existing.id));
                      router.back();
                    },
                  },
                ])
              }
            />
          ) : null}
        </View>
      }
    >
      <SelectField label="Émotion" options={EMOTIONS.map((e) => ({ value: e as string, label: e }))} value={emotion} onChange={setEmotion} />
      <Field label="Intensité ressentie">
        <Scale label="Intensité" value={intensity} onChange={setIntensity} min={1} max={10} low="Légère" high="Très forte" />
      </Field>
      <TextField label="Situation" value={fields.situation} onChangeText={set('situation')} multiline maxLength={1000} />
      <TextField label="Déclencheur" value={fields.trigger} onChangeText={set('trigger')} maxLength={120} />
      <TextField label="Pensées" value={fields.thoughts} onChangeText={set('thoughts')} multiline maxLength={1000} />
      <TextField label="Ma réaction" value={fields.reaction} onChangeText={set('reaction')} multiline maxLength={1000} />
      <SelectField label="Stratégie utilisée" options={[{ value: null, label: 'Aucune' }, ...STRATEGIES.map((s) => ({ value: s as string | null, label: s }))]} value={strategy} onChange={setStrategy} />
      <SelectField label="Résultat ressenti" options={[{ value: null, label: '—' }, ...OUTCOMES.map((o) => ({ value: o.value as string | null, label: o.label }))]} value={outcome} onChange={setOutcome} />
      <TextField label="Notes libres" value={fields.notes} onChangeText={set('notes')} multiline maxLength={2000} />
    </Screen>
  );
}
