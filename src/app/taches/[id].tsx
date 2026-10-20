import { router, useLocalSearchParams } from 'expo-router';
import { Trash2 } from 'lucide-react-native';
import { useState } from 'react';
import { Alert, Pressable, View } from 'react-native';

import type { RecurrenceRule } from '@/agenda/recurrence';
import { canFocus, PRIORITY_LABEL } from '@/agenda/tasks';
import { Chips } from '@/components/form/Chips';
import { DateField, TimeField } from '@/components/form/DateTimeField';
import { Field, TextField } from '@/components/form/Field';
import { RecurrenceField, ReminderField } from '@/components/form/RecurrenceReminder';
import { AppText, Button, Card, Checkbox, Screen } from '@/components/ui';
import { useData, useMutate } from '@/hooks/useData';
import { useToday } from '@/hooks/useToday';
import { useTheme } from '@/theme/ThemeProvider';
import { MIN_TOUCH } from '@/theme/tokens';

export default function TaskForm() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const isNew = id === 'nouveau';
  const today = useToday();
  const { c } = useTheme();
  const mutate = useMutate();
  const existing = useData(({ org }) => (isNew ? undefined : org.getTask(id)), [id]);
  const subtasks = useData(({ org }) => (isNew ? [] : org.listSubtasks(id)), [id]);
  const allTasks = useData(({ org }) => org.listTasks());

  const [title, setTitle] = useState(existing?.title ?? '');
  const [notes, setNotes] = useState(existing?.notes ?? '');
  const [dueDate, setDueDate] = useState<string | null>(existing ? existing.dueDate : today);
  const [dueTime, setDueTime] = useState<string | null>(existing?.dueTime ?? null);
  const [priority, setPriority] = useState(existing?.priority ?? 0);
  const [recurrence, setRecurrence] = useState<RecurrenceRule | null>(existing?.recurrence ?? null);
  const [reminder, setReminder] = useState<number | null>(existing?.reminderMinutes ?? null);
  const [newSub, setNewSub] = useState('');

  const input = () => ({
    title: title.trim(),
    notes: notes.trim() || null,
    dueDate,
    dueTime: dueDate ? dueTime : null,
    priority,
    recurrence: dueDate ? recurrence : null,
    reminderMinutes: dueDate ? reminder : null,
  });

  const save = () => {
    mutate(({ org }) => org.saveTask(input(), isNew ? undefined : id));
    router.back();
  };

  const focused = existing?.focusDate === today;
  const toggleFocus = () => {
    if (!existing) return;
    if (!focused && !canFocus(allTasks, today, existing.id)) {
      Alert.alert('Trois priorités maximum', 'Retirez une priorité du jour avant d’en ajouter une autre.');
      return;
    }
    mutate(({ org }) => org.setFocus(existing.id, focused ? null : today));
  };

  return (
    <Screen
      title={isNew ? 'Nouvelle tâche' : 'Tâche'}
      back
      footer={
        <View style={{ gap: 10 }}>
          <Button label="Enregistrer" disabled={!title.trim()} onPress={save} />
          {existing && !existing.completedAt ? (
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Button style={{ flex: 1 }} label={focused ? 'Retirer des priorités' : 'Priorité du jour'} variant="secondary" onPress={toggleFocus} />
              <Button
                style={{ flex: 1 }}
                label="Reporter à demain"
                variant="outline"
                onPress={() => {
                  mutate(({ org }) => org.postponeTask(existing, today));
                  router.back();
                }}
              />
            </View>
          ) : null}
        </View>
      }
    >
      <TextField label="Titre" value={title} onChangeText={setTitle} maxLength={160} autoFocus={isNew} />
      <Field label="Échéance">
        <DateField label="Échéance" value={dueDate} onChange={setDueDate} optional />
      </Field>
      {dueDate ? (
        <>
          <Field label="Heure">
            <TimeField label="Heure" value={dueTime} onChange={setDueTime} optional />
          </Field>
          <RecurrenceField value={recurrence} onChange={setRecurrence} />
          <ReminderField value={reminder} onChange={setReminder} />
        </>
      ) : null}
      <Field label="Priorité">
        <Chips label="Priorité" options={PRIORITY_LABEL.map((label, value) => ({ value, label }))} value={priority} onChange={setPriority} />
      </Field>
      <TextField label="Notes" value={notes} onChangeText={setNotes} multiline maxLength={2000} />

      {existing ? (
        <Field label="Sous-tâches">
          <Card style={{ paddingVertical: 4 }}>
            {subtasks.map((s) => (
              <View key={s.id} style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ flex: 1 }}>
                  <Checkbox label={s.title} checked={s.done} onChange={(v) => mutate(({ org }) => org.toggleSubtask(s.id, v))} />
                </View>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Supprimer ${s.title}`}
                  onPress={() => mutate(({ org }) => org.deleteSubtask(s.id))}
                  style={{ width: MIN_TOUCH, height: MIN_TOUCH, alignItems: 'center', justifyContent: 'center' }}
                >
                  <Trash2 size={18} color={c.textMuted} />
                </Pressable>
              </View>
            ))}
            <TextField
              label="Ajouter une sous-tâche"
              value={newSub}
              onChangeText={setNewSub}
              returnKeyType="done"
              maxLength={160}
              onSubmitEditing={() => {
                if (!newSub.trim()) return;
                mutate(({ org }) => org.addSubtask(existing.id, newSub.trim()));
                setNewSub('');
              }}
            />
          </Card>
        </Field>
      ) : (
        <AppText variant="caption" color={c.textMuted}>Les sous-tâches s’ajoutent une fois la tâche enregistrée.</AppText>
      )}

      {existing ? (
        <Button
          label="Supprimer la tâche"
          variant="danger"
          onPress={() =>
            Alert.alert('Supprimer cette tâche ?', existing.title, [
              { text: 'Annuler', style: 'cancel' },
              {
                text: 'Supprimer',
                style: 'destructive',
                onPress: () => {
                  mutate(({ org }) => org.deleteTask(existing.id));
                  router.back();
                },
              },
            ])
          }
        />
      ) : null}
    </Screen>
  );
}
