import { router } from 'expo-router';
import { Check } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import type { AgendaItem } from '@/agenda/agenda';
import { categoryOf } from '@/agenda/categories';
import { AppText } from '@/components/ui';
import { useTheme } from '@/theme/ThemeProvider';
import { radius } from '@/theme/tokens';

export function AgendaItemRow({ item }: { item: AgendaItem }) {
  const { c } = useTheme();
  const color =
    item.kind === 'event'
      ? categoryOf(item.category).color
      : item.kind === 'task'
        ? c.primary
        : item.kind === 'routine'
          ? c.rest
          : item.kind === 'prayer'
            ? '#4A6350'
            : item.kind === 'workout'
              ? c.success
              : c.textMuted;
  const subtitle = {
    task: 'Tâche',
    routine: 'Routine',
    external: item.subtitle ?? 'Calendrier',
    prayer: 'Prière',
    workout: 'Séance réalisée',
    event: categoryOf(item.category).label,
  }[item.kind];
  const open = () => {
    if (item.kind === 'event') router.push({ pathname: '/evenement/[id]', params: { id: item.id, date: item.date } });
    else if (item.kind === 'task') router.push({ pathname: '/taches/[id]', params: { id: item.id } });
    else if (item.kind === 'routine') router.push({ pathname: '/routines/[id]', params: { id: item.id, date: item.date } });
    else if (item.kind === 'prayer') router.push('/spiritualite');
    else if (item.kind === 'workout') router.push({ pathname: '/sport/seance/[id]', params: { id: item.id } });
  };
  return (
    <Pressable
      accessibilityRole={item.kind === 'external' ? undefined : 'button'}
      disabled={item.kind === 'external'}
      onPress={open}
      style={{ flexDirection: 'row', gap: 12, alignItems: 'stretch' }}
    >
      <AppText variant="caption" color={c.textMuted} style={{ width: 44, paddingTop: 12, fontVariant: ['tabular-nums'] }}>
        {item.startTime ?? 'Jour'}
      </AppText>
      <View style={{ flex: 1, flexDirection: 'row', gap: 10, alignItems: 'center', padding: 12, borderRadius: radius.md, backgroundColor: c.surface, borderWidth: 1, borderColor: c.border }}>
        <View style={{ width: 4, alignSelf: 'stretch', borderRadius: 2, backgroundColor: color }} />
        <View style={{ flex: 1, gap: 2 }}>
          <AppText style={[{ fontFamily: 'Inter_500Medium' }, item.done && { textDecorationLine: 'line-through', color: c.textMuted }]}>{item.title}</AppText>
          <AppText variant="caption" color={c.textMuted}>
            {subtitle}
            {item.endTime ? ` · jusqu’à ${item.endTime}` : ''}
          </AppText>
        </View>
        {item.done ? <Check size={18} color={c.success} /> : null}
      </View>
    </Pressable>
  );
}
