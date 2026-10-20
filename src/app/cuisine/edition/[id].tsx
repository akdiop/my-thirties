import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';

import { Chips } from '@/components/form/Chips';
import { Field, TextField } from '@/components/form/Field';
import { Stepper } from '@/components/form/Scale';
import { AppText, Button, Screen } from '@/components/ui';
import { CATEGORIES, ingredientLine, ORIGINS, parseIngredientLine } from '@/cuisine/cuisine';
import { useData, useMutate } from '@/hooks/useData';
import { useTheme } from '@/theme/ThemeProvider';

export default function EditionRecette() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { c } = useTheme();
  const mutate = useMutate();
  const r = useData(({ life }) => (id === 'new' ? undefined : life.getRecipe(id)), [id]);
  const [title, setTitle] = useState(r?.title ?? '');
  const [origin, setOrigin] = useState<string>(r?.origin ?? 'maison');
  const [category, setCategory] = useState<string>(r?.category ?? 'plat');
  const [servings, setServings] = useState(r?.servings ?? 4);
  const [prepMin, setPrepMin] = useState(r?.prepMin ?? 15);
  const [cookMin, setCookMin] = useState(r?.cookMin ?? 30);
  const [ingredients, setIngredients] = useState(r ? r.ingredients.map(ingredientLine).join('\n') : '');
  const [steps, setSteps] = useState(r ? r.steps.join('\n') : '');
  const [storage, setStorage] = useState(r?.storage ?? '');
  const [notes, setNotes] = useState(r?.notes ?? '');

  const save = () => {
    const savedId = mutate(({ life }) =>
      life.saveRecipe(
        {
          title: title.trim(),
          origin,
          category,
          servings,
          prepMin,
          cookMin,
          ingredients: ingredients.split('\n').flatMap((l) => parseIngredientLine(l) ?? []),
          steps: steps.split('\n').map((s) => s.trim()).filter(Boolean),
          storage: storage.trim() || null,
          notes: notes.trim() || null,
        },
        r?.id,
      ),
    );
    if (r) router.back();
    else router.replace({ pathname: '/cuisine/recette/[id]', params: { id: savedId } });
  };

  return (
    <Screen title={r ? 'Modifier la recette' : 'Nouvelle recette'} back footer={<Button label="Enregistrer" disabled={!title.trim()} onPress={save} />}>
      <TextField label="Nom" value={title} onChangeText={setTitle} maxLength={80} />
      <Field label="Origine">
        <Chips label="Origine" options={ORIGINS.map((o) => ({ value: o.id as string, label: o.label }))} value={origin} onChange={setOrigin} />
      </Field>
      <Field label="Type">
        <Chips label="Type" options={CATEGORIES.map((o) => ({ value: o.id as string, label: o.label }))} value={category} onChange={setCategory} />
      </Field>
      <Field label="Portions">
        <Stepper label="Portions" value={servings} onChange={setServings} min={1} max={30} />
      </Field>
      <Field label="Préparation">
        <Stepper label="Préparation" value={prepMin} onChange={setPrepMin} min={0} max={240} step={5} suffix="min" />
      </Field>
      <Field label="Cuisson">
        <Stepper label="Cuisson" value={cookMin} onChange={setCookMin} min={0} max={480} step={5} suffix="min" />
      </Field>
      <TextField label="Ingrédients, un par ligne" value={ingredients} onChangeText={setIngredients} multiline placeholder={'400 g riz\n2 oignons\n1 c. à s. moutarde'} />
      <AppText variant="caption" color={c.textMuted}>Écrivez la quantité puis l’unité (g, kg, ml, l, c. à s., c. à c.) pour que les courses se calculent.</AppText>
      <TextField label="Étapes, une par ligne" value={steps} onChangeText={setSteps} multiline />
      <TextField label="Conservation" value={storage} onChangeText={setStorage} placeholder="3 jours au réfrigérateur…" maxLength={200} />
      <TextField label="Notes" value={notes} onChangeText={setNotes} multiline maxLength={1000} />
    </Screen>
  );
}
