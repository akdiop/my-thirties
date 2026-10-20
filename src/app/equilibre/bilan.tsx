import { router } from 'expo-router';
import { useState } from 'react';

import { addDays, monthLabel } from '@/agenda/dates';
import { TextField } from '@/components/form/Field';
import { AppText, Button, Card, Screen } from '@/components/ui';
import { emotionTrends } from '@/equilibre/emotions';
import { useData, useMutate } from '@/hooks/useData';
import { useToday } from '@/hooks/useToday';

export default function Bilan() {
  const today = useToday();
  const month = today.slice(0, 7);
  const mutate = useMutate();
  const existing = useData(({ well }) => well.getReflection(month), [month]);
  const trends = useData(({ well }) => emotionTrends(well.listEmotions(500), `${month}-01`), [month]);
  const gratitudeDays = useData(({ well }) => well.listGratitude(31).filter((g) => g.date.startsWith(month)).length, [month]);
  const [f, setF] = useState({
    helped: existing?.helped ?? '',
    difficult: existing?.difficult ?? '',
    strategies: existing?.strategies ?? '',
    learnings: existing?.learnings ?? '',
    intentions: existing?.intentions ?? '',
  });
  const set = (k: keyof typeof f) => (v: string) => setF({ ...f, [k]: v });
  const clean = (v: string) => v.trim() || null;

  return (
    <Screen
      title="Bilan du mois"
      subtitle={monthLabel(today)}
      back
      footer={
        <Button
          label="Enregistrer"
          onPress={() => {
            mutate(({ well }) => well.saveReflection(month, { helped: clean(f.helped), difficult: clean(f.difficult), strategies: clean(f.strategies), learnings: clean(f.learnings), intentions: clean(f.intentions) }));
            router.back();
          }}
        />
      }
    >
      <Card tone="sage" style={{ gap: 4 }}>
        <AppText>{trends.total} entrées de journal émotionnel · {gratitudeDays} jours de gratitude</AppText>
        {trends.helpful.length ? <AppText>Stratégies qui ont aidé : {trends.helpful.map((h) => h.name.toLowerCase()).join(', ')}</AppText> : null}
        <AppText variant="caption">Repères qualitatifs, sans score.</AppText>
      </Card>
      <TextField label="Ce qui m’a aidée" value={f.helped} onChangeText={set('helped')} multiline maxLength={2000} />
      <TextField label="Ce qui reste difficile" value={f.difficult} onChangeText={set('difficult')} multiline maxLength={2000} />
      <TextField label="Les stratégies utiles" value={f.strategies} onChangeText={set('strategies')} multiline maxLength={2000} />
      <TextField label="Mes apprentissages" value={f.learnings} onChangeText={set('learnings')} multiline maxLength={2000} />
      <TextField label={`Mes intentions pour ${monthLabel(addDays(`${month}-01`, 32)).toLowerCase()}`} value={f.intentions} onChangeText={set('intentions')} multiline maxLength={2000} />
    </Screen>
  );
}
