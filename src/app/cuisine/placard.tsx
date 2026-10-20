import { useState } from 'react';
import { X } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { TextField } from '@/components/form/Field';
import { AppText, Button, Card, ListRow, Screen } from '@/components/ui';
import { formatQty, parseIngredientLine } from '@/cuisine/cuisine';
import { useData, useMutate } from '@/hooks/useData';
import { useTheme } from '@/theme/ThemeProvider';
import { MIN_TOUCH } from '@/theme/tokens';

export default function Placard() {
  const { c } = useTheme();
  const mutate = useMutate();
  const items = useData(({ life }) => life.listPantry());
  const [line, setLine] = useState('');
  const parsed = parseIngredientLine(line);
  const add = () => {
    if (!parsed) return;
    mutate(({ life }) => life.savePantryItem(parsed.name, parsed.qty, parsed.unit));
    setLine('');
  };

  return (
    <Screen title="Placard" subtitle="Ce que vous avez déjà, déduit des courses" back>
      <View style={{ gap: 8 }}>
        <TextField label="Ajouter" value={line} onChangeText={setLine} placeholder="1 kg riz, huile…" maxLength={80} onSubmitEditing={add} />
        <Button
          label="Ajouter au placard"
          variant="outline"
          disabled={!parsed}
          onPress={add}
        />
        <AppText variant="caption" color={c.textMuted}>Sans quantité, l’ingrédient est considéré comme disponible en quantité suffisante.</AppText>
      </View>
      {items.length ? (
        <Card style={{ paddingVertical: 4 }}>
          {items.map((i, k) => (
            <ListRow
              key={i.id}
              label={i.name}
              value={i.qty === null ? 'en stock' : formatQty(i)}
              last={k === items.length - 1}
              right={
                <Pressable accessibilityRole="button" accessibilityLabel={`Retirer ${i.name}`} onPress={() => mutate(({ life }) => life.deletePantryItem(i.id))} style={{ width: MIN_TOUCH, height: MIN_TOUCH, alignItems: 'center', justifyContent: 'center' }}>
                  <X size={18} color={c.textMuted} />
                </Pressable>
              }
            />
          ))}
        </Card>
      ) : null}
    </Screen>
  );
}
