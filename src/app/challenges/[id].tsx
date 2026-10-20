import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Pressable, TextInput, View } from 'react-native';

import { addDays, dayLabel } from '@/agenda/dates';
import { AppText, Button, Card, ProgressBar, Screen } from '@/components/ui';
import { Segmented } from '@/components/ui/Segmented';
import type { DayState } from '@/data/wellbeing';
import { useData, useMutate } from '@/hooks/useData';
import { useTheme } from '@/theme/ThemeProvider';
import { radius } from '@/theme/tokens';

const stateLabels: Record<DayState, string> = {
  done: 'Réalisé', rest: 'Repos', not_done: 'Non réalisé',
};

export default function ChallengeDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { c } = useTheme();
  const mutate = useMutate();
  const [selected, setSelected] = useState(1);
  const [plan, setPlan] = useState('');
  const data = useData(({ wellbeing }) => ({
    item: wellbeing.getChallenge(id),
    records: wellbeing.listDays(id),
  }), [id]);

  const current = data.records.find((r) => r.dayNumber === selected);
  useEffect(() => { setPlan(current?.plan ?? ''); }, [selected, current?.plan]);

  if (!data.item) return <Screen title="Challenge introuvable" back><AppText>Ce programme n’existe plus.</AppText></Screen>;
  const item = data.item;
  const state: DayState = current?.state ?? 'not_done';
  const done = data.records.filter((r) => r.state === 'done').length;
  const rest = data.records.filter((r) => r.state === 'rest').length;
  const setState = (value: DayState) => mutate(({ wellbeing }) => wellbeing.setDay(id, selected, value));

  const archive = () => Alert.alert('Archiver ce challenge ?', 'Vous pourrez le retrouver dans votre historique.', [
    { text: 'Annuler', style: 'cancel' },
    { text: 'Archiver', onPress: () => {
      mutate(({ wellbeing }) => wellbeing.setChallengeStatus(id, 'archived'));
      router.back();
    } },
  ]);

  return (
    <Screen title={item.title} subtitle={item.discipline + ' · ' + item.days + ' jours'} back>
      <Card tone="sage" style={{ gap: 8 }}>
        <AppText variant="label">{done} séances réalisées · {rest} jours de repos</AppText>
        <ProgressBar value={done / item.days} label={done + ' sur ' + item.days} />
        <AppText variant="caption">Votre progression reste enregistrée même si vous manquez une journée.</AppText>
      </Card>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {Array.from({ length: item.days }, (_, i) => {
          const n = i + 1;
          const record = data.records.find((r) => r.dayNumber === n);
          const status = record?.state ?? 'not_done';
          const active = selected === n;
          return (
            <Pressable key={n} accessibilityRole="button"
              accessibilityLabel={'Jour ' + n + ', ' + stateLabels[status]}
              accessibilityState={{ selected: active }} onPress={() => setSelected(n)}
              style={{ width: 51, minHeight: 58, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center',
                borderWidth: active ? 2 : 1, borderColor: active ? c.primary : c.border,
                backgroundColor: status === 'done' ? c.successTint : status === 'rest' ? c.restTint : c.surface }}>
              <AppText variant="label">{n}</AppText>
              <AppText variant="caption" color={status === 'done' ? c.accent : c.textMuted}>{status === 'done' ? '✓' : status === 'rest' ? '—' : '·'}</AppText>
            </Pressable>
          );
        })}
      </View>
      <Card style={{ gap: 12 }}>
        <AppText variant="cardTitle">Jour {selected}</AppText>
        <AppText variant="caption" color={c.textMuted}>{dayLabel(addDays(item.startDate, selected - 1))}</AppText>
        <Segmented<DayState> label="État du jour" value={state} onChange={setState} options={[
          { value: 'done', label: 'Réalisé' }, { value: 'rest', label: 'Repos' }, { value: 'not_done', label: 'Non réalisé' },
        ]} />
        <AppText variant="label">Mon programme ou mes notes</AppText>
        <TextInput accessibilityLabel="Exercices et notes de ce jour" multiline
          placeholder="Exercices, durée, séries, conseils ou adaptations…"
          placeholderTextColor={c.textMuted} value={plan} onChangeText={setPlan}
          style={{ minHeight: 105, borderWidth: 1, borderColor: c.border, borderRadius: radius.md, padding: 12, color: c.text, textAlignVertical: 'top' }} />
        <Button label="Enregistrer la fiche" onPress={() => mutate(({ wellbeing }) => wellbeing.setDay(id, selected, state, plan.trim()))} />
        <AppText variant="caption" color={c.textMuted}>Les vidéos pédagogiques seront ajoutées après validation des ressources. Les jours de repos font partie du programme.</AppText>
      </Card>
      <Button label={item.status === 'archived' ? 'Réactiver' : 'Archiver le challenge'} variant="outline"
        onPress={item.status === 'archived' ? () => mutate(({ wellbeing }) => wellbeing.setChallengeStatus(id, 'active')) : archive} />
    </Screen>
  );
}
