import { ScanFace } from 'lucide-react-native';
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { AppState, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText, Button } from '@/components/ui';
import { authenticateWithBiometrics, biometricsAvailable } from '@/security/biometrics';
import { readLockConfig, readStoredPin, writeLockConfig, writeStoredPin, type LockConfig } from '@/security/lockState';
import { hashPin, INITIAL_LOCKOUT, PIN_LENGTH, registerFailure, remainingLockMs, shouldRelock, verifyPin } from '@/security/pin';
import { randomHex } from '@/security/random';
import { useLock } from '@/state/lock';
import { useSettings } from '@/state/settings';
import { useTheme } from '@/theme/ThemeProvider';
import { PinDots, PinPad } from './PinPad';

export function LockGate({ children }: { children: ReactNode }) {
  const { status, everUnlocked, setStatus, setBackgroundedAt } = useLock();
  const lockDelayMs = useSettings((s) => s.lockDelayMs);
  const [covered, setCovered] = useState(false);

  useEffect(() => {
    readStoredPin().then((pin) => setStatus(pin ? 'locked' : 'setup'));
  }, [setStatus]);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (next) => {
      const { status: current, backgroundedAt: since } = useLock.getState();
      if (next === 'active') {
        setCovered(false);
        if (current === 'unlocked' && shouldRelock(since, Date.now(), lockDelayMs)) setStatus('locked');
        setBackgroundedAt(null);
      } else {
        setCovered(true);
        if (next === 'background' && since === null) setBackgroundedAt(Date.now());
      }
    });
    return () => sub.remove();
  }, [lockDelayMs, setStatus, setBackgroundedAt]);

  if (status === 'checking') return <Cover />;
  if (status === 'setup') return <SetupPin onDone={() => setStatus('unlocked')} />;
  if (!everUnlocked) return <Unlock onUnlocked={() => setStatus('unlocked')} />;
  return (
    <>
      {children}
      {status === 'locked' ? (
        <View style={StyleSheet.absoluteFill}>
          <Unlock onUnlocked={() => setStatus('unlocked')} />
        </View>
      ) : covered ? (
        <Cover absolute />
      ) : null}
    </>
  );
}

function Cover({ absolute }: { absolute?: boolean }) {
  const { c } = useTheme();
  return (
    <View
      style={[{ flex: 1, backgroundColor: c.background, alignItems: 'center', justifyContent: 'center' }, absolute && { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }]}
    >
      <AppText variant="display">My thirties</AppText>
    </View>
  );
}

function LockLayout({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  const { c } = useTheme();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.background, alignItems: 'center', paddingTop: 64, gap: 12 }}>
      <AppText variant="screenTitle" center>{title}</AppText>
      <AppText color={c.textMuted} center style={{ paddingHorizontal: 32 }}>{subtitle}</AppText>
      {children}
    </SafeAreaView>
  );
}

function SetupPin({ onDone }: { onDone: () => void }) {
  const [first, setFirst] = useState<string | null>(null);
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [askBiometrics, setAskBiometrics] = useState(false);
  const { c } = useTheme();

  useEffect(() => {
    if (value.length < PIN_LENGTH) return;
    if (first === null) {
      setFirst(value);
      setValue('');
      setError(null);
      return;
    }
    if (value !== first) {
      setFirst(null);
      setValue('');
      setError('Les deux codes ne correspondent pas. Recommencez.');
      return;
    }
    (async () => {
      await writeStoredPin(await hashPin(value, randomHex(16)));
      if (await biometricsAvailable()) setAskBiometrics(true);
      else {
        await writeLockConfig({ biometricEnabled: false, lockout: INITIAL_LOCKOUT });
        onDone();
      }
    })();
  }, [value, first, onDone]);

  const chooseBiometrics = async (enabled: boolean) => {
    await writeLockConfig({ biometricEnabled: enabled, lockout: INITIAL_LOCKOUT });
    onDone();
  };

  if (askBiometrics) {
    return (
      <LockLayout title="Face ID" subtitle="Déverrouiller My thirties avec Face ID ? Votre code reste disponible en secours.">
        <View style={{ alignSelf: 'stretch', paddingHorizontal: 32, gap: 12, marginTop: 24 }}>
          <Button label="Activer Face ID" onPress={() => chooseBiometrics(true)} />
          <Button label="Plus tard" variant="outline" onPress={() => chooseBiometrics(false)} />
        </View>
      </LockLayout>
    );
  }

  return (
    <LockLayout
      title={first === null ? 'Créez votre code' : 'Confirmez votre code'}
      subtitle="Six chiffres pour protéger vos données. Il ne quitte jamais ce téléphone."
    >
      <View style={{ marginVertical: 28 }}>
        <PinDots length={value.length} />
      </View>
      {error ? <AppText color={c.danger} accessibilityLiveRegion="polite">{error}</AppText> : null}
      <PinPad value={value} onChange={setValue} />
    </LockLayout>
  );
}

function Unlock({ onUnlocked }: { onUnlocked: () => void }) {
  const [value, setValue] = useState('');
  const [config, setConfig] = useState<LockConfig | null>(null);
  const [now, setNow] = useState(Date.now());
  const [message, setMessage] = useState<string | null>(null);
  const triedBiometrics = useRef(false);
  const { c } = useTheme();

  const tryBiometrics = useCallback(async () => {
    if (await authenticateWithBiometrics()) {
      const current = await readLockConfig();
      await writeLockConfig({ ...current, lockout: INITIAL_LOCKOUT });
      onUnlocked();
    }
  }, [onUnlocked]);

  useEffect(() => {
    readLockConfig().then((cfg) => {
      setConfig(cfg);
      if (cfg.biometricEnabled && !triedBiometrics.current && remainingLockMs(cfg.lockout, Date.now()) === 0) {
        triedBiometrics.current = true;
        tryBiometrics();
      }
    });
  }, [tryBiometrics]);

  const waitMs = config ? remainingLockMs(config.lockout, now) : 0;

  useEffect(() => {
    if (waitMs <= 0) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [waitMs]);

  useEffect(() => {
    if (value.length < PIN_LENGTH || !config) return;
    (async () => {
      const stored = await readStoredPin();
      if (stored && (await verifyPin(value, stored))) {
        await writeLockConfig({ ...config, lockout: INITIAL_LOCKOUT });
        onUnlocked();
        return;
      }
      const lockout = registerFailure(config.lockout, Date.now());
      const next = { ...config, lockout };
      await writeLockConfig(next);
      setConfig(next);
      setNow(Date.now());
      setValue('');
      setMessage('Code incorrect.');
    })();
  }, [value, config, onUnlocked]);

  return (
    <LockLayout title="Bon retour" subtitle="Saisissez votre code ou utilisez Face ID">
      <View style={{ marginVertical: 28 }}>
        <PinDots length={value.length} />
      </View>
      <AppText color={waitMs > 0 ? c.danger : c.textMuted} accessibilityLiveRegion="polite" style={{ minHeight: 22 }}>
        {waitMs > 0 ? `Trop d’essais. Réessayez dans ${Math.ceil(waitMs / 1000)} s.` : message ?? ''}
      </AppText>
      <PinPad
        value={value}
        onChange={setValue}
        disabled={waitMs > 0}
        leftAction={
          config?.biometricEnabled ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Face ID"
              onPress={tryBiometrics}
              style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: c.secondary, alignItems: 'center', justifyContent: 'center' }}
            >
              <ScanFace size={30} color={c.onSecondary} />
            </Pressable>
          ) : null
        }
      />
    </LockLayout>
  );
}
