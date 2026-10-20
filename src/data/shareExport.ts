import Constants from 'expo-constants';
import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';

import { buildExport } from './exportData';
import { encryptExport } from './encryptedExport';
import type { OrganisationRepository } from './organisation';
import type { Repository } from './repository';
import type { WellbeingRepository } from './wellbeing';

export async function shareExport(repo: Repository, org: OrganisationRepository, wellbeing: WellbeingRepository, password: string) {
  const now = new Date();
  const payload = buildExport({ ...repo.dumpAll(), ...org.dumpAll(), ...wellbeing.dumpAll() }, now, Constants.expoConfig?.version ?? '0.0.0');
  const encrypted = await encryptExport(payload, password);
  const file = new File(Paths.cache, 'my-thirties-export-' + now.toISOString().slice(0, 10) + '.encrypted.json');
  if (file.exists) file.delete();
  file.create();
  file.write(JSON.stringify(encrypted));
  try {
    if (!(await Sharing.isAvailableAsync())) throw new Error('Le partage n’est pas disponible sur cet appareil.');
    await Sharing.shareAsync(file.uri, { mimeType: 'application/json', UTI: 'public.json', dialogTitle: 'Exporter ma sauvegarde chiffrée' });
  } finally {
    if (file.exists) file.delete();
  }
}
