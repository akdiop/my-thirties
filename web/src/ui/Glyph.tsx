import { moodOf } from '../lib/rituals';
import {
  Apple, BatteryLow, Bed, Beef, BookHeart, BookOpen, BookOpenText, Brain, Brush, Building2, Cake, CalendarCheck, Carrot, Citrus, ClipboardList,
  Cloud, CloudRain, Coffee, Coins, Compass, CookingPot, Cookie, Croissant, CupSoda, Drumstick, Droplet, Dumbbell, Egg, EggFried, Feather, FileText, Fish,
  Flame, Folder, Footprints, Gem, GlassWater, HandHeart, Headphones, Heart, History, IceCreamCone, Landmark, Languages, Leaf, Lightbulb, Mail,
  Meh, Milk, Moon, Mountain, Music, NotebookPen, Palette, PersonStanding, Phone, PhoneOff, Pizza, Popcorn, Salad, Sandwich, Smile, Soup, Sparkle,
  Sparkles, Sprout, Star, Sun, Sunrise, Target, TreePalm, Trees, Trophy, Users, Utensils, Wallet, Waves, Wheat,
} from 'lucide-react';

/** Icônes de l'app (traits fins, couleurs de la palette) à la place des emojis. */
export const GLYPHS = {
  apple: Apple, battery: BatteryLow, bed: Bed, beef: Beef, bookHeart: BookHeart, book: BookOpen, bookText: BookOpenText, brain: Brain, brush: Brush,
  city: Building2, cake: Cake, calendar: CalendarCheck, carrot: Carrot, citrus: Citrus, list: ClipboardList, cloud: Cloud, rain: CloudRain, coffee: Coffee,
  coins: Coins, compass: Compass, pot: CookingPot, cookie: Cookie, croissant: Croissant, drink: CupSoda, drumstick: Drumstick, drop: Droplet,
  dumbbell: Dumbbell, egg: Egg, eggFried: EggFried, feather: Feather, file: FileText, fish: Fish, flame: Flame, folder: Folder, steps: Footprints,
  gem: Gem, glass: GlassWater, handHeart: HandHeart, headphones: Headphones, heart: Heart, history: History, icecream: IceCreamCone, landmark: Landmark,
  languages: Languages, leaf: Leaf, idea: Lightbulb, mail: Mail, meh: Meh, milk: Milk, moon: Moon, mountain: Mountain, music: Music, notebook: NotebookPen,
  palette: Palette, stretch: PersonStanding, phone: Phone, phoneOff: PhoneOff, pizza: Pizza, popcorn: Popcorn, salad: Salad, sandwich: Sandwich,
  smile: Smile, soup: Soup, sparkle: Sparkle, sparkles: Sparkles, sprout: Sprout, star: Star, sun: Sun, sunrise: Sunrise, target: Target, palm: TreePalm,
  trees: Trees, trophy: Trophy, users: Users, utensils: Utensils, wallet: Wallet, waves: Waves, wheat: Wheat,
} as const;
export type GlyphName = keyof typeof GLYPHS;

/** Teintes de la palette : fond doux + trait. */
export const TINTS = {
  caramel: ['#F3E6D8', '#B5835A'], sauge: ['#DFE8E3', '#6F8A80'], rose: ['#F1E4E0', '#B07A6E'], chocolat: ['#E8DCD6', '#8C6257'],
  or: ['#EFE7D2', '#A88A4C'], ardoise: ['#E2E6EA', '#5D6F7E'], lilas: ['#EADFEA', '#86688A'], terre: ['#F5E9DA', '#C0703F'],
} as const;
export type Tint = keyof typeof TINTS;

export function Glyph({ name, tint = 'chocolat', size = 18, badge = 0, label }: { name: GlyphName | string; tint?: Tint; size?: number; badge?: number; label?: string }) {
  const Icon = GLYPHS[name as GlyphName] ?? Sparkle;
  const [bg, ink] = TINTS[tint];
  const icon = <Icon size={size} strokeWidth={1.7} color={ink} aria-hidden={label ? undefined : true} aria-label={label} />;
  return badge ? <span className="glyph-badge" style={{ width: badge, height: badge, background: bg }}>{icon}</span> : icon;
}

/** Icône d'humeur (Mon jour ou Bien-être), dans un rond teinté. */
export function MoodIcon({ mood, size = 18, badge = 0 }: { mood: unknown; size?: number; badge?: number }) {
  const m = moodOf(mood);
  return m ? <Glyph name={m.icon} tint={m.tint} size={size} badge={badge} label={m.value} /> : null;
}
