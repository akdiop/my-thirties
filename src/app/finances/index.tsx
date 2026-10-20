import { router } from 'expo-router';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useState } from 'react';
import { Alert, Pressable, View } from 'react-native';

import { addMonths, monthLabel, startOfMonth, toISODate } from '@/agenda/dates';
import { HeaderAdd } from '@/components/HeaderAdd';
import { AppText, Button, Card, ListRow, ProgressBar, Screen } from '@/components/ui';
import { useMoney } from '@/features/finances/useMoney';
import { fetchUsdRate, FX_SOURCE } from '@/finances/fx';
import { convertMinor, formatMoney, goalProgress, monthlyCost, monthSummary, XOF_PER_EUR } from '@/finances/money';
import { useData, useMutate } from '@/hooks/useData';
import { useToday } from '@/hooks/useToday';
import { useTheme } from '@/theme/ThemeProvider';
import { MIN_TOUCH } from '@/theme/tokens';

export default function Finances() {
  const today = useToday();
  const { c } = useTheme();
  const mutate = useMutate();
  const { main, rates } = useMoney();
  const [month, setMonth] = useState(startOfMonth(today));
  const [updating, setUpdating] = useState(false);
  const end = addMonths(month, 1);
  const txs = useData(({ life }) => life.listTx(month, toISODate(new Date(Date.parse(`${end}T12:00:00`) - 86_400_000))), [month, end]);
  const subs = useData(({ life }) => life.listSubscriptions());
  const budgets = useData(({ life }) => life.listBudgets());
  const goals = useData(({ life }) => life.listGoals());
  const s = monthSummary(txs, month.slice(0, 7), main, rates);
  const conv = (minor: number, from: typeof main) => convertMinor(minor, from, main, rates);
  const subsMonthly = subs.reduce((sum, x) => sum + (conv(monthlyCost(x.amountMinor, x.frequency), x.currency) ?? 0), 0);

  const updateRate = async () => {
    setUpdating(true);
    try {
      const r = await fetchUsdRate();
      mutate(({ life }) => life.saveRate(r.date, r.usdPerEur, FX_SOURCE));
    } catch (e) {
      Alert.alert('Taux non mis à jour', e instanceof Error ? e.message : String(e));
    } finally {
      setUpdating(false);
    }
  };

  const arrow = (dir: -1 | 1) => (
    <Pressable accessibilityRole="button" accessibilityLabel={dir < 0 ? 'Mois précédent' : 'Mois suivant'} onPress={() => setMonth(addMonths(month, dir))} style={{ width: MIN_TOUCH, height: MIN_TOUCH, alignItems: 'center', justifyContent: 'center' }}>
      {dir < 0 ? <ChevronLeft size={20} color={c.primary} /> : <ChevronRight size={20} color={c.primary} />}
    </Pressable>
  );

  return (
    <Screen title="Mes finances" back right={<HeaderAdd label="Nouvelle opération" onPress={() => router.push({ pathname: '/finances/operation/[id]', params: { id: 'new' } })} />}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        {arrow(-1)}
        <AppText variant="cardTitle" style={{ textTransform: 'capitalize' }}>{monthLabel(month)}</AppText>
        {arrow(1)}
      </View>

      <Card tone="sand" style={{ gap: 6 }}>
        <AppText variant="caption" color={c.textMuted}>Reste du mois</AppText>
        <AppText variant="number" color={s.balance < 0 ? c.danger : c.text}>{formatMoney(s.balance, main)}</AppText>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <AppText variant="caption">Entrées {formatMoney(s.income, main)}</AppText>
          <AppText variant="caption">Sorties {formatMoney(s.expense, main)}</AppText>
        </View>
        {s.unconverted ? <AppText variant="caption" color={c.danger}>{s.unconverted} opération(s) en USD non comptées : mettez à jour le taux ci-dessous.</AppText> : null}
      </Card>

      <Card style={{ gap: 10 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <AppText variant="cardTitle">Budgets</AppText>
          <Pressable accessibilityRole="button" onPress={() => router.push('/finances/budgets')}>
            <AppText variant="label" color={c.accent}>Modifier</AppText>
          </Pressable>
        </View>
        {budgets.length ? (
          budgets.map((b) => {
            const limit = conv(b.amountMinor, b.currency) ?? b.amountMinor;
            const spent = s.categories.find((x) => x.name === b.category)?.total ?? 0;
            return (
              <View key={b.id} style={{ gap: 4 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <AppText variant="label">{b.category}</AppText>
                  <AppText variant="caption" color={spent > limit ? c.danger : c.textMuted}>{formatMoney(spent, main)} / {formatMoney(limit, main)}</AppText>
                </View>
                <ProgressBar value={limit ? Math.min(1, spent / limit) : 0} label={`${b.category} : ${formatMoney(spent, main)} sur ${formatMoney(limit, main)}`} />
              </View>
            );
          })
        ) : (
          <AppText color={c.textMuted}>Aucun budget défini.</AppText>
        )}
      </Card>

      {s.categories.length ? (
        <Card style={{ paddingVertical: 4 }}>
          {s.categories.map((x, i) => (
            <ListRow key={x.name} label={x.name} value={`${formatMoney(x.total, main)} · ${Math.round(x.share * 100)} %`} last={i === s.categories.length - 1} />
          ))}
        </Card>
      ) : null}

      <View style={{ gap: 8 }}>
        <AppText variant="cardTitle">Opérations</AppText>
        {txs.length ? (
          <Card style={{ paddingVertical: 4 }}>
            {txs.map((t, i) => (
              <ListRow
                key={t.id}
                label={`${t.date.slice(8, 10)}/${t.date.slice(5, 7)} · ${t.label ?? t.category}`}
                value={`${t.kind === 'expense' ? '−' : '+'} ${formatMoney(t.amountMinor, t.currency)}`}
                color={t.kind === 'income' ? c.success : undefined}
                onPress={() => router.push({ pathname: '/finances/operation/[id]', params: { id: t.id } })}
                last={i === txs.length - 1}
              />
            ))}
          </Card>
        ) : (
          <AppText color={c.textMuted}>Aucune opération ce mois-ci.</AppText>
        )}
      </View>

      <Card style={{ gap: 8 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <AppText variant="cardTitle">Abonnements</AppText>
          <Pressable accessibilityRole="button" onPress={() => router.push({ pathname: '/finances/abonnement/[id]', params: { id: 'new' } })}>
            <AppText variant="label" color={c.accent}>Ajouter</AppText>
          </Pressable>
        </View>
        {subs.length ? (
          <>
            <AppText variant="caption" color={c.textMuted}>Environ {formatMoney(subsMonthly, main)} par mois</AppText>
            {subs.map((x, i) => (
              <ListRow
                key={x.id}
                label={x.name}
                value={`${formatMoney(x.amountMinor, x.currency)} · ${x.nextDate.slice(8, 10)}/${x.nextDate.slice(5, 7)}`}
                color={x.nextDate < today ? c.danger : undefined}
                onPress={() => router.push({ pathname: '/finances/abonnement/[id]', params: { id: x.id } })}
                last={i === subs.length - 1}
              />
            ))}
          </>
        ) : (
          <AppText color={c.textMuted}>Aucun abonnement suivi.</AppText>
        )}
      </Card>

      <Card style={{ gap: 10 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <AppText variant="cardTitle">Épargne</AppText>
          <Pressable accessibilityRole="button" onPress={() => router.push('/finances/epargne')}>
            <AppText variant="label" color={c.accent}>Gérer</AppText>
          </Pressable>
        </View>
        {goals.length ? (
          goals.map((g) => (
            <View key={g.id} style={{ gap: 4 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <AppText variant="label">{g.title}</AppText>
                <AppText variant="caption" color={c.textMuted}>{formatMoney(g.savedMinor, g.currency)} / {formatMoney(g.targetMinor, g.currency)}</AppText>
              </View>
              <ProgressBar value={goalProgress(g.savedMinor, g.targetMinor)} label={`${g.title} : ${Math.round(goalProgress(g.savedMinor, g.targetMinor) * 100)} %`} />
            </View>
          ))
        ) : (
          <AppText color={c.textMuted}>Aucun objectif d’épargne.</AppText>
        )}
      </Card>

      <Card tone="sand" style={{ gap: 6 }}>
        <AppText style={{ fontFamily: 'Inter_600SemiBold' }}>Taux de change</AppText>
        <AppText variant="caption">1 EUR = {XOF_PER_EUR} XOF (parité fixe).</AppText>
        <AppText variant="caption">
          {rates.usdPerEur ? `1 EUR = ${String(rates.usdPerEur).replace('.', ',')} USD · taux du ${rates.date?.split('-').reverse().join('/')} (${FX_SOURCE}).` : 'Aucun taux USD enregistré : les montants en USD ne sont pas convertis.'}
        </AppText>
        <Button label="Mettre à jour le taux USD" variant="outline" loading={updating} onPress={updateRate} />
      </Card>
    </Screen>
  );
}
