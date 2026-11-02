import { Heart, Pencil, Sparkles } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, Switch, TextInput, View } from 'react-native';

import { AppText, Card, Screen } from '@/components/ui';
import { useSession } from '@/db/DatabaseProvider';
import { useData } from '@/hooks/useData';
import { CARE_ACTIONS, isCareDone, nextStage, pandaProgress, PANDA_STAGES, stageFromPoints, type CareAction, type PandaState } from '@/panda/companion';
import { useSettings } from '@/state/settings';
import { useTheme } from '@/theme/ThemeProvider';

const dayIso = () => new Date().toLocaleDateString('en-CA');

function PandaArt({ stage }: { stage: number }) {
  const { scheme } = useTheme();
  const fur = '#342C29', face = '#FFF8EF', blush = '#DBA59A', scarf = stage >= 3 ? '#AD8066' : '#D8B899';
  return <View accessibilityLabel={'Panda compagnon, étape ' + (stage + 1)} style={{ width: 276, height: 270, alignSelf: 'center' }}>
    <View style={{ position: 'absolute', left: 62, top: 18, width: 64, height: 65, borderRadius: 40, backgroundColor: fur }} />
    <View style={{ position: 'absolute', right: 62, top: 18, width: 64, height: 65, borderRadius: 40, backgroundColor: fur }} />
    <View style={{ position: 'absolute', left: 60, bottom: 4, width: 156, height: 139, borderRadius: 84, backgroundColor: fur }} />
    <View style={{ position: 'absolute', left: 95, bottom: 15, width: 89, height: 110, borderRadius: 49, backgroundColor: face }} />
    <View style={{ position: 'absolute', left: 33, bottom: 3, width: 69, height: 43, borderRadius: 36, backgroundColor: fur }} />
    <View style={{ position: 'absolute', right: 33, bottom: 3, width: 69, height: 43, borderRadius: 36, backgroundColor: fur }} />
    <View style={{ position: 'absolute', left: 33, top: 34, width: 210, height: 198, borderRadius: 110, backgroundColor: face, borderWidth: 1, borderColor: '#E7D8CA' }} />
    <View style={{ position: 'absolute', left: 66, top: 100, width: 54, height: 72, borderRadius: 35, backgroundColor: fur, transform: [{ rotate: '16deg' }] }} />
    <View style={{ position: 'absolute', right: 66, top: 100, width: 54, height: 72, borderRadius: 35, backgroundColor: fur, transform: [{ rotate: '-16deg' }] }} />
    <View style={{ position: 'absolute', left: 91, top: 121, width: 14, height: 18, borderRadius: 9, backgroundColor: face }} />
    <View style={{ position: 'absolute', right: 91, top: 121, width: 14, height: 18, borderRadius: 9, backgroundColor: face }} />
    <View style={{ position: 'absolute', left: 129, top: 162, width: 22, height: 16, borderRadius: 10, backgroundColor: fur }} />
    <AppText style={{ position: 'absolute', left: 127, top: 169, color: fur, fontSize: 28, textAlign: 'center', lineHeight: 33 }}>⌣</AppText>
    <View style={{ position: 'absolute', left: 47, top: 169, width: 24, height: 12, borderRadius: 18, backgroundColor: blush, opacity: 0.32 }} />
    <View style={{ position: 'absolute', right: 47, top: 169, width: 24, height: 12, borderRadius: 18, backgroundColor: blush, opacity: 0.32 }} />
    {stage >= 1 ? <View style={{ position: 'absolute', left: 65, top: 213, width: 146, height: 23, borderRadius: 12, backgroundColor: scarf }} /> : null}
    {stage >= 2 ? <AppText style={{ position: 'absolute', right: 1, top: 93, fontSize: 24, color: '#B78E6D' }}>✦</AppText> : null}
    {stage >= 4 ? <AppText style={{ position: 'absolute', left: 122, top: -12, fontSize: 36, color: '#C6A16D' }}>♛</AppText> : null}
    {scheme === 'dark' ? <View style={{ position: 'absolute', top: 20, width: 1, height: 1, opacity: 0 }} /> : null}
  </View>;
}

export default function PandaScreen() {
  const { repo } = useSession();
  const { c } = useTheme();
  const panda = useSettings((s) => s.panda);
  const setSetting = useSettings((s) => s.set);
  const [draft, setDraft] = useState('Mochi');
  const [renaming, setRenaming] = useState(false);
  const today = dayIso();
  const from = panda?.adoptedAt || today;
  // L'app ne lit que les dates de présence d'entrées, jamais les valeurs ni les textes.
  const linkedDates = useData(({ well }) => {
    const dates = [
      ...well.dailyHealthRange(from, today).map((row) => row.date),
      ...well.listSleep(from, today).map((row) => row.date),
      ...well.listGratitude(120).map((row) => row.date),
      ...well.listEmotions(300).map((row) => row.at.slice(0, 10)),
    ];
    return [...new Set(dates.filter((day) => day >= from && day <= today))];
  }, [from, today]);
  const progress = panda ? pandaProgress(panda, linkedDates) : null;

  const save = (next: PandaState) => {
    const currentStage = panda ? pandaProgress(panda, linkedDates).stage : 0;
    const stage = pandaProgress(next, linkedDates).stage;
    const finalState = { ...next, bestLevel: Math.max(currentStage, stage, next.bestLevel) };
    repo.saveSetting('panda', finalState);
    setSetting('panda', finalState);
  };
  const adopt = () => {
    save({ name: draft.trim().slice(0, 24) || 'Mochi', adoptedAt: today, moments: [],
      linkHabits: false, bestLevel: 0 });
  };
  const care = (action: CareAction) => {
    if (!panda || isCareDone(panda, today, action)) return;
    save({ ...panda, moments: [...panda.moments, { day: today, action }] });
  };

  return <Screen title="Mon panda" subtitle="Un compagnon qui grandit avec moi" back>
    <View style={{ borderRadius: 25, padding: 16, gap: 4, backgroundColor: c.surfaceAlt, alignItems: 'center' }}>
      <AppText variant="label" color={c.textMuted}>MON PETIT COMPAGNON</AppText>
      <AppText variant="screenTitle">{panda?.name || 'Un panda à adopter'}</AppText>
      <PandaArt stage={progress?.stage ?? 0} />
      <AppText center color={c.textMuted}>{panda ? 'J’avance à mon rythme, avec ou sans pause.' : 'Une aventure douce, sans pression ni pénalités.'}</AppText>
    </View>

    {!panda ? <Card style={{ gap: 12 }}>
      <AppText variant="cardTitle">Bienvenue dans ton jardin</AppText>
      <AppText>Ton panda évolue avec les moments que tu choisis de noter. Tu peux te reposer autant que nécessaire : rien n’est perdu.</AppText>
      <AppText variant="label">Son prénom</AppText>
      <TextInput accessibilityLabel="Prénom du panda" value={draft} onChangeText={setDraft}
        maxLength={24} placeholder="Mochi" placeholderTextColor={c.textMuted}
        style={{ borderWidth: 1, borderColor: c.border, borderRadius: 12, padding: 12, color: c.text, backgroundColor: c.background }} />
      <Pressable accessibilityRole="button" onPress={adopt} style={{ backgroundColor: c.primary, borderRadius: 12, padding: 14 }}>
        <AppText center color={c.onPrimary} style={{ fontFamily: 'Inter_600SemiBold' }}>Adopter mon panda</AppText>
      </Pressable>
    </Card> : <>
      <Card style={{ gap: 12 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
          <AppText variant="cardTitle">{PANDA_STAGES[progress!.stage]}</AppText>
          <AppText variant="caption" color={c.textMuted}>Étape {progress!.stage + 1} / 5</AppText>
        </View>
        <View accessibilityLabel={'Progression du panda : ' + progress!.points + ' moments enregistrés'}
          style={{ height: 10, backgroundColor: c.progressTrack, borderRadius: 6, overflow: 'hidden' }}>
          <View style={{ height: 10, width: (progress!.next ? Math.min(100, 100 * progress!.points / progress!.next) : 100) + '%',
            backgroundColor: '#B68F72', borderRadius: 6 }} />
        </View>
        <AppText variant="caption" color={c.textMuted}>{progress!.next
          ? progress!.points + ' moments · prochaine étape à ' + progress!.next
          : 'Dernière étape atteinte. L’aventure continue.'}</AppText>
        <AppText>{progress!.daysTogether} journée(s) de petits pas. Les jours sans action ne retirent aucun progrès.</AppText>
      </Card>

      <Card style={{ gap: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}><Heart size={20} color={c.primary} /><AppText variant="cardTitle">Un geste pour moi</AppText></View>
        <AppText>Choisis ce qui t’a fait du bien aujourd’hui. Aucun geste n’est obligatoire.</AppText>
        {CARE_ACTIONS.map((item) => {
          const done = isCareDone(panda, today, item.id);
          return <Pressable key={item.id} accessibilityRole="button" disabled={done} onPress={() => care(item.id)}
            style={{ minHeight: 64, borderRadius: 13, padding: 13, backgroundColor: done ? c.surfaceAlt : c.background,
              borderWidth: 1, borderColor: c.border, gap: 3, opacity: done ? 0.75 : 1 }}>
            <AppText style={{ fontFamily: 'Inter_600SemiBold' }}>{done ? '✓ ' : '+ '}{item.title}</AppText>
            <AppText variant="caption" color={c.textMuted}>{done ? 'Déjà noté aujourd’hui' : item.description}</AppText>
          </Pressable>;
        })}
      </Card>

      <Card style={{ gap: 12 }}>
        <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}><Sparkles size={19} color={c.primary} /><AppText variant="cardTitle">Grandir ensemble</AppText></View>
        <AppText>Relie, si tu le souhaites, les journées où tu as rempli ton suivi d’humeur, de sommeil, de gratitude ou ton journal. Seule la présence d’une entrée compte, jamais son contenu.</AppText>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <AppText style={{ flex: 1 }}>Relier mes activités enregistrées</AppText>
          <Switch accessibilityLabel="Relier mes activités enregistrées au panda" value={panda.linkHabits}
            onValueChange={(enabled) => save({ ...panda, linkHabits: enabled })}
            trackColor={{ false: c.border, true: '#B68F72' }} thumbColor={c.surface} />
        </View>
        <AppText variant="caption" color={c.textMuted}>{panda.linkHabits
          ? progress!.linkedDays + ' journée(s) de participation comptabilisées.'
          : 'Désactivé par défaut.'}</AppText>
        {renaming ? <View style={{ gap: 8 }}>
          <TextInput accessibilityLabel="Renommer mon panda" value={draft} onChangeText={setDraft} maxLength={24}
            style={{ backgroundColor: c.background, borderColor: c.border, borderWidth: 1, borderRadius: 12, padding: 12, color: c.text }} />
          <Pressable accessibilityRole="button" onPress={() => { save({ ...panda, name: draft.trim().slice(0, 24) || panda.name }); setRenaming(false); }}>
            <AppText color={c.primary}>Enregistrer le prénom</AppText>
          </Pressable>
        </View> : <Pressable accessibilityRole="button" onPress={() => { setDraft(panda.name); setRenaming(true); }}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Pencil size={16} color={c.primary} /><AppText color={c.primary}>Renommer mon panda</AppText>
        </Pressable>}
      </Card>
    </>}
    <AppText variant="caption" center color={c.textMuted}>Un compagnon ludique, pas un diagnostic. Ton repos et tes journées difficiles sont respectés.</AppText>
  </Screen>;
}
