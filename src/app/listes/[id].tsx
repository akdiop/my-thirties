import { router, useLocalSearchParams } from 'expo-router';
import { ArrowDown, ArrowUp, Check, MoreHorizontal, Trash2 } from 'lucide-react-native';
import { useState } from 'react';
import { ActionSheetIOS, Alert, Platform, Pressable, TextInput, View } from 'react-native';

import { AppText, Card, ProgressBar, Screen } from '@/components/ui';
import { useData, useMutate } from '@/hooks/useData';
import { move, progress } from '@/lists/lists';
import { useTheme } from '@/theme/ThemeProvider';
import { MIN_TOUCH, radius } from '@/theme/tokens';

export default function ListDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { c } = useTheme();
  const mutate = useMutate();
  const data = useData(({ org }) => ({ list: org.getList(id), items: org.listItems(id) }), [id]);
  const [title, setTitle] = useState('');
  const [quantity, setQuantity] = useState('');
  const [editing, setEditing] = useState<string | null>(null);

  if (!data.list || data.list.deletedAt) {
    return (
      <Screen title="Liste introuvable" back>
        <AppText>Cette liste n’existe plus.</AppText>
      </Screen>
    );
  }
  const l = data.list;
  const p = progress(data.items);

  const add = () => {
    if (!title.trim()) return;
    mutate(({ org }) => org.addListItem(id, title, quantity.trim() || null));
    setTitle('');
    setQuantity('');
  };

  const actions = () => {
    const options = [
      'Dupliquer',
      l.archivedAt ? 'Désarchiver' : 'Archiver',
      'Retirer les éléments cochés',
      'Supprimer la liste',
      'Annuler',
    ];
    const run = (i: number) => {
      if (i === 0) {
        const copy = mutate(({ org }) => org.duplicateList(id));
        if (copy) router.replace({ pathname: '/listes/[id]', params: { id: copy } });
      } else if (i === 1) {
        mutate(({ org }) => org.archiveList(id, !l.archivedAt));
        router.back();
      } else if (i === 2) {
        mutate(({ org }) => org.clearChecked(id));
      } else if (i === 3) {
        Alert.alert('Supprimer cette liste ?', l.title, [
          { text: 'Annuler', style: 'cancel' },
          {
            text: 'Supprimer',
            style: 'destructive',
            onPress: () => {
              mutate(({ org }) => org.deleteList(id));
              router.back();
            },
          },
        ]);
      }
    };
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions({ options, destructiveButtonIndex: 3, cancelButtonIndex: 4 }, run);
    } else {
      Alert.alert(l.title, undefined, options.slice(0, 4).map((text, i) => ({ text, onPress: () => run(i) })));
    }
  };

  const input = { minHeight: 46, borderRadius: radius.md, borderWidth: 1, borderColor: c.border, backgroundColor: c.surface, paddingHorizontal: 14, fontFamily: 'Inter_400Regular', fontSize: 15, color: c.text } as const;

  return (
    <Screen
      title={l.title}
      subtitle={l.archivedAt ? 'Archivée' : `${p.done} / ${p.total} cochés`}
      back
      right={
        <Pressable accessibilityRole="button" accessibilityLabel="Actions de la liste" onPress={actions} style={{ width: MIN_TOUCH, height: MIN_TOUCH, alignItems: 'center', justifyContent: 'center' }}>
          <MoreHorizontal size={24} color={c.primary} />
        </Pressable>
      }
    >
      {p.total ? <ProgressBar value={p.ratio} label={`${p.done} sur ${p.total}`} /> : null}
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <TextInput accessibilityLabel="Nouvel élément" placeholder="Ajouter…" placeholderTextColor={c.textMuted} value={title} onChangeText={setTitle} onSubmitEditing={add} returnKeyType="done" maxLength={160} style={[input, { flex: 1 }]} />
        <TextInput accessibilityLabel="Quantité" placeholder="Qté" placeholderTextColor={c.textMuted} value={quantity} onChangeText={setQuantity} onSubmitEditing={add} maxLength={20} style={[input, { width: 72 }]} />
      </View>
      <Card style={{ paddingVertical: 0 }}>
        {data.items.length ? (
          data.items.map((item, i) => (
            <View key={item.id} style={{ borderBottomWidth: i === data.items.length - 1 ? 0 : 1, borderColor: c.border }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: 52 }}>
                <Pressable
                  accessibilityRole="checkbox"
                  accessibilityLabel={item.title}
                  accessibilityState={{ checked: item.checked }}
                  onPress={() => mutate(({ org }) => org.updateListItem(item.id, { checked: !item.checked }))}
                  style={{ width: MIN_TOUCH, height: MIN_TOUCH, alignItems: 'center', justifyContent: 'center', marginLeft: -10 }}
                >
                  <View style={{ width: 22, height: 22, borderRadius: 7, borderWidth: 1.5, borderColor: item.checked ? c.success : c.rest, backgroundColor: item.checked ? c.success : 'transparent', alignItems: 'center', justifyContent: 'center' }}>
                    {item.checked ? <Check size={14} color="#FFFFFF" strokeWidth={3} /> : null}
                  </View>
                </Pressable>
                <Pressable accessibilityRole="button" accessibilityHint="Afficher les options" onPress={() => setEditing(editing === item.id ? null : item.id)} style={{ flex: 1, paddingVertical: 8 }}>
                  <AppText style={item.checked ? { textDecorationLine: 'line-through', color: c.textMuted } : undefined}>{item.title}</AppText>
                  {item.notes ? <AppText variant="caption" color={c.textMuted}>{item.notes}</AppText> : null}
                </Pressable>
                {item.quantity ? <AppText variant="label" color={c.textMuted}>{item.quantity}</AppText> : null}
              </View>
              {editing === item.id ? (
                <View style={{ flexDirection: 'row', gap: 4, paddingBottom: 8, justifyContent: 'flex-end' }}>
                  <TextInput
                    accessibilityLabel="Note"
                    placeholder="Note"
                    placeholderTextColor={c.textMuted}
                    defaultValue={item.notes ?? ''}
                    onEndEditing={(e) => mutate(({ org }) => org.updateListItem(item.id, { notes: e.nativeEvent.text.trim() || null }))}
                    maxLength={200}
                    style={[input, { flex: 1, minHeight: 40 }]}
                  />
                  <Pressable accessibilityRole="button" accessibilityLabel="Monter" onPress={() => mutate(({ org }) => org.setPositions('listItem', move(data.items, item.id, -1)))} style={{ width: MIN_TOUCH, height: MIN_TOUCH, alignItems: 'center', justifyContent: 'center' }}>
                    <ArrowUp size={18} color={c.primary} />
                  </Pressable>
                  <Pressable accessibilityRole="button" accessibilityLabel="Descendre" onPress={() => mutate(({ org }) => org.setPositions('listItem', move(data.items, item.id, 1)))} style={{ width: MIN_TOUCH, height: MIN_TOUCH, alignItems: 'center', justifyContent: 'center' }}>
                    <ArrowDown size={18} color={c.primary} />
                  </Pressable>
                  <Pressable accessibilityRole="button" accessibilityLabel={`Supprimer ${item.title}`} onPress={() => mutate(({ org }) => org.deleteListItem(item.id))} style={{ width: MIN_TOUCH, height: MIN_TOUCH, alignItems: 'center', justifyContent: 'center' }}>
                    <Trash2 size={18} color={c.danger} />
                  </Pressable>
                </View>
              ) : null}
            </View>
          ))
        ) : (
          <AppText color={c.textMuted} style={{ paddingVertical: 14 }}>Liste vide. Ajoutez un premier élément.</AppText>
        )}
      </Card>
    </Screen>
  );
}
