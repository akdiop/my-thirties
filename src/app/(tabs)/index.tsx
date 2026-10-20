import { router } from 'expo-router';
import { Sparkles } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { isScheduledOn, routineProgress } from '@/agenda/routines';
import { dailyPriorities } from '@/agenda/tasks';
import { CalmButton } from '@/components/CalmButton';
import { AppText, Card, Checkbox, ProgressBar, Screen } from '@/components/ui';
import { AgendaItemRow } from '@/features/agenda/AgendaItemRow';
import { challengeView, formatAmount } from '@/features/challengeView';
import { BudgetCard } from '@/features/finances/BudgetCard';
import { useAgenda } from '@/features/agenda/useAgenda';
import { Avatar } from '@/features/profile/Avatar';
import { useData, useMutate } from '@/hooks/useData';
import { birthdayLine } from '@/profile/profile';
import { useToday } from '@/hooks/useToday';
import { useAppData } from '@/state/appData';
import { useTheme } from '@/theme/ThemeProvider';
import { formatLongDate, greeting } from '@/utils/dates';

function SectionTitle({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  const { c } = useTheme();
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
      <AppText variant="cardTitle">{title}</AppText>
      {action ? (
        <Pressable accessibilityRole="button" onPress={onAction} hitSlop={12}>
          <AppText variant="label" color={c.primary} style={{ fontFamily: 'Inter_600SemiBold' }}>{action}</AppText>
        </Pressable>
      ) : null}
    </View>
  );
}

export default function Accueil() {
  const profile = useAppData((s) => s.profile);
  const financesOn = useAppData((s) => s.modules.find((m) => m.moduleId === 'finances')?.enabled ?? true);
  const today = useToday();
  const { c } = useTheme();
  const mutate = useMutate();
  const now = new Date();
  const evening = now.getHours() >= 18;

  const agenda = useAgenda(today, today);
  const tasks = useData(({ org }) => org.listTasks());
  const priorities = dailyPriorities(tasks, today);
  const doneToday = tasks.filter((t) => t.completedAt && t.completedAt.slice(0, 10) === today).length;
  const routines = useData(
    ({ org }) =>
      org
        .listRoutines()
        .filter((r) => isScheduledOn(r.weekdays, today))
        .map((r) => ({ ...r, progress: routineProgress(org.listRoutineItems(r.id).map((i) => i.id), org.checksFor(r.id, today)) })),
    [today],
  );

  const challenges = useData(
    ({ well }) =>
      well
        .listChallenges('active')
        .map((ch) => ({ ch, view: challengeView(ch, well.recordedStatuses(ch.id), today) }))
        .filter(({ view }) => view.todayState === 'today')
        .map(({ ch, view }) => `${ch.title} · ${ch.sets} × ${formatAmount(view.todayValue ?? 0, ch.unit)}`),
    [today],
  );

  return (
    <Screen
      title={`${greeting(now)}, ${profile?.firstName ?? ''}`}
      subtitle={[formatLongDate(now, profile?.timezone), birthdayLine(profile?.birthDate ?? null, now)].filter(Boolean).join(' · ')}
      right={
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Sparkles size={22} color={c.primary} accessibilityLabel="Assistant, prévu en phase 5" />
          <Pressable accessibilityRole="button" accessibilityLabel="Mon profil" onPress={() => router.push('/mon-profil')}>
            <Avatar photo={profile?.photoUri} name={profile?.firstName} size={40} />
          </Pressable>
        </View>
      }
    >
      <CalmButton />

      {evening ? (
        <Card tone="sage" style={{ gap: 8 }}>
          <AppText variant="cardTitle">Bilan du soir</AppText>
          <AppText>
            {doneToday ? `${doneToday} tâche${doneToday > 1 ? 's' : ''} terminée${doneToday > 1 ? 's' : ''} aujourd’hui.` : 'Aucune tâche cochée aujourd’hui, et c’est très bien aussi.'}
          </AppText>
          <Pressable accessibilityRole="button" onPress={() => router.push('/taches')}>
            <AppText variant="label" color={c.accent} style={{ fontFamily: 'Inter_600SemiBold' }}>Préparer demain</AppText>
          </Pressable>
        </Card>
      ) : null}

      <Card tone="sand" style={{ gap: 10 }}>
        <SectionTitle title="Votre journée" action="Agenda" onAction={() => router.navigate('/agenda')} />
        {agenda.length ? (
          agenda.slice(0, 5).map((item) => <AgendaItemRow key={item.key} item={item} />)
        ) : (
          <AppText>Journée libre pour l’instant.</AppText>
        )}
        {agenda.length > 5 ? <AppText variant="caption">et {agenda.length - 5} autre(s)</AppText> : null}
      </Card>

      <View style={{ gap: 8 }}>
        <SectionTitle title="Mes 3 priorités" action="Tâches" onAction={() => router.push('/taches')} />
        <Card style={{ paddingVertical: 4 }}>
          {priorities.length ? (
            priorities.map((t) => (
              <Checkbox key={t.id} label={t.title} checked={!!t.completedAt} onChange={(v) => mutate(({ org }) => (v ? org.completeTask(t, today) : org.reopenTask(t.id, today)))} />
            ))
          ) : (
            <AppText color={c.textMuted} style={{ paddingVertical: 12 }}>
              Aucune priorité choisie. Ouvrez une tâche et touchez « Priorité du jour ».
            </AppText>
          )}
        </Card>
      </View>

      {routines.map((r) => (
        <Pressable key={r.id} accessibilityRole="button" onPress={() => router.push({ pathname: '/routines/[id]', params: { id: r.id, date: today } })}>
          <Card style={{ gap: 8 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <AppText style={{ fontFamily: 'Inter_600SemiBold' }}>{r.name}</AppText>
              <AppText variant="caption" color={c.accent}>{r.progress.done} / {r.progress.total}</AppText>
            </View>
            <ProgressBar value={r.progress.ratio} label={`${r.name} : ${r.progress.done} sur ${r.progress.total}`} />
          </Card>
        </Pressable>
      ))}

      {challenges.length ? (
        <Pressable accessibilityRole="button" onPress={() => router.navigate('/bien-etre')}>
          <Card tone="sage" style={{ gap: 4 }}>
            <AppText style={{ fontFamily: 'Inter_600SemiBold' }}>Challenges du jour</AppText>
            <AppText variant="caption">{challenges.join(' · ')}</AppText>
          </Card>
        </Pressable>
      ) : null}
      {financesOn ? <BudgetCard today={today} /> : null}
    </Screen>
  );
}
