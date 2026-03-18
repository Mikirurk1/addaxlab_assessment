/** Max size for uploaded avatar file (5 MB). */
export const AVATAR_MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

/** Target dimensions for stored avatar (display uses size prop). */
export const AVATAR_TARGET_SIZE = 150;

/**
 * Compresses an image file to AVATAR_TARGET_SIZE x AVATAR_TARGET_SIZE (cover crop),
 * returns a data URL (JPEG). Rejects if file is too large or not an image.
 */
export function compressAvatarImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (file.size > AVATAR_MAX_FILE_SIZE_BYTES) {
      reject(new Error('FILE_TOO_BIG'));
      return;
    }
    if (!file.type.startsWith('image/')) {
      reject(new Error('INVALID_TYPE'));
      return;
    }
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement('canvas');
      canvas.width = AVATAR_TARGET_SIZE;
      canvas.height = AVATAR_TARGET_SIZE;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('CANVAS'));
        return;
      }
      const s = Math.max(img.width, img.height);
      const x = (img.width - s) / 2;
      const y = (img.height - s) / 2;
      ctx.drawImage(img, x, y, s, s, 0, 0, AVATAR_TARGET_SIZE, AVATAR_TARGET_SIZE);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      resolve(dataUrl);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('LOAD'));
    };
    img.src = url;
  });
}
