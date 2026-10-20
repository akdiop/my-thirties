import { router } from 'expo-router';
import { Camera } from 'lucide-react-native';
import { useState } from 'react';
import { Alert, Pressable, View } from 'react-native';

import { toISODate } from '@/agenda/dates';
import { Chips } from '@/components/form/Chips';
import { DateField } from '@/components/form/DateTimeField';
import { Field, TextField } from '@/components/form/Field';
import { AppText, Button, Card, Screen } from '@/components/ui';
import { useSession } from '@/db/DatabaseProvider';
import { useRefresh } from '@/data/useRefresh';
import { Avatar } from '@/features/profile/Avatar';
import { pickProfilePhoto } from '@/features/profile/photo';
import { birthdayLine, SITUATIONS, splitTags } from '@/profile/profile';
import { useAppData } from '@/state/appData';
import { useTheme } from '@/theme/ThemeProvider';
import { radius } from '@/theme/tokens';

export default function MonProfil() {
  const { repo } = useSession();
  const refresh = useRefresh();
  const { c } = useTheme();
  const profile = useAppData((s) => s.profile);
  const [f, setF] = useState({
    firstName: profile?.firstName ?? '',
    lastName: profile?.lastName ?? '',
    city: profile?.city ?? '',
    children: profile?.children ?? '',
    job: profile?.job ?? '',
    hobbies: profile?.hobbies.join(', ') ?? '',
    languages: profile?.languages.join(', ') ?? '',
    values: profile?.personalValues.join(', ') ?? '',
    intention: profile?.intention ?? '',
  });
  const [photo, setPhoto] = useState<string | null>(profile?.photoUri ?? null);
  const [birthDate, setBirthDate] = useState<string | null>(profile?.birthDate ?? null);
  const [situation, setSituation] = useState<string | null>(profile?.situation ?? null);
  const set = (k: keyof typeof f) => (v: string) => setF({ ...f, [k]: v });
  const clean = (v: string) => v.trim() || null;
  const today = toISODate(new Date());

  const choosePhoto = async () => {
    try {
      const picked = await pickProfilePhoto();
      if (picked) setPhoto(picked);
    } catch (e) {
      Alert.alert('Photo', e instanceof Error ? e.message : 'Photo impossible à charger.');
    }
  };

  const save = () => {
    if (!profile || !f.firstName.trim()) return;
    repo.updateProfile(profile.id, {
      firstName: f.firstName.trim(),
      lastName: clean(f.lastName),
      photoUri: photo,
      birthDate: birthDate && birthDate <= today ? birthDate : null,
      city: clean(f.city),
      situation,
      children: clean(f.children),
      job: clean(f.job),
      hobbies: splitTags(f.hobbies),
      languages: splitTags(f.languages),
      personalValues: splitTags(f.values),
      intention: clean(f.intention),
    });
    refresh();
    router.back();
  };

  const tags = (text: string) =>
    splitTags(text).length ? (
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
        {splitTags(text).map((t) => (
          <View key={t} style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.pill, backgroundColor: c.surfaceAlt }}>
            <AppText variant="caption" color={c.primary} style={{ fontFamily: 'Inter_600SemiBold' }}>{t}</AppText>
          </View>
        ))}
      </View>
    ) : null;

  const line = birthdayLine(birthDate, new Date());

  return (
    <Screen title="Mon profil" back footer={<Button label="Enregistrer" disabled={!f.firstName.trim()} onPress={save} />}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
        <Avatar photo={photo} name={f.firstName} size={88} />
        <View style={{ flex: 1, gap: 8 }}>
          <Pressable accessibilityRole="button" onPress={choosePhoto} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: 44 }}>
            <Camera size={18} color={c.primary} />
            <AppText variant="label" color={c.primary} style={{ fontFamily: 'Inter_600SemiBold' }}>{photo ? 'Changer la photo' : 'Ajouter une photo'}</AppText>
          </Pressable>
          {photo ? (
            <Pressable accessibilityRole="button" onPress={() => setPhoto(null)} style={{ minHeight: 32, justifyContent: 'center' }}>
              <AppText variant="caption" color={c.textMuted}>Retirer la photo</AppText>
            </Pressable>
          ) : null}
        </View>
      </View>
      <AppText variant="caption" color={c.textMuted}>La photo est réduite sur l’iPhone et gardée dans la base chiffrée de l’app.</AppText>

      <TextField label="Prénom" value={f.firstName} onChangeText={set('firstName')} maxLength={40} textContentType="givenName" />
      <TextField label="Nom (facultatif)" value={f.lastName} onChangeText={set('lastName')} maxLength={60} textContentType="familyName" />
      <Field label="Date de naissance">
        <DateField label="Date de naissance" value={birthDate} onChange={setBirthDate} optional />
      </Field>
      {line ? (
        <Card tone="sand">
          <AppText color={c.primary} style={{ fontFamily: 'Inter_600SemiBold' }}>{line}</AppText>
        </Card>
      ) : null}
      <Field label="Situation">
        <Chips label="Situation" options={[{ value: null, label: '—' }, ...SITUATIONS.map((s) => ({ value: s as string | null, label: s }))]} value={situation} onChange={setSituation} />
      </Field>
      <TextField label="Ville" value={f.city} onChangeText={set('city')} maxLength={80} placeholder="Dakar, Paris…" />
      <TextField label="Métier ou activité" value={f.job} onChangeText={set('job')} maxLength={120} />
      <TextField label="Enfants (facultatif)" value={f.children} onChangeText={set('children')} maxLength={200} placeholder="Prénoms, âges…" />
      <TextField label="Hobbies (séparés par des virgules)" value={f.hobbies} onChangeText={set('hobbies')} placeholder="Tennis, Pilates, cuisine…" />
      {tags(f.hobbies)}
      <TextField label="Langues parlées" value={f.languages} onChangeText={set('languages')} placeholder="Français, wolof, anglais…" />
      <TextField label="Ce qui compte pour moi" value={f.values} onChangeText={set('values')} placeholder="Famille, foi, liberté…" />
      {tags(f.values)}
      <TextField label="Mon intention pour mes trente ans" value={f.intention} onChangeText={set('intention')} multiline maxLength={500} />
    </Screen>
  );
}
