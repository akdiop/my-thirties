import { router } from 'expo-router';
import { Pressable, View } from 'react-native';

import { CalmButton } from '@/components/CalmButton';
import { Scale } from '@/components/form/Scale';
import { AppText, Card, Screen } from '@/components/ui';
import { challengeView, formatAmount } from '@/features/challengeView';
import { useAgenda } from '@/features/agenda/useAgenda';
import { StepsCard } from '@/features/steps/StepsCard';
import { useData, useMutate } from '@/hooks/useData';
import { useNow } from '@/hooks/useNow';
import { useToday } from '@/hooks/useToday';
import { periodDays, predict } from '@/sante/cycle';
import { intensitySuggestion } from '@/sante/suggestion';
import { formatCountdown, formatTime, nextPrayer, PRAYER_LABEL } from '@/spiritualite/prayer';
import { useAppData } from '@/state/appData';
import { useSettings } from '@/state/settings';
import { useTheme } from '@/theme/ThemeProvider';
import { orderedModules } from '@/modules/registry';
import { dayLabel } from '@/agenda/dates';

export default function BienEtre() {
  const today = useToday();
  const now = useNow();
  const { c } = useTheme();
  const mutate = useMutate();
  const prayer = useSettings((s) => s.prayer);
  const healthForSport = useSettings((s) => s.healthForSport);
  const enabled = new Set(orderedModules(useAppData((s) => s.modules)).map((m) => m.module.id));

  const health = useData(({ well }) => well.getDailyHealth(today), [today]);
  const periods = useData(({ well }) => well.listPeriods());
  const challenges = useData(({ well }) => well.listChallenges('active').map((ch) => ({ ch, view: challengeView(ch, well.recordedStatuses(ch.id), today) })), [today]);
  const gratitude = useData(({ well }) => well.getGratitude(today), [today]);
  const sport = useAgenda(today, today).filter((i) => (i.kind === 'event' && i.category === 'sport') || i.kind === 'workout');

  const prediction = predict(periods, today);
  const inPeriod = periodDays(periods, today).has(today);
  const suggestion = healthForSport ? intensitySuggestion({ energy: health?.energy ?? null, pain: health?.pain ?? null, inPeriod }) : null;
  const next = nextPrayer(now, prayer);
  const todayChallenges = challenges.filter(({ view }) => view.todayState === 'today' || view.todayState === 'rest' || view.todayState === 'planned-rest');

  return (
    <Screen title="Bien-être" subtitle="Votre corps et votre esprit, aujourd’hui">
      <CalmButton />
      <View style={{ gap: 8 }}>
        <AppText variant="cardTitle">Comment vous sentez-vous ?</AppText>
        <Scale label="Humeur" value={health?.mood ?? null} onChange={(v) => mutate(({ well }) => well.saveDailyHealth(today, { mood: v }))} low="Difficile" high="Très bien" />
        <Pressable accessibilityRole="button" onPress={() => router.push({ pathname: '/equilibre/emotion/[id]', params: { id: 'nouveau' } })}>
          <AppText variant="label" color={c.primary} style={{ fontFamily: 'Inter_600SemiBold' }}>Écrire dans le journal émotionnel</AppText>
        </Pressable>
      </View>

      {suggestion ? (
        <Card tone="sage">
          <AppText>{suggestion.text}</AppText>
        </Card>
      ) : null}

      {enabled.has('sante') ? <StepsCard today={today} /> : null}

      {enabled.has('sport') ? (
        <Card style={{ gap: 8 }}>
          <AppText variant="cardTitle">Sport du jour</AppText>
          {sport.length ? (
            sport.map((s) => (
              <AppText key={s.key}>
                {s.kind === 'workout' ? '✓ ' : s.startTime ? `${s.startTime} · ` : ''}
                {s.title}
              </AppText>
            ))
          ) : (
            <AppText color={c.textMuted}>Rien de prévu.</AppText>
          )}
          <Pressable accessibilityRole="button" onPress={() => router.push('/sport')}>
            <AppText variant="label" color={c.primary} style={{ fontFamily: 'Inter_600SemiBold' }}>Mon sport</AppText>
          </Pressable>
        </Card>
      ) : null}

      {enabled.has('challenges') && todayChallenges.length ? (
        <View style={{ gap: 8 }}>
          <AppText variant="cardTitle">Challenges du jour</AppText>
          {todayChallenges.map(({ ch, view }) => {
            const rest = view.todayState !== 'today';
            return (
              <Pressable
                key={ch.id}
                accessibilityRole="button"
                onPress={() => (rest ? router.push({ pathname: '/challenges/[id]', params: { id: ch.id } }) : router.push({ pathname: '/challenges/jour', params: { id: ch.id, day: String(view.todayIndex) } }))}
              >
                <Card tone={rest ? 'surface' : 'sage'} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: rest ? c.restTint : c.secondary, alignItems: 'center', justifyContent: 'center' }}>
                    <AppText variant="label" color={rest ? c.primary : c.onSecondary}>{view.todayIndex}</AppText>
                  </View>
                  <View style={{ flex: 1 }}>
                    <AppText style={{ fontFamily: 'Inter_600SemiBold' }}>{ch.title}</AppText>
                    <AppText variant="caption">{rest ? 'Jour de repos, récupérez bien' : `${ch.sets} × ${formatAmount(view.todayValue ?? 0, ch.unit)}`}</AppText>
                  </View>
                </Card>
              </Pressable>
            );
          })}
        </View>
      ) : null}

      <View style={{ flexDirection: 'row', gap: 12 }}>
        {enabled.has('sante') ? (
          <Pressable accessibilityRole="button" onPress={() => router.push('/sante')} style={{ flex: 1 }}>
            <Card style={{ gap: 4, flex: 1 }}>
              <AppText variant="caption" color={c.textMuted}>Cycle</AppText>
              <AppText variant="number">{prediction ? `Jour ${prediction.cycleDay}` : '—'}</AppText>
              <AppText variant="caption">{prediction ? `Règles vers le ${dayLabel(prediction.nextStart)} (estimation)` : 'Suivi à commencer'}</AppText>
            </Card>
          </Pressable>
        ) : null}
        {enabled.has('spiritualite') ? (
          <Pressable accessibilityRole="button" onPress={() => router.push('/spiritualite')} style={{ flex: 1 }}>
            <Card style={{ gap: 4, flex: 1 }}>
              <AppText variant="caption" color={c.textMuted}>Prochaine prière</AppText>
              <AppText variant="number">{PRAYER_LABEL[next.name]} · {formatTime(next.at)}</AppText>
              <AppText variant="caption">dans {formatCountdown(next.at.getTime() - now.getTime())}</AppText>
            </Card>
          </Pressable>
        ) : null}
      </View>

      {enabled.has('equilibre') ? (
        <Pressable accessibilityRole="button" onPress={() => router.push('/equilibre/gratitude')}>
          <Card tone="sand" style={{ gap: 4 }}>
            <AppText style={{ fontFamily: 'Inter_600SemiBold' }}>Gratitude</AppText>
            <AppText variant="caption">{gratitude?.things.length ? `${gratitude.things.length} chose(s) notée(s) aujourd’hui` : 'Trois choses positives de la journée ?'}</AppText>
          </Card>
        </Pressable>
      ) : null}
    </Screen>
  );
}
