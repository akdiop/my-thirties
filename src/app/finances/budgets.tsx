import { useState } from 'react';
import { TextInput, View } from 'react-native';

import { AppText, Card, Screen } from '@/components/ui';
import { useMoney } from '@/features/finances/useMoney';
import { EXPENSE_CATEGORIES, fromMinor, parseAmount } from '@/finances/money';
import { useData, useMutate } from '@/hooks/useData';
import { useTheme } from '@/theme/ThemeProvider';
import { radius } from '@/theme/tokens';

export default function Budgets() {
  const { c } = useTheme();
  const mutate = useMutate();
  const { main } = useMoney();
  const budgets = useData(({ life }) => life.listBudgets());
  const initial = Object.fromEntries(budgets.map((b) => [b.category, String(fromMinor(b.amountMinor, b.currency)).replace('.', ',')]));
  const [values, setValues] = useState<Record<string, string>>(initial);

  const commit = (category: string) => {
    const raw = (values[category] ?? '').trim();
    const minor = raw ? parseAmount(raw, main) : null;
    if (raw && minor === null) return setValues({ ...values, [category]: initial[category] ?? '' });
    mutate(({ life }) => life.setBudget(category, minor, main));
  };

  return (
    <Screen title="Budgets mensuels" subtitle={`Montants en ${main}, laissez vide pour ne pas suivre`} back>
      <Card style={{ gap: 4 }}>
        {EXPENSE_CATEGORIES.map((cat) => (
          <View key={cat} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 52 }}>
            <AppText style={{ flex: 1 }} nativeID={`budget-${cat}`}>{cat}</AppText>
            <TextInput
              accessibilityLabelledBy={`budget-${cat}`}
              value={values[cat] ?? ''}
              onChangeText={(v) => setValues({ ...values, [cat]: v })}
              onEndEditing={() => commit(cat)}
              keyboardType="decimal-pad"
              placeholder="—"
              placeholderTextColor={c.textMuted}
              style={{ width: 130, height: 44, borderRadius: radius.md, borderWidth: 1, borderColor: c.border, paddingHorizontal: 12, textAlign: 'right', fontFamily: 'Inter_400Regular', fontSize: 15, color: c.text }}
            />
          </View>
        ))}
      </Card>
    </Screen>
  );
}
