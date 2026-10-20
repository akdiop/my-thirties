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
          <AppText variant="caption" color={c.textMuted}>Vous pouvez planifier des journées de repos et adapter chaque séance. Aucun jour manqué n'efface votre progression.</AppText>
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
    </Screen>
  );
}
