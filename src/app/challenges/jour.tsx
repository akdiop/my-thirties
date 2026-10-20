import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { dayLabel } from '@/agenda/dates';
import { adapt, dateForDay, templateById, UNIT_LABEL, type ChallengeUnit } from '@/challenges/challenges';
import { AppText, Button, Card, Screen } from '@/components/ui';
import { VideoCard } from '@/components/VideoCard';
import { formatAmount } from '@/features/challengeView';
import { useData, useMutate } from '@/hooks/useData';
import { useTheme } from '@/theme/ThemeProvider';

export default function ChallengeDay() {
  const { id, day: dayParam } = useLocalSearchParams<{ id: string; day: string }>();
  const day = Number(dayParam);
  const { c } = useTheme();
  const mutate = useMutate();
  const data = useData(({ well }) => ({ ch: well.getChallenge(id), adjusted: well.adjustedValue(id, day) }), [id, day]);
  const [showAdapt, setShowAdapt] = useState(false);

  if (!data.ch) {
    return (
      <Screen title="Challenge introuvable" back>
        <AppText>Ce challenge n’existe plus.</AppText>
      </Screen>
    );
  }
  const ch = data.ch;
  const t = templateById(ch.templateId);
  const planned = ch.plan[day - 1] ?? 0;
  const value = data.adjusted ?? planned;
  const date = dateForDay(ch.startDate, day);

  return (
    <Screen
      title={`${formatAmount(value, ch.unit)} ${ch.unit === 'reps' ? ch.exercise.toLowerCase() : ''}`}
      subtitle={`${ch.title} · jour ${day} sur ${ch.plan.length} · ${dayLabel(date)}`}
      back
      footer={
        <View style={{ gap: 10 }}>
          <Button
            label="Terminé"
            onPress={() => {
              mutate(({ well }) => well.completeChallengeDay(id, day, date, value));
              router.back();
            }}
          />
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Button
              style={{ flex: 1 }}
              label="Reporter à demain"
              variant="outline"
              onPress={() => {
                mutate(({ well }) => well.postponeChallengeDay(id, day));
                router.back();
              }}
            />
            <Button style={{ flex: 1 }} label="Adapter" variant="secondary" onPress={() => setShowAdapt(!showAdapt)} />
          </View>
        </View>
      }
    >
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <Card tone="sand" style={{ flex: 1, alignItems: 'center', gap: 2 }}>
          <AppText variant="number">{ch.sets} × {formatAmount(value, ch.unit)}</AppText>
          <AppText variant="caption">{UNIT_LABEL[ch.unit as ChallengeUnit]}</AppText>
        </Card>
        <Card tone="sand" style={{ flex: 1, alignItems: 'center', gap: 2 }}>
          <AppText variant="number">60 s</AppText>
          <AppText variant="caption">de repos entre séries</AppText>
        </Card>
      </View>
      {data.adjusted !== null ? <AppText color={c.accent}>Version adaptée : {formatAmount(data.adjusted, ch.unit)} au lieu de {formatAmount(planned, ch.unit)}.</AppText> : null}
      {showAdapt ? (
        <Card tone="sage" style={{ gap: 10 }}>
          <AppText style={{ fontFamily: 'Inter_600SemiBold' }}>Adapter la séance du jour</AppText>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {[0.8, 0.6, 0.5].map((f) => (
              <Button
                key={f}
                style={{ flex: 1 }}
                label={`${Math.round(f * 100)} %`}
                variant="outline"
                onPress={() => {
                  mutate(({ well }) => well.adaptChallengeDay(id, day, adapt(planned, f)));
                  setShowAdapt(false);
                }}
              />
            ))}
          </View>
          <AppText variant="caption">Le jour compte comme réalisé une fois la version adaptée faite.</AppText>
        </Card>
      ) : null}
      {ch.templateId ? <VideoCard mediaKey={`challenge-${ch.templateId}`} /> : null}
      {t ? (
        <>
          <Card style={{ gap: 8 }}>
            <AppText style={{ fontFamily: 'Inter_600SemiBold' }}>Comment faire</AppText>
            {t.instructions.map((s, i) => (
              <View key={i} style={{ flexDirection: 'row', gap: 10 }}>
                <AppText variant="label" style={{ width: 18 }}>{i + 1}.</AppText>
                <AppText style={{ flex: 1 }}>{s}</AppText>
              </View>
            ))}
          </Card>
          <Card tone="sage" style={{ gap: 4 }}>
            <AppText style={{ fontFamily: 'Inter_600SemiBold' }}>Précautions et alternative</AppText>
            <AppText>{t.cautions}</AppText>
            <AppText>Plus doux : {t.alternative}</AppText>
          </Card>
        </>
      ) : null}
    </Screen>
  );
}
