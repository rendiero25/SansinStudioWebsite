/**
 * Injects Cloudinary transformations for performance optimization.
 * f_auto: Automatically choose the best format for the browser (WebM, MP4, etc.)
 * q_auto: Automatically compress while maintaining visual quality.
 */
export const getOptimizedVideoUrl = (url: string | undefined): string => {
  if (!url) return "";
  if (!url.includes("cloudinary.com")) return url;

  // Find the 'upload/' part and inject transformations right after it
  const parts = url.split("/upload/");
  if (parts.length !== 2) return url;

  return `${parts[0]}/upload/f_auto,q_auto/${parts[1]}`;
};

/**
 * Generates a poster (thumbnail) URL from a Cloudinary video URL.
 * Changes extension to .jpg and adds a transformation to pick a frame.
 */
export const getVideoPosterUrl = (url: string | undefined): string => {
  if (!url) return "";
  if (!url.includes("cloudinary.com")) return url;

  const parts = url.split("/upload/");
  if (parts.length !== 2) return url;

  // Change extension to jpg and add transformations
  // so_auto: start offset auto (finds an interesting frame)
  const videoFileName = parts[1];
  const posterFileName = videoFileName.replace(/\.[^/.]+$/, ".jpg");

  return `${parts[0]}/upload/f_auto,q_auto,so_auto/${posterFileName}`;
};
