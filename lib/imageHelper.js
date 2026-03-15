// Helper pour gérer les URLs d'images
export const getImageUrl = (imagePath) => {
  if (!imagePath) {
    return '/assets/default.png';
  }
  
  // Si c'est déjà une URL complète, la retourner telle quelle
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // Si c'est une image locale dans /assets/, la retourner telle quelle
  if (imagePath.startsWith('/assets/')) {
    return imagePath;
  }
  
  // Si c'est un chemin d'upload, construire l'URL complète
  if (imagePath.startsWith('/uploads/')) {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5001';
    return `${baseUrl}${imagePath}`;
  }
  
  // Par défaut, retourner l'image par défaut
  return '/assets/default.png';
};
