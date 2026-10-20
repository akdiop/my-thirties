import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';

import { Chips } from '@/components/form/Chips';
import { AppText, Button, Card, ProgressBar, Screen } from '@/components/ui';
import { Segmented } from '@/components/ui/Segmented';
import { useData, useMutate } from '@/hooks/useData';
import { useToday } from '@/hooks/useToday';
import { useTheme } from '@/theme/ThemeProvider';
import { radius } from '@/theme/tokens';

const disciplines = [
  { value: 'tennis', label: 'Tennis' }, { value: 'pilates', label: 'Pilates' },
  { value: 'yoga', label: 'Yoga' }, { value: 'mobilite', label: 'Mobilité' },
  { value: 'autre', label: 'Autre' },
];

export default function Challenges() {
  const { c } = useTheme();
  const today = useToday();
  const mutate = useMutate();
  const [title, setTitle] = useState('');
  const [discipline, setDiscipline] = useState('pilates');
  const [days, setDays] = useState<'7' | '14' | '30'>('30');
  const [creating, setCreating] = useState(false);
  const challenges = useData(({ wellbeing }) =>
    wellbeing.listChallenges().map((item) => ({ ...item, records: wellbeing.listDays(item.id) })));

  const create = () => {
    if (!title.trim()) return;
    const id = mutate(({ wellbeing }) => wellbeing.createChallenge(title, discipline, today, Number(days)));
    setTitle('');
    setCreating(false);
    router.push({ pathname: '/challenges/[id]', params: { id } });
  };

  return (
    <Screen title="Mes challenges" subtitle="Avancer à mon rythme, sans pression" back>
      <Button label={creating ? 'Fermer' : '+ Nouveau challenge'} onPress={() => setCreating(!creating)} variant="secondary" />
      {creating ? (
        <Card style={{ gap: 12 }}>
          <AppText variant="cardTitle">Mon programme</AppText>
          <TextInput accessibilityLabel="Nom du challenge" placeholder="Nom du challenge"
            placeholderTextColor={c.textMuted} value={title} onChangeText={setTitle} maxLength={80}
            style={{ minHeight: 48, borderWidth: 1, borderColor: c.border, borderRadius: radius.md, color: c.text, paddingHorizontal: 12 }} />
          <AppText variant="label">Activité</AppText>
          <Chips label="Activité" value={discipline} onChange={setDiscipline} options={disciplines} />
          <AppText variant="label">Durée</AppText>
          <Segmented label="Durée" value={days} onChange={setDays} options={[
            { value: '7', label: '7 jours' }, { value: '14', label: '14 jours' }, { value: '30', label: '30 jours' },
          ]} />
          <Button label="Créer mon challenge" onPress={create} disabled={!title.trim()} />
          <AppText variant="caption" color={c.textMuted}>Vous pouvez planifier des journées de repos et adapter chaque séance. Aucun jour manqué n’efface votre progression.</AppText>
        </Card>
      ) : null}
      {challenges.map((item) => {
        const done = item.records.filter((r) => r.state === 'done').length;
        const rest = item.records.filter((r) => r.state === 'rest').length;
        return (
          <Pressable key={item.id} accessibilityRole="button" onPress={() => router.push({ pathname: '/challenges/[id]', params: { id: item.id } })}>
            <Card style={{ gap: 10 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <AppText variant="cardTitle">{item.title}</AppText>
                <AppText variant="caption" color={c.textMuted}>{item.discipline}</AppText>
              </View>
              <ProgressBar value={done / item.days} label={done + ' journées réalisées sur ' + item.days} />
              <AppText variant="caption" color={c.textMuted}>{done} réalisées · {rest} repos · {item.days} jours au total</AppText>
              <AppText variant="label" color={c.accent}>{item.status === 'archived' ? 'Archivé' : item.status === 'completed' ? 'Terminé' : 'Voir mon calendrier →'}</AppText>
            </Card>
          </Pressable>
        );
      })}
      {!challenges.length ? <AppText color={c.textMuted}>Aucun challenge pour le moment. Créez votre premier programme.</AppText> : null}
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
