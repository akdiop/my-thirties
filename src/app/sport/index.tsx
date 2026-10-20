import { router } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { dayLabel } from '@/agenda/dates';
import { AppText, Card, ListRow, Screen, StatusBadge } from '@/components/ui';
import { Segmented } from '@/components/ui/Segmented';
import { useData } from '@/hooks/useData';
import { fichesBySection, SPORT_NOTICE, YOGA_SESSIONS, type Discipline } from '@/sport/content';
import { useTheme } from '@/theme/ThemeProvider';
import { MIN_TOUCH } from '@/theme/tokens';

type Tab = Discipline | 'journal';

const DISCIPLINE_NAME: Record<string, string> = { tennis: 'Tennis', pilates: 'Pilates', yoga: 'Yoga', challenge: 'Challenge', autre: 'Autre' };

function Journal() {
  const { c } = useTheme();
  const sessions = useData(({ well }) => well.listWorkouts(60));
  if (!sessions.length) return <AppText color={c.textMuted}>Aucune séance enregistrée. Touchez + pour noter votre première séance.</AppText>;
  return (
    <Card style={{ paddingVertical: 4 }}>
      {sessions.map((s, i) => (
        <ListRow
          key={s.id}
          label={`${s.title}`}
          value={`${dayLabel(s.date)}${s.durationMin ? ` · ${s.durationMin} min` : ''}`}
          onPress={() => router.push({ pathname: '/sport/seance/[id]', params: { id: s.id } })}
          last={i === sessions.length - 1}
        />
      ))}
      <AppText variant="caption" color={c.textMuted} style={{ paddingBottom: 10 }}>
        {sessions.length} séance{sessions.length > 1 ? 's' : ''} · {[...new Set(sessions.map((s) => DISCIPLINE_NAME[s.discipline] ?? s.discipline))].join(', ')}
      </AppText>
    </Card>
  );
}

export default function Sport() {
  const { c } = useTheme();
  const [tab, setTab] = useState<Tab>('pilates');
  return (
    <Screen
      title="Mon sport"
      back
      right={
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Enregistrer une séance"
          onPress={() => router.push({ pathname: '/sport/seance/[id]', params: { id: 'nouveau', discipline: tab === 'journal' ? 'pilates' : tab } })}
          style={{ width: MIN_TOUCH, height: MIN_TOUCH, alignItems: 'center', justifyContent: 'center' }}
        >
          <Plus size={24} color={c.primary} />
        </Pressable>
      }
    >
      <Segmented<Tab>
        label="Discipline"
        value={tab}
        onChange={setTab}
        options={[{ value: 'tennis', label: 'Tennis' }, { value: 'pilates', label: 'Pilates' }, { value: 'yoga', label: 'Yoga' }, { value: 'journal', label: 'Journal' }]}
      />
      {tab === 'journal' ? (
        <Journal />
      ) : (
        <>
          {tab === 'yoga' ? (
            <View style={{ gap: 8 }}>
              <AppText variant="cardTitle">Séances guidées</AppText>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {YOGA_SESSIONS.map((s) => (
                  <Pressable
                    key={s.minutes}
                    accessibilityRole="button"
                    accessibilityLabel={`Séance de ${s.minutes} minutes, ${s.title}`}
                    onPress={() => router.push({ pathname: '/sport/yoga/[minutes]', params: { minutes: String(s.minutes) } })}
                    style={{ flex: 1, minHeight: 64, borderRadius: 14, backgroundColor: c.successTint, alignItems: 'center', justifyContent: 'center' }}
                  >
                    <AppText variant="number">{s.minutes}</AppText>
                    <AppText variant="caption">min</AppText>
                  </Pressable>
                ))}
              </View>
            </View>
          ) : null}
          {fichesBySection(tab).map(([section, fiches]) => (
            <View key={section} style={{ gap: 6 }}>
              <AppText variant="cardTitle">{section}</AppText>
              <Card style={{ paddingVertical: 4 }}>
                {fiches.map((f, i) => (
                  <ListRow key={f.id} label={f.title} onPress={() => router.push({ pathname: '/sport/fiche/[id]', params: { id: f.id } })} last={i === fiches.length - 1} />
                ))}
              </Card>
            </View>
          ))}
          <Card style={{ gap: 8 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <AppText style={{ fontFamily: 'Inter_600SemiBold' }}>Analyser ma technique</AppText>
              <StatusBadge status="not-developed" />
            </View>
            <AppText variant="caption" color={c.textMuted}>Analyse de posture sur l’iPhone, prévue en phase 5 comme prototype.</AppText>
          </Card>
          <AppText variant="caption" color={c.textMuted}>{SPORT_NOTICE}</AppText>
        </>
      )}
    </Screen>
  );
}
