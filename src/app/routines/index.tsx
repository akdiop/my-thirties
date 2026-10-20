import { router } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { describeWeekdays, isScheduledOn, routineKind, routineProgress } from '@/agenda/routines';
import { AppText, Card, ProgressBar, Screen } from '@/components/ui';
import { useData } from '@/hooks/useData';
import { useToday } from '@/hooks/useToday';
import { useTheme } from '@/theme/ThemeProvider';
import { MIN_TOUCH } from '@/theme/tokens';

export default function Routines() {
  const today = useToday();
  const { c } = useTheme();
  const routines = useData(
    ({ org }) =>
      org.listRoutines().map((r) => {
        const items = org.listRoutineItems(r.id);
        return { ...r, progress: routineProgress(items.map((i) => i.id), org.checksFor(r.id, today)) };
      }),
    [today],
  );

  return (
    <Screen
      title="Mes routines"
      back
      right={
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Nouvelle routine"
          onPress={() => router.push({ pathname: '/routines/edition/[id]', params: { id: 'nouveau' } })}
          style={{ width: MIN_TOUCH, height: MIN_TOUCH, alignItems: 'center', justifyContent: 'center' }}
        >
          <Plus size={24} color={c.primary} />
        </Pressable>
      }
    >
      {routines.length ? (
        routines.map((r) => {
          const active = isScheduledOn(r.weekdays, today);
          return (
            <Pressable key={r.id} accessibilityRole="button" onPress={() => router.push({ pathname: '/routines/[id]', params: { id: r.id, date: today } })}>
              <Card tone={active ? 'sage' : 'surface'} style={{ gap: 8 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <AppText variant="cardTitle">{r.name}</AppText>
                  <AppText variant="caption" color={c.textMuted}>{routineKind(r.kind).label}</AppText>
                </View>
                <AppText variant="caption" color={c.textMuted}>
                  {describeWeekdays(r.weekdays)}
                  {r.time ? ` · ${r.time}` : ''}
                </AppText>
                {active ? (
                  <>
                    <ProgressBar value={r.progress.ratio} label={`${r.progress.done} sur ${r.progress.total}`} />
                    <AppText variant="caption" color={c.accent} style={{ fontFamily: 'Inter_600SemiBold' }}>
                      Aujourd’hui : {r.progress.done} / {r.progress.total}
                    </AppText>
                  </>
                ) : (
                  <AppText variant="caption" color={c.textMuted}>Pas prévue aujourd’hui</AppText>
                )}
              </Card>
            </Pressable>
          );
        })
      ) : (
        <AppText color={c.textMuted}>Aucune routine. Touchez + pour créer votre routine du matin, du soir ou une routine personnalisée.</AppText>
      )}
    </Screen>
  );
}
