import { router, useLocalSearchParams } from 'expo-router';
import { X } from 'lucide-react-native';
import { useState } from 'react';
import { Alert, Pressable, View } from 'react-native';

import { dayLabel } from '@/agenda/dates';
import { DateField, TimeField } from '@/components/form/DateTimeField';
import { Field, TextField } from '@/components/form/Field';
import { Stepper } from '@/components/form/Scale';
import { AppText, Button, Card, Checkbox, Screen } from '@/components/ui';
import { Segmented } from '@/components/ui/Segmented';
import { useData, useMutate } from '@/hooks/useData';
import { useToday } from '@/hooks/useToday';
import { passionStats } from '@/passions/passions';
import { useTheme } from '@/theme/ThemeProvider';
import { MIN_TOUCH } from '@/theme/tokens';

export default function Passion() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const today = useToday();
  const { c } = useTheme();
  const mutate = useMutate();
  const p = useData(({ life }) => life.getPassion(id), [id]);
  const steps = useData(({ life }) => life.passionSteps(id), [id]);
  const logs = useData(({ life }) => life.passionLogs(id), [id]);
  const [newStep, setNewStep] = useState('');
  const [logText, setLogText] = useState('');
  const [minutes, setMinutes] = useState(30);
  const [sessionDate, setSessionDate] = useState<string | null>(today);
  const [sessionTime, setSessionTime] = useState<string | null>('18:00');

  if (!p || p.deletedAt) return <Screen title="Passion" back><AppText>Passion introuvable.</AppText></Screen>;
  const stats = passionStats(logs, today);

  return (
    <Screen title={p.title} subtitle={`Parcours de ${p.horizonMonths} mois`} back>
      {p.why ? <AppText color={c.textMuted}>{p.why}</AppText> : null}
      <Segmented
        label="Statut"
        value={p.status}
        onChange={(status) => mutate(({ life }) => life.updatePassion(p.id, { status }))}
        options={[{ value: 'active', label: 'En cours' }, { value: 'paused', label: 'En pause' }, { value: 'done', label: 'Accomplie' }]}
      />
      <Card tone="sage" style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
        <View style={{ alignItems: 'center' }}>
          <AppText variant="number">{stats.monthMinutes}</AppText>
          <AppText variant="caption">min ce mois</AppText>
        </View>
        <View style={{ alignItems: 'center' }}>
          <AppText variant="number">{stats.sessions}</AppText>
          <AppText variant="caption">séances</AppText>
        </View>
        <View style={{ alignItems: 'center' }}>
          <AppText variant="number">{stats.weekStreak}</AppText>
          <AppText variant="caption">semaines d’affilée</AppText>
        </View>
      </Card>

      <Card style={{ gap: 8 }}>
        <AppText variant="cardTitle">Parcours</AppText>
        {steps.map((s) => (
          <View key={s.id} style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ flex: 1 }}>
              <Checkbox checked={!!s.doneAt} onChange={(v) => mutate(({ life }) => life.updatePassionStep(s.id, { doneAt: v ? today : null }))} label={s.title} />
              {s.targetDate ? <AppText variant="caption" color={!s.doneAt && s.targetDate < today ? c.accent : c.textMuted} style={{ marginLeft: 36 }}>Vers le {s.targetDate.split('-').reverse().join('/')}</AppText> : null}
            </View>
            <Pressable accessibilityRole="button" accessibilityLabel={`Supprimer ${s.title}`} onPress={() => mutate(({ life }) => life.deletePassionStep(s.id))} style={{ width: MIN_TOUCH, height: MIN_TOUCH, alignItems: 'center', justifyContent: 'center' }}>
              <X size={16} color={c.textMuted} />
            </Pressable>
          </View>
        ))}
        <TextField label="Nouvelle étape" value={newStep} onChangeText={setNewStep} maxLength={100} />
        <Button
          label="Ajouter l’étape"
          variant="outline"
          disabled={!newStep.trim()}
          onPress={() => {
            mutate(({ life }) => life.addPassionStep(p.id, newStep, null));
            setNewStep('');
          }}
        />
      </Card>

      <Card style={{ gap: 10 }}>
        <AppText variant="cardTitle">Journal</AppText>
        <TextField label="Ce que j’ai fait, appris, ressenti" value={logText} onChangeText={setLogText} multiline maxLength={2000} />
        <Field label="Durée">
          <Stepper label="Durée" value={minutes} onChange={setMinutes} min={0} max={480} step={15} suffix="min" />
        </Field>
        <Button
          label="Ajouter au journal"
          disabled={!logText.trim()}
          onPress={() => {
            mutate(({ life }) => life.addPassionLog(p.id, today, minutes || null, logText));
            setLogText('');
          }}
        />
        {logs.map((l) => (
          <View key={l.id} style={{ gap: 2 }}>
            <AppText variant="caption" color={c.textMuted}>{dayLabel(l.date)}{l.minutes ? ` · ${l.minutes} min` : ''}</AppText>
            <AppText>{l.text}</AppText>
          </View>
        ))}
      </Card>

      <Card tone="sand" style={{ gap: 10 }}>
        <AppText variant="cardTitle">Planifier une séance</AppText>
        <Field label="Date">
          <DateField label="Date de la séance" value={sessionDate} onChange={setSessionDate} />
        </Field>
        <TimeField label="Heure de la séance" value={sessionTime} onChange={setSessionTime} optional />
        <Button
          label="Ajouter à l’agenda"
          variant="secondary"
          disabled={!sessionDate}
          onPress={() => {
            if (!sessionDate) return;
            mutate(({ life }) => life.schedulePassionSession(p.id, sessionDate, sessionTime));
            Alert.alert('Séance ajoutée', 'Elle apparaît dans votre agenda.');
          }}
        />
      </Card>

      <Button
        label="Liste du matériel"
        variant="outline"
        onPress={() => {
          const listId = mutate(({ life }) => life.materialsList(p.id));
          router.push({ pathname: '/listes/[id]', params: { id: listId } });
        }}
      />
      <Button
        label="Supprimer cette passion"
        variant="danger"
        onPress={() =>
          Alert.alert('Supprimer cette passion ?', 'Le parcours et le journal seront effacés.', [
            { text: 'Annuler', style: 'cancel' },
            {
              text: 'Supprimer',
              style: 'destructive',
              onPress: () => {
                mutate(({ life }) => life.deletePassion(p.id));
                router.back();
              },
            },
          ])
        }
      />
    </Screen>
  );
}
