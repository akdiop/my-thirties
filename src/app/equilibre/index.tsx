import { router } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { addDays, daysBetween, dayLabel } from '@/agenda/dates';
import { CalmButton } from '@/components/CalmButton';
import { AppText, Card, ListRow, ProgressBar, Screen } from '@/components/ui';
import { Segmented } from '@/components/ui/Segmented';
import { AXES, CONTENT_NOTICE, PROGRAMS } from '@/equilibre/content';
import { emotionTrends } from '@/equilibre/emotions';
import { useData } from '@/hooks/useData';
import { useToday } from '@/hooks/useToday';
import { useTheme } from '@/theme/ThemeProvider';
import { MIN_TOUCH } from '@/theme/tokens';

type Tab = 'axes' | 'booster' | 'journal';

function Journal() {
  const today = useToday();
  const { c } = useTheme();
  const entries = useData(({ well }) => well.listEmotions(200));
  const trends = emotionTrends(entries, addDays(today, -30));
  return (
    <View style={{ gap: 12 }}>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Pressable accessibilityRole="button" onPress={() => router.push('/equilibre/gratitude')} style={{ flex: 1 }}>
          <Card tone="sand" style={{ gap: 4 }}>
            <AppText style={{ fontFamily: 'Inter_600SemiBold' }}>Gratitude</AppText>
            <AppText variant="caption">Trois choses positives aujourd’hui</AppText>
          </Card>
        </Pressable>
        <Pressable accessibilityRole="button" onPress={() => router.push('/equilibre/bilan')} style={{ flex: 1 }}>
          <Card tone="sand" style={{ gap: 4 }}>
            <AppText style={{ fontFamily: 'Inter_600SemiBold' }}>Bilan du mois</AppText>
            <AppText variant="caption">Ce qui m’a aidée, mes intentions</AppText>
          </Card>
        </Pressable>
      </View>
      {trends.total ? (
        <Card tone="sage" style={{ gap: 6 }}>
          <AppText style={{ fontFamily: 'Inter_600SemiBold' }}>Ces 30 derniers jours</AppText>
          <AppText>
            {trends.total} entrée{trends.total > 1 ? 's' : ''} · le plus souvent : {trends.emotions.slice(0, 2).map((e) => e.name.toLowerCase()).join(', ')}
          </AppText>
          {trends.triggers.length ? <AppText>Déclencheur qui revient : {trends.triggers.map((t) => t.name).join(', ')}</AppText> : null}
          {trends.helpful.length ? <AppText>Ce qui vous a aidée : {trends.helpful.map((h) => h.name.toLowerCase()).join(', ')}</AppText> : null}
          <AppText variant="caption">Ce sont des repères pour réfléchir, pas une évaluation.</AppText>
        </Card>
      ) : null}
      <Card style={{ paddingVertical: 4 }}>
        {entries.length ? (
          entries.slice(0, 30).map((e, i) => (
            <ListRow
              key={e.id}
              label={`${e.emotion} · ${e.intensity}/10`}
              value={dayLabel(e.at.slice(0, 10))}
              onPress={() => router.push({ pathname: '/equilibre/emotion/[id]', params: { id: e.id } })}
              last={i === Math.min(entries.length, 30) - 1}
            />
          ))
        ) : (
          <AppText color={c.textMuted} style={{ paddingVertical: 12 }}>Aucune entrée. Touchez + pour noter ce que vous ressentez.</AppText>
        )}
      </Card>
    </View>
  );
}

function Booster() {
  const today = useToday();
  const { c } = useTheme();
  const [length, setLength] = useState<7 | 14 | 30>(7);
  const progress = useData(
    ({ well }) =>
      PROGRAMS.map((p) => {
        const e = well.activeEnrollment(p.id);
        const day = e ? Math.min(p.days.length, daysBetween(e.startDate, today) + 1) : null;
        const steps = p.days.reduce((s, d) => s + d.steps.length, 0);
        const done = e ? well.programChecks(e.id).filter((x) => x.step >= 0).length : 0;
        return { p, day, ratio: done / steps };
      }),
    [today],
  );
  const shown = progress.filter(({ p, day }) => p.days.length === length || day !== null);
  return (
    <View style={{ gap: 12 }}>
      <Segmented
        label="Durée"
        value={String(length)}
        onChange={(v) => setLength(Number(v) as 7 | 14 | 30)}
        options={[{ value: '7', label: '7 jours' }, { value: '14', label: '14 jours' }, { value: '30', label: '30 jours' }]}
      />
      {shown.map(({ p, day, ratio }) => (
        <Pressable key={p.id} accessibilityRole="button" onPress={() => router.push({ pathname: '/equilibre/programme/[id]', params: { id: p.id } })}>
          <Card tone={day ? 'sage' : 'surface'} style={{ gap: 6 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <AppText variant="caption" style={{ fontFamily: 'Inter_600SemiBold', letterSpacing: 1.2, textTransform: 'uppercase' }}>Programme {p.days.length} jours</AppText>
              {day ? <AppText variant="caption" color={c.accent}>Jour {day}</AppText> : null}
            </View>
            <AppText variant="cardTitle">{p.title}</AppText>
            <AppText variant="caption">{p.objective}</AppText>
            {day ? <ProgressBar value={ratio} label={`${Math.round(ratio * 100)} % des exercices`} /> : null}
          </Card>
        </Pressable>
      ))}
    </View>
  );
}

export default function Equilibre() {
  const { c } = useTheme();
  const [tab, setTab] = useState<Tab>('axes');
  return (
    <Screen
      title="Mon équilibre"
      back
      right={
        tab === 'journal' ? (
          <Pressable accessibilityRole="button" accessibilityLabel="Nouvelle entrée" onPress={() => router.push({ pathname: '/equilibre/emotion/[id]', params: { id: 'nouveau' } })} style={{ width: MIN_TOUCH, height: MIN_TOUCH, alignItems: 'center', justifyContent: 'center' }}>
            <Plus size={24} color={c.primary} />
          </Pressable>
        ) : null
      }
    >
      <Segmented<Tab> label="Section" value={tab} onChange={setTab} options={[{ value: 'axes', label: 'Axes' }, { value: 'booster', label: 'Booster' }, { value: 'journal', label: 'Journal' }]} />
      {tab === 'axes' ? (
        <Card style={{ paddingVertical: 4 }}>
          {AXES.map((a, i) => (
            <ListRow key={a.id} label={a.title} value={a.priority ? 'Priorité' : undefined} onPress={() => router.push({ pathname: '/equilibre/axe/[id]', params: { id: a.id } })} last={i === AXES.length - 1} />
          ))}
        </Card>
      ) : tab === 'booster' ? (
        <Booster />
      ) : (
        <Journal />
      )}
      <CalmButton />
      <AppText variant="caption" color={c.textMuted}>{CONTENT_NOTICE}</AppText>
    </Screen>
  );
}
