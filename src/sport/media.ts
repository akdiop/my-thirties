import { CHALLENGE_TEMPLATES } from '@/challenges/challenges';
import { FICHES, YOGA_SESSIONS } from './content';

export type Video = { url: string; title: string; lang: 'fr' | 'en' };

export const VIDEOS: Record<string, Video> = {};

export const mediaKeys = () => [
  ...FICHES.map((f) => f.id),
  ...CHALLENGE_TEMPLATES.map((t) => `challenge-${t.id}`),
  ...YOGA_SESSIONS.map((s) => `yoga-seance-${s.minutes}`),
];

export const videoFor = (key: string): Video | undefined => VIDEOS[key];
