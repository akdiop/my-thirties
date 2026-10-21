import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';

import { HeaderAdd } from '@/components/HeaderAdd';
import { SelectField } from '@/components/form/SelectField';
import { AppText, Button, Card, Screen } from '@/components/ui';
import { Segmented } from '@/components/ui/Segmented';
import { categoryLabel, originLabel, RECIPE_LIBRARY } from '@/cuisine/cuisine';
import { RECIPE_CATEGORIES } from '@/cuisine/recipeCategories';
import { CULINARY_STYLES } from '@/cuisine/recipeStyles';
import { useData, useMutate } from '@/hooks/useData';
import { useTheme } from '@/theme/ThemeProvider';

export default function Recettes() {
  const { c } = useTheme();
  const mutate = useMutate();
  const [tab, setTab] = useState<'mine' | 'library'>('mine');
  const [category, setCategory] = useState<string>('petit-dejeuner');
  const [search, setSearch] = useState('');
  const [style, setStyle] = useState('toutes');
  const [maxMinutes, setMaxMinutes] = useState('toutes');
  const recipes = useData(({ life }) => life.listRecipes());
  const filteredLibrary = RECIPE_LIBRARY.filter((r) => r.category === category &&
    (style === 'toutes' || r.origin === style) &&
    (maxMinutes === 'toutes' || (r.prepMin ?? 0) + (r.cookMin ?? 0) <= Number(maxMinutes)) &&
    (r.title + ' ' + r.ingredients.map((i) => i.name).join(' ')).toLocaleLowerCase('fr').includes(search.trim().toLocaleLowerCase('fr')));
  const imported = new Set(recipes.map((r) => r.libraryId).filter(Boolean));

  return (
    <Screen title="Mes recettes" back right={<HeaderAdd label="Nouvelle recette" onPress={() => router.push({ pathname: '/cuisine/edition/[id]', params: { id: 'new' } })} />}>
      <Segmented label="Recettes" value={tab} onChange={setTab} options={[{ value: 'mine', label: `Les miennes (${recipes.length})` }, { value: 'library', label: `Bibliothèque (${RECIPE_LIBRARY.length})` }]} />
      {tab === 'mine' ? (
        recipes.length ? (
          recipes.map((r) => (
            <Pressable key={r.id} accessibilityRole="button" onPress={() => router.push({ pathname: '/cuisine/recette/[id]', params: { id: r.id } })}>
              <Card style={{ gap: 4 }}>
                <AppText style={{ fontFamily: 'Inter_600SemiBold' }}>{r.title}</AppText>
                <AppText variant="caption" color={c.textMuted}>
                  {originLabel(r.origin)} · {categoryLabel(r.category)} · {r.servings} portions{r.cookMin ? ` · ${(r.prepMin ?? 0) + r.cookMin} min` : ''}
                </AppText>
              </Card>
            </Pressable>
          ))
        ) : (
          <AppText color={c.textMuted}>Aucune recette. Créez la vôtre ou partez d’une idée de base.</AppText>
        )
      ) : (
        <>
          <AppText variant="caption" color={c.textMuted}>Recettes de repas et boissons, boulangerie, desserts et bases maison. Les quantités sont indicatives.</AppText>
          <SelectField label="Catégorie" options={RECIPE_CATEGORIES.map((item) => ({ value: item.id as string, label: item.label + ' (' + RECIPE_LIBRARY.filter((r) => r.category === item.id).length + ')' }))} value={category} onChange={setCategory} />
          <SelectField label="Inspiration culinaire" options={CULINARY_STYLES.map((item) => ({ value: item.id as string, label: item.label }))} value={style} onChange={setStyle} />
          <SelectField label="Temps disponible" options={[{ value: 'toutes', label: 'Toutes les durées' }, { value: '15', label: '15 minutes maximum' }, { value: '30', label: '30 minutes maximum' }, { value: '60', label: '1 heure maximum' }]} value={maxMinutes} onChange={setMaxMinutes} />
          <TextInput accessibilityLabel="Rechercher une recette" placeholder="Rechercher dans cette catégorie…" placeholderTextColor={c.textMuted}
            value={search} onChangeText={setSearch} style={{ backgroundColor: '#F5F1E6', color: '#6B4A38', padding: 12, borderRadius: 12 }} />
          <AppText variant="caption" color={c.textMuted}>{filteredLibrary.length} recette(s)</AppText>
          {filteredLibrary.map((r) => (
            <Card key={r.libraryId} style={{ gap: 6 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 8 }}>
                <AppText style={{ fontFamily: 'Inter_600SemiBold', flex: 1 }}>{r.title}</AppText>
                <AppText variant="caption" color={c.textMuted}>{originLabel(r.origin)}</AppText>
              </View>
              <AppText variant="caption" color={c.textMuted}>{r.ingredients.map((i) => i.name).join(', ')}</AppText>
              <Button
                label={imported.has(r.libraryId) ? 'Ouvrir' : 'Ajouter à mes recettes'}
                variant="outline"
                onPress={() => {
                  const id = mutate(({ life }) => life.importRecipe(r.libraryId));
                  router.push({ pathname: '/cuisine/recette/[id]', params: { id } });
                }}
              />
            </Card>
          ))}
        </>
      )}
    </Screen>
  );
}
