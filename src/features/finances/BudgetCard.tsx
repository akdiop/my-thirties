import { router } from 'expo-router';
import { Pressable } from 'react-native';

import { addDays, addMonths, startOfMonth } from '@/agenda/dates';
import { AppText, Card } from '@/components/ui';
import { formatMoney, monthSummary } from '@/finances/money';
import { useData } from '@/hooks/useData';
import { useTheme } from '@/theme/ThemeProvider';
import { useMoney } from './useMoney';

export function BudgetCard({ today }: { today: string }) {
  const { c } = useTheme();
  const { main, rates } = useMoney();
  const month = startOfMonth(today);
  const txs = useData(({ life }) => life.listTx(month, addDays(addMonths(month, 1), -1)), [month]);
  const due = useData(({ life }) => life.listSubscriptions().filter((s) => s.nextDate >= today && s.nextDate <= addDays(today, 7)), [today]);
  const s = monthSummary(txs, month.slice(0, 7), main, rates);
  return (
    <Pressable accessibilityRole="button" onPress={() => router.push('/finances')}>
      <Card style={{ gap: 4 }}>
        <AppText variant="cardTitle">Budget</AppText>
        <AppText variant="number" color={s.balance < 0 ? c.danger : c.text}>{formatMoney(s.balance, main)}</AppText>
        <AppText variant="caption" color={c.textMuted}>
          Reste ce mois-ci{due.length ? ` · ${due.length} prélèvement${due.length > 1 ? 's' : ''} cette semaine` : ''}
        </AppText>
      </Card>
    </Pressable>
  );
}
