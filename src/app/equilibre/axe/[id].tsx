import { useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

import { AppText, Card, Screen } from '@/components/ui';
import { axisById } from '@/equilibre/content';

export default function Axe() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const a = axisById(id);
  if (!a) {
    return (
      <Screen title="Axe introuvable" back>
        <AppText>Cet axe n’existe pas.</AppText>
      </Screen>
    );
  }
  return (
    <Screen title={a.title} subtitle={a.subtitle} back>
      <AppText>{a.explanation}</AppText>
      {a.exercises.map((ex) => (
        <Card key={ex.title} tone="sage" style={{ gap: 8 }}>
          <AppText style={{ fontFamily: 'Inter_600SemiBold' }}>{ex.title}</AppText>
          {ex.steps.map((s, i) => (
            <View key={i} style={{ flexDirection: 'row', gap: 10 }}>
              <AppText variant="label" style={{ width: 18 }}>{i + 1}.</AppText>
              <AppText style={{ flex: 1 }}>{s}</AppText>
            </View>
          ))}
        </Card>
      ))}
      <Card style={{ gap: 8 }}>
        <AppText style={{ fontFamily: 'Inter_600SemiBold' }}>Questions de réflexion</AppText>
        {a.questions.map((q) => (
          <AppText key={q}>· {q}</AppText>
        ))}
      </Card>
      <Card tone="sand" style={{ gap: 4 }}>
        <AppText style={{ fontFamily: 'Inter_600SemiBold' }}>Situation concrète</AppText>
        <AppText>{a.situation}</AppText>
      </Card>
    </Screen>
  );
}
