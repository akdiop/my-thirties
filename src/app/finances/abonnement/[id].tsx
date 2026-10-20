import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';

import { Chips } from '@/components/form/Chips';
import { DateField } from '@/components/form/DateTimeField';
import { Field, TextField } from '@/components/form/Field';
import { AppText, Button, Card, Screen } from '@/components/ui';
import { useMoney } from '@/features/finances/useMoney';
import { CURRENCIES, EXPENSE_CATEGORIES, formatMoney, FREQUENCY_LABEL, fromMinor, parseAmount, type Currency, type Frequency } from '@/finances/money';
import { useData, useMutate } from '@/hooks/useData';
import { useToday } from '@/hooks/useToday';
import { useTheme } from '@/theme/ThemeProvider';

const REMIND = [
  { value: null, label: 'Aucun' },
  { value: 1, label: 'La veille' },
  { value: 3, label: '3 jours avant' },
  { value: 7, label: '7 jours avant' },
];

export default function Abonnement() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const today = useToday();
  const { c } = useTheme();
  const mutate = useMutate();
  const { main } = useMoney();
  const existing = useData(({ life }) => (id === 'new' ? undefined : life.getSubscription(id)), [id]);
  const [name, setName] = useState(existing?.name ?? '');
  const [currency, setCurrency] = useState<Currency>(existing?.currency ?? main);
  const [amount, setAmount] = useState(existing ? String(fromMinor(existing.amountMinor, existing.currency)).replace('.', ',') : '');
  const [frequency, setFrequency] = useState<Frequency>(existing?.frequency ?? 'monthly');
  const [nextDate, setNextDate] = useState(existing?.nextDate ?? today);
  const [category, setCategory] = useState(existing?.category ?? 'Abonnements');
  const [remindDays, setRemindDays] = useState<number | null>(existing?.remindDays ?? 1);
  const minor = parseAmount(amount, currency);

  const save = () => {
    if (minor === null || !name.trim()) return;
    mutate(({ life }) => life.saveSubscription({ name: name.trim(), amountMinor: minor, currency, frequency, nextDate, category, remindDays }, existing?.id));
    router.back();
  };

  return (
    <Screen title={existing ? existing.name : 'Nouvel abonnement'} back footer={<Button label="Enregistrer" disabled={minor === null || !name.trim()} onPress={save} />}>
      {existing ? (
        <Card tone="sand" style={{ gap: 8 }}>
          <AppText>Prochaine échéance : {existing.nextDate.split('-').reverse().join('/')} · {formatMoney(existing.amountMinor, existing.currency)}</AppText>
          <Button
            label="Marquer comme payé"
            variant="outline"
            onPress={() => {
              mutate(({ life }) => life.paySubscription(existing.id, existing.nextDate <= today ? existing.nextDate : today));
              router.back();
            }}
          />
          <AppText variant="caption" color={c.textMuted}>Ajoute la dépense dans vos opérations et passe à l’échéance suivante.</AppText>
        </Card>
      ) : null}
      <TextField label="Nom" value={name} onChangeText={setName} maxLength={60} placeholder="Musique, salle de sport…" />
      <TextField label={`Montant (${currency})`} value={amount} onChangeText={setAmount} keyboardType="decimal-pad" />
      <Field label="Devise">
        <Chips label="Devise" options={CURRENCIES.map((x) => ({ value: x, label: x }))} value={currency} onChange={setCurrency} />
      </Field>
      <Field label="Fréquence">
        <Chips label="Fréquence" options={(Object.keys(FREQUENCY_LABEL) as Frequency[]).map((f) => ({ value: f, label: FREQUENCY_LABEL[f] }))} value={frequency} onChange={setFrequency} />
      </Field>
      <Field label="Prochaine échéance">
        <DateField label="Prochaine échéance" value={nextDate} onChange={(d) => d && setNextDate(d)} />
      </Field>
      <Field label="Catégorie">
        <Chips label="Catégorie" options={EXPENSE_CATEGORIES.map((x) => ({ value: x as string, label: x }))} value={category} onChange={setCategory} />
      </Field>
      <Field label="Rappel">
        <Chips label="Rappel" options={REMIND} value={remindDays} onChange={setRemindDays} />
      </Field>
      {existing ? (
        <Button
          label="Résilié : ne plus suivre"
          variant="danger"
          onPress={() =>
            Alert.alert('Arrêter le suivi ?', 'Les dépenses déjà enregistrées sont conservées.', [
              { text: 'Annuler', style: 'cancel' },
              {
                text: 'Arrêter',
                style: 'destructive',
                onPress: () => {
                  mutate(({ life }) => life.endSubscription(existing.id, today));
                  router.back();
                },
              },
            ])
          }
        />
      ) : null}
    </Screen>
  );
}
