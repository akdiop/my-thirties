import { AppText, Card } from '@/components/ui';
import { useTheme } from '@/theme/ThemeProvider';

export function PlannedCard({ title, phase, children }: { title: string; phase: number; children: string }) {
  const { c } = useTheme();
  return (
    <Card style={{ gap: 6 }}>
      <AppText variant="cardTitle">{title}</AppText>
      <AppText color={c.textMuted}>{children}</AppText>
      <AppText variant="caption" color={c.accent} style={{ fontFamily: 'Inter_600SemiBold' }}>
        Prévu en phase {phase}
      </AppText>
    </Card>
  );
}
