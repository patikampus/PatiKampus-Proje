import api from './index';

export const login = async (Email, Sifre) => {
  const response = await api.post('/auth/giris', { Email, Sifre });
  return response.data;
};

export const logout = async (refreshToken) => {
  const response = await api.post('/auth/cikis', { refreshToken });
  return response.data;
};
