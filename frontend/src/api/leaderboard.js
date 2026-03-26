import api from './index';

// Liderlik tablosu (kullanıcılar)
export const getLeaderboard = async (params = {}) => {
  const res = await api.get('/kullanicilar/liderlik', { params });
  return res.data;
};
