import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { AppText, Button, Card, Screen } from '@/components/ui';
import { useMutate } from '@/hooks/useData';
import { useToday } from '@/hooks/useToday';
import { currentDhikr, DHIKR, DHIKR_ROUTINES, startCounter, tap, type CounterState } from '@/spiritualite/dhikr';
import { useTheme } from '@/theme/ThemeProvider';
import { palette } from '@/theme/tokens';

export default function Dhikr() {
  const { c } = useTheme();
  const today = useToday();
  const mutate = useMutate();
  const [state, setState] = useState<CounterState | null>(null);

  const finish = () => {
    if (state && state.total > 0) mutate(({ well }) => well.saveDhikr(today, state.routineId, state.total));
    setState(null);
  };

  if (!state) {
    return (
      <Screen title="Compteur de dhikr" subtitle="Choisissez votre mode" back>
        <Pressable accessibilityRole="button" onPress={() => setState(startCounter(null))} style={{ borderRadius: 22, backgroundColor: palette.olive, padding: 18, gap: 4 }}>
          <AppText style={{ fontFamily: 'Inter_600SemiBold', fontSize: 17 }} color="#FFFFFF">Mode libre</AppText>
          <AppText color="#FFFFFF">Compter sans limite ni formule imposée</AppText>
        </Pressable>
        {DHIKR_ROUTINES.map((r) => (
          <Pressable key={r.id} accessibilityRole="button" onPress={() => setState(startCounter(r.id))}>
            <Card style={{ gap: 10 }}>
              <AppText variant="cardTitle">{r.name}</AppText>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                {r.steps.map(([id, n], i) => (
                  <View key={i} style={{ paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, backgroundColor: c.successTint }}>
                    <AppText variant="label" color={c.accent}>{n}× {DHIKR[id].phrase}</AppText>
                  </View>
                ))}
              </View>
            </Card>
          </Pressable>
        ))}
      </Screen>
    );
  }

  const { routine, id, goal } = currentDhikr(state);
  const d = DHIKR[id];
  const onTap = () => {
    const next = tap(state);
    if (next.reachedGoal) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    else Haptics.selectionAsync();
    setState(next);
  };

  return (
    <Screen
      title={routine ? routine.name : 'Mode libre'}
      back
      footer={
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Button style={{ flex: 1 }} label="Remettre à zéro" variant="outline" onPress={() => setState(startCounter(state.routineId))} />
          <Button style={{ flex: 1 }} label="Terminer" variant="secondary" onPress={finish} />
        </View>
      }
    >
      {routine ? (
        <View style={{ flexDirection: 'row', gap: 6, justifyContent: 'center' }}>
          {routine.steps.map((_, i) => (
            <View key={i} style={{ width: 28, height: 5, borderRadius: 3, backgroundColor: i < state.step || state.done ? c.success : i === state.step ? c.primary : c.surfaceAlt }} />
          ))}
        </View>
      ) : (
        <AppText variant="caption" center>Ou choisissez la formule à répéter :</AppText>
      )}
      <View style={{ alignItems: 'center', gap: 4, marginTop: 8 }}>
        <AppText style={{ fontSize: 34, lineHeight: 50, writingDirection: 'rtl' }}>{d.arabic}</AppText>
        <AppText variant="screenTitle">{d.phrase}</AppText>
        <AppText color={c.textMuted}>{d.meaning}</AppText>
      </View>
      <View style={{ alignItems: 'center', marginTop: 12 }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Compter. ${state.count}${goal ? ` sur ${goal}` : ''}`}
          onPress={onTap}
          style={({ pressed }) => ({ width: 236, height: 236, borderRadius: 118, backgroundColor: c.successTint, alignItems: 'center', justifyContent: 'center', transform: [{ scale: pressed ? 0.97 : 1 }] })}
        >
          <View style={{ width: 176, height: 176, borderRadius: 88, backgroundColor: palette.olive, alignItems: 'center', justifyContent: 'center' }}>
            <AppText color="#FFFFFF" style={{ fontSize: 54, lineHeight: 60, fontFamily: 'Inter_600SemiBold', fontVariant: ['tabular-nums'] }}>{state.count}</AppText>
            <AppText color="#FFFFFF">{goal ? `sur ${goal}` : 'sans limite'}</AppText>
          </View>
        </Pressable>
      </View>
      <AppText variant="caption" center color={c.textMuted}>Total de la séance : {state.total}</AppText>
      {state.done ? (
        <Card tone="sage">
          <AppText center style={{ fontFamily: 'Inter_600SemiBold' }}>Routine terminée</AppText>
        </Card>
      ) : null}
    </Screen>
  );
}
