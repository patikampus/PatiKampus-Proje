import api from './index';

// Tüm kullanıcıları getir (admin)
export const getAllUsers = async (params = {}) => {
  const res = await api.get('/kullanicilar', { params });
  return res.data;
};

// Kullanıcı arama (admin)
export const searchUsers = async (q) => {
  const res = await api.get('/kullanicilar/ara', { params: { q } });
  return res.data;
};

// Kullanıcı oluştur (admin)
export const createUser = async (data) => {
  const res = await api.post('/kullanicilar', data);
  return res.data;
};

// Kullanıcı güncelle (admin)
export const updateUser = async (id, data) => {
  const res = await api.put(`/kullanicilar/${id}`, data);
  return res.data;
};

// Kullanıcı sil (admin)
export const deleteUser = async (id) => {
  const res = await api.delete(`/kullanicilar/${id}`);
  return res.data;
};
