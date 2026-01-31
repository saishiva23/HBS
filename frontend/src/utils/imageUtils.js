/**
 * Image utility functions for handling various image URL formats
 */

/**
 * Converts Google Drive share links to direct image URLs
 * @param {string} url - The URL to convert
 * @returns {string} - Converted direct URL or original URL if not a Google Drive link
 */
export const convertGoogleDriveUrl = (url) => {
  if (!url || typeof url !== 'string') return url;

  // Pattern 1: https://drive.google.com/file/d/FILE_ID/view?usp=sharing
  const sharePattern = /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/;
  const match = url.match(sharePattern);

  if (match && match[1]) {
    const fileId = match[1];
    return `https://drive.google.com/uc?export=view&id=${fileId}`;
  }

  // Pattern 2: Already in direct format (uc?export=view&id=FILE_ID)
  if (url.includes('drive.google.com/uc?export=view')) {
    return url; // Already in correct format
  }

  // Pattern 3: https://drive.google.com/open?id=FILE_ID
  const openPattern = /drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/;
  const openMatch = url.match(openPattern);

  if (openMatch && openMatch[1]) {
    const fileId = openMatch[1];
    return `https://drive.google.com/uc?export=view&id=${fileId}`;
  }

  // Not a Google Drive URL, return as-is
  return url;
};

/**
 * Validates if a URL is likely a valid image URL
 * @param {string} url - The URL to validate
 * @returns {boolean} - True if likely valid, false otherwise
 */
export const isValidImageUrl = (url) => {
  if (!url || typeof url !== 'string') return false;

  // Check if it's a valid URL format
  try {
    new URL(url);
  } catch {
    return false;
  }

  // Common image URL patterns
  const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg|bmp)(\?.*)?$/i;
  const imageHosts = [
    'imgur.com',
    'unsplash.com',
    'cloudinary.com',
    'drive.google.com',
    'amazonaws.com',
    'googleusercontent.com',
  ];

  // Check if URL ends with image extension
  if (imageExtensions.test(url)) return true;

  // Check if URL is from known image hosting services
  if (imageHosts.some(host => url.includes(host))) return true;

  // Check if it starts with http/https
  return url.startsWith('http://') || url.startsWith('https://');
};

/**
 * Normalizes an image URL by converting Google Drive links and validating
 * @param {string} url - The URL to normalize
 * @returns {string|null} - Normalized URL or null if invalid
 */
export const normalizeImageUrl = (url) => {
  if (!url) return null;

  // Trim whitespace
  url = url.trim();

  // Convert Google Drive URLs
  url = convertGoogleDriveUrl(url);

  // Add https:// if missing but looks like a valid domain
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    if (url.includes('.')) {
      url = `https://${url}`;
    }
  }

  // Validate
  if (!isValidImageUrl(url)) return null;

  return url;
};

/**
 * Detects the type of URL
 * @param {string} url - The URL to check
 * @returns {string} - 'google-drive', 'imgur', 'unsplash', 'other'
 */
export const detectUrlType = (url) => {
  if (!url) return 'other';

  if (url.includes('drive.google.com')) {
    if (url.includes('/file/d/') || url.includes('/open?id=')) {
      return 'google-drive-share';
    }
    if (url.includes('uc?export=view')) {
      return 'google-drive-direct';
    }
    return 'google-drive';
  }

  if (url.includes('imgur.com')) return 'imgur';
  if (url.includes('unsplash.com')) return 'unsplash';
  if (url.includes('cloudinary.com')) return 'cloudinary';

  return 'other';
};

/**
 * Gets a user-friendly message about the URL type
 * @param {string} url - The URL to check
 * @returns {string} - User-friendly message
 */
export const getUrlTypeMessage = (url) => {
  const type = detectUrlType(url);

  const messages = {
    'google-drive-share': '✓ Google Drive link detected - Auto-converting to direct URL',
    'google-drive-direct': '✓ Google Drive direct URL - Ready to use',
    'google-drive': '✓ Google Drive URL detected',
    'imgur': '✓ Imgur image detected',
    'unsplash': '✓ Unsplash image detected',
    'cloudinary': '✓ Cloudinary image detected',
    'other': '✓ Image URL added',
  };

  return messages[type] || messages.other;
};

export default {
  convertGoogleDriveUrl,
  isValidImageUrl,
  normalizeImageUrl,
  detectUrlType,
  getUrlTypeMessage,
};
