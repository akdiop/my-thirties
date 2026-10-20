import { router } from 'expo-router';
import { X } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Easing, Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText, Button } from '@/components/ui';
import { breathAt, CYCLES, EXHALE_MS, INHALE_MS } from '@/features/calm/breathing';
import { useTheme } from '@/theme/ThemeProvider';
import { palette } from '@/theme/tokens';

export default function Calme() {
  const { c, scheme } = useTheme();
  const [start] = useState(() => Date.now());
  const [now, setNow] = useState(start);
  const [reduceMotion, setReduceMotion] = useState(false);
  const scale = useRef(new Animated.Value(0.7)).current;
  const state = breathAt(now - start);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
    const t = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (reduceMotion || state.done) return;
    Animated.timing(scale, {
      toValue: state.phase === 'inhale' ? 1 : 0.7,
      duration: state.phase === 'inhale' ? INHALE_MS : EXHALE_MS,
      easing: Easing.inOut(Easing.sin),
      useNativeDriver: true,
    }).start();
  }, [state.phase, state.cycle, state.done, reduceMotion, scale]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: scheme === 'dark' ? c.background : c.successTint, alignItems: 'center', paddingHorizontal: 24 }}>
      <View style={{ alignSelf: 'stretch', alignItems: 'flex-end', paddingTop: 8 }}>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.back()}
          style={{ minHeight: 44, paddingHorizontal: 16, borderRadius: 22, backgroundColor: c.background, flexDirection: 'row', alignItems: 'center', gap: 8 }}
        >
          <X size={16} color={c.accent} />
          <AppText variant="label" color={c.accent}>Quitter</AppText>
        </Pressable>
      </View>
      <AppText variant="screenTitle" center color={c.text} style={{ marginTop: 28 }}>
        {state.done ? 'Bien joué.' : 'Vous êtes en sécurité.\nRespirons ensemble.'}
      </AppText>
      <View style={{ width: 280, height: 280, marginTop: 40, alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ position: 'absolute', width: 280, height: 280, borderRadius: 140, backgroundColor: palette.sage, opacity: 0.2 }} />
        <Animated.View
          style={{ width: 200, height: 200, borderRadius: 100, backgroundColor: palette.olive, alignItems: 'center', justifyContent: 'center', transform: [{ scale }] }}
        >
          <AppText accessibilityLiveRegion="polite" color="#FFFFFF" style={{ fontFamily: 'Inter_600SemiBold', fontSize: 22, lineHeight: 28 }}>
            {state.done ? 'Terminé' : state.phase === 'inhale' ? 'Inspirez' : 'Expirez'}
          </AppText>
          {!state.done && <AppText color="#FFFFFF">{state.secondsLeft} s</AppText>}
        </Animated.View>
      </View>
      <AppText variant="label" color={c.accent} style={{ marginTop: 28 }}>
        {state.done ? `${CYCLES} cycles` : `Cycle ${state.cycle} sur ${CYCLES} · inspirez 4 s, expirez 6 s`}
      </AppText>
      <View style={{ flex: 1 }} />
      <View style={{ alignSelf: 'stretch', paddingBottom: 16 }}>
        <Button label={state.done ? 'Revenir' : 'Je me sens mieux'} variant="secondary" onPress={() => router.back()} />
      </View>
    </SafeAreaView>
  );
}
