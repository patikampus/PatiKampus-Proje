import api from './index';

// Bekleyen fotoğraf onay taleplerini getir
export const getPendingPhotoRequests = async (params = {}) => {
  const res = await api.get('/mama-eklemeleri', { params });
  return res.data;
};

// Fotoğraf onayla
export const approvePhoto = async (fotoId) => {
  const res = await api.put(`/mama-eklemeleri/fotograflar/${fotoId}/onayla`);
  return res.data;
};

// Fotoğrafı reddet
export const rejectPhoto = async (fotoId, reason = '') => {
  const res = await api.put(`/mama-eklemeleri/fotograflar/${fotoId}/red`, { reason });
  return res.data;
};
