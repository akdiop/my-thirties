import { useState } from 'react';
import { ChevronRight, Plus, Sparkles, Trophy } from 'lucide-react';
import type { Entry, EntryInput } from '../lib/cloud';
import { isoOf } from '../lib/rituals';
import { Bar, Check22 } from '../ui/kit';
import {
  checklistShare, DAYS, DEFAULT_FOCUS, DEFAULT_MONTH_GOALS, DEFAULT_WEEK, DONT_FORGET, endOf, GOLDEN_RULE, LIFESTYLE, milestones, MONTH_HABITS,
  monthsOf, PILLARS, PLAN, progressOf, SESSIONS, SLOTS, TRANSFO_KIND, WHY, type Link, type Section, type TransfoData,
} from '../lib/transformation';

type Tab = 'programme' | 'objectif' | 'semaine' | 'mois' | 'vie';
const TABS: [Tab, string][] = [['programme', 'Programme'], ['objectif', 'Mon objectif'], ['semaine', 'Ma semaine'], ['mois', 'Mes 3 mois'], ['vie', 'Style de vie']];
const LINK_LABEL: Record<Link, string> = { finances: 'Finances', habits: 'Habitudes', notes: 'Journal', boussole: 'Boussole', sommeil: 'Sommeil', lectures: 'Lectures', challenges: 'Défis' };
const fmtDate = (iso: string) => new Date(iso + 'T12:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });
const num = (v: string) => { const n = Number(v.replace(',', '.')); return Number.isFinite(n) && v.trim() ? n : undefined; };

/** Ma meilleure version : programme de 3 mois (7 piliers, objectif chiffré, semaine type, suivi mensuel, style de vie). */
export function Transformation({ entries, onCreate, onUpdate, onGo }: {
  entries: Entry[]; onCreate: (i: EntryInput) => Promise<void>; onUpdate: (e: Entry, d: Record<string, unknown>) => Promise<void>; onGo: (t: Link) => void;
}) {
  const entry = entries.find((e) => e.kind === TRANSFO_KIND);
  const d = (entry?.data ?? {}) as TransfoData;
  const today = isoOf(new Date());
  const [tab, setTab] = useState<Tab>('programme');
  const [startAt, setStartAt] = useState(today);
  const save = (patch: Partial<TransfoData>) => entry ? onUpdate(entry, { ...entry.data, ...patch }) : Promise.resolve();
  const toggle = (id: string) => void save({ checks: { ...(d.checks ?? {}), [id]: !d.checks?.[id] } });

  if (!entry || !d.start) return <div className="screen transfo">
    <header className="tab-head"><h1>Ma meilleure version</h1><p>Changer ma vie en 3 mois</p></header>
    <section className="soft-card transfo-intro">
      <p>Un programme de 90 jours pour avancer sur 7 piliers : environnement, état d’esprit, image personnelle, développement personnel, santé, finances et vision.</p>
      <ul className="how-list"><li>Des listes à cocher, pilier par pilier</li><li>Un objectif chiffré avec ses paliers et mon pourquoi</li>
        <li>Une semaine type, un suivi sur 3 mois et un style de vie pour la semaine et les vacances</li></ul>
      <label>Je commence le<input type="date" value={startAt} onChange={(e) => setStartAt(e.target.value)} /></label>
      <button className="button primary" onClick={() => void onCreate({ module: 'equilibre', kind: TRANSFO_KIND, title: 'Ma meilleure version · 3 mois', entry_date: startAt,
        data: { start: startAt, end: endOf(startAt), checks: {}, week: DEFAULT_WEEK, focus: DEFAULT_FOCUS, months: [DEFAULT_MONTH_GOALS, DEFAULT_MONTH_GOALS, DEFAULT_MONTH_GOALS], mode: 'semaine' } })}>
        <Sparkles size={16} /> Commencer mes 3 mois</button>
    </section>
    <p className="transfo-quote">Discipline aujourd’hui, liberté demain.</p>
  </div>;

  const end = d.end ?? endOf(d.start);
  const p = progressOf(d.start, end, today);
  const all = checklistShare(d, [...PILLARS, ...PLAN]);

  return <div className="screen transfo">
    <header className="tab-head"><h1>Ma meilleure version</h1>
      <p>{!p.started ? 'Départ le ' + fmtDate(d.start) : p.done ? 'Programme terminé, bravo !' : 'Jour ' + p.day + ' sur ' + p.total + ' · mois ' + p.month + ' · semaine ' + p.week}</p></header>
    <section className="transfo-hero">
      <div className="transfo-ring" style={{ background: `conic-gradient(#7E7254 ${Math.round(all.share * 360)}deg, #E2E0DB 0)` }}><div><strong>{Math.round(all.share * 100)} %</strong><span>accompli</span></div></div>
      <div className="transfo-hero-text">
        <strong>{all.done} sur {all.total} engagements</strong>
        <span>Du {fmtDate(d.start)} au {fmtDate(end)}</span>
        <Bar value={p.day / p.total} tone="olive" />
      </div>
    </section>
    <div className="chip-scroll" role="tablist">{TABS.map(([k, label]) => <button key={k} role="tab" aria-selected={tab === k} className={'chip' + (tab === k ? ' on' : '')} onClick={() => setTab(k)}>{label}</button>)}</div>

    {tab === 'programme' && <div className="stack-8">{PILLARS.map((s) => <Checklist key={s.id} s={s} d={d} onToggle={toggle} onGo={onGo}
      onAdd={(t) => void save({ custom: { ...(d.custom ?? {}), [s.id]: [...(d.custom?.[s.id] ?? []), t] } })} />)}
      <p className="transfo-quote">Discipline aujourd’hui, liberté demain.</p></div>}

    {tab === 'objectif' && <Objective d={d} save={save} toggle={toggle} onGo={onGo} today={today} />}

    {tab === 'semaine' && <section className="stack-8">
      <div className="soft-card">
        <p className="ritual-label">Planning hebdomadaire</p>
        <p className="muted small">Touche une case pour la modifier.</p>
        <div className="week-plan">{DAYS.map((day, i) => <div key={day} className="plan-day"><strong>{day}</strong>
          {SLOTS.map((slot, j) => { const v = d.week?.[i]?.[j] ?? DEFAULT_WEEK[i]![j]!;
            return <button key={slot} className="week-cell" aria-label={day + ' ' + slot + ' : ' + v} onClick={() => {
              const next = window.prompt(day + ' · ' + slot, v); if (next === null) return;
              const w = (d.week ?? DEFAULT_WEEK).map((r) => [...r]); w[i]![j] = next.trim().slice(0, 40); void save({ week: w });
            }}><small>{slot}</small>{v || '—'}</button>; })}</div>)}</div>
      </div>
      <div className="soft-card form-stack">
        <p className="ritual-label">Focus de la semaine</p>
        <textarea className="soft-input" rows={2} defaultValue={d.focus ?? DEFAULT_FOCUS} onBlur={(e) => { const v = e.target.value.trim(); if (v !== (d.focus ?? DEFAULT_FOCUS)) void save({ focus: v.slice(0, 200) }); }} />
      </div>
      <div className="soft-card">
        <p className="ritual-label">Mes séances sport de la semaine</p>
        {SESSIONS.map((s, k) => { const id = 'sess-w' + p.week + '-' + k;
          return <label key={s} className="transfo-row"><Check22 checked={Boolean(d.checks?.[id])} onChange={() => toggle(id)} label={s} /><span>{s}</span></label>; })}
      </div>
    </section>}

    {tab === 'mois' && <section className="stack-8">{monthsOf(d.start).map((name, m) => {
      const goals = d.months?.[m] ?? DEFAULT_MONTH_GOALS;
      return <div key={m} className={'soft-card' + (p.month === m + 1 && p.started && !p.done ? ' transfo-current' : '')}>
        <p className="ritual-label">Mois {m + 1} · {name}</p>
        <p className="label-strong">Objectifs du mois</p>
        <ul className="how-list">{goals.map((g, k) => <li key={k}>{g}</li>)}</ul>
        <button className="link-btn small" onClick={() => { const t = window.prompt('Nouvel objectif pour ' + name)?.trim(); if (!t) return;
          const months = [0, 1, 2].map((k) => [...(d.months?.[k] ?? DEFAULT_MONTH_GOALS)]); months[m]!.push(t.slice(0, 80)); void save({ months }); }}><Plus size={14} /> Ajouter un objectif</button>
        <p className="label-strong">Habitudes à suivre, semaine par semaine</p>
        <div className="month-habits">{MONTH_HABITS.map((h, k) => <div key={h} className="month-habit"><span>{h}</span>
          <span className="month-dots">{[0, 1, 2, 3, 4].map((w) => { const id = `m${m}-h${k}-w${w}`;
            return <button key={w} className={'dot-check' + (d.checks?.[id] ? ' on' : '')} aria-pressed={Boolean(d.checks?.[id])} aria-label={h + ', semaine ' + (w + 1)} onClick={() => toggle(id)} />; })}</span></div>)}</div>
      </div>; })}
      <div className="soft-card"><p className="ritual-label">À ne pas oublier</p><ul className="how-list">{DONT_FORGET.map((t) => <li key={t}>{t}</li>)}</ul></div>
    </section>}

    {tab === 'vie' && <section className="stack-8">
      <div className="chip-row">{LIFESTYLE.map((s) => <button key={s.id} className={'chip' + ((d.mode ?? 'semaine') === s.id ? ' on' : '')} onClick={() => void save({ mode: s.id as TransfoData['mode'] })}>{s.title}</button>)}</div>
      {LIFESTYLE.filter((s) => s.id === (d.mode ?? 'semaine')).map((s) => <div key={s.id} className="soft-card">
        <p className="ritual-label">{s.title} · aujourd’hui</p>
        {s.items.map((i) => { const id = i.id + '-' + today;
          return <div key={i.id} className="transfo-row"><Check22 checked={Boolean(d.checks?.[id])} onChange={() => toggle(id)} label={i.text} /><span>{i.text}</span>
            {i.link && <button className="link-btn small" onClick={() => onGo(i.link!)}>{LINK_LABEL[i.link]} <ChevronRight size={13} /></button>}</div>; })}
        <p className="muted small">Ces cases repartent à zéro chaque jour.</p>
      </div>)}
      <div className="soft-card transfo-rule"><p className="ritual-label">Règle d’or</p><p>{GOLDEN_RULE}</p></div>
      <p className="transfo-quote">Je suis fière du chemin parcouru et impatiente de vivre la suite.</p>
    </section>}
  </div>;
}

function Checklist({ s, d, onToggle, onGo, onAdd }: { s: Section; d: TransfoData; onToggle: (id: string) => void; onGo: (t: Link) => void; onAdd: (t: string) => void }) {
  const custom = d.custom?.[s.id] ?? [];
  const done = [...s.items.map((i) => i.id), ...custom.map((_, k) => s.id + '-c' + k)].filter((id) => d.checks?.[id]).length;
  return <div className="soft-card">
    <div className="transfo-head"><p className="ritual-label">{s.title}</p><small className="muted">{done}/{s.items.length + custom.length}</small></div>
    {s.items.map((i) => <div key={i.id} className="transfo-row"><Check22 checked={Boolean(d.checks?.[i.id])} onChange={() => onToggle(i.id)} label={i.text} />
      <span>{i.text}</span>{i.link && <button className="link-btn small" onClick={() => onGo(i.link!)}>{LINK_LABEL[i.link]} <ChevronRight size={13} /></button>}</div>)}
    {custom.map((t, k) => <div key={k} className="transfo-row"><Check22 checked={Boolean(d.checks?.[s.id + '-c' + k])} onChange={() => onToggle(s.id + '-c' + k)} label={t} /><span>{t}</span></div>)}
    <button className="link-btn small" onClick={() => { const t = window.prompt('Ajouter à « ' + s.title + ' »')?.trim(); if (t) onAdd(t.slice(0, 100)); }}><Plus size={14} /> Ajouter</button>
  </div>;
}

function Objective({ d, save, toggle, onGo, today }: { d: TransfoData; save: (p: Partial<TransfoData>) => Promise<void>; toggle: (id: string) => void; onGo: (t: Link) => void; today: string }) {
  const g = d.goal ?? {};
  const [label, setLabel] = useState(g.label ?? 'Perdre du poids'), [unit, setUnit] = useState(g.unit ?? 'kg');
  const [start, setStart] = useState(g.start !== undefined ? String(g.start) : ''), [target, setTarget] = useState(g.target !== undefined ? String(g.target) : '');
  const [w, setW] = useState('');
  const weighs = [...(d.weighs ?? [])].sort((a, b) => a.date.localeCompare(b.date));
  const steps = milestones(d.goal, weighs);
  const why = d.why ?? [];
  const saveGoal = () => void save({ goal: { label: label.trim().slice(0, 60), unit: unit.trim().slice(0, 10), start: num(start), target: num(target) } });
  const last = weighs.at(-1);
  return <section className="stack-8">
    <div className="soft-card form-stack">
      <p className="ritual-label">Mon objectif</p>
      <label>Objectif<input value={label} onChange={(e) => setLabel(e.target.value)} onBlur={saveGoal} /></label>
      <div className="two-inputs">
        <label>Point de départ<input inputMode="decimal" value={start} onChange={(e) => setStart(e.target.value)} onBlur={saveGoal} /></label>
        <label>Objectif<input inputMode="decimal" value={target} onChange={(e) => setTarget(e.target.value)} onBlur={saveGoal} /></label>
      </div>
      <label>Unité<input value={unit} onChange={(e) => setUnit(e.target.value)} onBlur={saveGoal} /></label>
      <p className="muted small">Date limite : {fmtDate(d.end ?? endOf(d.start!))}</p>
    </div>

    {steps.length > 0 && <div className="soft-card">
      <p className="ritual-label"><Trophy size={16} /> Mes paliers</p>
      <div className="transfo-steps">{steps.map((s, k) => <span key={k} className={'transfo-step' + (s.reached ? ' on' : '')}>{s.delta > 0 ? '+' : ''}{String(s.delta).replace('.', ',')} {g.unit ?? ''}</span>)}</div>
      {last && <p className="small">Dernière mesure : {String(last.value).replace('.', ',')} {g.unit ?? ''} le {fmtDate(last.date)}</p>}
    </div>}

    <div className="soft-card form-stack">
      <p className="ritual-label">Mes mesures</p>
      <div className="two-inputs"><input inputMode="decimal" placeholder={'Mesure (' + (g.unit || 'kg') + ')'} value={w} onChange={(e) => setW(e.target.value)} />
        <button className="button soft" disabled={num(w) === undefined} onClick={() => { const v = num(w)!; void save({ weighs: [...weighs.filter((x) => x.date !== today), { date: today, value: v }] }); setW(''); }}>Noter</button></div>
      {weighs.length > 1 && <Sparkline values={weighs.map((x) => x.value)} />}
      {weighs.slice(-5).reverse().map((x) => <div key={x.date} className="transfo-row"><span>{fmtDate(x.date)}</span><strong>{String(x.value).replace('.', ',')} {g.unit ?? ''}</strong></div>)}
    </div>

    <div className="soft-card">
      <p className="ritual-label">Pourquoi je le fais</p>
      <div className="chip-row">{WHY.map((x) => <button key={x} className={'chip' + (why.includes(x) ? ' on' : '')} onClick={() => void save({ why: why.includes(x) ? why.filter((y) => y !== x) : [...why, x] })}>{x}</button>)}</div>
      <textarea className="soft-input" rows={2} placeholder="Mon pourquoi à moi…" defaultValue={d.whyOther ?? ''} onBlur={(e) => { if (e.target.value !== (d.whyOther ?? '')) void save({ whyOther: e.target.value.slice(0, 300) }); }} />
      <p className="transfo-quote small">Pour la moi du futur.</p>
    </div>

    {PLAN.map((s) => <Checklist key={s.id} s={s} d={d} onToggle={toggle} onGo={onGo}
      onAdd={(t) => void save({ custom: { ...(d.custom ?? {}), [s.id]: [...(d.custom?.[s.id] ?? []), t] } })} />)}
  </section>;
}

function Sparkline({ values }: { values: number[] }) {
  const min = Math.min(...values), max = Math.max(...values), W = 300, H = 60;
  const pts = values.map((v, i) => `${(i / (values.length - 1)) * W},${max === min ? H / 2 : H - ((v - min) / (max - min)) * (H - 8) - 4}`).join(' ');
  return <svg className="transfo-spark" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Évolution de mes mesures"><polyline points={pts} fill="none" stroke="#7E7254" strokeWidth="2" strokeLinejoin="round" /></svg>;
}
