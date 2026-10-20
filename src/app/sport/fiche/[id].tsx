import { router, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

import { AppText, Button, Card, Screen } from '@/components/ui';
import { DISCIPLINE_LABEL, ficheById } from '@/sport/content';
import { useTheme } from '@/theme/ThemeProvider';

function Block({ title, items, tone }: { title: string; items?: string[]; tone?: 'sand' | 'sage' }) {
  if (!items?.length) return null;
  return (
    <Card tone={tone} style={{ gap: 8 }}>
      <AppText style={{ fontFamily: 'Inter_600SemiBold' }}>{title}</AppText>
      {items.map((t, i) => (
        <View key={i} style={{ flexDirection: 'row', gap: 10 }}>
          <AppText variant="label" style={{ width: 18 }}>{i + 1}.</AppText>
          <AppText style={{ flex: 1 }}>{t}</AppText>
        </View>
      ))}
    </Card>
  );
}

export default function Fiche() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const fiche = ficheById(id);
  const { c } = useTheme();
  if (!fiche) {
    return (
      <Screen title="Fiche introuvable" back>
        <AppText>Cette fiche n’existe pas.</AppText>
      </Screen>
    );
  }
  return (
    <Screen
      title={fiche.title}
      subtitle={`${DISCIPLINE_LABEL[fiche.discipline]} · ${fiche.section}${fiche.minutes ? ` · ${fiche.minutes} min` : ''}`}
      back
      footer={
        <Button
          label="Noter une séance"
          variant="secondary"
          onPress={() => router.push({ pathname: '/sport/seance/[id]', params: { id: 'nouveau', discipline: fiche.discipline, title: fiche.title } })}
        />
      }
    >
      <AppText>{fiche.summary}</AppText>
      <Card tone="sand" style={{ minHeight: 120, alignItems: 'center', justifyContent: 'center' }}>
        <AppText variant="caption" center>Vidéo de démonstration à choisir avec vous</AppText>
      </Card>
      <Block title="Comment faire" items={fiche.steps} />
      <Block title="Erreurs fréquentes" items={fiche.errors} />
      <Block title="Exercices" items={fiche.drills} tone="sage" />
      <Block title="Conseils" items={fiche.tips} />
      {fiche.cautions ? (
        <Card style={{ gap: 4, borderColor: c.rest }}>
          <AppText style={{ fontFamily: 'Inter_600SemiBold' }}>Précautions</AppText>
          <AppText>{fiche.cautions}</AppText>
        </Card>
      ) : null}
      {fiche.alternative ? (
        <Card tone="sage" style={{ gap: 4 }}>
          <AppText style={{ fontFamily: 'Inter_600SemiBold' }}>Version plus douce</AppText>
          <AppText>{fiche.alternative}</AppText>
        </Card>
      ) : null}
    </Screen>
  );
}
