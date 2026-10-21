import { useState } from 'react';
import { Modal, Pressable, ScrollView, View } from 'react-native';
import { ChevronDown, Check } from 'lucide-react-native';

import { FieldLabel, TextField } from '@/components/form/Field';
import { AppText } from '@/components/ui';
import { useTheme } from '@/theme/ThemeProvider';
import { radius } from '@/theme/tokens';

export type SelectOption<T extends string | null> = { value: T; label: string };

export function SelectField<T extends string | null>({
  label, options, value, onChange, allowCustom = false,
}: {
  label: string;
  options: SelectOption<T>[];
  value: T;
  onChange: (next: T) => void;
  allowCustom?: boolean;
}) {
  const { c } = useTheme();
  const [open, setOpen] = useState(false);
  const [manual, setManual] = useState(false);
  const selected = options.find((option) => option.value === value);
  const isCustom = allowCustom && (manual || (value !== null && value !== '' && !selected));

  return <View style={{ gap: 8 }}>
    <FieldLabel>{label}</FieldLabel>
    <Pressable accessibilityRole="button" accessibilityLabel={label + ' : ' + (selected?.label ?? (value || 'Choisir'))}
      accessibilityHint="Ouvrir la liste des choix"
      onPress={() => setOpen(true)}
      style={{ minHeight: 48, borderWidth: 1, borderColor: c.border, borderRadius: radius.md,
        backgroundColor: c.surface, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
      <AppText style={{ flex: 1 }}>{selected?.label ?? (isCustom ? 'Autre (préciser)' : value || 'Choisir…')}</AppText>
      <ChevronDown size={18} color={c.textMuted} />
    </Pressable>
    {isCustom ? <TextField label={'Préciser : ' + label} value={value ?? ''} onChangeText={(v) => onChange(v as T)} maxLength={120} /> : null}
    <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'center', padding: 24 }}>
        <Pressable accessibilityLabel="Fermer la liste" onPress={() => setOpen(false)} style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }} />
        <View style={{ backgroundColor: c.surface, borderRadius: radius.lg, padding: 16, maxHeight: '75%', gap: 12 }}>
          <AppText variant="cardTitle">{label}</AppText>
          <ScrollView keyboardShouldPersistTaps="handled">
            {options.map((option, i) => <Pressable key={String(option.value) + '-' + i}
              accessibilityRole="radio" accessibilityState={{ selected: value === option.value }}
              onPress={() => { setManual(false); onChange(option.value); setOpen(false); }}
              style={{ minHeight: 48, paddingVertical: 12, paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: c.border,
                flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
              <AppText style={{ flex: 1 }}>{option.label}</AppText>
              {value === option.value ? <Check size={18} color={c.text} /> : null}
            </Pressable>)}
            {allowCustom ? <Pressable accessibilityRole="button" onPress={() => { setManual(true); onChange('' as T); setOpen(false); }}
              style={{ minHeight: 48, paddingVertical: 12, paddingHorizontal: 8 }}>
              <AppText>Autre (préciser)</AppText>
            </Pressable> : null}
          </ScrollView>
          <Pressable accessibilityRole="button" onPress={() => setOpen(false)} style={{ paddingVertical: 12, alignItems: 'center' }}>
            <AppText color={c.textMuted}>Fermer</AppText>
          </Pressable>
        </View>
      </View>
    </Modal>
  </View>;
}
