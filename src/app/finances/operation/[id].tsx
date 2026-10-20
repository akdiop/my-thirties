import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';

import { Chips } from '@/components/form/Chips';
import { DateField } from '@/components/form/DateTimeField';
import { Field, TextField } from '@/components/form/Field';
import { Button, Screen } from '@/components/ui';
import { Segmented } from '@/components/ui/Segmented';
import { useMoney } from '@/features/finances/useMoney';
import { CURRENCIES, EXPENSE_CATEGORIES, fromMinor, INCOME_CATEGORIES, parseAmount, type Currency } from '@/finances/money';
import { useData, useMutate } from '@/hooks/useData';
import { useToday } from '@/hooks/useToday';

export default function Operation() {
  const { id, tripId } = useLocalSearchParams<{ id: string; tripId?: string }>();
  const today = useToday();
  const mutate = useMutate();
  const { main } = useMoney();
  const existing = useData(({ life }) => (id === 'new' ? undefined : life.getTx(id)), [id]);
  const trips = useData(({ life }) => life.listTrips().filter((t) => t.status !== 'done' || t.id === existing?.tripId));
  const [kind, setKind] = useState<'income' | 'expense'>(existing?.kind ?? 'expense');
  const [currency, setCurrency] = useState<Currency>(existing?.currency ?? main);
  const [amount, setAmount] = useState(existing ? String(fromMinor(existing.amountMinor, existing.currency)).replace('.', ',') : '');
  const [category, setCategory] = useState<string>(existing?.category ?? (tripId ? 'Voyages' : 'Alimentation'));
  const [date, setDate] = useState(existing?.date ?? today);
  const [label, setLabel] = useState(existing?.label ?? '');
  const [notes, setNotes] = useState(existing?.notes ?? '');
  const [trip, setTrip] = useState<string | null>(existing?.tripId ?? tripId ?? null);
  const minor = parseAmount(amount, currency);
  const categories = kind === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  const save = () => {
    if (minor === null) return;
    mutate(({ life }) =>
      life.saveTx({ date, kind, amountMinor: minor, currency, category, label: label.trim() || null, notes: notes.trim() || null, tripId: kind === 'expense' ? trip : null }, existing?.id),
    );
    router.back();
  };

  return (
    <Screen
      title={existing ? 'Opération' : 'Nouvelle opération'}
      back
      footer={<Button label="Enregistrer" disabled={minor === null} onPress={save} />}
    >
      <Segmented
        label="Type"
        value={kind}
        onChange={(k) => {
          setKind(k);
          setCategory(k === 'expense' ? 'Alimentation' : 'Salaire');
        }}
        options={[{ value: 'expense', label: 'Dépense' }, { value: 'income', label: 'Entrée' }]}
      />
      <TextField label={`Montant (${currency})`} value={amount} onChangeText={setAmount} keyboardType="decimal-pad" placeholder={currency === 'XOF' ? '15 000' : '12,50'} />
      <Field label="Devise">
        <Chips label="Devise" options={CURRENCIES.map((x) => ({ value: x, label: x }))} value={currency} onChange={setCurrency} />
      </Field>
      <Field label="Catégorie">
        <Chips label="Catégorie" options={categories.map((x) => ({ value: x as string, label: x }))} value={category} onChange={setCategory} />
      </Field>
      <TextField label="Libellé" value={label} onChangeText={setLabel} maxLength={80} placeholder="Marché, loyer…" />
      <Field label="Date">
        <DateField label="Date" value={date} onChange={(d) => d && setDate(d)} />
      </Field>
      {kind === 'expense' && trips.length ? (
        <Field label="Voyage lié">
          <Chips label="Voyage lié" options={[{ value: null, label: 'Aucun' }, ...trips.map((t) => ({ value: t.id as string | null, label: t.title }))]} value={trip} onChange={setTrip} />
        </Field>
      ) : null}
      <TextField label="Notes" value={notes} onChangeText={setNotes} multiline maxLength={500} />
      {existing ? (
        <Button
          label="Supprimer"
          variant="danger"
          onPress={() =>
            Alert.alert('Supprimer cette opération ?', undefined, [
              { text: 'Annuler', style: 'cancel' },
              {
                text: 'Supprimer',
                style: 'destructive',
                onPress: () => {
                  mutate(({ life }) => life.deleteTx(existing.id));
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
