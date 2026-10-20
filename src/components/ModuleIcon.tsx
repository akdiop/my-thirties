import { Brush, CalendarCheck, Compass, CookingPot, Dumbbell, Flower2, Heart, List, Moon, Trophy, Wallet, type LucideIcon } from 'lucide-react-native';

import type { ModuleId } from '@/modules/registry';

const ICONS: Record<ModuleId, LucideIcon> = {
  quotidien: CalendarCheck,
  sante: Heart,
  sport: Dumbbell,
  challenges: Trophy,
  equilibre: Flower2,
  spiritualite: Moon,
  finances: Wallet,
  cuisine: CookingPot,
  decouvertes: Compass,
  passions: Brush,
  listes: List,
};

export function ModuleIcon({ id, color, size = 28 }: { id: ModuleId; color: string; size?: number }) {
  const Icon = ICONS[id];
  return <Icon size={size} color={color} strokeWidth={1.5} />;
}
