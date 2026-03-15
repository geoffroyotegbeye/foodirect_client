// Helper pour gérer les URLs d'images
const FALLBACK = '/assets/1.png';
const INVALID_ASSETS = ['/assets/default.png'];

export const getImageUrl = (imagePath) => {
  if (!imagePath || INVALID_ASSETS.includes(imagePath)) return FALLBACK;

  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) return imagePath;

  if (imagePath.startsWith('/assets/')) return imagePath;

  if (imagePath.startsWith('/uploads/')) {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5001';
    return `${baseUrl}${imagePath}`;
  }

  return FALLBACK;
};
