import { router, useLocalSearchParams } from 'expo-router';
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
