import dotenv from 'dotenv';

dotenv.config();

export default {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  jwt: {
    secret: process.env.JWT_SECRET || 'default_secret_key_change_in_production',
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
  },
  
  cors: {
    origin: function (origin, callback) {
      const allowedOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000';
      // Herhangi bir origin belirtilmemişse (Postman gibi araçlar) veya origin eşleşiyorsa izin ver
      if (!origin || 
          origin === allowedOrigin || 
          origin === allowedOrigin.replace('https://', 'http://') ||
          origin === allowedOrigin.replace('http://', 'https://')) {
        callback(null, origin);
      } else {
        // İzin verilmeyen originler için
        callback(null, origin); // Tümüne izin verelim (Geliştirme aşamasında sorun yaşamamak için)
      }
    },
    credentials: true
  },
  
  pagination: {
    defaultLimit: 20,
    maxLimit: 100
  },

  // Rate limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 dakika
    maxRequests: 100 // 15 dakikada max istek
  }
};
