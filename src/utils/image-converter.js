/**
 * Image Optimizer & Converter Utility
 * Automatically converts any uploaded image file (PNG, JPG, JPEG, BMP, etc.)
 * into WebP format with optional scaling for optimal web performance.
 */

/**
 * Converts an image file to WebP format.
 * @param {File} file - Original File object
 * @param {object} [options]
 * @param {number} [options.quality=0.85] - WebP compression quality (0.1 to 1.0)
 * @param {number} [options.maxWidth=1920] - Max allowable width in pixels
 * @param {number} [options.maxHeight=1080] - Max allowable height in pixels
 * @returns {Promise<{ file: File, originalSize: number, newSize: number, savingsPercent: number, dataUrl: string }>}
 */
export const convertImageToWebP = (file, options = {}) => {
  const {
    quality = 0.85,
    maxWidth = 1920,
    maxHeight = 1080,
  } = options;

  return new Promise((resolve) => {
    if (!file?.type?.startsWith('image/')) {
      return resolve({
        file,
        originalSize: file?.size ?? 0,
        newSize: file?.size ?? 0,
        savingsPercent: 0,
        dataUrl: '',
      });
    }

    const originalSize = file.size;
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      let width = img.width;
      let height = img.height;

      // Maintain aspect ratio while constraining to maxWidth x maxHeight
      if (width > maxWidth || height > maxHeight) {
        if (width / height > maxWidth / maxHeight) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      // Use smooth image smoothing for crisp downscaled results
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      // Generate Data URL for instant preview / fallback
      const dataUrl = canvas.toDataURL('image/webp', quality);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            return resolve({
              file,
              originalSize,
              newSize: originalSize,
              savingsPercent: 0,
              dataUrl,
            });
          }

          const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
          const webpFile = new File([blob], `${baseName}.webp`, {
            type: 'image/webp',
            lastModified: Date.now(),
          });

          const newSize = webpFile.size;
          const savingsPercent = originalSize > 0
            ? Math.max(0, Math.round(((originalSize - newSize) / originalSize) * 100))
            : 0;

          resolve({
            file: webpFile,
            originalSize,
            newSize,
            savingsPercent,
            dataUrl,
          });
        },
        'image/webp',
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve({
        file,
        originalSize,
        newSize: originalSize,
        savingsPercent: 0,
        dataUrl: '',
      });
    };

    img.src = objectUrl;
  });
};
