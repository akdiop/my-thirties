import { router } from 'expo-router';
import { Trash2 } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';

import { addDays, addMonths, dayLabel, monthGrid, monthLabel, weekdayShort } from '@/agenda/dates';
import { Chips } from '@/components/form/Chips';
import { TimeField } from '@/components/form/DateTimeField';
import { Field, TextField } from '@/components/form/Field';
import { Scale, Stepper } from '@/components/form/Scale';
import { AppText, Button, Card, Screen } from '@/components/ui';
import { Segmented } from '@/components/ui/Segmented';
import type { DailyHealthInput } from '@/data/wellbeing';
import { useData, useMutate } from '@/hooks/useData';
import { useToday } from '@/hooks/useToday';
import { CYCLE_DISCLAIMER, periodDays, predict } from '@/sante/cycle';
import { averageSleep, formatDuration, sleepMinutes } from '@/sante/sleep';
import { useTheme } from '@/theme/ThemeProvider';
import { StepsCard } from '@/features/steps/StepsCard';
import { useSession } from '@/db/DatabaseProvider';
import { useSettings } from '@/state/settings';
import { MIN_TOUCH } from '@/theme/tokens';

type Tab = 'cycle' | 'jour' | 'sommeil' | 'pas';

const SYMPTOMS = ['Crampes', 'Maux de tête', 'Fatigue', 'Ballonnements', 'Seins sensibles', 'Acné', 'Nausées', 'Irritabilité', 'Insomnie'];
const MEALS = ['Petit-déjeuner', 'Déjeuner', 'Dîner', 'Collation'];

function CycleTab() {
  const today = useToday();
  const { c } = useTheme();
  const mutate = useMutate();
  const [month, setMonth] = useState(today);
  const periods = useData(({ well }) => well.listPeriods());
  const prediction = useMemo(() => predict(periods, today), [periods, today]);
  const bleeding = useMemo(() => periodDays(periods, today, prediction?.stats.periodLength), [periods, today, prediction]);
  const open = periods.find((p) => !p.endDate);
  const grid = monthGrid(month);
  const inWindow = (d: string) => !!prediction && d >= prediction.window[0] && d <= prediction.window[1];

  return (
    <View style={{ gap: 16 }}>
      <Card tone="sand" style={{ gap: 6 }}>
        {prediction ? (
          <>
            <AppText variant="cardTitle">Jour {prediction.cycleDay} du cycle</AppText>
            <AppText>
              Prochaines règles vers le {dayLabel(prediction.nextStart)} (entre le {dayLabel(prediction.window[0])} et le {dayLabel(prediction.window[1])}).
            </AppText>
            <AppText variant="caption">
              Cycle moyen {prediction.stats.cycleLength} jours · fiabilité {prediction.confidence}
              {prediction.stats.basedOn ? ` (${prediction.stats.basedOn} cycles)` : ''}
            </AppText>
          </>
        ) : (
          <AppText>Indiquez le début de vos dernières règles pour commencer le suivi.</AppText>
        )}
      </Card>
      {open ? (
        <Button label="Fin des règles aujourd’hui" variant="secondary" onPress={() => mutate(({ well }) => well.endPeriod(open.id, today))} />
      ) : (
        <Button label="Début des règles aujourd’hui" onPress={() => mutate(({ well }) => well.startPeriod(today))} />
      )}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Pressable accessibilityRole="button" accessibilityLabel="Mois précédent" onPress={() => setMonth(addMonths(month, -1))} style={{ width: MIN_TOUCH, height: MIN_TOUCH, justifyContent: 'center' }}>
          <AppText color={c.primary}>‹</AppText>
        </Pressable>
        <AppText variant="label" color={c.primary} style={{ fontFamily: 'Inter_600SemiBold' }}>{monthLabel(month)}</AppText>
        <Pressable accessibilityRole="button" accessibilityLabel="Mois suivant" onPress={() => setMonth(addMonths(month, 1))} style={{ width: MIN_TOUCH, height: MIN_TOUCH, justifyContent: 'center', alignItems: 'flex-end' }}>
          <AppText color={c.primary}>›</AppText>
        </Pressable>
      </View>
      <View>
        <View style={{ flexDirection: 'row' }}>
          {grid.slice(0, 7).map((d) => (
            <AppText key={d} variant="caption" color={c.textMuted} center style={{ flex: 1 }}>{weekdayShort(d)}</AppText>
          ))}
        </View>
        {Array.from({ length: grid.length / 7 }, (_, w) => (
          <View key={w} style={{ flexDirection: 'row' }}>
            {grid.slice(w * 7, w * 7 + 7).map((d) => {
              const isPeriod = bleeding.has(d);
              const predicted = !isPeriod && inWindow(d);
              const isToday = d === today;
              const outside = d.slice(0, 7) !== month.slice(0, 7);
              const label = `${dayLabel(d)}${isPeriod ? ', règles' : predicted ? ', règles possibles' : ''}`;
              return (
                <View key={d} accessible accessibilityLabel={label} style={{ flex: 1, height: 42, alignItems: 'center', justifyContent: 'center', opacity: outside ? 0.35 : 1 }}>
                  <View
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 17,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: isToday ? c.primary : isPeriod ? '#E8C9BE' : 'transparent',
                      borderWidth: predicted ? 1.5 : 0,
                      borderStyle: 'dashed',
                      borderColor: '#C98F7E',
                    }}
                  >
                    <AppText variant="label" color={isToday ? c.onPrimary : c.text}>{Number(d.slice(8))}</AppText>
                  </View>
                </View>
              );
            })}
          </View>
        ))}
      </View>
      <View style={{ flexDirection: 'row', gap: 16, justifyContent: 'center' }}>
        <AppText variant="caption">● Règles</AppText>
        <AppText variant="caption">◌ Règles possibles</AppText>
      </View>
      {periods.length ? (
        <Field label="Historique">
          <Card style={{ paddingVertical: 4 }}>
            {[...periods].reverse().slice(0, 6).map((p, i, arr) => (
              <View key={p.id} style={{ flexDirection: 'row', alignItems: 'center', minHeight: 48, borderBottomWidth: i === arr.length - 1 ? 0 : 1, borderColor: c.border }}>
                <AppText style={{ flex: 1 }}>
                  {dayLabel(p.startDate)}
                  {p.endDate ? ` → ${dayLabel(p.endDate)}` : ' · en cours'}
                </AppText>
                <Pressable accessibilityRole="button" accessibilityLabel="Supprimer cette période" onPress={() => mutate(({ well }) => well.deletePeriod(p.id))} style={{ width: MIN_TOUCH, height: MIN_TOUCH, alignItems: 'center', justifyContent: 'center' }}>
                  <Trash2 size={18} color={c.textMuted} />
                </Pressable>
              </View>
            ))}
          </Card>
        </Field>
      ) : null}
      <AppText variant="caption" color={c.textMuted}>{CYCLE_DISCLAIMER}</AppText>
    </View>
  );
}

function DayTab() {
  const today = useToday();
  const { c } = useTheme();
  const mutate = useMutate();
  const health = useData(({ well }) => well.getDailyHealth(today), [today]);
  const food = useData(({ well }) => well.listFood(today), [today]);
  const [meal, setMeal] = useState('Déjeuner');
  const [desc, setDesc] = useState('');
  const save = (patch: Partial<DailyHealthInput>) => mutate(({ well }) => well.saveDailyHealth(today, patch));
  const symptoms = health?.symptoms ?? [];

  return (
    <View style={{ gap: 16 }}>
      <Field label="Humeur">
        <Scale label="Humeur" value={health?.mood ?? null} onChange={(v) => save({ mood: v })} low="Difficile" high="Très bien" />
      </Field>
      <Field label="Énergie">
        <Scale label="Énergie" value={health?.energy ?? null} onChange={(v) => save({ energy: v })} low="Épuisée" high="Pleine d’énergie" />
      </Field>
      <Field label="Douleurs">
        <Scale label="Douleurs" value={health?.pain ?? null} onChange={(v) => save({ pain: v })} min={0} max={4} low="Aucune" high="Fortes" />
      </Field>
      <Field label="Symptômes">
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {SYMPTOMS.map((s) => {
            const on = symptoms.includes(s);
            return (
              <Pressable
                key={s}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: on }}
                onPress={() => save({ symptoms: on ? symptoms.filter((x) => x !== s) : [...symptoms, s] })}
                style={{ minHeight: 38, paddingHorizontal: 14, borderRadius: 999, justifyContent: 'center', backgroundColor: on ? c.secondary : c.surfaceAlt }}
              >
                <AppText variant="label" color={on ? c.onSecondary : c.text}>{s}</AppText>
              </Pressable>
            );
          })}
        </View>
      </Field>
      <Field label="Hydratation (verres d’eau)">
        <Stepper label="Verres d’eau" value={health?.water ?? 0} onChange={(v) => save({ water: v })} max={20} suffix="verres" />
      </Field>
      <Field label="Journal alimentaire (facultatif)">
        <Card style={{ gap: 10 }}>
          {food.map((f) => (
            <View key={f.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <AppText style={{ flex: 1 }}>
                <AppText variant="label" color={c.textMuted}>{f.meal} · </AppText>
                {f.description}
              </AppText>
              <Pressable accessibilityRole="button" accessibilityLabel={`Supprimer ${f.description}`} onPress={() => mutate(({ well }) => well.deleteFood(f.id))} style={{ width: MIN_TOUCH, height: MIN_TOUCH, alignItems: 'center', justifyContent: 'center' }}>
                <Trash2 size={18} color={c.textMuted} />
              </Pressable>
            </View>
          ))}
          <Chips label="Repas" options={MEALS.map((m) => ({ value: m, label: m }))} value={meal} onChange={setMeal} />
          <TextField
            label="Ce que j’ai mangé"
            value={desc}
            onChangeText={setDesc}
            returnKeyType="done"
            maxLength={200}
            onSubmitEditing={() => {
              if (!desc.trim()) return;
              mutate(({ well }) => well.addFood(today, meal, desc, null));
              setDesc('');
            }}
          />
        </Card>
      </Field>
      <TextField label="Notes du jour" defaultValue={health?.notes ?? ''} onEndEditing={(e) => save({ notes: e.nativeEvent.text.trim() || null })} multiline maxLength={2000} />
      <Button label="Ajouter un rendez-vous de santé" variant="outline" onPress={() => router.push({ pathname: '/evenement/[id]', params: { id: 'nouveau', date: today } })} />
      <AppText variant="caption" color={c.textMuted}>Ces notes servent à votre suivi personnel. L’application ne pose aucun diagnostic.</AppText>
    </View>
  );
}

function SleepTab() {
  const today = useToday();
  const { c } = useTheme();
  const mutate = useMutate();
  const entries = useData(({ well }) => well.listSleep(addDays(today, -13), today), [today]);
  const last = entries.find((e) => e.date === today);
  const [bed, setBed] = useState<string | null>(last?.bedTime ?? '23:00');
  const [wake, setWake] = useState<string | null>(last?.wakeTime ?? '07:00');
  const [quality, setQuality] = useState<number | null>(last?.quality ?? null);
  const week = entries.filter((e) => e.date > addDays(today, -7));
  const avg = averageSleep(week);

  return (
    <View style={{ gap: 16 }}>
      <Card tone="sage" style={{ gap: 4 }}>
        <AppText variant="cardTitle">{avg ? formatDuration(avg) : '—'}</AppText>
        <AppText>Moyenne des 7 dernières nuits{week.length ? ` (${week.length} notées)` : ''}</AppText>
      </Card>
      <AppText variant="cardTitle">Nuit dernière</AppText>
      <Field label="Coucher">
        <TimeField label="Coucher" value={bed} onChange={setBed} />
      </Field>
      <Field label="Réveil">
        <TimeField label="Réveil" value={wake} onChange={setWake} />
      </Field>
      <Field label="Qualité ressentie">
        <Scale label="Qualité" value={quality} onChange={setQuality} low="Mauvaise" high="Excellente" />
      </Field>
      <Button label="Enregistrer la nuit" disabled={!bed || !wake} onPress={() => bed && wake && mutate(({ well }) => well.saveSleep(today, bed, wake, quality))} />
      {entries.length ? (
        <Card style={{ paddingVertical: 4 }}>
          {entries.map((e, i) => (
            <View key={e.id} style={{ flexDirection: 'row', minHeight: 44, alignItems: 'center', borderBottomWidth: i === entries.length - 1 ? 0 : 1, borderColor: c.border }}>
              <AppText style={{ flex: 1 }}>{dayLabel(e.date)}</AppText>
              <AppText variant="label" color={c.textMuted}>
                {e.bedTime} → {e.wakeTime} · {formatDuration(sleepMinutes(e.bedTime, e.wakeTime))}
              </AppText>
            </View>
          ))}
        </Card>
      ) : null}
    </View>
  );
}

function StepsTab() {
  const today = useToday();
  const { c } = useTheme();
  const { repo } = useSession();
  const goal = useSettings((s) => s.stepGoal);
  const enabled = useSettings((s) => s.stepsEnabled);
  const set = useSettings((s) => s.set);
  return (
    <View style={{ gap: 16 }}>
      <StepsCard today={today} detailed />
      {enabled ? (
        <Field label="Objectif quotidien">
          <Stepper
            label="Objectif de pas"
            value={goal}
            onChange={(v) => {
              set('stepGoal', v);
              repo.saveSetting('stepGoal', v);
            }}
            min={1000}
            max={30000}
            step={500}
            suffix="pas"
          />
        </Field>
      ) : null}
      <AppText variant="caption" color={c.textMuted}>Les pas viennent du capteur de mouvement de l’iPhone, qui garde environ 7 jours d’historique ; My thirties enregistre chaque total pour garder un historique plus long.</AppText>
    </View>
  );
}

export default function Sante() {
  const [tab, setTab] = useState<Tab>('cycle');
  return (
    <Screen title="Ma santé" back>
      <Segmented<Tab>
        label="Section"
        value={tab}
        onChange={setTab}
        options={[{ value: 'cycle', label: 'Cycle' }, { value: 'jour', label: 'Jour' }, { value: 'sommeil', label: 'Sommeil' }, { value: 'pas', label: 'Pas' }]}
      />
      {tab === 'cycle' ? <CycleTab /> : tab === 'jour' ? <DayTab /> : tab === 'sommeil' ? <SleepTab /> : <StepsTab />}
    </Screen>
  );
}
