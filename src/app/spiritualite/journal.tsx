import { Trash2 } from 'lucide-react-native';
import { useState } from 'react';
import { Alert, Pressable, View } from 'react-native';

import { dayLabel } from '@/agenda/dates';
import { TextField } from '@/components/form/Field';
import { AppText, Button, Card, Screen } from '@/components/ui';
import { useData, useMutate } from '@/hooks/useData';
import { useToday } from '@/hooks/useToday';
import { useTheme } from '@/theme/ThemeProvider';
import { MIN_TOUCH } from '@/theme/tokens';

export default function JournalSpirituel() {
  const today = useToday();
  const { c } = useTheme();
  const mutate = useMutate();
  const entries = useData(({ well }) => well.listJournal());
  const [text, setText] = useState('');
  return (
    <Screen title="Journal spirituel" back>
      <TextField label="Aujourd’hui" value={text} onChangeText={setText} multiline maxLength={4000} placeholder="Une pensée, une gratitude, une intention…" />
      <Button
        label="Enregistrer"
        disabled={!text.trim()}
        onPress={() => {
          mutate(({ well }) => well.addJournal(today, text));
          setText('');
        }}
      />
      {entries.map((e) => (
        <Card key={e.id} style={{ gap: 6 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <AppText variant="caption" color={c.textMuted} style={{ flex: 1 }}>{dayLabel(e.date)}</AppText>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Supprimer"
              onPress={() =>
                Alert.alert('Supprimer cette note ?', undefined, [
                  { text: 'Annuler', style: 'cancel' },
                  { text: 'Supprimer', style: 'destructive', onPress: () => mutate(({ well }) => well.deleteJournal(e.id)) },
                ])
              }
              style={{ width: MIN_TOUCH, height: MIN_TOUCH, alignItems: 'center', justifyContent: 'center' }}
            >
              <Trash2 size={18} color={c.textMuted} />
            </Pressable>
          </View>
          <AppText>{e.text}</AppText>
        </Card>
      ))}
    </Screen>
  );
}
