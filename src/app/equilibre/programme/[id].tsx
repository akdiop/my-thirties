import { useLocalSearchParams } from 'expo-router';
import { Alert, View } from 'react-native';

import { daysBetween } from '@/agenda/dates';
import { TextField } from '@/components/form/Field';
import { AppText, Button, Card, Checkbox, Screen } from '@/components/ui';
import { programById } from '@/equilibre/content';
import { useData, useMutate } from '@/hooks/useData';
import { useToday } from '@/hooks/useToday';
import { useTheme } from '@/theme/ThemeProvider';

export default function Programme() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const p = programById(id);
  const today = useToday();
  const { c } = useTheme();
  const mutate = useMutate();
  const data = useData(({ well }) => {
    const e = well.activeEnrollment(id);
    return { e, checks: e ? well.programChecks(e.id) : [] };
  }, [id]);

  if (!p) {
    return (
      <Screen title="Programme introuvable" back>
        <AppText>Ce programme n’existe pas.</AppText>
      </Screen>
    );
  }
  const e = data.e;
  const current = e ? Math.min(p.days.length, daysBetween(e.startDate, today) + 1) : 0;
  const checked = (day: number, step: number) => data.checks.some((x) => x.day === day && x.step === step);
  const journal = (day: number) => data.checks.find((x) => x.day === day && x.step === -1)?.journal ?? '';

  return (
    <Screen
      title={p.title}
      subtitle={`${p.days.length} jours · ${p.objective}`}
      back
      footer={
        e ? (
          <Button
            label="Arrêter le programme"
            variant="outline"
            onPress={() =>
              Alert.alert('Arrêter ce programme ?', 'Vos réponses restent dans l’historique.', [
                { text: 'Annuler', style: 'cancel' },
                { text: 'Arrêter', onPress: () => mutate(({ well }) => well.endEnrollment(e.id, current >= p.days.length ? 'completed' : 'stopped')) },
              ])
            }
          />
        ) : (
          <Button label="Commencer aujourd’hui" onPress={() => mutate(({ well }) => well.enroll(id, today))} />
        )
      }
    >
      {p.days.map((d, i) => {
        const day = i + 1;
        const unlocked = !!e && day <= current;
        return (
          <Card key={day} tone={day === current ? 'sage' : 'surface'} style={{ gap: 6, opacity: unlocked || !e ? 1 : 0.55 }}>
            <AppText variant="caption" color={c.accent} style={{ fontFamily: 'Inter_600SemiBold' }}>Jour {day}{day === current ? ' · aujourd’hui' : ''}</AppText>
            <AppText style={{ fontFamily: 'Inter_600SemiBold' }}>{d.title}</AppText>
            {d.steps.map((s, j) =>
              unlocked ? (
                <Checkbox key={j} label={s} checked={checked(day, j)} onChange={(v) => mutate(({ well }) => well.toggleProgramStep(e!.id, day, j, v))} />
              ) : (
                <AppText key={j}>· {s}</AppText>
              ),
            )}
            <AppText variant="caption" color={c.textMuted}>{d.question}</AppText>
            {unlocked ? (
              <View>
                <TextField
                  label="Ma réponse"
                  defaultValue={journal(day)}
                  multiline
                  maxLength={2000}
                  onEndEditing={(ev) => {
                    const text = ev.nativeEvent.text.trim();
                    if (text !== journal(day)) mutate(({ well }) => well.saveProgramJournal(e!.id, day, text));
                  }}
                />
              </View>
            ) : null}
          </Card>
        );
      })}
    </Screen>
  );
}
