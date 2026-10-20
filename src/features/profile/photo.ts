import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';

/** Choisit une photo dans la photothèque, la recadre en carré et la réduit (256 px, JPEG) pour la garder dans la base chiffrée. */
export async function pickProfilePhoto(): Promise<string | null> {
  const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [1, 1], quality: 1 });
  const asset = result.canceled ? undefined : result.assets[0];
  if (!asset) return null;
  const context = ImageManipulator.manipulate(asset.uri);
  const side = Math.min(asset.width, asset.height);
  if (asset.width !== asset.height) context.crop({ originX: (asset.width - side) / 2, originY: (asset.height - side) / 2, width: side, height: side });
  context.resize({ width: 256, height: 256 });
  const image = await context.renderAsync();
  const saved = await image.saveAsync({ base64: true, compress: 0.75, format: SaveFormat.JPEG });
  if (!saved.base64) throw new Error('Photo impossible à préparer.');
  return `data:image/jpeg;base64,${saved.base64}`;
}
