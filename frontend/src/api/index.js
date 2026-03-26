import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Gerekirse portu ve adresi değiştirin
  withCredentials: true,
});

export default api;
