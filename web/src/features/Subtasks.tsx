import type { Entry } from '../lib/cloud';

export type Subtask = { id: string; text: string; checked: boolean };

export function makeSubtasks(text: string, previous: Subtask[] = []): Subtask[] {
  const counts = new Map<string, number>();
  const old = new Map<string, Subtask[]>();
  for (const item of previous) {
    const key = item.text.trim();
    if (!old.has(key)) old.set(key, []);
    old.get(key)!.push(item);
  }
  return text.split(/\r?\n/).map((s) => s.trim()).filter(Boolean).slice(0, 100).map((line) => {
    const n = counts.get(line) ?? 0;
    counts.set(line, n + 1);
    const match = old.get(line)?.[n];
    return { id: match?.id ?? crypto.randomUUID(), text: line, checked: match?.checked ?? false };
  });
}

export function SubtaskChecklist({ entry, onUpdate }: {
  entry: Entry; onUpdate: (entry: Entry, data: Record<string, unknown>) => Promise<void>;
}) {
  const items = Array.isArray(entry.data.subtasks) ? entry.data.subtasks as Subtask[] : [];
  if (!items.length) return null;
  const done = items.filter((x) => x.checked).length;
  return <div className="subtask-checklist"><p className="fineprint">Sous-tâches : {done} sur {items.length}</p>
    {items.map((item) => <label className="checklist-item" key={item.id}>
      <input type="checkbox" checked={item.checked} onChange={(e) => void onUpdate(entry, {
        ...entry.data, subtasks: items.map((x) => x.id === item.id ? { ...x, checked: e.target.checked } : x),
      })} /><span className={item.checked ? 'checked' : ''}>{item.text}</span>
    </label>)}</div>;
}
