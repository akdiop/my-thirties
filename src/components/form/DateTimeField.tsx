import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Platform, Pressable, View } from 'react-native';

import { parseISODate, toISODate, type ISODate } from '@/agenda/dates';
import { AppText } from '@/components/ui';
import { useTheme } from '@/theme/ThemeProvider';
import { radius } from '@/theme/tokens';
import { formatLongDate } from '@/utils/dates';

const toTime = (d: Date) => `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;

const timeAsDate = (time: string | null) => {
  const d = new Date();
  const [h, m] = (time ?? '09:00').split(':').map(Number);
  d.setHours(h ?? 9, m ?? 0, 0, 0);
  return d;
};

function PickerShell({ label, display, onClear, children, open, setOpen }: { label: string; display: string; onClear?: () => void; children: React.ReactNode; open: boolean; setOpen: (v: boolean) => void }) {
  const { c } = useTheme();
  return (
    <View style={{ gap: 8 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${label} : ${display}`}
          onPress={() => setOpen(!open)}
          style={{ flex: 1, minHeight: 48, borderRadius: radius.md, borderWidth: 1, borderColor: c.border, backgroundColor: c.surface, paddingHorizontal: 14, justifyContent: 'center' }}
        >
          <AppText>{display}</AppText>
        </Pressable>
        {onClear ? (
          <Pressable accessibilityRole="button" accessibilityLabel={`Retirer ${label}`} onPress={onClear} style={{ minHeight: 48, justifyContent: 'center', paddingHorizontal: 8 }}>
            <AppText variant="label" color={c.primary}>Retirer</AppText>
          </Pressable>
        ) : null}
      </View>
      {open ? children : null}
    </View>
  );
}

export function DateField({ label, value, onChange, optional }: { label: string; value: ISODate | null; onChange: (v: ISODate | null) => void; optional?: boolean }) {
  const [open, setOpen] = useState(false);
  const { c } = useTheme();
  return (
    <PickerShell
      label={label}
      display={value ? formatLongDate(parseISODate(value)) : 'Aucune date'}
      onClear={optional && value ? () => onChange(null) : undefined}
      open={open}
      setOpen={setOpen}
    >
      <DateTimePicker
        value={value ? parseISODate(value) : new Date()}
        mode="date"
        locale="fr-FR"
        display={Platform.OS === 'ios' ? 'inline' : 'default'}
        accentColor={c.secondary}
        onChange={(e, d) => {
          if (Platform.OS !== 'ios') setOpen(false);
          if (e.type === 'set' && d) onChange(toISODate(d));
        }}
      />
    </PickerShell>
  );
}

export function TimeField({ label, value, onChange, optional }: { label: string; value: string | null; onChange: (v: string | null) => void; optional?: boolean }) {
  const [open, setOpen] = useState(false);
  const { c } = useTheme();
  return (
    <PickerShell label={label} display={value ?? 'Toute la journée'} onClear={optional && value ? () => onChange(null) : undefined} open={open} setOpen={setOpen}>
      <DateTimePicker
        value={timeAsDate(value)}
        mode="time"
        locale="fr-FR"
        is24Hour
        minuteInterval={5}
        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
        accentColor={c.secondary}
        onChange={(e, d) => {
          if (Platform.OS !== 'ios') setOpen(false);
          if (e.type === 'set' && d) onChange(toTime(d));
        }}
      />
    </PickerShell>
  );
}
