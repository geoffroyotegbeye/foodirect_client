import api from '../lib/api';

export const orderService = {
  // Créer une commande
  createOrder: async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  // Récupérer toutes les commandes (admin)
  getAllOrders: async () => {
    const response = await api.get('/orders');
    return response.data;
  },

  // Récupérer une commande par ID
  getOrderById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  // Modifier le statut d'une commande (admin)
  updateOrderStatus: async (id, status) => {
    const response = await api.patch(`/orders/${id}/status`, { status });
    return response.data;
  },

  // Modifier le statut de paiement (admin)
  updatePaymentStatus: async (id, payment_status) => {
    const response = await api.patch(`/orders/${id}/payment`, { payment_status });
    return response.data;
  },

  // Supprimer une commande (admin)
  deleteOrder: async (id) => {
    const response = await api.delete(`/orders/${id}`);
    return response.data;
  },
};
