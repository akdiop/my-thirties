import type { ReactNode } from 'react';
import { TextInput, View, type TextInputProps } from 'react-native';

import { AppText } from '@/components/ui';
import { useTheme } from '@/theme/ThemeProvider';
import { radius } from '@/theme/tokens';

export function FieldLabel({ children, nativeID }: { children: string; nativeID?: string }) {
  return (
    <AppText variant="label" nativeID={nativeID} style={{ fontFamily: 'Inter_600SemiBold' }}>
      {children}
    </AppText>
  );
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <View style={{ gap: 8 }}>
      <FieldLabel>{label}</FieldLabel>
      {children}
    </View>
  );
}

export function TextField({ label, multiline, ...props }: TextInputProps & { label: string }) {
  const { c } = useTheme();
  const id = `field-${label}`;
  return (
    <View style={{ gap: 8 }}>
      <FieldLabel nativeID={id}>{label}</FieldLabel>
      <TextInput
        accessibilityLabelledBy={id}
        placeholderTextColor={c.textMuted}
        multiline={multiline}
        {...props}
        style={[
          {
            minHeight: multiline ? 88 : 48,
            borderRadius: radius.md,
            borderWidth: 1,
            borderColor: c.border,
            backgroundColor: c.surface,
            paddingHorizontal: 14,
            paddingVertical: multiline ? 12 : 0,
            fontFamily: 'Inter_400Regular',
            fontSize: 15,
            color: c.text,
            textAlignVertical: multiline ? 'top' : 'center',
          },
          props.style,
        ]}
      />
    </View>
  );
}
