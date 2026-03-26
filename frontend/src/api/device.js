import api from './index';

// Tüm mama kaplarını getir
export const getMamaKaplari = async () => {
  const res = await api.get('/mama-kaplari');
  return res.data;
};

// Belirli mama kabının en son sensör verisi
export const getSonSensorVerisi = async (mamaKabiId) => {
  const res = await api.get(`/sensor-verileri/mama-kabi/${mamaKabiId}/son`);
  return res.data;
};

// Belirli mama kabının tüm sensör verileri (log akışı için)
export const getSensorVerileri = async (mamaKabiId) => {
  const res = await api.get(`/sensor-verileri/mama-kabi/${mamaKabiId}`);
  return res.data;
};

// Anomali logları (isteğe bağlı)
export const getAnomaliler = async (params = {}) => {
  const res = await api.get('/anomaliler', { params });
  return res.data;
};
