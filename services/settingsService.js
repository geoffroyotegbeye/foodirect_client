import api from '../lib/api';

export const getSettings = async () => {
  const { data } = await api.get('/settings');
  return data.data;
};

export const updateSettingImage = async (key, file) => {
  const formData = new FormData();
  formData.append('image', file);
  const { data } = await api.patch(`/settings/image/${key}`, formData);
  return data.data;
};
