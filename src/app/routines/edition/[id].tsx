import { router, useLocalSearchParams } from 'expo-router';
import { Trash2 } from 'lucide-react-native';
import { useState } from 'react';
import { Alert, Pressable, Switch, TextInput, View } from 'react-native';

import { ROUTINE_KINDS, routineKind } from '@/agenda/routines';
import { Chips, WeekdayPicker } from '@/components/form/Chips';
import { TimeField } from '@/components/form/DateTimeField';
import { Field, TextField } from '@/components/form/Field';
import { AppText, Button, ListRow, Screen } from '@/components/ui';
import { useData, useMutate } from '@/hooks/useData';
import { useTheme } from '@/theme/ThemeProvider';
import { MIN_TOUCH, radius } from '@/theme/tokens';

export default function RoutineEdit() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const isNew = id === 'nouveau';
  const { c } = useTheme();
  const mutate = useMutate();
  const existing = useData(({ org }) => (isNew ? undefined : { routine: org.getRoutine(id), items: org.listRoutineItems(id) }), [id]);

  const [kind, setKind] = useState(existing?.routine?.kind ?? 'matin');
  const preset = routineKind(kind);
  const [name, setName] = useState<string>(existing?.routine?.name ?? preset.defaultName);
  const [weekdays, setWeekdays] = useState<number[]>(existing?.routine?.weekdays ?? [...preset.weekdays]);
  const [time, setTime] = useState<string | null>(existing?.routine ? existing.routine.time : preset.time);
  const [remind, setRemind] = useState(existing?.routine?.remind ?? false);
  const [items, setItems] = useState<string[]>(existing?.items.map((i) => i.title) ?? [...preset.items]);

  const applyKind = (k: string) => {
    setKind(k);
    if (!isNew) return;
    const p = routineKind(k);
    setName(p.defaultName);
    setWeekdays([...p.weekdays]);
    setTime(p.time);
    setItems([...p.items]);
  };

  const valid = name.trim().length > 0 && weekdays.length > 0;

  const save = () => {
    mutate(({ org }) => org.saveRoutine({ name: name.trim(), kind, weekdays, time, remind: remind && !!time, items }, isNew ? undefined : id));
    router.back();
  };

  return (
    <Screen
      title={isNew ? 'Nouvelle routine' : 'Modifier la routine'}
      back
      footer={<Button label="Enregistrer" disabled={!valid} onPress={save} />}
    >
      <Field label="Type">
        <Chips label="Type de routine" options={ROUTINE_KINDS.map((k) => ({ value: k.id as string, label: k.label }))} value={kind} onChange={applyKind} />
      </Field>
      <TextField label="Nom" value={name} onChangeText={setName} maxLength={80} />
      <Field label="Jours">
        <WeekdayPicker value={weekdays} onChange={setWeekdays} />
      </Field>
      <Field label="Heure">
        <TimeField label="Heure" value={time} onChange={setTime} optional />
      </Field>
      {time ? (
        <ListRow label="Me le rappeler" right={<Switch value={remind} onValueChange={setRemind} trackColor={{ true: c.secondary }} accessibilityLabel="Me le rappeler" />} last />
      ) : null}
      <Field label="Étapes">
        <View style={{ gap: 8 }}>
          {items.map((item, i) => (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <TextInput
                accessibilityLabel={`Étape ${i + 1}`}
                value={item}
                onChangeText={(v) => setItems(items.map((x, j) => (j === i ? v : x)))}
                maxLength={120}
                style={{ flex: 1, minHeight: 46, borderRadius: radius.md, borderWidth: 1, borderColor: c.border, backgroundColor: c.surface, paddingHorizontal: 14, fontFamily: 'Inter_400Regular', fontSize: 15, color: c.text }}
              />
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Supprimer l’étape ${i + 1}`}
                onPress={() => setItems(items.filter((_, j) => j !== i))}
                style={{ width: MIN_TOUCH, height: MIN_TOUCH, alignItems: 'center', justifyContent: 'center' }}
              >
                <Trash2 size={18} color={c.textMuted} />
              </Pressable>
            </View>
          ))}
          <Button label="+ Ajouter une étape" variant="outline" onPress={() => setItems([...items, ''])} />
        </View>
      </Field>
      {!isNew ? (
        <Button
          label="Supprimer la routine"
          variant="danger"
          onPress={() =>
            Alert.alert('Supprimer cette routine ?', name, [
              { text: 'Annuler', style: 'cancel' },
              {
                text: 'Supprimer',
                style: 'destructive',
                onPress: () => {
                  mutate(({ org }) => org.deleteRoutine(id));
                  router.dismissTo('/routines');
                },
              },
            ])
          }
        />
      ) : null}
      <AppText variant="caption" color={c.textMuted}>Les cases cochées des jours passés sont conservées dans l’historique.</AppText>
    </Screen>
  );
}
