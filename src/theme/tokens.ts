import type { TextStyle } from 'react-native';

export const palette = {
  cream: '#FAF7F2',
  sand: '#E9DCCF',
  caramel: '#B68F72',
  chocolate: '#6B3F2E',
  sage: '#8F9F7A',
  olive: '#5E7A5F',
  gold: '#D4B483',
  ink: '#2B1A12',
  muted: '#7A6355',
  oliveDeep: '#4A6350',
  espresso: '#2A1810',
  espressoSurface: '#3A2419',
  alert: '#B3261E',
  white: '#FFFFFF',
} as const;

export type ColorScheme = 'light' | 'dark';

export type ThemeColors = {
  background: string;
  surface: string;
  surfaceAlt: string;
  border: string;
  text: string;
  textMuted: string;
  primary: string;
  onPrimary: string;
  secondary: string;
  onSecondary: string;
  accent: string;
  progress: string;
  progressTrack: string;
  success: string;
  successTint: string;
  rest: string;
  restTint: string;
  danger: string;
};

export const colors: Record<ColorScheme, ThemeColors> = {
  light: {
    background: palette.cream,
    surface: '#FFFDF9',
    surfaceAlt: palette.sand,
    border: '#EFE5DA',
    text: palette.ink,
    textMuted: palette.muted,
    primary: palette.chocolate,
    onPrimary: palette.cream,
    secondary: palette.olive,
    onSecondary: palette.white,
    accent: palette.oliveDeep,
    progress: palette.sage,
    progressTrack: palette.sand,
    success: palette.sage,
    successTint: '#E8EDE2',
    rest: palette.caramel,
    restTint: '#F1E4D8',
    danger: palette.alert,
  },
  dark: {
    background: palette.espresso,
    surface: palette.espressoSurface,
    surfaceAlt: '#4A3022',
    border: '#4E3427',
    text: palette.cream,
    textMuted: '#C9B8A8',
    primary: '#E9DCCF',
    onPrimary: palette.espresso,
    secondary: '#A9B894',
    onSecondary: palette.espresso,
    accent: '#A9B894',
    progress: '#A9B894',
    progressTrack: '#4A3022',
    success: '#A9B894',
    successTint: '#34402C',
    rest: palette.caramel,
    restTint: '#4A3022',
    danger: '#F2B8B5',
  },
};

export const radius = { sm: 8, md: 12, lg: 16, xl: 24, pill: 999 } as const;

export const space = (n: number) => n * 4;

export const fonts = {
  display: 'CormorantGaramond_500Medium',
  title: 'CormorantGaramond_600SemiBold',
  body: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
} as const;

export const type = {
  display: { fontFamily: fonts.display, fontSize: 44, lineHeight: 48 },
  screenTitle: { fontFamily: fonts.title, fontSize: 30, lineHeight: 36 },
  cardTitle: { fontFamily: fonts.title, fontSize: 22, lineHeight: 28 },
  body: { fontFamily: fonts.body, fontSize: 15, lineHeight: 22 },
  label: { fontFamily: fonts.medium, fontSize: 13, lineHeight: 18 },
  caption: { fontFamily: fonts.body, fontSize: 12, lineHeight: 17 },
  number: { fontFamily: fonts.semibold, fontSize: 20, lineHeight: 26, fontVariant: ['tabular-nums'] },
} satisfies Record<string, TextStyle>;

export type TypeVariant = keyof typeof type;

export const MIN_TOUCH = 44;
