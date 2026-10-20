import { PlayCircle } from 'lucide-react-native';
import { Linking, Pressable, View } from 'react-native';

import { AppText, Card } from '@/components/ui';
import { videoFor } from '@/sport/media';
import { useTheme } from '@/theme/ThemeProvider';

export function VideoCard({ mediaKey }: { mediaKey: string }) {
  const { c } = useTheme();
  const video = videoFor(mediaKey);
  if (!video) {
    return (
      <Card tone="sand" style={{ minHeight: 72, alignItems: 'center', justifyContent: 'center' }}>
        <AppText variant="caption" center>Pas encore de vidéo de démonstration</AppText>
      </Card>
    );
  }
  return (
    <Pressable accessibilityRole="link" accessibilityHint="Ouvre la vidéo dans YouTube" onPress={() => Linking.openURL(video.url)}>
      <Card tone="sage" style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <PlayCircle size={34} color={c.accent} />
        <View style={{ flex: 1, gap: 2 }}>
          <AppText style={{ fontFamily: 'Inter_600SemiBold' }}>Regarder la démonstration</AppText>
          <AppText variant="caption">
            {video.title} · {video.lang === 'fr' ? 'en français' : 'en anglais'} · YouTube, connexion requise
          </AppText>
        </View>
      </Card>
    </Pressable>
  );
}
