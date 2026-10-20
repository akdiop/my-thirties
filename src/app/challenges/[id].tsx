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
import { Alert, Pressable, View } from 'react-native';

import { dayLabel } from '@/agenda/dates';
import { cellState, cycleStatus, dateForDay, type CellState } from '@/challenges/challenges';
import { TimeField } from '@/components/form/DateTimeField';
import { Field } from '@/components/form/Field';
import { AppText, Button, Card, ProgressBar, Screen } from '@/components/ui';
import { challengeView, formatAmount } from '@/features/challengeView';
import { useData, useMutate } from '@/hooks/useData';
import { useToday } from '@/hooks/useToday';
import { useTheme } from '@/theme/ThemeProvider';

const STATE_LABEL: Record<CellState, string> = {
  done: 'réalisé',
  rest: 'repos',
  missed: 'non réalisé',
  today: 'aujourd’hui',
  'planned-rest': 'repos prévu',
  future: 'à venir',
  pending: 'non noté',
};

export default function ChallengeCalendar() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const today = useToday();
  const { c } = useTheme();
  const mutate = useMutate();
  const data = useData(({ well }) => {
    const ch = well.getChallenge(id);
    return ch ? { ch, records: well.recordedStatuses(id) } : null;
  }, [id]);

  if (!data || data.ch.deletedAt) {
    return (
      <Screen title="Challenge introuvable" back>
        <AppText>Ce challenge n’existe plus.</AppText>
      </Screen>
    );
  }
  const { ch, records } = data;
  const view = challengeView(ch, records, today);

  const look = (s: CellState) => {
    switch (s) {
      case 'done':
        return { bg: c.success, band: '#7A8B66', ink: '#1F2A1B', bandInk: '#FFFFFF', border: c.success };
      case 'rest':
      case 'planned-rest':
        return { bg: c.restTint, band: '#E6D3C2', ink: c.primary, bandInk: c.primary, border: '#D9C2AE' };
      case 'missed':
      case 'pending':
        return { bg: c.background, band: c.border, ink: c.textMuted, bandInk: c.textMuted, border: '#9C8576' };
      case 'today':
        return { bg: c.surface, band: c.primary, ink: c.text, bandInk: c.onPrimary, border: c.primary };
      default:
        return { bg: c.surface, band: '#F3E9DF', ink: c.text, bandInk: c.primary, border: c.border };
    }
  };

  const onCell = (day: number, state: CellState) => {
    if (day === view.todayIndex && state === 'today') {
      router.push({ pathname: '/challenges/jour', params: { id, day: String(day) } });
      return;
    }
    if (day > view.todayIndex) return;
    mutate(({ well }) => well.setDayStatus(id, day, cycleStatus(state)));
  };

  const activeDays = ch.plan.filter((v) => v > 0).length;

  return (
    <Screen
      title={ch.title}
      subtitle={`${ch.exercise} · ${ch.sets > 1 ? `${ch.sets} séries` : '1 série'}`}
      back
      footer={
        view.todayState === 'today' && ch.status === 'active' ? (
          <Button label="Voir la séance du jour" onPress={() => router.push({ pathname: '/challenges/jour', params: { id, day: String(view.todayIndex) } })} />
        ) : null
      }
    >
      <Card tone="sand" style={{ gap: 8 }}>
        <ProgressBar value={view.summary.done / Math.max(1, activeDays)} label={`${view.summary.done} séances sur ${activeDays}`} />
        <AppText variant="caption">
          {view.summary.done} séances · {view.summary.rest} repos · jour {Math.min(Math.max(view.todayIndex, 0), ch.plan.length)} sur {ch.plan.length}
        </AppText>
      </Card>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
        {ch.plan.map((value, i) => {
          const day = i + 1;
          const state = cellState(ch.plan, day, view.todayIndex, records.get(day));
          const l = look(state);
          const isRest = value === 0 || state === 'rest';
          return (
            <Pressable
              key={day}
              accessibilityRole="button"
              accessibilityLabel={`Jour ${day}, ${dayLabel(dateForDay(ch.startDate, day))} : ${STATE_LABEL[state]}${isRest ? '' : `, ${formatAmount(value, ch.unit)}`}`}
              accessibilityHint={day <= view.todayIndex ? 'Touchez pour changer le statut' : undefined}
              onPress={() => onCell(day, state)}
              style={{ width: '15.3%', height: 66, borderRadius: 10, overflow: 'hidden', backgroundColor: l.bg, borderWidth: state === 'today' ? 2 : 1, borderColor: l.border }}
            >
              <View style={{ height: 18, backgroundColor: l.band, alignItems: 'center', justifyContent: 'center' }}>
                <AppText style={{ fontSize: 10.5, lineHeight: 13, fontFamily: 'Inter_600SemiBold' }} color={l.bandInk}>J{day}</AppText>
              </View>
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <AppText style={{ fontFamily: 'Inter_600SemiBold', fontSize: isRest ? 11 : 16, lineHeight: 20 }} color={l.ink}>
                  {isRest ? 'Repos' : formatAmount(value, ch.unit)}
                </AppText>
              </View>
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
      <AppText variant="caption" color={c.textMuted} center>
        Touchez un jour passé pour le marquer réalisé, non réalisé ou repos. Un jour manqué ne remet rien à zéro.
      </AppText>
      <Field label="Rappel quotidien">
        <TimeField label="Rappel" value={ch.reminderTime} onChange={(v) => mutate(({ well }) => well.setChallengeReminder(id, v))} optional />
      </Field>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        {ch.status === 'archived' ? (
          <Button
            style={{ flex: 1 }}
            label="Recommencer"
            variant="secondary"
            onPress={() => {
              const copy = mutate(({ well }) => well.restartChallenge(id, today));
              if (copy) router.replace({ pathname: '/challenges/[id]', params: { id: copy } });
            }}
          />
        ) : (
          <Button style={{ flex: 1 }} label={ch.status === 'paused' ? 'Reprendre' : 'Mettre en pause'} variant="outline" onPress={() => mutate(({ well }) => well.setChallengeStatus(id, ch.status === 'paused' ? 'active' : 'paused'))} />
        )}
        <Button
          style={{ flex: 1 }}
          label={ch.status === 'archived' ? 'Supprimer' : 'Archiver'}
          variant="danger"
          onPress={() =>
            ch.status === 'archived'
              ? Alert.alert('Supprimer ce challenge ?', 'Son historique sera effacé.', [
                  { text: 'Annuler', style: 'cancel' },
                  {
                    text: 'Supprimer',
                    style: 'destructive',
                    onPress: () => {
                      mutate(({ well }) => well.deleteChallenge(id));
                      router.back();
                    },
                  },
                ])
              : mutate(({ well }) => well.setChallengeStatus(id, 'archived'))
          }
        />
      </View>
    </Screen>
  );
}
