import { router } from 'expo-router';
import { Check, Settings2 } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { AppText, Card, ListRow, Screen } from '@/components/ui';
import { useData, useMutate } from '@/hooks/useData';
import { useNow } from '@/hooks/useNow';
import { useToday } from '@/hooks/useToday';
import { formatHijri, hijriOf } from '@/spiritualite/hijri';
import { formatCountdown, formatTime, nextPrayer, PRAYER_LABEL, prayerTimes } from '@/spiritualite/prayer';
import { useSettings } from '@/state/settings';
import { useTheme } from '@/theme/ThemeProvider';
import { MIN_TOUCH, palette } from '@/theme/tokens';
import { formatLongDate } from '@/utils/dates';

export default function Spiritualite() {
  const now = useNow();
  const today = useToday();
  const { c } = useTheme();
  const mutate = useMutate();
  const settings = useSettings((s) => s.prayer);
  const pagesGoal = useSettings((s) => s.quranPagesPerDay);
  const times = prayerTimes(now, settings);
  const next = nextPrayer(now, settings);
  const done = useData(({ well }) => well.prayersDone(today), [today]);
  const pagesToday = useData(({ well }) => well.quranLogs(today, today).reduce((s, l) => s + l.pages, 0), [today]);

  return (
    <Screen
      title="Ma spiritualité"
      back
      right={
        <Pressable accessibilityRole="button" accessibilityLabel="Réglages des horaires" onPress={() => router.push('/spiritualite/reglages')} style={{ width: MIN_TOUCH, height: MIN_TOUCH, alignItems: 'center', justifyContent: 'center' }}>
          <Settings2 size={22} color={c.primary} />
        </Pressable>
      }
    >
      <View style={{ borderRadius: 22, backgroundColor: palette.olive, padding: 18, gap: 4 }}>
        <AppText variant="caption" color="#FFFFFF" style={{ fontFamily: 'Inter_600SemiBold', letterSpacing: 1.6, textTransform: 'uppercase' }}>Prochaine prière</AppText>
        <AppText variant="display" color="#FFFFFF" style={{ fontSize: 40, lineHeight: 44 }}>
          {PRAYER_LABEL[next.name]} · {formatTime(next.at)}
        </AppText>
        <AppText color="#FFFFFF">dans {formatCountdown(next.at.getTime() - now.getTime())} · {settings.placeLabel}</AppText>
        <AppText variant="caption" color="#FFFFFF" style={{ marginTop: 6 }}>
          {formatHijri(hijriOf(now))} · {formatLongDate(now)}
        </AppText>
      </View>
      <Card style={{ paddingVertical: 4 }}>
        {times.map((p, i) => {
          const isDone = done.has(p.name);
          const isNext = p.name === next.name && next.at.getDate() === now.getDate();
          return (
            <View key={p.name} style={{ flexDirection: 'row', alignItems: 'center', minHeight: 50, borderBottomWidth: i === times.length - 1 ? 0 : 1, borderColor: c.border }}>
              <AppText style={[{ flex: 1 }, isNext && { fontFamily: 'Inter_600SemiBold', color: c.accent }]}>{PRAYER_LABEL[p.name]}</AppText>
              <AppText style={[{ fontVariant: ['tabular-nums'], marginRight: 8 }, isNext && { fontFamily: 'Inter_600SemiBold', color: c.accent }]}>{formatTime(p.at)}</AppText>
              <Pressable
                accessibilityRole="checkbox"
                accessibilityLabel={`${PRAYER_LABEL[p.name]} accomplie`}
                accessibilityState={{ checked: isDone }}
                onPress={() => mutate(({ well }) => well.togglePrayer(today, p.name, !isDone))}
                style={{ width: MIN_TOUCH, height: MIN_TOUCH, alignItems: 'center', justifyContent: 'center' }}
              >
                <View style={{ width: 24, height: 24, borderRadius: 12, borderWidth: 1.5, borderColor: isDone ? c.success : c.rest, backgroundColor: isDone ? c.success : 'transparent', alignItems: 'center', justifyContent: 'center' }}>
                  {isDone ? <Check size={14} color="#FFFFFF" strokeWidth={3} /> : null}
                </View>
              </Pressable>
            </View>
          );
        })}
      </Card>
      <AppText variant="caption" color={c.textMuted}>Le suivi des prières est facultatif et reste privé.</AppText>
      <Card style={{ paddingVertical: 4 }}>
        <ListRow label="Dhikr et compteur" value="libre ou routine" onPress={() => router.push('/spiritualite/dhikr')} />
        <ListRow label="Lecture du Coran" value={`${pagesToday} / ${pagesGoal} pages`} onPress={() => router.push('/spiritualite/coran')} />
        <ListRow label="Journal spirituel" onPress={() => router.push('/spiritualite/journal')} last />
      </Card>
    </Screen>
  );
}
