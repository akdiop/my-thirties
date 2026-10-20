import { router } from 'expo-router';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';

import { addDays, dayLabel, rangeDays, startOfWeek } from '@/agenda/dates';
import { DateField, TimeField } from '@/components/form/DateTimeField';
import { Field } from '@/components/form/Field';
import { AppText, Button, Card, ListRow, Screen } from '@/components/ui';
import { formatQty, prepOrder, shoppingList, SLOT_LABEL, type RecipeLike } from '@/cuisine/cuisine';
import { useData, useMutate } from '@/hooks/useData';
import { useToday } from '@/hooks/useToday';
import { useTheme } from '@/theme/ThemeProvider';
import { MIN_TOUCH, radius } from '@/theme/tokens';

const SLOTS = ['dejeuner', 'diner'] as const;

export default function Cuisine() {
  const today = useToday();
  const { c } = useTheme();
  const mutate = useMutate();
  const [week, setWeek] = useState(startOfWeek(today));
  const days = rangeDays(week, 7);
  const meals = useData(({ life }) => life.mealsBetween(week, addDays(week, 6)), [week]);
  const recipes = useData(({ life }) => life.listRecipes());
  const pantry = useData(({ life }) => life.listPantry());
  const [batchDate, setBatchDate] = useState<string | null>(addDays(week, -1) >= today ? addDays(week, -1) : today);
  const [batchTime, setBatchTime] = useState<string | null>('10:00');

  const byId = useMemo(() => new Map(recipes.map((r) => [r.id, r])), [recipes]);
  const planned = meals.flatMap((m) => {
    const r = m.recipeId ? byId.get(m.recipeId) : undefined;
    return r ? [{ recipe: r as RecipeLike, portions: m.portions }] : [];
  });
  const lines = shoppingList(planned, pantry);
  const uniqueRecipes = [...new Map(planned.map((p) => [p.recipe.id, p.recipe])).values()];
  const order = prepOrder(uniqueRecipes);

  const arrow = (dir: -1 | 1) => (
    <Pressable accessibilityRole="button" accessibilityLabel={dir < 0 ? 'Semaine précédente' : 'Semaine suivante'} onPress={() => setWeek(addDays(week, dir * 7))} style={{ width: MIN_TOUCH, height: MIN_TOUCH, alignItems: 'center', justifyContent: 'center' }}>
      {dir < 0 ? <ChevronLeft size={20} color={c.primary} /> : <ChevronRight size={20} color={c.primary} />}
    </Pressable>
  );

  return (
    <Screen title="Ma cuisine" back>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <Button label="Mes recettes" variant="outline" style={{ flex: 1 }} onPress={() => router.push('/cuisine/recettes')} />
        <Button label="Placard" variant="outline" style={{ flex: 1 }} onPress={() => router.push('/cuisine/placard')} />
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        {arrow(-1)}
        <AppText variant="cardTitle">Semaine du {week.slice(8, 10)}/{week.slice(5, 7)}</AppText>
        {arrow(1)}
      </View>

      <Card style={{ gap: 10 }}>
        {days.map((d) => (
          <View key={d} style={{ gap: 6 }}>
            <AppText variant="label" color={d === today ? c.accent : c.textMuted} style={{ textTransform: 'capitalize', fontFamily: 'Inter_600SemiBold' }}>{dayLabel(d)}</AppText>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {SLOTS.map((slot) => {
                const m = meals.find((x) => x.date === d && x.slot === slot);
                return (
                  <Pressable
                    key={slot}
                    accessibilityRole="button"
                    accessibilityLabel={`${SLOT_LABEL[slot]} ${dayLabel(d)} : ${m ? m.title : 'rien de prévu'}`}
                    onPress={() => router.push({ pathname: '/cuisine/repas', params: { date: d, slot } })}
                    style={{ flex: 1, minHeight: MIN_TOUCH, borderRadius: radius.md, padding: 10, backgroundColor: m ? c.successTint : c.surfaceAlt }}
                  >
                    <AppText variant="caption" color={c.textMuted}>{SLOT_LABEL[slot]}</AppText>
                    <AppText variant="label" numberOfLines={2}>{m ? `${m.title} · ${m.portions}` : '+'}</AppText>
                  </Pressable>
                );
              })}
            </View>
          </View>
        ))}
      </Card>

      <Card style={{ gap: 8 }}>
        <AppText variant="cardTitle">Courses de la semaine</AppText>
        {lines.length ? (
          <>
            {lines.slice(0, 8).map((l, i) => (
              <ListRow key={`${l.name}-${l.unit}`} label={l.name} value={formatQty(l)} last={i === Math.min(7, lines.length - 1)} />
            ))}
            {lines.length > 8 ? <AppText variant="caption" color={c.textMuted}>… et {lines.length - 8} autres</AppText> : null}
            <AppText variant="caption" color={c.textMuted}>Le contenu du placard est déjà déduit.</AppText>
            <Button
              label="Envoyer dans Mes listes"
              onPress={() => {
                const id = mutate(({ life }) => life.syncShoppingList(week, lines));
                router.push({ pathname: '/listes/[id]', params: { id } });
              }}
            />
          </>
        ) : (
          <AppText color={c.textMuted}>Planifiez des repas à partir de vos recettes pour obtenir la liste.</AppText>
        )}
      </Card>

      {uniqueRecipes.length ? (
        <Card tone="sand" style={{ gap: 8 }}>
          <AppText variant="cardTitle">Session batch cooking</AppText>
          <AppText variant="caption" color={c.textMuted}>Environ {Math.round(order.estimateMin / 15) * 15} min · ordre conseillé</AppText>
          {order.steps.map((s, i) => (
            <AppText key={i}>{i + 1}. {s}</AppText>
          ))}
          {uniqueRecipes.some((r) => r.storage) ? (
            <View style={{ gap: 4 }}>
              <AppText style={{ fontFamily: 'Inter_600SemiBold' }}>Conservation</AppText>
              {uniqueRecipes.filter((r) => r.storage).map((r) => (
                <AppText key={r.id} variant="caption">{r.title} : {r.storage}</AppText>
              ))}
            </View>
          ) : null}
          <Field label="Quand ?">
            <DateField label="Date de la session" value={batchDate} onChange={setBatchDate} />
          </Field>
          <TimeField label="Heure de la session" value={batchTime} onChange={setBatchTime} optional />
          <Button
            label="Ajouter à l’agenda"
            variant="secondary"
            disabled={!batchDate}
            onPress={() => {
              if (!batchDate) return;
              mutate(({ life }) => life.scheduleBatch(batchDate, batchTime, order.steps.join('\n'), week));
              router.navigate('/agenda');
            }}
          />
        </Card>
      ) : null}
    </Screen>
  );
}
