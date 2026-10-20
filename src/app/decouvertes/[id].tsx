import { router, useLocalSearchParams } from 'expo-router';
import { X } from 'lucide-react-native';
import { useState } from 'react';
import { Alert, Pressable, View } from 'react-native';

import { DateField, TimeField } from '@/components/form/DateTimeField';
import { Field, TextField } from '@/components/form/Field';
import { AppText, Button, Card, Checkbox, ProgressBar, Screen } from '@/components/ui';
import { TRIP_ITEM_LABEL, TRIP_STATUS_LABEL, tripCountdown, tripNights, type TripItemKind } from '@/decouvertes/trips';
import { convertMinor, formatMoney } from '@/finances/money';
import { useMoney } from '@/features/finances/useMoney';
import { useData, useMutate } from '@/hooks/useData';
import { useToday } from '@/hooks/useToday';
import { useTheme } from '@/theme/ThemeProvider';
import { MIN_TOUCH } from '@/theme/tokens';

export default function Voyage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const today = useToday();
  const { c } = useTheme();
  const mutate = useMutate();
  const { rates } = useMoney();
  const t = useData(({ life }) => life.getTrip(id), [id]);
  const items = useData(({ life }) => life.tripItems(id), [id]);
  const spentTx = useData(({ life }) => life.tripTx(id), [id]);
  const [adding, setAdding] = useState<TripItemKind | null>(null);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [notes, setNotes] = useState('');

  if (!t || t.deletedAt) return <Screen title="Voyage" back><AppText>Voyage introuvable.</AppText></Screen>;
  const countdown = tripCountdown(t, today);
  const nights = tripNights(t);
  let unconverted = 0;
  const spent = spentTx.reduce((s, x) => {
    const v = convertMinor(x.amountMinor, x.currency, t.currency, rates);
    if (v === null) unconverted++;
    return s + (v ?? 0);
  }, 0);

  const openList = (which: 'checklist' | 'packing') => {
    const listId = mutate(({ life }) => life.tripList(t.id, which));
    router.push({ pathname: '/listes/[id]', params: { id: listId } });
  };

  const addItem = () => {
    if (!adding || !title.trim()) return;
    mutate(({ life }) => life.saveTripItem(t.id, { kind: adding, title: title.trim(), date, time, notes: notes.trim() || null }));
    setAdding(null);
    setTitle('');
    setDate(null);
    setTime(null);
    setNotes('');
  };

  return (
    <Screen title={t.title} subtitle={`${t.destination} · ${TRIP_STATUS_LABEL[t.status]}`} back right={<Pressable accessibilityRole="button" onPress={() => router.push({ pathname: '/decouvertes/edition/[id]', params: { id: t.id } })} style={{ minHeight: MIN_TOUCH, justifyContent: 'center' }}><AppText variant="label" color={c.accent}>Modifier</AppText></Pressable>}>
      <Card tone="sand" style={{ gap: 4 }}>
        <AppText>
          {t.startDate ? `Du ${t.startDate.split('-').reverse().join('/')}` : 'Dates à définir'}
          {t.endDate ? ` au ${t.endDate.split('-').reverse().join('/')}` : ''}
          {nights !== null ? ` · ${nights} nuit${nights > 1 ? 's' : ''}` : ''}
        </AppText>
        {countdown ? <AppText color={c.accent} style={{ fontFamily: 'Inter_600SemiBold' }}>{countdown}</AppText> : null}
        {t.startDate ? <Button label="Ajouter départ et retour à l’agenda" variant="outline" onPress={() => { mutate(({ life }) => life.addTripToAgenda(t.id)); Alert.alert('Ajouté à l’agenda', 'Un rappel la veille est prévu si les notifications sont activées.'); }} /> : null}
      </Card>

      <Card style={{ gap: 8 }}>
        <AppText variant="cardTitle">Budget</AppText>
        {t.budgetMinor ? <ProgressBar value={Math.min(1, spent / t.budgetMinor)} label={`Dépensé ${formatMoney(spent, t.currency)} sur ${formatMoney(t.budgetMinor, t.currency)}`} /> : null}
        <AppText color={t.budgetMinor && spent > t.budgetMinor ? c.danger : c.text}>
          {formatMoney(spent, t.currency)} dépensés{t.budgetMinor ? ` sur ${formatMoney(t.budgetMinor, t.currency)}` : ''}
        </AppText>
        {unconverted ? <AppText variant="caption" color={c.danger}>{unconverted} dépense(s) en USD non converties : mettez à jour le taux dans Mes finances.</AppText> : null}
        <AppText variant="caption" color={c.textMuted}>Les prix réels sont à vérifier auprès des prestataires ; l’application n’en invente aucun.</AppText>
        <Button label="Ajouter une dépense" variant="outline" onPress={() => router.push({ pathname: '/finances/operation/[id]', params: { id: 'new', tripId: t.id } })} />
      </Card>

      <View style={{ flexDirection: 'row', gap: 8 }}>
        <Button label="Préparatifs" variant="secondary" style={{ flex: 1 }} onPress={() => openList('checklist')} />
        <Button label="Valise" variant="secondary" style={{ flex: 1 }} onPress={() => openList('packing')} />
      </View>

      {(Object.keys(TRIP_ITEM_LABEL) as TripItemKind[]).map((kind) => {
        const group = items.filter((i) => i.kind === kind);
        return (
          <Card key={kind} style={{ gap: 8 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <AppText variant="cardTitle">{TRIP_ITEM_LABEL[kind]}</AppText>
              <Pressable accessibilityRole="button" onPress={() => setAdding(kind)}>
                <AppText variant="label" color={c.accent}>Ajouter</AppText>
              </Pressable>
            </View>
            {group.map((i) => (
              <View key={i.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View style={{ flex: 1 }}>
                  <Checkbox checked={i.done} onChange={(v) => mutate(({ life }) => life.toggleTripItem(i.id, v))} label={`${i.date ? `${i.date.slice(8, 10)}/${i.date.slice(5, 7)}${i.time ? ` ${i.time}` : ''} · ` : ''}${i.title}`} />
                  {i.notes ? <AppText variant="caption" color={c.textMuted} style={{ marginLeft: 36 }}>{i.notes}</AppText> : null}
                </View>
                <Pressable accessibilityRole="button" accessibilityLabel={`Supprimer ${i.title}`} onPress={() => mutate(({ life }) => life.deleteTripItem(i.id))} style={{ width: MIN_TOUCH, height: MIN_TOUCH, alignItems: 'center', justifyContent: 'center' }}>
                  <X size={16} color={c.textMuted} />
                </Pressable>
              </View>
            ))}
            {!group.length && adding !== kind ? <AppText variant="caption" color={c.textMuted}>Rien pour l’instant.</AppText> : null}
            {adding === kind ? (
              <View style={{ gap: 10 }}>
                <TextField label="Intitulé" value={title} onChangeText={setTitle} maxLength={100} autoFocus />
                <Field label="Date">
                  <DateField label="Date" value={date} onChange={setDate} optional />
                </Field>
                {kind !== 'idea' ? <TimeField label="Heure" value={time} onChange={setTime} optional /> : null}
                <TextField label={kind === 'booking' ? 'Notes (pas de numéro de carte ni de passeport)' : 'Notes'} value={notes} onChangeText={setNotes} maxLength={500} />
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <Button label="Annuler" variant="outline" style={{ flex: 1 }} onPress={() => setAdding(null)} />
                  <Button label="Ajouter" style={{ flex: 1 }} disabled={!title.trim()} onPress={addItem} />
                </View>
              </View>
            ) : null}
          </Card>
        );
      })}
      {t.notes ? <AppText color={c.textMuted}>{t.notes}</AppText> : null}
    </Screen>
  );
}
