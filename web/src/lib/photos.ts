export const PHOTO_KIND = 'photo';

/** Réduit une photo d'illustration (paysage 720×450, JPEG) dans le navigateur pour qu'elle tienne dans une entrée privée. */
export async function shrinkHero(file: File): Promise<string> {
  if (!/^image\/(jpeg|png|webp|heic|heif)$/.test(file.type)) throw new Error('Choisis une image JPEG, PNG ou WebP.');
  if (file.size > 20_000_000) throw new Error('Image trop lourde (20 Mo maximum).');
  const bitmap = await createImageBitmap(file);
  const W = 720, H = 450;
  const scale = Math.max(W / bitmap.width, H / bitmap.height);
  const sw = W / scale, sh = H / scale;
  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Traitement de l’image impossible.');
  ctx.drawImage(bitmap, (bitmap.width - sw) / 2, (bitmap.height - sh) / 2, sw, sh, 0, 0, W, H);
  bitmap.close();
  for (const quality of [0.72, 0.6, 0.5, 0.4, 0.3]) {
    const url = canvas.toDataURL('image/jpeg', quality);
    if (url.length < 46_000) return url;
  }
  throw new Error('Image trop détaillée : essaie une autre photo.');
}
