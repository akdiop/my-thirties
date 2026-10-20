import { router } from 'expo-router';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';

import { groupByDate } from '@/agenda/agenda';
import { addDays, addMonths, dayLabel, monthGrid, monthLabel, rangeDays, startOfWeek, weekdayShort, type ISODate } from '@/agenda/dates';
import { AppText, Screen } from '@/components/ui';
import { Segmented } from '@/components/ui/Segmented';
import { AgendaItemRow } from '@/features/agenda/AgendaItemRow';
import { useAgenda } from '@/features/agenda/useAgenda';
import { useToday } from '@/hooks/useToday';
import { useTheme } from '@/theme/ThemeProvider';
import { MIN_TOUCH } from '@/theme/tokens';

type Mode = 'day' | 'week' | 'month';

export default function Agenda() {
  const today = useToday();
  const { c } = useTheme();
  const [mode, setMode] = useState<Mode>('week');
  const [selected, setSelected] = useState<ISODate>(today);

  const range = useMemo(() => {
    if (mode === 'day') return [selected];
    if (mode === 'week') return rangeDays(startOfWeek(selected), 7);
    return monthGrid(selected);
  }, [mode, selected]);

  const items = useAgenda(range[0]!, range[range.length - 1]!);
  const byDate = useMemo(() => groupByDate(items), [items]);
  const dayItems = byDate.get(selected) ?? [];

  const shift = (dir: -1 | 1) => setSelected(mode === 'day' ? addDays(selected, dir) : mode === 'week' ? addDays(selected, 7 * dir) : addMonths(selected, dir));

  const nav = (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      <Pressable accessibilityRole="button" accessibilityLabel="Précédent" onPress={() => shift(-1)} style={{ width: MIN_TOUCH, height: MIN_TOUCH, alignItems: 'center', justifyContent: 'center' }}>
        <ChevronLeft size={22} color={c.primary} />
      </Pressable>
      <Pressable accessibilityRole="button" accessibilityHint="Revenir à aujourd’hui" onPress={() => setSelected(today)}>
        <AppText variant="label" color={c.primary} style={{ fontFamily: 'Inter_600SemiBold', fontSize: 15 }}>
          {mode === 'day' ? dayLabel(selected) : monthLabel(selected)}
        </AppText>
      </Pressable>
      <Pressable accessibilityRole="button" accessibilityLabel="Suivant" onPress={() => shift(1)} style={{ width: MIN_TOUCH, height: MIN_TOUCH, alignItems: 'center', justifyContent: 'center' }}>
        <ChevronRight size={22} color={c.primary} />
      </Pressable>
    </View>
  );

  const dayCell = (d: ISODate, compact: boolean) => {
    const isSel = d === selected;
    const isToday = d === today;
    const outside = mode === 'month' && d.slice(0, 7) !== selected.slice(0, 7);
    const has = (byDate.get(d)?.length ?? 0) > 0;
    return (
      <Pressable
        key={d}
        accessibilityRole="button"
        accessibilityLabel={`${dayLabel(d)}${has ? ', occupé' : ''}`}
        accessibilityState={{ selected: isSel }}
        onPress={() => setSelected(d)}
        style={{ flex: 1, alignItems: 'center', gap: 4, paddingVertical: compact ? 4 : 6, opacity: outside ? 0.4 : 1 }}
      >
        {!compact ? <AppText variant="caption" color={c.textMuted}>{weekdayShort(d)}</AppText> : null}
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: isSel ? c.primary : 'transparent',
            borderWidth: isToday && !isSel ? 1.5 : 0,
            borderColor: c.primary,
          }}
        >
          <AppText style={{ fontFamily: 'Inter_600SemiBold' }} color={isSel ? c.onPrimary : c.text}>
            {Number(d.slice(8))}
          </AppText>
        </View>
        <View style={{ width: 5, height: 5, borderRadius: 3, backgroundColor: has ? c.secondary : 'transparent' }} />
      </Pressable>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <Screen
        title="Agenda"
        right={
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Nouvel événement"
            onPress={() => router.push({ pathname: '/evenement/[id]', params: { id: 'nouveau', date: selected } })}
            style={{ width: MIN_TOUCH, height: MIN_TOUCH, alignItems: 'center', justifyContent: 'center' }}
          >
            <Plus size={24} color={c.primary} />
          </Pressable>
        }
      >
        <Segmented<Mode>
          label="Affichage"
          value={mode}
          onChange={setMode}
          options={[{ value: 'day', label: 'Jour' }, { value: 'week', label: 'Semaine' }, { value: 'month', label: 'Mois' }]}
        />
        {nav}
        {mode === 'week' ? <View style={{ flexDirection: 'row' }}>{range.map((d) => dayCell(d, false))}</View> : null}
        {mode === 'month' ? (
          <View>
            <View style={{ flexDirection: 'row' }}>
              {range.slice(0, 7).map((d) => (
                <AppText key={d} variant="caption" color={c.textMuted} center style={{ flex: 1 }}>
                  {weekdayShort(d)}
                </AppText>
              ))}
            </View>
            {Array.from({ length: range.length / 7 }, (_, w) => (
              <View key={w} style={{ flexDirection: 'row' }}>
                {range.slice(w * 7, w * 7 + 7).map((d) => dayCell(d, true))}
              </View>
            ))}
          </View>
        ) : null}
        {mode !== 'day' ? (
          <AppText variant="cardTitle" style={{ textTransform: 'capitalize' }}>
            {dayLabel(selected)}
          </AppText>
        ) : null}
        <View style={{ gap: 8 }}>
          {dayItems.length ? (
            dayItems.map((item) => <AgendaItemRow key={item.key} item={item} />)
          ) : (
            <AppText color={c.textMuted}>Rien de prévu. Touchez + pour ajouter un événement.</AppText>
          )}
        </View>
      </Screen>
    </View>
  );
}
