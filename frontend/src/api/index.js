import axios from 'axios';

const api = axios.create({
  baseURL: 'http://tro1iulrl6eia9kbnn48rij9.76.13.128.133.sslip.io/api', // SSL için https kullanıldı
  withCredentials: true,
});

export default api;
