import { describeRule, type Frequency, type RecurrenceRule } from '@/agenda/recurrence';
import { Chips } from './Chips';
import { Field } from './Field';

const FREQS: { value: Frequency | 'none'; label: string }[] = [
  { value: 'none', label: 'Jamais' },
  { value: 'daily', label: 'Chaque jour' },
  { value: 'weekly', label: 'Chaque semaine' },
  { value: 'monthly', label: 'Chaque mois' },
  { value: 'yearly', label: 'Chaque année' },
];

export function RecurrenceField({ value, onChange }: { value: RecurrenceRule | null; onChange: (v: RecurrenceRule | null) => void }) {
  return (
    <Field label={`Répétition · ${describeRule(value)}`}>
      <Chips
        label="Répétition"
        options={FREQS}
        value={value?.freq ?? 'none'}
        onChange={(f) => onChange(f === 'none' ? null : { freq: f, interval: 1 })}
      />
    </Field>
  );
}

export const REMINDER_OPTIONS: { value: number | null; label: string }[] = [
  { value: null, label: 'Aucun' },
  { value: 0, label: 'À l’heure' },
  { value: 10, label: '10 min avant' },
  { value: 30, label: '30 min avant' },
  { value: 60, label: '1 h avant' },
  { value: 1440, label: 'La veille' },
];

export function ReminderField({ value, onChange }: { value: number | null; onChange: (v: number | null) => void }) {
  return (
    <Field label="Rappel">
      <Chips label="Rappel" options={REMINDER_OPTIONS} value={value} onChange={onChange} />
    </Field>
  );
}
