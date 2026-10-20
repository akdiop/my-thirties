import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { dayLabel } from '@/agenda/dates';
import { TextField } from '@/components/form/Field';
import { AppText, Button, Card, Screen } from '@/components/ui';
import { useData, useMutate } from '@/hooks/useData';
import { useToday } from '@/hooks/useToday';
import { useTheme } from '@/theme/ThemeProvider';

export default function Gratitude() {
  const today = useToday();
  const { c } = useTheme();
  const mutate = useMutate();
  const entry = useData(({ well }) => well.getGratitude(today), [today]);
  const history = useData(({ well }) => well.listGratitude(14));
  const [things, setThings] = useState<string[]>(entry?.things.length ? [...entry.things, '', '', ''].slice(0, 3) : ['', '', '']);
  const [f, setF] = useState({
    learned: entry?.learned ?? '',
    success: entry?.success ?? '',
    reflection: entry?.reflection ?? '',
    intention: entry?.intention ?? '',
    freeText: entry?.freeText ?? '',
  });
  const set = (k: keyof typeof f) => (v: string) => setF({ ...f, [k]: v });
  const clean = (v: string) => v.trim() || null;

  return (
    <Screen
      title="Gratitude"
      subtitle={dayLabel(today)}
      back
      footer={
        <Button
          label="Enregistrer"
          onPress={() => {
            mutate(({ well }) =>
              well.saveGratitude(today, {
                things: things.map((t) => t.trim()).filter(Boolean),
                learned: clean(f.learned),
                success: clean(f.success),
                reflection: clean(f.reflection),
                intention: clean(f.intention),
                freeText: clean(f.freeText),
              }),
            );
            router.back();
          }}
        />
      }
    >
      {things.map((t, i) => (
        <TextField key={i} label={`Chose positive ${i + 1}`} value={t} onChangeText={(v) => setThings(things.map((x, j) => (j === i ? v : x)))} maxLength={200} />
      ))}
      <TextField label="Ce que j’ai appris" value={f.learned} onChangeText={set('learned')} maxLength={500} />
      <TextField label="Une réussite" value={f.success} onChangeText={set('success')} maxLength={500} />
      <TextField label="Une réflexion" value={f.reflection} onChangeText={set('reflection')} multiline maxLength={1000} />
      <TextField label="Mon intention pour demain" value={f.intention} onChangeText={set('intention')} maxLength={300} />
      <TextField label="Écriture libre" value={f.freeText} onChangeText={set('freeText')} multiline maxLength={4000} />
      {history.filter((h) => h.date !== today).length ? (
        <View style={{ gap: 8 }}>
          <AppText variant="cardTitle">Jours précédents</AppText>
          {history
            .filter((h) => h.date !== today)
            .map((h) => (
              <Card key={h.id} style={{ gap: 4 }}>
                <AppText variant="caption" color={c.textMuted}>{dayLabel(h.date)}</AppText>
                {h.things.map((t, i) => (
                  <AppText key={i}>· {t}</AppText>
                ))}
              </Card>
            ))}
        </View>
      ) : null}
    </Screen>
  );
}
