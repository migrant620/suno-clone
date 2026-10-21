import { Image } from 'react-native';
import type { ImagePickerAsset } from 'expo-image-picker';

export async function profileImageUri(asset: ImagePickerAsset): Promise<string> {
  const data = asset.base64;
  if (!data || data.length > 4_000_000) throw new Error('Image unavailable or too large');
  const mime = data.startsWith('/9j/') ? 'image/jpeg'
    : data.startsWith('iVBORw0KGgo') ? 'image/png'
    : data.startsWith('R0lGOD') ? 'image/gif'
    : asset.mimeType || 'image/jpeg';
  const uri = `data:${mime};base64,${data}`;
  await new Promise<void>((resolve, reject) => Image.getSize(uri, (width, height) => {
    if (width > 0 && height > 0) resolve(); else reject(new Error('Image is empty'));
  }, reject));
  return uri;
}
