import type { ReactNode } from 'react';
import {
  ArrowLeft, Brush, CalendarCheck, Check, ChevronRight, Compass, CookingPot, Dumbbell, Flower2, Heart, List, Moon, Sparkles, Trophy, Wallet,
  type LucideIcon,
} from 'lucide-react';
import type { ModuleId } from '../lib/cloud';

export type Tone = 'sable' | 'sauge' | 'creme';
export const TILE: Record<Tone, { bg: string; fg: string }> = {
  sable: { bg: '#E8DCD6', fg: '#8C6257' },
  sauge: { bg: '#DFE8E3', fg: '#5A7369' },
  creme: { bg: '#F5ECE8', fg: '#8C6257' },
};

/** Icône et teinte de chaque espace, comme sur la maquette « Mes espaces ». */
export const MODULE_LOOK: Record<ModuleId | 'assistant', { icon: LucideIcon; tone: Tone; short: string }> = {
  quotidien: { icon: CalendarCheck, tone: 'creme', short: 'Mon quotidien' },
  sante: { icon: Heart, tone: 'sauge', short: 'Ma santé' },
  sport: { icon: Dumbbell, tone: 'sauge', short: 'Mon sport' },
  challenges: { icon: Trophy, tone: 'sauge', short: 'Mes challenges' },
  equilibre: { icon: Flower2, tone: 'sable', short: 'Mon équilibre' },
  spiritualite: { icon: Moon, tone: 'sable', short: 'Ma spiritualité' },
  finances: { icon: Wallet, tone: 'creme', short: 'Mes finances' },
  cuisine: { icon: CookingPot, tone: 'creme', short: 'Ma cuisine' },
  decouvertes: { icon: Compass, tone: 'sauge', short: 'Mes découvertes' },
  passions: { icon: Brush, tone: 'sable', short: 'Mes passions' },
  listes: { icon: List, tone: 'creme', short: 'Mes listes' },
  assistant: { icon: Sparkles, tone: 'sauge', short: 'Assistant' },
};

export function ScreenHeader({ title, subtitle, onBack, right }: { title: string; subtitle?: string; onBack?: () => void; right?: ReactNode }) {
  return <header className="screen-header">
    {onBack && <button className="icon-btn back" onClick={onBack} aria-label="Retour"><ArrowLeft size={22} /></button>}
    <div className="screen-title"><h1>{title}</h1>{subtitle && <p>{subtitle}</p>}</div>
    {right && <div className="screen-actions">{right}</div>}
  </header>;
}

export function Segmented<T extends string>({ value, options, onChange, label }: { value: T; options: { value: T; label: string }[]; onChange: (v: T) => void; label: string }) {
  return <div className="segmented" role="tablist" aria-label={label}>
    {options.map((o) => <button key={o.value} role="tab" aria-selected={o.value === value} className={o.value === value ? 'on' : ''} onClick={() => onChange(o.value)}>{o.label}</button>)}
  </div>;
}

export function SectionTitle({ children, action, onAction }: { children: ReactNode; action?: string; onAction?: () => void }) {
  return <div className="section-title"><h2>{children}</h2>{action && <button className="link-btn" onClick={onAction}>{action}</button>}</div>;
}

export function Bar({ value, tone = 'sauge' }: { value: number; tone?: 'sauge' | 'caramel' | 'olive' }) {
  return <div className={'bar ' + tone} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(value * 100)}>
    <div style={{ width: Math.max(0, Math.min(100, value * 100)) + '%' }} />
  </div>;
}

export function Check22({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return <button className={'check22' + (checked ? ' on' : '')} role="checkbox" aria-checked={checked} aria-label={label} onClick={() => onChange(!checked)}>
    {checked && <Check size={14} strokeWidth={3} />}
  </button>;
}

export function RowLink({ icon: Icon, title, sub, onClick, tone }: { icon: LucideIcon; title: string; sub?: string; onClick?: () => void; tone?: Tone }) {
  return <button className="row-link" onClick={onClick}>
    <span className="row-icon" style={tone ? { background: TILE[tone].bg, color: TILE[tone].fg } : undefined}><Icon size={19} /></span>
    <span className="row-text"><strong>{title}</strong>{sub && <small>{sub}</small>}</span>
    <ChevronRight size={18} className="row-chev" />
  </button>;
}

export function ModuleTile({ id, label, onClick }: { id: ModuleId | 'assistant'; label?: string; onClick: () => void }) {
  const look = MODULE_LOOK[id];
  const Icon = look.icon;
  return <button className="module-tile" style={{ background: TILE[look.tone].bg }} onClick={onClick}>
    <Icon size={26} color={TILE[look.tone].fg} strokeWidth={1.6} />
    <span>{label ?? look.short}</span>
  </button>;
}
