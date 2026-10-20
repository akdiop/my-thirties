import { Trash2 } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { addDays, dayLabel } from '@/agenda/dates';
import { Field, TextField } from '@/components/form/Field';
import { Stepper } from '@/components/form/Scale';
import { AppText, Button, Card, ProgressBar, Screen } from '@/components/ui';
import { useData, useMutate } from '@/hooks/useData';
import { useSession } from '@/db/DatabaseProvider';
import { useToday } from '@/hooks/useToday';
import { useSettings } from '@/state/settings';
import { useTheme } from '@/theme/ThemeProvider';
import { MIN_TOUCH } from '@/theme/tokens';

const MUSHAF_PAGES = 604;

export default function Coran() {
  const today = useToday();
  const { c } = useTheme();
  const mutate = useMutate();
  const { repo } = useSession();
  const goal = useSettings((s) => s.quranPagesPerDay);
  const setSetting = useSettings((s) => s.set);
  const logs = useData(({ well }) => well.quranLogs(addDays(today, -29), today), [today]);
  const total = useData(({ well }) => well.quranLogs('0000-01-01', today).reduce((s, l) => s + l.pages, 0), [today]);
  const [pages, setPages] = useState(goal);
  const [note, setNote] = useState('');
  const todayPages = logs.filter((l) => l.date === today).reduce((s, l) => s + l.pages, 0);
  const week = logs.filter((l) => l.date > addDays(today, -7)).reduce((s, l) => s + l.pages, 0);

  return (
    <Screen title="Lecture du Coran" back>
      <Card tone="sage" style={{ gap: 6 }}>
        <AppText variant="cardTitle">{todayPages} / {goal} pages aujourd’hui</AppText>
        <ProgressBar value={todayPages / Math.max(1, goal)} label={`${todayPages} pages sur ${goal}`} />
        <AppText variant="caption">{week} pages cette semaine · {total % MUSHAF_PAGES} / {MUSHAF_PAGES} pages de la lecture en cours</AppText>
      </Card>
      <Field label="Pages lues">
        <Stepper label="Pages lues" value={pages} onChange={setPages} min={1} max={60} suffix="pages" />
      </Field>
      <TextField label="Note (sourate, verset, réflexion)" value={note} onChangeText={setNote} maxLength={300} />
      <Button
        label="Ajouter"
        onPress={() => {
          mutate(({ well }) => well.addQuranPages(today, pages, note.trim() || null));
          setNote('');
        }}
      />
      <Field label="Objectif quotidien">
        <Stepper
          label="Objectif"
          value={goal}
          onChange={(v) => {
            setSetting('quranPagesPerDay', v);
            repo.saveSetting('quranPagesPerDay', v);
          }}
          min={1}
          max={40}
          suffix="pages"
        />
      </Field>
      {logs.length ? (
        <Card style={{ paddingVertical: 4 }}>
          {logs.map((l, i) => (
            <View key={l.id} style={{ flexDirection: 'row', alignItems: 'center', minHeight: 48, borderBottomWidth: i === logs.length - 1 ? 0 : 1, borderColor: c.border }}>
              <View style={{ flex: 1 }}>
                <AppText>{dayLabel(l.date)} · {l.pages} pages</AppText>
                {l.note ? <AppText variant="caption" color={c.textMuted}>{l.note}</AppText> : null}
              </View>
              <Pressable accessibilityRole="button" accessibilityLabel="Supprimer" onPress={() => mutate(({ well }) => well.deleteQuranLog(l.id))} style={{ width: MIN_TOUCH, height: MIN_TOUCH, alignItems: 'center', justifyContent: 'center' }}>
                <Trash2 size={18} color={c.textMuted} />
              </Pressable>
            </View>
          ))}
        </Card>
      ) : null}
      <AppText variant="caption" color={c.textMuted}>
        Le texte du Coran n’est pas encore intégré : il sera ajouté depuis une source de référence (Tanzil), après votre validation.
      </AppText>
    </Screen>
  );
}
