import * as Location from 'expo-location';
import { useState } from 'react';
import { Alert, Switch, View } from 'react-native';

import { Chips } from '@/components/form/Chips';
import { Field } from '@/components/form/Field';
import { Stepper } from '@/components/form/Scale';
import { AppText, Button, Card, ListRow, Screen } from '@/components/ui';
import { Segmented } from '@/components/ui/Segmented';
import { useSession } from '@/db/DatabaseProvider';
import { CITIES, METHODS, PRAYER_LABEL, PRAYERS, type PrayerSettings } from '@/spiritualite/prayer';
import { useSettings } from '@/state/settings';
import { useTheme } from '@/theme/ThemeProvider';

export default function PrayerSettingsScreen() {
  const { c } = useTheme();
  const { repo } = useSession();
  const prayer = useSettings((s) => s.prayer);
  const set = useSettings((s) => s.set);
  const [locating, setLocating] = useState(false);

  const save = (patch: Partial<PrayerSettings>) => {
    const next = { ...prayer, ...patch };
    set('prayer', next);
    repo.saveSetting('prayer', next);
  };

  const locate = async () => {
    setLocating(true);
    try {
      const perm = await Location.requestForegroundPermissionsAsync();
      if (!perm.granted) {
        Alert.alert('Localisation refusée', 'Choisissez une ville dans la liste.');
        return;
      }
      const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Low });
      save({ latitude: Math.round(pos.coords.latitude * 1000) / 1000, longitude: Math.round(pos.coords.longitude * 1000) / 1000, placeLabel: 'Ma position' });
    } catch {
      Alert.alert('Position indisponible', 'Choisissez une ville dans la liste.');
    } finally {
      setLocating(false);
    }
  };

  return (
    <Screen title="Horaires des prières" back>
      <Field label="Lieu">
        <Chips
          label="Ville"
          options={CITIES.map((city) => ({ value: city.id as string, label: city.label }))}
          value={CITIES.find((city) => city.label === prayer.placeLabel)?.id ?? ''}
          onChange={(id) => {
            const city = CITIES.find((x) => x.id === id);
            if (city) save({ latitude: city.latitude, longitude: city.longitude, placeLabel: city.label });
          }}
        />
        <Button label={locating ? 'Localisation…' : 'Utiliser ma position (une fois)'} variant="outline" loading={locating} onPress={locate} />
        <AppText variant="caption" color={c.textMuted}>
          {prayer.placeLabel} · {prayer.latitude.toFixed(3)}, {prayer.longitude.toFixed(3)}. La position est arrondie et reste sur l’iPhone.
        </AppText>
      </Field>
      <Field label="Méthode de calcul">
        <Chips label="Méthode" options={METHODS.map((m) => ({ value: m.id as string, label: m.label }))} value={prayer.method} onChange={(v) => save({ method: v as PrayerSettings['method'] })} />
      </Field>
      <Field label="Asr">
        <Segmented label="Calcul de Asr" value={prayer.madhab} onChange={(v) => save({ madhab: v })} options={[{ value: 'shafi', label: 'Standard (Shafi, Maliki, Hanbali)' }, { value: 'hanafi', label: 'Hanafi' }]} />
      </Field>
      <Field label="Ajustements manuels (minutes)">
        <Card style={{ gap: 10 }}>
          {PRAYERS.map((p) => (
            <View key={p} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <AppText>{PRAYER_LABEL[p]}</AppText>
              <Stepper label={`Ajustement ${PRAYER_LABEL[p]}`} value={prayer.adjustments[p]} onChange={(v) => save({ adjustments: { ...prayer.adjustments, [p]: v } })} min={-30} max={30} suffix="min" />
            </View>
          ))}
        </Card>
      </Field>
      <Card style={{ paddingVertical: 4 }}>
        <ListRow label="Afficher dans l’agenda" right={<Switch value={prayer.showInAgenda} onValueChange={(v) => save({ showInAgenda: v })} trackColor={{ true: c.secondary }} accessibilityLabel="Afficher dans l’agenda" />} />
        {PRAYERS.map((p, i) => (
          <ListRow
            key={p}
            label={`Rappel ${PRAYER_LABEL[p]}`}
            last={i === PRAYERS.length - 1}
            right={
              <Switch
                value={prayer.remind.includes(p)}
                onValueChange={(v) => save({ remind: v ? [...prayer.remind, p] : prayer.remind.filter((x) => x !== p) })}
                trackColor={{ true: c.secondary }}
                accessibilityLabel={`Rappel ${PRAYER_LABEL[p]}`}
              />
            }
          />
        ))}
      </Card>
      <AppText variant="caption" color={c.textMuted}>
        Calcul astronomique réalisé sur l’iPhone (bibliothèque adhan). Comparez avec la mosquée de votre quartier et ajustez si besoin.
      </AppText>
    </Screen>
  );
}
