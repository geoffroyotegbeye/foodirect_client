import api from '../lib/api';

export const userService = {
  // Récupérer tous les utilisateurs (admin seulement)
  getAllUsers: async (page = 1, limit = 10) => {
    const response = await api.get(`/users?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Récupérer un utilisateur par ID
  getUserById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  // Créer un utilisateur (admin seulement)
  createUser: async (userData) => {
    const response = await api.post('/users', userData);
    return response.data;
  },

  // Modifier un utilisateur (admin seulement)
  updateUser: async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  // Supprimer un utilisateur (admin seulement)
  deleteUser: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },

  // Activer/Désactiver un utilisateur
  toggleUserStatus: async (id, is_active) => {
    const response = await api.patch(`/users/${id}/status`, { is_active });
    return response.data;
  },
};
