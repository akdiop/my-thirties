import { createClient, type Session } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const configured = Boolean(url && key && !url.includes('YOUR-PROJECT'));
export const cloud = configured
  ? createClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
        storage: window.localStorage,
      },
    })
  : null;

export type ModuleId =
  | 'quotidien' | 'sante' | 'sport' | 'challenges' | 'equilibre'
  | 'spiritualite' | 'finances' | 'cuisine' | 'decouvertes'
  | 'passions' | 'listes';

export type Entry = {
  id: string;
  user_id: string;
  module: ModuleId;
  kind: string;
  title: string;
  entry_date: string | null;
  data: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

export type EntryInput = {
  module: ModuleId;
  kind: string;
  title: string;
  entry_date: string | null;
  data: Record<string, unknown>;
};

export async function signIn(email: string, password: string) {
  if (!cloud) throw new Error('Connexion non configurée.');
  const { error } = await cloud.auth.signInWithPassword({ email, password });
  if (error) throw error;
}

export async function signOut() {
  if (!cloud) return;
  const { error } = await cloud.auth.signOut();
  if (error) throw error;
}

export async function getSession(): Promise<Session | null> {
  if (!cloud) return null;
  const { data, error } = await cloud.auth.getSession();
  if (error) throw error;
  return data.session;
}

export async function isOwner() {
  if (!cloud) return false;
  const { data, error } = await cloud.rpc('is_app_owner');
  if (error) throw error;
  return data === true;
}

export async function readEntries(): Promise<Entry[]> {
  if (!cloud) throw new Error('Connexion non configurée.');
  const result: Entry[] = [];
  const pageSize = 500;
  for (let offset = 0; offset < 5000; offset += pageSize) {
    const { data, error } = await cloud.from('entries')
      .select('id,user_id,module,kind,title,entry_date,data,created_at,updated_at')
      .order('created_at', { ascending: false })
      .range(offset, offset + pageSize - 1);
    if (error) throw error;
    result.push(...(data as Entry[]));
    if (!data || data.length < pageSize) return result;
  }
  throw new Error('Limite de chargement atteinte : contactez le support avant de continuer.');
}

export async function createEntry(input: EntryInput) {
  if (!cloud) throw new Error('Connexion non configurée.');
  const { error } = await cloud.from('entries').insert(input);
  if (error) throw error;
}

export async function editEntry(id: string, patch: Partial<Pick<Entry, 'title' | 'entry_date' | 'data'>>) {
  if (!cloud) throw new Error('Connexion non configurée.');
  const { error } = await cloud.from('entries').update(patch).eq('id', id);
  if (error) throw error;
}

export async function removeEntry(id: string) {
  if (!cloud) throw new Error('Connexion non configurée.');
  const { error } = await cloud.from('entries').delete().eq('id', id);
  if (error) throw error;
}

export async function restoreEntries(inputs: EntryInput[], onProgress?: (done: number) => void) {
  if (!cloud) throw new Error('Connexion non configurée.');
  if (inputs.length > 5000) throw new Error('La restauration accepte jusqu’à 5000 entrées par fichier.');
  for (let i = 0; i < inputs.length; i += 100) {
    const { error } = await cloud.from('entries').insert(inputs.slice(i, i + 100));
    if (error) throw error;
    onProgress?.(Math.min(inputs.length, i + 100));
  }
}
