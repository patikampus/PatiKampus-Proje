import api from './index';

// Tüm rolleri getir
export const getAllRoles = async () => {
  const res = await api.get('/roller');
  return res.data;
};
