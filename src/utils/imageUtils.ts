/**
 * Utility functions for handling images
 */

/**
 * Checks if an image exists at the given URL
 * @param url The URL to check
 * @returns A promise that resolves to a boolean indicating if the image exists
 */
export const checkImageExists = (url: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
};

/**
 * Gets the correct path for an image
 * @param path The image path
 * @returns The correct URL for the image
 */
export const getImagePath = (path: string): string => {
  // If the path is absolute (starts with http or https), return it as is
  if (path && (path.startsWith('http://') || path.startsWith('https://'))) {
    return path;
  }
  
  // If the path starts with a slash but not double slash, treat it as relative to base URL
  if (path && path.startsWith('/') && !path.startsWith('//')) {
    // Strip the leading slash since we'll add the base URL which might end with a slash
    path = path.substring(1);
  }
  
  // Use the public URL from the environment if available, or default to '/'
  const baseUrl = import.meta.env.BASE_URL || '/';
  
  // Avoid double slashes in the URL
  const formattedBaseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  
  return `${formattedBaseUrl}${path}`;
};

/**
 * Preloads an image
 * @param src The image source URL
 * @returns A promise that resolves when the image is loaded
 */
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
};

export default {
  checkImageExists,
  getImagePath,
  preloadImage
}; 