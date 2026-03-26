import api from './index';

// Geri bildirimleri getir (örnek: anomali veya feedback tablosu varsa)
export const getFeedbacks = async (params = {}) => {
  const res = await api.get('/anomaliler', { params });
  return res.data;
};
