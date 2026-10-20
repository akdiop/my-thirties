import { mediaKeys, VIDEOS } from './media';

describe('video catalogue', () => {
  it('only links known fiches to YouTube over https', () => {
    const keys = new Set(mediaKeys());
    for (const [key, v] of Object.entries(VIDEOS)) {
      expect(keys.has(key)).toBe(true);
      expect(v.url).toMatch(/^https:\/\/(www\.)?youtube\.com\/watch\?v=[\w-]{11}$/);
    }
  });
});
