import { View } from 'react-native';

import { STATUS_LABEL, type FeatureStatus } from '@/modules/registry';
import { useTheme } from '@/theme/ThemeProvider';
import { radius } from '@/theme/tokens';
import { AppText } from './AppText';

export function StatusBadge({ status }: { status: FeatureStatus }) {
  const { c } = useTheme();
  return (
    <View style={{ alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.pill, borderWidth: 1, borderColor: c.rest }}>
      <AppText variant="caption" color={c.primary} style={{ fontFamily: 'Inter_600SemiBold' }}>
        {STATUS_LABEL[status]}
      </AppText>
    </View>
  );
}
