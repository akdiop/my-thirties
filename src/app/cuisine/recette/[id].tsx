import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, View } from 'react-native';

import { Stepper } from '@/components/form/Scale';
import { AppText, Button, Card, ListRow, Screen } from '@/components/ui';
import { categoryLabel, formatQty, originLabel, scaleIngredients } from '@/cuisine/cuisine';
import { useData, useMutate } from '@/hooks/useData';
import { useTheme } from '@/theme/ThemeProvider';

export default function Recette() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { c } = useTheme();
  const mutate = useMutate();
  const r = useData(({ life }) => life.getRecipe(id), [id]);
  const [portions, setPortions] = useState(r?.servings ?? 4);
  if (!r || r.deletedAt) return <Screen title="Recette" back><AppText>Recette introuvable.</AppText></Screen>;
  const ingredients = scaleIngredients(r, portions);

  return (
    <Screen title={r.title} subtitle={`${originLabel(r.origin)} · ${categoryLabel(r.category)}`} back>
      <View style={{ flexDirection: 'row', gap: 16 }}>
        {r.prepMin ? <AppText variant="caption">Préparation {r.prepMin} min</AppText> : null}
        {r.cookMin ? <AppText variant="caption">Cuisson {r.cookMin} min</AppText> : null}
      </View>
      <Card style={{ gap: 8 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <AppText variant="cardTitle">Ingrédients</AppText>
          <Stepper label="Portions" value={portions} onChange={setPortions} min={1} max={30} suffix="pers." />
        </View>
        {ingredients.map((i, k) => (
          <ListRow key={k} label={i.name} value={formatQty(i)} last={k === ingredients.length - 1} />
        ))}
      </Card>
      {r.steps.length ? (
        <Card style={{ gap: 8 }}>
          <AppText variant="cardTitle">Étapes</AppText>
          {r.steps.map((s, k) => (
            <AppText key={k}>{k + 1}. {s}</AppText>
          ))}
        </Card>
      ) : null}
      {r.storage ? (
        <Card tone="sand" style={{ gap: 4 }}>
          <AppText style={{ fontFamily: 'Inter_600SemiBold' }}>Conservation</AppText>
          <AppText>{r.storage}</AppText>
        </Card>
      ) : null}
      {r.notes ? <AppText color={c.textMuted}>{r.notes}</AppText> : null}
      <Button label="Modifier" variant="outline" onPress={() => router.push({ pathname: '/cuisine/edition/[id]', params: { id: r.id } })} />
      <Button
        label="Supprimer"
        variant="danger"
        onPress={() =>
          Alert.alert('Supprimer cette recette ?', 'Les repas déjà planifiés gardent leur nom.', [
            { text: 'Annuler', style: 'cancel' },
            {
              text: 'Supprimer',
              style: 'destructive',
              onPress: () => {
                mutate(({ life }) => life.deleteRecipe(r.id));
                router.back();
              },
            },
          ])
        }
      />
    </Screen>
  );
}
