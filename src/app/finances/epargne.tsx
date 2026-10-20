import { useState } from 'react';
import { Alert, View } from 'react-native';

import { Chips } from '@/components/form/Chips';
import { DateField } from '@/components/form/DateTimeField';
import { Field, TextField } from '@/components/form/Field';
import { AppText, Button, Card, ProgressBar, Screen } from '@/components/ui';
import { useMoney } from '@/features/finances/useMoney';
import { CURRENCIES, formatMoney, goalProgress, parseAmount, type Currency } from '@/finances/money';
import { useData, useMutate } from '@/hooks/useData';
import { useTheme } from '@/theme/ThemeProvider';

export default function Epargne() {
  const { c } = useTheme();
  const mutate = useMutate();
  const { main } = useMoney();
  const goals = useData(({ life }) => life.listGoals());
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [target, setTarget] = useState('');
  const [currency, setCurrency] = useState<Currency>(main);
  const [deadline, setDeadline] = useState<string | null>(null);
  const [deltas, setDeltas] = useState<Record<string, string>>({});
  const targetMinor = parseAmount(target, currency);

  const move = (id: string, cur: Currency, sign: 1 | -1) => {
    const minor = parseAmount(deltas[id] ?? '', cur);
    if (minor === null) return;
    mutate(({ life }) => life.addToGoal(id, sign * minor));
    setDeltas({ ...deltas, [id]: '' });
  };

  return (
    <Screen title="Épargne" back>
      {goals.map((g) => (
        <Card key={g.id} style={{ gap: 8 }}>
          <AppText variant="cardTitle">{g.title}</AppText>
          <ProgressBar value={goalProgress(g.savedMinor, g.targetMinor)} label={`${g.title} : ${Math.round(goalProgress(g.savedMinor, g.targetMinor) * 100)} %`} />
          <AppText variant="caption" color={c.textMuted}>
            {formatMoney(g.savedMinor, g.currency)} sur {formatMoney(g.targetMinor, g.currency)}
            {g.deadline ? ` · avant le ${g.deadline.split('-').reverse().join('/')}` : ''}
          </AppText>
          <TextField label={`Montant (${g.currency})`} value={deltas[g.id] ?? ''} onChangeText={(v) => setDeltas({ ...deltas, [g.id]: v })} keyboardType="decimal-pad" />
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Button label="Ajouter" variant="secondary" style={{ flex: 1 }} onPress={() => move(g.id, g.currency, 1)} />
            <Button label="Retirer" variant="outline" style={{ flex: 1 }} onPress={() => move(g.id, g.currency, -1)} />
          </View>
          <Button
            label="Supprimer l’objectif"
            variant="danger"
            onPress={() =>
              Alert.alert('Supprimer cet objectif ?', undefined, [
                { text: 'Annuler', style: 'cancel' },
                { text: 'Supprimer', style: 'destructive', onPress: () => mutate(({ life }) => life.deleteGoal(g.id)) },
              ])
            }
          />
        </Card>
      ))}
      {creating ? (
        <Card style={{ gap: 12 }}>
          <TextField label="Objectif" value={title} onChangeText={setTitle} maxLength={60} placeholder="Voyage, fonds d’urgence…" />
          <TextField label={`Montant visé (${currency})`} value={target} onChangeText={setTarget} keyboardType="decimal-pad" />
          <Field label="Devise">
            <Chips label="Devise" options={CURRENCIES.map((x) => ({ value: x, label: x }))} value={currency} onChange={setCurrency} />
          </Field>
          <Field label="Échéance (facultatif)">
            <DateField label="Échéance" value={deadline} onChange={setDeadline} optional />
          </Field>
          <Button
            label="Créer"
            disabled={!title.trim() || targetMinor === null}
            onPress={() => {
              if (targetMinor === null) return;
              mutate(({ life }) => life.saveGoal({ title: title.trim(), targetMinor, currency, deadline }));
              setCreating(false);
              setTitle('');
              setTarget('');
            }}
          />
        </Card>
      ) : (
        <Button label="Nouvel objectif" variant="outline" onPress={() => setCreating(true)} />
      )}
    </Screen>
  );
}
