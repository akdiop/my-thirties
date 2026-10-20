import { Footprints } from 'lucide-react-native';
import { Alert, View } from 'react-native';

import { weekdayShort } from '@/agenda/dates';
import { AppText, Button, Card, ProgressBar } from '@/components/ui';
import { useSession } from '@/db/DatabaseProvider';
import { formatSteps, stepAverage, stepProgress } from '@/sante/steps';
import { useSettings } from '@/state/settings';
import { useTheme } from '@/theme/ThemeProvider';
import { enableSteps, useSteps } from './useSteps';

export function StepsCard({ today, detailed }: { today: string; detailed?: boolean }) {
  const { c } = useTheme();
  const { repo } = useSession();
  const goal = useSettings((s) => s.stepGoal);
  const set = useSettings((s) => s.set);
  const { enabled, today: steps, week, error } = useSteps(today);

  if (!enabled) {
    return (
      <Card style={{ gap: 8 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Footprints size={20} color={c.primary} />
          <AppText style={{ fontFamily: 'Inter_600SemiBold' }}>Compteur de pas</AppText>
        </View>
        <AppText variant="caption">Affichez les pas comptés par votre iPhone. Rien ne quitte le téléphone.</AppText>
        <Button
          label="Activer"
          variant="outline"
          onPress={async () => {
            const result = await enableSteps();
            if (result === 'granted') {
              set('stepsEnabled', true);
              repo.saveSetting('stepsEnabled', true);
            } else {
              Alert.alert(
                result === 'unavailable' ? 'Compteur indisponible' : 'Accès refusé',
                result === 'unavailable' ? 'Cet appareil ne compte pas les pas.' : 'Autorisez « Mouvements et forme » dans Réglages › My thirties.',
              );
            }
          }}
        />
      </Card>
    );
  }

  const p = stepProgress(steps, goal);
  const avg = stepAverage(week.slice(1));
  const max = Math.max(goal, ...week.map((d) => d.steps ?? 0));

  return (
    <Card tone={p?.reached ? 'sage' : 'surface'} style={{ gap: 8 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Footprints size={20} color={c.primary} />
        <AppText style={{ fontFamily: 'Inter_600SemiBold', flex: 1 }}>Pas aujourd’hui</AppText>
        <AppText variant="caption" color={c.textMuted}>objectif {formatSteps(goal)}</AppText>
      </View>
      {error ? (
        <AppText variant="caption" color={c.danger}>{error}</AppText>
      ) : (
        <>
          <AppText variant="number" style={{ fontSize: 28, lineHeight: 34 }}>{p ? formatSteps(p.steps) : '…'}</AppText>
          {p ? <ProgressBar value={p.ratio} label={`${formatSteps(p.steps)} pas sur ${formatSteps(goal)}`} /> : null}
          {avg !== null ? <AppText variant="caption">Moyenne des 6 jours précédents : {formatSteps(avg)}</AppText> : null}
        </>
      )}
      {detailed && week.length ? (
        <View accessible accessibilityLabel={`Pas des 7 derniers jours : ${week.map((d) => `${weekdayShort(d.date)} ${d.steps ?? 'inconnu'}`).join(', ')}`} style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 6, height: 96, marginTop: 6 }}>
          {[...week].reverse().map((d) => (
            <View key={d.date} style={{ flex: 1, alignItems: 'center', gap: 4 }}>
              <View style={{ width: '70%', height: Math.max(4, ((d.steps ?? 0) / max) * 70), borderRadius: 4, backgroundColor: (d.steps ?? 0) >= goal ? c.success : c.rest }} />
              <AppText variant="caption" color={c.textMuted}>{weekdayShort(d.date)}</AppText>
            </View>
          ))}
        </View>
      ) : null}
    </Card>
  );
}
