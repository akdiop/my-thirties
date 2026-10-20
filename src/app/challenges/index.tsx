import { router } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { proposals } from '@/challenges/challenges';
import { AppText, Button, Card, ProgressBar, Screen } from '@/components/ui';
import { Segmented } from '@/components/ui/Segmented';
import { challengeView, formatAmount } from '@/features/challengeView';
import { useData, useMutate } from '@/hooks/useData';
import { useToday } from '@/hooks/useToday';
import { useTheme } from '@/theme/ThemeProvider';
import { MIN_TOUCH } from '@/theme/tokens';

export default function Challenges() {
  const today = useToday();
  const { c } = useTheme();
  const mutate = useMutate();
  const [tab, setTab] = useState<'active' | 'archived'>('active');
  const list = useData(
    ({ well }) =>
      well
        .listChallenges()
        .filter((ch) => (tab === 'active' ? ch.status !== 'archived' : ch.status === 'archived'))
        .map((ch) => ({ ch, view: challengeView(ch, well.recordedStatuses(ch.id), today) })),
    [tab, today],
  );
  const active = useData(({ well }) => well.listChallenges().filter((ch) => ch.status === 'active'));
  const recent = useData(
    ({ well }) => {
      const done = well.listChallenges().map((ch) => challengeView(ch, well.recordedStatuses(ch.id), today).summary);
      const elapsed = done.reduce((s, x) => s + x.elapsed - x.rest, 0);
      return elapsed > 0 ? done.reduce((s, x) => s + x.done, 0) / elapsed : null;
    },
    [today],
  );
  const ideas = proposals(active.map((a) => a.templateId ?? ''), recent);

  return (
    <Screen
      title="Mes challenges"
      back
      right={
        <Pressable accessibilityRole="button" accessibilityLabel="Nouveau challenge" onPress={() => router.push('/challenges/nouveau')} style={{ width: MIN_TOUCH, height: MIN_TOUCH, alignItems: 'center', justifyContent: 'center' }}>
          <Plus size={24} color={c.primary} />
        </Pressable>
      }
    >
      <Segmented label="Challenges" value={tab} onChange={setTab} options={[{ value: 'active', label: 'En cours' }, { value: 'archived', label: 'Archives' }]} />
      {list.map(({ ch, view }) => (
        <Pressable key={ch.id} accessibilityRole="button" onPress={() => router.push({ pathname: '/challenges/[id]', params: { id: ch.id } })}>
          <Card tone={view.todayState === 'today' ? 'sage' : 'surface'} style={{ gap: 8 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <AppText variant="cardTitle" style={{ flex: 1 }}>{ch.title}</AppText>
              {ch.status === 'paused' ? <AppText variant="caption" color={c.textMuted}>En pause</AppText> : null}
            </View>
            <ProgressBar value={view.summary.done / Math.max(1, view.summary.total - ch.plan.filter((v) => v === 0).length)} label={`${view.summary.done} séances réalisées`} />
            <AppText variant="caption" color={c.accent} style={{ fontFamily: 'Inter_600SemiBold' }}>
              {view.notStarted
                ? 'Commence bientôt'
                : view.finished
                  ? `Terminé · ${view.summary.done} séances`
                  : view.todayState === 'rest' || view.todayState === 'planned-rest'
                    ? `Jour ${view.todayIndex} · repos`
                    : `Jour ${view.todayIndex} · ${formatAmount(view.todayValue ?? 0, ch.unit)} ${ch.unit === 'reps' ? ch.exercise.toLowerCase() : ''}`}
            </AppText>
          </Card>
        </Pressable>
      ))}
      {!list.length ? <AppText color={c.textMuted}>{tab === 'active' ? 'Aucun challenge en cours.' : 'Aucun challenge archivé.'}</AppText> : null}
      {tab === 'active' && ideas.length ? (
        <View style={{ gap: 8 }}>
          <AppText variant="cardTitle">Propositions du mois</AppText>
          {ideas.map(({ template, easier, reason }) => (
            <Card key={template.id} style={{ gap: 6 }}>
              <AppText style={{ fontFamily: 'Inter_600SemiBold' }}>{template.title}</AppText>
              <AppText variant="caption" color={c.textMuted}>{reason}</AppText>
              <Button
                label="Commencer aujourd’hui"
                variant="outline"
                onPress={() => {
                  const id = mutate(({ well }) => well.startChallenge(template.id, today, easier));
                  router.push({ pathname: '/challenges/[id]', params: { id } });
                }}
              />
            </Card>
          ))}
        </View>
      ) : null}
    </Screen>
  );
}
