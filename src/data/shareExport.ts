import Constants from 'expo-constants';
import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';

import { buildExport, exportFileName } from './exportData';
import type { OrganisationRepository } from './organisation';
import type { Repository } from './repository';
import type { WellbeingRepository } from './wellbeing';

export async function shareExport(repo: Repository, org: OrganisationRepository, well: WellbeingRepository) {
  const now = new Date();
  const payload = buildExport({ ...repo.dumpAll(), ...org.dumpAll(), ...well.dumpAll() }, now, Constants.expoConfig?.version ?? '0.0.0');
  const file = new File(Paths.cache, exportFileName(now));
  if (file.exists) file.delete();
  file.create();
  file.write(JSON.stringify(payload, null, 2));
  try {
    if (!(await Sharing.isAvailableAsync())) throw new Error('Le partage n’est pas disponible sur cet appareil.');
    await Sharing.shareAsync(file.uri, { mimeType: 'application/json', UTI: 'public.json', dialogTitle: 'Exporter mes données' });
  } finally {
    if (file.exists) file.delete();
  }
}
