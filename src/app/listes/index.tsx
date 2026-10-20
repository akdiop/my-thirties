import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';

import { Chips } from '@/components/form/Chips';
import { Field, TextField } from '@/components/form/Field';
import { AppText, Button, Card, ProgressBar, Screen } from '@/components/ui';
import { Segmented } from '@/components/ui/Segmented';
import { useData, useMutate } from '@/hooks/useData';
import { LIST_TEMPLATES, LIST_TYPES, listTypeLabel, progress } from '@/lists/lists';
import { useTheme } from '@/theme/ThemeProvider';

export default function Listes() {
  const { c } = useTheme();
  const mutate = useMutate();
  const [tab, setTab] = useState<'active' | 'archived'>('active');
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [type, setType] = useState<string>('courses');
  const [template, setTemplate] = useState<string | null>(null);

  const lists = useData(({ org }) => org.listLists({ archived: tab === 'archived' }), [tab]);
  const counts = useData(({ org }) => org.allListItems());
  const byList = useMemo(() => {
    const m = new Map<string, { checked: boolean }[]>();
    for (const i of counts) m.set(i.listId, [...(m.get(i.listId) ?? []), i]);
    return m;
  }, [counts]);

  const create = () => {
    const id = mutate(({ org }) => org.createList(title, type, template ?? undefined));
    setCreating(false);
    setTitle('');
    setTemplate(null);
    router.push({ pathname: '/listes/[id]', params: { id } });
  };

  return (
    <Screen title="Mes listes" back>
      <Segmented
        label="Listes"
        value={tab}
        onChange={setTab}
        options={[{ value: 'active', label: 'En cours' }, { value: 'archived', label: 'Archivées' }]}
      />
      {creating ? (
        <Card style={{ gap: 14 }}>
          <Field label="Partir d’un modèle">
            <Chips
              label="Modèle"
              options={[{ value: null, label: 'Liste vide' }, ...LIST_TEMPLATES.map((t) => ({ value: t.id as string | null, label: t.title }))]}
              value={template}
              onChange={(v) => {
                setTemplate(v);
                const t = LIST_TEMPLATES.find((x) => x.id === v);
                if (t) {
                  setType(t.type);
                  if (!title.trim()) setTitle(t.title);
                }
              }}
            />
          </Field>
          <TextField label="Nom de la liste" value={title} onChangeText={setTitle} maxLength={80} />
          <Field label="Type">
            <Chips label="Type" options={LIST_TYPES.map((t) => ({ value: t.id as string, label: t.label }))} value={type} onChange={setType} />
          </Field>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Button style={{ flex: 1 }} label="Annuler" variant="outline" onPress={() => setCreating(false)} />
            <Button style={{ flex: 1 }} label="Créer" disabled={!title.trim()} onPress={create} />
          </View>
        </Card>
      ) : tab === 'active' ? (
        <Button label="+ Nouvelle liste" onPress={() => setCreating(true)} />
      ) : null}
      {lists.map((l) => {
        const p = progress(byList.get(l.id) ?? []);
        return (
          <Pressable key={l.id} accessibilityRole="button" onPress={() => router.push({ pathname: '/listes/[id]', params: { id: l.id } })}>
            <Card style={{ gap: 8 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
                <AppText variant="cardTitle" style={{ flex: 1 }}>{l.title}</AppText>
                <AppText variant="caption" color={c.textMuted}>{listTypeLabel(l.type)}</AppText>
              </View>
              {p.total ? <ProgressBar value={p.ratio} label={`${p.done} sur ${p.total}`} /> : null}
              <AppText variant="caption" color={c.textMuted}>{p.total ? `${p.done} / ${p.total} cochés` : 'Vide'}</AppText>
            </Card>
          </Pressable>
        );
      })}
      {!lists.length && !creating ? (
        <AppText color={c.textMuted}>{tab === 'active' ? 'Aucune liste pour l’instant.' : 'Aucune liste archivée.'}</AppText>
      ) : null}
    </Screen>
  );
}
