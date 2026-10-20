import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, View } from 'react-native';

import { toISODate } from '@/agenda/dates';
import { Chips } from '@/components/form/Chips';
import { DateField } from '@/components/form/DateTimeField';
import { Field, TextField } from '@/components/form/Field';
import { Scale, Stepper } from '@/components/form/Scale';
import { Button, Screen } from '@/components/ui';
import { useData, useMutate } from '@/hooks/useData';

const DISCIPLINES = [
  { value: 'tennis', label: 'Tennis' },
  { value: 'pilates', label: 'Pilates' },
  { value: 'yoga', label: 'Yoga' },
  { value: 'autre', label: 'Autre' },
];

const FEELINGS = ['Facile', 'Juste bien', 'Difficile', 'Fatiguée', 'Fière'];

export default function Seance() {
  const params = useLocalSearchParams<{ id: string; discipline?: string; title?: string; minutes?: string }>();
  const isNew = params.id === 'nouveau';
  const mutate = useMutate();
  const existing = useData(({ well }) => (isNew ? undefined : well.getWorkout(params.id)), [params.id]);

  const [date, setDate] = useState(existing?.date ?? toISODate(new Date()));
  const [discipline, setDiscipline] = useState(existing?.discipline ?? params.discipline ?? 'pilates');
  const [title, setTitle] = useState(existing?.title ?? params.title ?? '');
  const [duration, setDuration] = useState(existing?.durationMin ?? (params.minutes ? Number(params.minutes) : 30));
  const [intensity, setIntensity] = useState<number | null>(existing?.intensity ?? null);
  const [feeling, setFeeling] = useState<string | null>(existing?.feeling ?? null);
  const [notes, setNotes] = useState(existing?.notes ?? '');
  const fromChallenge = existing?.discipline === 'challenge';

  const save = () => {
    mutate(({ well }) =>
      well.saveWorkout(
        { date, discipline, title: title.trim() || (DISCIPLINES.find((d) => d.value === discipline)?.label ?? 'Séance'), durationMin: duration || null, intensity, feeling, notes: notes.trim() || null },
        isNew ? undefined : params.id,
      ),
    );
    router.back();
  };

  return (
    <Screen
      title={isNew ? 'Nouvelle séance' : 'Séance'}
      back
      footer={
        <View style={{ gap: 10 }}>
          <Button label="Enregistrer" onPress={save} />
          {existing ? (
            <Button
              label="Supprimer"
              variant="danger"
              onPress={() =>
                Alert.alert('Supprimer cette séance ?', fromChallenge ? 'Le jour correspondant du challenge ne sera plus coché.' : existing.title, [
                  { text: 'Annuler', style: 'cancel' },
                  {
                    text: 'Supprimer',
                    style: 'destructive',
                    onPress: () => {
                      mutate(({ well }) => well.deleteWorkout(existing.id));
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
      {!fromChallenge ? (
        <Field label="Discipline">
          <Chips label="Discipline" options={DISCIPLINES} value={discipline} onChange={setDiscipline} />
        </Field>
      ) : null}
      <TextField label="Titre" value={title} onChangeText={setTitle} placeholder="Cours de Pilates, match en double…" maxLength={120} />
      <Field label="Date">
        <DateField label="Date" value={date} onChange={(d) => d && setDate(d)} />
      </Field>
      <Field label="Durée">
        <Stepper label="Durée" value={duration} onChange={setDuration} min={0} max={300} step={5} suffix="min" />
      </Field>
      <Field label="Intensité ressentie">
        <Scale label="Intensité" value={intensity} onChange={setIntensity} low="Douce" high="Intense" />
      </Field>
      <Field label="Ressenti">
        <Chips label="Ressenti" options={[{ value: null, label: '—' }, ...FEELINGS.map((f) => ({ value: f as string | null, label: f }))]} value={feeling} onChange={setFeeling} />
      </Field>
      <TextField label="Notes, difficultés, progrès" value={notes} onChangeText={setNotes} multiline maxLength={2000} />
    </Screen>
  );
}
