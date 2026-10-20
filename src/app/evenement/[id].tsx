import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, View } from 'react-native';

import { EVENT_CATEGORIES } from '@/agenda/categories';
import { timeToMinutes, toISODate } from '@/agenda/dates';
import type { RecurrenceRule } from '@/agenda/recurrence';
import { Chips } from '@/components/form/Chips';
import { DateField, TimeField } from '@/components/form/DateTimeField';
import { Field, TextField } from '@/components/form/Field';
import { RecurrenceField, ReminderField } from '@/components/form/RecurrenceReminder';
import { Button, Screen } from '@/components/ui';
import { useData, useMutate } from '@/hooks/useData';

export default function EventForm() {
  const params = useLocalSearchParams<{ id: string; date?: string }>();
  const isNew = params.id === 'nouveau';
  const existing = useData(({ org }) => (isNew ? undefined : org.getEvent(params.id)), [params.id]);
  const mutate = useMutate();

  const [title, setTitle] = useState(existing?.title ?? '');
  const [date, setDate] = useState(existing?.date ?? params.date ?? toISODate(new Date()));
  const [startTime, setStartTime] = useState<string | null>(existing ? existing.startTime : '09:00');
  const [endTime, setEndTime] = useState<string | null>(existing ? existing.endTime : '10:00');
  const [category, setCategory] = useState(existing?.category ?? 'perso');
  const [location, setLocation] = useState(existing?.location ?? '');
  const [notes, setNotes] = useState(existing?.notes ?? '');
  const [recurrence, setRecurrence] = useState<RecurrenceRule | null>(existing?.recurrence ?? null);
  const [reminder, setReminder] = useState<number | null>(existing ? existing.reminderMinutes : 30);

  const endBeforeStart = !!startTime && !!endTime && timeToMinutes(endTime) <= timeToMinutes(startTime);
  const valid = title.trim().length > 0 && !endBeforeStart;

  const save = () => {
    mutate(({ org }) =>
      org.saveEvent(
        {
          title: title.trim(),
          date,
          startTime,
          endTime: startTime ? endTime : null,
          category,
          location: location.trim() || null,
          notes: notes.trim() || null,
          recurrence,
          reminderMinutes: reminder,
        },
        isNew ? undefined : params.id,
      ),
    );
    router.back();
  };

  const remove = () => {
    if (!existing) return;
    const deleteAll = () => {
      mutate(({ org }) => org.deleteEvent(existing.id));
      router.back();
    };
    if (!existing.recurrence || !params.date) {
      Alert.alert('Supprimer cet événement ?', existing.title, [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Supprimer', style: 'destructive', onPress: deleteAll },
      ]);
      return;
    }
    Alert.alert('Événement répété', 'Que voulez-vous supprimer ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Seulement ce jour',
        onPress: () => {
          mutate(({ org }) => org.skipOccurrence(existing.id, params.date!));
          router.back();
        },
      },
      { text: 'Toute la série', style: 'destructive', onPress: deleteAll },
    ]);
  };

  return (
    <Screen
      title={isNew ? 'Nouvel événement' : 'Événement'}
      back
      footer={
        <View style={{ gap: 10 }}>
          <Button label="Enregistrer" disabled={!valid} onPress={save} />
          {!isNew ? <Button label="Supprimer" variant="danger" onPress={remove} /> : null}
        </View>
      }
    >
      <TextField label="Titre" value={title} onChangeText={setTitle} placeholder="Réunion, rendez-vous, dîner…" maxLength={120} autoFocus={isNew} />
      <Field label="Date">
        <DateField label="Date" value={date} onChange={(d) => d && setDate(d)} />
      </Field>
      <Field label="Début">
        <TimeField label="Début" value={startTime} onChange={setStartTime} optional />
      </Field>
      {startTime ? (
        <Field label={endBeforeStart ? 'Fin · doit être après le début' : 'Fin'}>
          <TimeField label="Fin" value={endTime} onChange={setEndTime} optional />
        </Field>
      ) : null}
      <Field label="Catégorie">
        <Chips label="Catégorie" options={EVENT_CATEGORIES.map((cat) => ({ value: cat.id as string, label: cat.label, color: cat.color }))} value={category} onChange={setCategory} />
      </Field>
      <RecurrenceField value={recurrence} onChange={setRecurrence} />
      <ReminderField value={reminder} onChange={setReminder} />
      <TextField label="Lieu" value={location} onChangeText={setLocation} maxLength={200} />
      <TextField label="Notes" value={notes} onChangeText={setNotes} multiline maxLength={2000} />
    </Screen>
  );
}
