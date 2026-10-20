import { router } from 'expo-router';
import { useState } from 'react';

import { Chips } from '@/components/form/Chips';
import { DateField } from '@/components/form/DateTimeField';
import { Field, TextField } from '@/components/form/Field';
import { AppText, Button, Card, Screen } from '@/components/ui';
import { useMutate } from '@/hooks/useData';
import { useToday } from '@/hooks/useToday';
import { defaultPath } from '@/passions/passions';

export default function NouvellePassion() {
  const today = useToday();
  const mutate = useMutate();
  const [title, setTitle] = useState('');
  const [why, setWhy] = useState('');
  const [horizon, setHorizon] = useState<6 | 12>(6);
  const [start, setStart] = useState(today);

  return (
    <Screen
      title="Nouvelle passion"
      back
      footer={
        <Button
          label="Commencer le parcours"
          disabled={!title.trim()}
          onPress={() => {
            const id = mutate(({ life }) => life.createPassion(title, why.trim() || null, horizon, start));
            router.replace({ pathname: '/passions/[id]', params: { id } });
          }}
        />
      }
    >
      <TextField label="Passion" value={title} onChangeText={setTitle} maxLength={60} placeholder="Céramique, piano, photo…" />
      <TextField label="Pourquoi elle m’attire" value={why} onChangeText={setWhy} multiline maxLength={500} />
      <Field label="Durée du parcours">
        <Chips label="Durée du parcours" options={[{ value: 6 as const, label: '6 mois' }, { value: 12 as const, label: '12 mois' }]} value={horizon} onChange={setHorizon} />
      </Field>
      <Field label="Début">
        <DateField label="Début" value={start} onChange={(d) => d && setStart(d)} />
      </Field>
      <Card tone="sand" style={{ gap: 4 }}>
        <AppText style={{ fontFamily: 'Inter_600SemiBold' }}>Un jalon par mois, modifiable ensuite</AppText>
        {defaultPath(horizon, start).map((s, i) => (
          <AppText key={i} variant="caption">Mois {i + 1} · {s.title}</AppText>
        ))}
      </Card>
    </Screen>
  );
}
