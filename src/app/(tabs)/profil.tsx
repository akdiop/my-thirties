import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Switch, TextInput, View } from 'react-native';

import { AppText, Button, Card, ListRow, Screen } from '@/components/ui';
import { Segmented } from '@/components/ui/Segmented';
import { TimeField } from '@/components/form/DateTimeField';
import { requestCalendarAccess } from '@/features/agenda/deviceCalendar';
import { useSession } from '@/db/DatabaseProvider';
import { shareExport } from '@/data/shareExport';
import { useRefresh } from '@/data/useRefresh';
import { wipeEverything } from '@/data/wipe';
import { ensurePermission } from '@/notifications/scheduler';
import { orderedModules } from '@/modules/registry';
import { biometricsAvailable } from '@/security/biometrics';
import { readLockConfig, writeLockConfig } from '@/security/lockState';
import { useAppData } from '@/state/appData';
import { useLock } from '@/state/lock';
import { useSettings, type Appearance, type Settings } from '@/state/settings';
import { useTheme } from '@/theme/ThemeProvider';
import { radius } from '@/theme/tokens';

const LOCK_DELAYS = [
  { value: '0', label: 'Immédiat' },
  { value: '60000', label: '1 min' },
  { value: '300000', label: '5 min' },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const { c } = useTheme();
  return (
    <View style={{ gap: 6 }}>
      <AppText variant="caption" color={c.textMuted} style={{ fontFamily: 'Inter_600SemiBold', letterSpacing: 1.4, textTransform: 'uppercase' }}>
        {title}
      </AppText>
      <Card style={{ paddingVertical: 4 }}>{children}</Card>
    </View>
  );
}

export default function Profil() {
  const { repo, org, well, sqlite } = useSession();
  const refresh = useRefresh();
  const { profile, modules } = useAppData();
  const settings = useSettings();
  const { c } = useTheme();
  const [name, setName] = useState(profile?.firstName ?? '');
  const [faceId, setFaceId] = useState<boolean | null>(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    Promise.all([biometricsAvailable(), readLockConfig()]).then(([available, cfg]) => setFaceId(available ? cfg.biometricEnabled : null));
  }, []);

  const save = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    settings.set(key, value);
    repo.saveSetting(key, value);
  };

  const saveName = () => {
    const trimmed = name.trim();
    if (!profile || !trimmed || trimmed === profile.firstName) return setName(profile?.firstName ?? '');
    repo.updateProfile(profile.id, { firstName: trimmed });
    refresh();
  };

  const toggleFaceId = async (enabled: boolean) => {
    const cfg = await readLockConfig();
    await writeLockConfig({ ...cfg, biometricEnabled: enabled });
    setFaceId(enabled);
  };

  const toggleNotifications = async (enabled: boolean) => {
    if (enabled && !(await ensurePermission())) {
      Alert.alert('Notifications refusées', 'Autorisez My thirties dans Réglages › Notifications de l’iPhone.');
      return;
    }
    save('notifications', { ...settings.notifications, enabled });
  };

  const exportData = async () => {
    setExporting(true);
    try {
      await shareExport(repo, org, well);
    } catch (e) {
      Alert.alert('Export impossible', e instanceof Error ? e.message : String(e));
    } finally {
      setExporting(false);
    }
  };

  const confirmDelete = () =>
    Alert.alert('Supprimer toutes mes données ?', 'Profil, réglages et code seront effacés de cet iPhone. Cette action est définitive.', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Continuer',
        style: 'destructive',
        onPress: () =>
          Alert.alert('Dernière confirmation', 'Exportez d’abord vos données si vous voulez les garder.', [
            { text: 'Annuler', style: 'cancel' },
            {
              text: 'Tout supprimer',
              style: 'destructive',
              onPress: async () => {
                await wipeEverything(sqlite);
                useAppData.getState().load({ profile: null, modules: [] });
                useLock.getState().setStatus('setup');
              },
            },
          ]),
      },
    ]);

  const enabledCount = orderedModules(modules).length;

  return (
    <Screen title="Profil">
      <Section title="Moi">
        <View style={{ paddingVertical: 10, gap: 6 }}>
          <AppText variant="label" nativeID="profileName">Prénom</AppText>
          <TextInput
            accessibilityLabelledBy="profileName"
            value={name}
            onChangeText={setName}
            onEndEditing={saveName}
            maxLength={40}
            style={{ height: 46, borderRadius: radius.md, borderWidth: 1, borderColor: c.border, paddingHorizontal: 14, fontFamily: 'Inter_400Regular', fontSize: 15, color: c.text }}
          />
        </View>
        <View style={{ paddingVertical: 10, gap: 6 }}>
          <AppText variant="label">Devise principale</AppText>
          <Segmented
            label="Devise principale"
            value={profile?.currency ?? 'XOF'}
            options={[{ value: 'XOF', label: 'XOF' }, { value: 'EUR', label: 'EUR' }, { value: 'USD', label: 'USD' }]}
            onChange={(currency) => {
              if (!profile) return;
              repo.updateProfile(profile.id, { currency });
              refresh();
            }}
          />
        </View>
        <View style={{ paddingVertical: 10, gap: 6 }}>
          <AppText variant="label">Apparence</AppText>
          <Segmented<Appearance>
            label="Apparence"
            value={settings.appearance}
            options={[{ value: 'light', label: 'Clair' }, { value: 'dark', label: 'Sombre' }, { value: 'system', label: 'Auto' }]}
            onChange={(v) => save('appearance', v)}
          />
        </View>
      </Section>

      <Section title="Sécurité">
        {faceId !== null ? (
          <ListRow label="Face ID" right={<Switch value={faceId} onValueChange={toggleFaceId} trackColor={{ true: c.secondary }} accessibilityLabel="Face ID" />} />
        ) : (
          <ListRow label="Face ID" value="Non disponible" />
        )}
        <View style={{ paddingVertical: 10, gap: 6 }}>
          <AppText variant="label">Verrouiller après</AppText>
          <Segmented
            label="Verrouiller après"
            value={String(settings.lockDelayMs)}
            options={LOCK_DELAYS}
            onChange={(v) => save('lockDelayMs', Number(v))}
          />
        </View>
        <ListRow label="Verrouiller maintenant" onPress={() => useLock.getState().setStatus('locked')} last />
      </Section>

      <Section title="Notifications et espaces">
        <ListRow
          label="Notifications"
          right={<Switch value={settings.notifications.enabled} onValueChange={toggleNotifications} trackColor={{ true: c.secondary }} accessibilityLabel="Notifications" />}
        />
        <ListRow
          label="Heures silencieuses"
          value={settings.notifications.quietHours ? `${settings.notifications.quietHours.start} – ${settings.notifications.quietHours.end}` : 'Aucune'}
        />
        <View style={{ paddingVertical: 10, gap: 6 }}>
          <AppText variant="label">Briefing du matin</AppText>
          <TimeField label="Briefing du matin" value={settings.briefingTime} onChange={(v) => save('briefingTime', v)} optional />
        </View>
        <View style={{ paddingVertical: 10, gap: 6 }}>
          <AppText variant="label">Bilan du soir</AppText>
          <TimeField label="Bilan du soir" value={settings.eveningTime} onChange={(v) => save('eveningTime', v)} optional />
        </View>
        <ListRow
          label="Calendriers de l’iPhone"
          right={
            <Switch
              value={settings.deviceCalendars}
              trackColor={{ true: c.secondary }}
              accessibilityLabel="Afficher les calendriers de l’iPhone"
              onValueChange={async (v) => {
                if (v && !(await requestCalendarAccess())) {
                  Alert.alert('Accès refusé', 'Autorisez My thirties dans Réglages › Calendriers de l’iPhone.');
                  return;
                }
                save('deviceCalendars', v);
              }}
            />
          }
        />
        <ListRow
          label="Adapter le sport à ma santé"
          right={<Switch value={settings.healthForSport} onValueChange={(v) => save('healthForSport', v)} trackColor={{ true: c.secondary }} accessibilityLabel="Utiliser mes données de santé pour adapter le sport" />}
        />
        <ListRow label="Espaces affichés" value={`${enabledCount} sur 11`} onPress={() => router.push('/modules')} last />
      </Section>

      <Section title="Mes données">
        <View style={{ paddingVertical: 12, gap: 10 }}>
          <Button label="Exporter mes données" variant="outline" loading={exporting} onPress={exportData} />
          <Button label="Supprimer toutes mes données…" variant="danger" onPress={confirmDelete} />
        </View>
      </Section>
    </Screen>
  );
}
