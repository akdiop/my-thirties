import { Switch, View } from 'react-native';

import { ModuleIcon } from '@/components/ModuleIcon';
import { AppText, Card, Screen } from '@/components/ui';
import { useSession } from '@/db/DatabaseProvider';
import { useRefresh } from '@/data/useRefresh';
import { orderedModules } from '@/modules/registry';
import { useAppData } from '@/state/appData';
import { useTheme } from '@/theme/ThemeProvider';

export default function Modules() {
  const { repo } = useSession();
  const refresh = useRefresh();
  const modules = useAppData((s) => s.modules);
  const { c } = useTheme();
  const all = orderedModules(modules, { includeDisabled: true });

  return (
    <Screen title="Espaces affichés" subtitle="Un espace masqué garde ses données" back>
      <Card style={{ paddingVertical: 4 }}>
        {all.map(({ module, state }, i) => (
          <View
            key={module.id}
            style={{ minHeight: 56, flexDirection: 'row', alignItems: 'center', gap: 12, borderBottomWidth: i === all.length - 1 ? 0 : 1, borderColor: c.border }}
          >
            <ModuleIcon id={module.id} color={c.primary} size={22} />
            <AppText style={{ flex: 1 }}>{module.label}</AppText>
            <Switch
              accessibilityLabel={module.label}
              value={state.enabled}
              trackColor={{ true: c.secondary }}
              onValueChange={(enabled) => {
                repo.setModuleEnabled(module.id, enabled, state.position);
                refresh();
              }}
            />
          </View>
        ))}
      </Card>
    </Screen>
  );
}
