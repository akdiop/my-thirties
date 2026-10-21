import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';

import { Chips } from '@/components/form/Chips';
import { DateField } from '@/components/form/DateTimeField';
import { Field, TextField } from '@/components/form/Field';
import { SelectField } from '@/components/form/SelectField';
import { Button, Screen } from '@/components/ui';
import { TRIP_STATUS_LABEL, type TripStatus } from '@/decouvertes/trips';
import { useMoney } from '@/features/finances/useMoney';
import { CURRENCIES, fromMinor, parseAmount, type Currency } from '@/finances/money';
import { useData, useMutate } from '@/hooks/useData';

const DESTINATIONS = ['Dakar, Sénégal', 'Saint-Louis, Sénégal', 'Sine-Saloum, Sénégal', 'Casamance, Sénégal', 'Marrakech, Maroc', 'Essaouira, Maroc', 'Chefchaouen, Maroc', 'Île de Sal, Cap-Vert', 'Lisbonne, Portugal', 'Porto, Portugal', 'Séville, Espagne', 'Grenade, Espagne', 'Rome, Italie', 'Florence, Italie', 'Copenhague, Danemark', 'Amsterdam, Pays-Bas', 'Istanbul, Turquie', 'Cappadoce, Turquie', 'Athènes, Grèce', 'Zanzibar, Tanzanie', 'Kigali, Rwanda', 'Le Cap, Afrique du Sud', 'Dubaï, Émirats arabes unis', 'Kyoto, Japon', 'Tokyo, Japon', 'Bali, Indonésie', 'Montréal, Canada', 'New York, États-Unis', 'Rio de Janeiro, Brésil'];

export default function EditionVoyage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const mutate = useMutate();
  const { main } = useMoney();
  const t = useData(({ life }) => (id === 'new' ? undefined : life.getTrip(id)), [id]);
  const [title, setTitle] = useState(t?.title ?? '');
  const [destination, setDestination] = useState(t?.destination ?? '');
  const [status, setStatus] = useState<TripStatus>(t?.status ?? 'idea');
  const [startDate, setStartDate] = useState<string | null>(t?.startDate ?? null);
  const [endDate, setEndDate] = useState<string | null>(t?.endDate ?? null);
  const [currency, setCurrency] = useState<Currency>(t?.currency ?? main);
  const [budget, setBudget] = useState(t?.budgetMinor ? String(fromMinor(t.budgetMinor, t.currency)).replace('.', ',') : '');
  const [notes, setNotes] = useState(t?.notes ?? '');
  const budgetMinor = budget.trim() ? parseAmount(budget, currency) : null;
  const invalid = !destination.trim() || (budget.trim() !== '' && budgetMinor === null) || (!!startDate && !!endDate && endDate < startDate);

  const save = () => {
    const savedId = mutate(({ life }) =>
      life.saveTrip({ title: title.trim() || destination.trim(), destination: destination.trim(), status, startDate, endDate, currency, budgetMinor, notes: notes.trim() || null }, t?.id),
    );
    if (t) router.back();
    else router.replace({ pathname: '/decouvertes/[id]', params: { id: savedId } });
  };

  return (
    <Screen title={t ? 'Modifier' : 'Nouvelle destination'} back footer={<Button label="Enregistrer" disabled={invalid} onPress={save} />}>
      <SelectField label="Destination" options={DESTINATIONS.map((x) => ({ value: x, label: x }))} value={destination} onChange={setDestination} allowCustom />
      <TextField label="Nom du voyage (facultatif)" value={title} onChangeText={setTitle} maxLength={80} />
      <Field label="Statut">
        <Chips label="Statut" options={(Object.keys(TRIP_STATUS_LABEL) as TripStatus[]).map((s) => ({ value: s, label: TRIP_STATUS_LABEL[s] }))} value={status} onChange={setStatus} />
      </Field>
      <Field label="Départ">
        <DateField label="Départ" value={startDate} onChange={setStartDate} optional />
      </Field>
      <Field label="Retour">
        <DateField label="Retour" value={endDate} onChange={setEndDate} optional />
      </Field>
      <TextField label={`Budget (${currency}, facultatif)`} value={budget} onChangeText={setBudget} keyboardType="decimal-pad" />
      <Field label="Devise du budget">
        <Chips label="Devise du budget" options={CURRENCIES.map((x) => ({ value: x, label: x }))} value={currency} onChange={setCurrency} />
      </Field>
      <TextField label="Notes" value={notes} onChangeText={setNotes} multiline maxLength={2000} />
      {t ? (
        <Button
          label="Supprimer ce voyage"
          variant="danger"
          onPress={() =>
            Alert.alert('Supprimer ce voyage ?', 'Les dépenses et listes liées sont conservées.', [
              { text: 'Annuler', style: 'cancel' },
              {
                text: 'Supprimer',
                style: 'destructive',
                onPress: () => {
                  mutate(({ life }) => life.deleteTrip(t.id));
                  router.dismissTo('/decouvertes');
                },
              },
            ])
          }
        />
      ) : null}
    </Screen>
  );
}
