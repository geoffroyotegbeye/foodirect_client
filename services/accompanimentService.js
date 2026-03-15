import api from '../lib/api';

export const accompanimentService = {
  getAll: async () => {
    const res = await api.get('/accompaniments');
    return res.data;
  },

  getByMenu: async (menuId) => {
    const res = await api.get(`/accompaniments/menu/${menuId}`);
    return res.data;
  },

  create: async (data) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description || '');
    formData.append('price', data.price || 0);
    formData.append('available', data.available ? '1' : '0');
    if (data.image) formData.append('image', data.image);
    const res = await api.post('/accompaniments', formData);
    return res.data;
  },

  update: async (id, data) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description || '');
    formData.append('price', data.price || 0);
    formData.append('available', data.available ? '1' : '0');
    if (data.image) formData.append('image', data.image);
    const res = await api.put(`/accompaniments/${id}`, formData);
    return res.data;
  },

  remove: async (id) => {
    const res = await api.delete(`/accompaniments/${id}`);
    return res.data;
  },

  setMenuAccompaniments: async (menuId, accompaniment_ids) => {
    const res = await api.put(`/accompaniments/menu/${menuId}/accompaniments`, { accompaniment_ids });
    return res.data;
  },
};
