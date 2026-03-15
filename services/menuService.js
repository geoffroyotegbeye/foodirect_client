import api from '../lib/api';

export const menuService = {
  // Récupérer tous les plats (avec pagination pour l'admin)
  getAllMenu: async (page = 1, limit = 10) => {
    const response = await api.get(`/menu?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Récupérer les plats en vedette (Menu du Jour) - OPTIMISÉ
  getFeaturedMenu: async () => {
    const response = await api.get('/menu/featured');
    return response.data;
  },

  // Récupérer les plats disponibles pour la landing page - OPTIMISÉ
  getAvailableMenu: async (limit = 50) => {
    const response = await api.get(`/menu/available?limit=${limit}`);
    return response.data;
  },

  // Récupérer un plat par ID
  getMenuById: async (id) => {
    const response = await api.get(`/menu/${id}`);
    return response.data;
  },

  // Récupérer par catégorie
  getMenuByCategory: async (category) => {
    const response = await api.get(`/menu/category/${category}`);
    return response.data;
  },

  // Créer un plat (admin) - avec upload d'image
  createMenu: async (menuData) => {
    const formData = new FormData();
    
    // Ajouter tous les champs
    Object.keys(menuData).forEach(key => {
      if (menuData[key] !== null && menuData[key] !== undefined) {
        formData.append(key, menuData[key]);
      }
    });
    
    const response = await api.post('/menu', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  // Modifier un plat (admin) - avec upload d'image
  updateMenu: async (id, menuData) => {
    const formData = new FormData();
    
    // Ajouter tous les champs
    Object.keys(menuData).forEach(key => {
      if (menuData[key] !== null && menuData[key] !== undefined) {
        formData.append(key, menuData[key]);
      }
    });
    
    const response = await api.put(`/menu/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  // Supprimer un plat (admin)
  deleteMenu: async (id) => {
    const response = await api.delete(`/menu/${id}`);
    return response.data;
  },

  // Toggle featured (Menu du Jour)
  toggleFeatured: async (id, featured) => {
    const response = await api.patch(`/menu/${id}/featured`, { featured });
    return response.data;
  },
};
