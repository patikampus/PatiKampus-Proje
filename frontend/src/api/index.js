import axios from 'axios';

const api = axios.create({
  baseURL: 'http://tro1iulrl6eia9kbnn48rij9.76.13.128.133.sslip.io/api', // SSL için https kullanıldı
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
