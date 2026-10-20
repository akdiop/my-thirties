import { useState } from 'react';
import { KeyboardAvoidingView, Platform, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText, Button } from '@/components/ui';
import { useSession } from '@/db/DatabaseProvider';
import { useRefresh } from '@/data/useRefresh';
import { useTheme } from '@/theme/ThemeProvider';
import { radius } from '@/theme/tokens';

export function Welcome() {
  const { repo } = useSession();
  const refresh = useRefresh();
  const { c } = useTheme();
  const [name, setName] = useState('');
  const valid = name.trim().length >= 1 && name.trim().length <= 40;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.background }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, padding: 32, justifyContent: 'center', gap: 16 }}>
        <AppText variant="display" center>My thirties</AppText>
        <AppText variant="label" center color={c.secondary} style={{ letterSpacing: 2.5, textTransform: 'uppercase', marginBottom: 24 }}>
          Un quotidien plus aligné, plus serein, toujours moi
        </AppText>
        <View style={{ gap: 8 }}>
          <AppText variant="label" nativeID="firstNameLabel">Votre prénom</AppText>
          <TextInput
            accessibilityLabelledBy="firstNameLabel"
            value={name}
            onChangeText={setName}
            autoFocus
            maxLength={40}
            autoComplete="given-name"
            returnKeyType="done"
            style={{ height: 52, borderRadius: radius.md, borderWidth: 1, borderColor: c.border, backgroundColor: c.surface, paddingHorizontal: 16, fontFamily: 'Inter_400Regular', fontSize: 16, color: c.text }}
          />
        </View>
        <Button
          label="Commencer"
          disabled={!valid}
          onPress={() => {
            repo.createProfile(name);
            refresh();
          }}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
