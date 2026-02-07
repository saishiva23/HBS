/**
 * Default image utility for hotels and room types
 * Provides fallback images when no images are uploaded
 */

// Default image paths (stored in public/images/defaults/)
export const DEFAULT_IMAGES = {
  hotel: '/images/defaults/hotel.png',
  standard: '/images/defaults/standard.png',
  'standard ac': '/images/defaults/standard_ac.png',
  deluxe: '/images/defaults/deluxe.png',
  family: '/images/defaults/family.png',
};

/**
 * Get default image for a room type
 * @param {string} roomTypeName - Name of the room type (e.g., "Standard", "Deluxe")
 * @returns {string} Path to default image
 */
export const getDefaultRoomImage = (roomTypeName) => {
  if (!roomTypeName) return DEFAULT_IMAGES.standard;
  
  const normalized = roomTypeName.toLowerCase().trim();
  
  // Match room type to default image
  if (normalized.includes('family')) return DEFAULT_IMAGES.family;
  if (normalized.includes('deluxe')) return DEFAULT_IMAGES.deluxe;
  if (normalized.includes('ac')) return DEFAULT_IMAGES['standard ac'];
  
  // Default to standard room
  return DEFAULT_IMAGES.standard;
};

/**
 * Get default image for a hotel
 * @returns {string} Path to default hotel image
 */
export const getDefaultHotelImage = () => {
  return DEFAULT_IMAGES.hotel;
};

/**
 * Get image to display - returns first image from array or default
 * @param {Array} images - Array of image URLs
 * @param {string} type - Type of default image ('hotel' or room type name)
 * @returns {string} Image URL to display
 */
export const getDisplayImage = (images, type = 'hotel') => {
  // If images array exists and has items, return first image
  if (images && Array.isArray(images) && images.length > 0) {
    return images[0];
  }
  
  // Return appropriate default image
  if (type === 'hotel') {
    return getDefaultHotelImage();
  }
  
  return getDefaultRoomImage(type);
};

/**
 * Get all images or default image as array
 * @param {Array} images - Array of image URLs
 * @param {string} type - Type of default image ('hotel' or room type name)
 * @returns {Array} Array of image URLs
 */
export const getImageArray = (images, type = 'hotel') => {
  // If images array exists and has items, return it
  if (images && Array.isArray(images) && images.length > 0) {
    return images;
  }
  
  // Return default image as single-item array
  if (type === 'hotel') {
    return [getDefaultHotelImage()];
  }
  
  return [getDefaultRoomImage(type)];
};
