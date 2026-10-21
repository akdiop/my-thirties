import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';

import { dayLabel } from '@/agenda/dates';
import { Chips } from '@/components/form/Chips';
import { SelectField } from '@/components/form/SelectField';
import { Field, TextField } from '@/components/form/Field';
import { Stepper } from '@/components/form/Scale';
import { AppText, Button, Screen } from '@/components/ui';
import { SLOT_LABEL } from '@/cuisine/cuisine';
import { useData, useMutate } from '@/hooks/useData';
import { useTheme } from '@/theme/ThemeProvider';

export default function Repas() {
  const { date, slot } = useLocalSearchParams<{ date: string; slot: 'dejeuner' | 'diner' }>();
  const { c } = useTheme();
  const mutate = useMutate();
  const recipes = useData(({ life }) => life.listRecipes());
  const existing = useData(({ life }) => life.mealsBetween(date, date).find((m) => m.slot === slot), [date, slot]);
  const [recipeId, setRecipeId] = useState<string | null>(existing?.recipeId ?? null);
  const [title, setTitle] = useState(existing && !existing.recipeId ? existing.title : '');
  const [portions, setPortions] = useState(existing?.portions ?? 2);
  const chosen = recipes.find((r) => r.id === recipeId);
  const finalTitle = chosen?.title ?? title.trim();

  return (
    <Screen
      title={SLOT_LABEL[slot] ?? 'Repas'}
      subtitle={dayLabel(date)}
      back
      footer={
        <Button
          label="Enregistrer"
          disabled={!finalTitle}
          onPress={() => {
            mutate(({ life }) => life.planMeal(date, slot, recipeId, finalTitle, portions));
            router.back();
          }}
        />
      }
    >
      {recipes.length ? (
        <SelectField label="Recette" options={[{ value: null, label: 'Autre' }, ...recipes.map((r) => ({ value: r.id as string | null, label: r.title }))]} value={recipeId} onChange={setRecipeId} />
      ) : (
        <AppText color={c.textMuted}>Ajoutez des recettes dans « Mes recettes » pour calculer automatiquement les courses.</AppText>
      )}
      {!recipeId ? <TextField label="Repas" value={title} onChangeText={setTitle} maxLength={60} placeholder="Restes, restaurant…" /> : null}
      <Field label="Portions">
        <Stepper label="Portions" value={portions} onChange={setPortions} min={1} max={20} />
      </Field>
      {existing ? (
        <Button
          label="Retirer du planning"
          variant="danger"
          onPress={() => {
            mutate(({ life }) => life.deleteMeal(existing.id));
            router.back();
          }}
        />
      ) : null}
    </Screen>
  );
}
