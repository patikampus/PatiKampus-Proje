import api from './index';

export const login = async (Email, Sifre) => {
  const response = await api.post('/auth/giris', { Email, Sifre });
  return response.data;
};

export const register = async ({ AdSoyad, Email, Sifre }) => {
  const response = await api.post('/auth/kayit', { AdSoyad, Email, Sifre });
  return response.data;
};

export const logout = async (refreshToken) => {
  const response = await api.post('/auth/cikis', { refreshToken });
  return response.data;
};

export const getMe = async () => {
  const response = await api.get('/auth/ben');
  return response.data;
};

export const refreshAccessToken = async (refreshToken) => {
  const response = await api.post(
    '/auth/token-yenile',
    {},
    { headers: { Authorization: `Bearer ${refreshToken}` } }
  );
  return response.data;
};

export const requestPasswordReset = async (Email) => {
  const response = await api.post('/auth/sifre-sifirlama-talebi', { Email });
  return response.data;
};

export const resetPassword = async (Token, YeniSifre) => {
  const response = await api.post('/auth/sifre-sifirlama', { Token, YeniSifre });
  return response.data;
};

export const validateToken = async () => {
  const response = await api.post('/auth/token-dogrula');
  return response.data;
};

export const getLoginHistory = async (limit = 10) => {
  const response = await api.get('/auth/giris-gecmisi', { params: { limit } });
  return response.data;
};
