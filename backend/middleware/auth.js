import jwt from 'jsonwebtoken';
import config from '../config/index.js';
import kullaniciService from '../services/kullaniciService.js';
import adminService from '../services/adminService.js';

// Token blacklist (memory-based, production'da Redis kullanılmalı)
const tokenBlacklist = new Set();

// Token'ı blacklist'e ekle
export const addToBlacklist = (token) => {
  tokenBlacklist.add(token);
  setTimeout(() => {
    tokenBlacklist.delete(token);
  }, 24 * 60 * 60 * 1000);
};

// Token blacklist kontrolü
export const isBlacklisted = (token) => {
  return tokenBlacklist.has(token);
};

// Token'ı header'dan çıkar
export const extractToken = (req) => {
  const authHeader = req.headers.authorization;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }
  
  if (req.cookies && req.cookies.token) {
    return req.cookies.token;
  }
  
  if (req.query && req.query.token) {
    return req.query.token;
  }
  
  return null;
};

// Token doğrulama
export const verifyToken = (token) => {
  return jwt.verify(token, config.jwt.secret);
};

// Access token oluştur
export const generateAccessToken = (kullanici) => {
  return jwt.sign(
    {
      KullaniciId: kullanici.KullaniciId,
      Email: kullanici.Email,
      RolId: kullanici.RolId,
      type: 'access'
    },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn || '1h' }
  );
};

// Refresh token oluştur
export const generateRefreshToken = (kullanici) => {
  return jwt.sign(
    {
      KullaniciId: kullanici.KullaniciId,
      type: 'refresh'
    },
    config.jwt.secret,
    { expiresIn: '7d' }
  );
};

// JWT Token doğrulama middleware
export const auth = async (req, res, next) => {
  try {
    const token = extractToken(req);
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Yetkilendirme başarısız. Token bulunamadı.',
        code: 'TOKEN_NOT_FOUND'
      });
    }

    if (isBlacklisted(token)) {
      return res.status(401).json({
        success: false,
        message: 'Token geçersiz kılınmış',
        code: 'TOKEN_BLACKLISTED'
      });
    }

    const decoded = verifyToken(token);
    
    if (decoded.type === 'refresh') {
      return res.status(401).json({
        success: false,
        message: 'Access token kullanmalısınız',
        code: 'INVALID_TOKEN_TYPE'
      });
    }

    const kullanici = await kullaniciService.getById(decoded.KullaniciId);
    
    if (!kullanici) {
      return res.status(401).json({
        success: false,
        message: 'Kullanıcı bulunamadı',
        code: 'USER_NOT_FOUND'
      });
    }

    if (!kullanici.AktifMi) {
      return res.status(401).json({
        success: false,
        message: 'Hesabınız devre dışı bırakılmış',
        code: 'USER_DISABLED'
      });
    }

    const isAdmin = await adminService.isAdmin(kullanici.KullaniciId);
    
    req.user = {
      KullaniciId: kullanici.KullaniciId,
      Email: kullanici.Email,
      AdSoyad: kullanici.AdSoyad,
      RolId: kullanici.RolId,
      isAdmin
    };
    req.token = token;
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Geçersiz token',
        code: 'INVALID_TOKEN'
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token süresi dolmuş',
        code: 'TOKEN_EXPIRED'
      });
    }
    next(error);
  }
};

// Admin yetkisi kontrolü middleware
export const adminAuth = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Önce giriş yapmalısınız',
        code: 'NOT_AUTHENTICATED'
      });
    }

    if (!req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Bu işlem için admin yetkisi gerekli',
        code: 'ADMIN_REQUIRED'
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};

// Opsiyonel auth
export const optionalAuth = async (req, res, next) => {
  try {
    const token = extractToken(req);
    
    if (!token || isBlacklisted(token)) {
      return next();
    }
    
    try {
      const decoded = verifyToken(token);
      
      if (decoded.type !== 'refresh') {
        const kullanici = await kullaniciService.getById(decoded.KullaniciId);
        
        if (kullanici && kullanici.AktifMi) {
          const isAdmin = await adminService.isAdmin(kullanici.KullaniciId);
          req.user = {
            KullaniciId: kullanici.KullaniciId,
            Email: kullanici.Email,
            AdSoyad: kullanici.AdSoyad,
            RolId: kullanici.RolId,
            isAdmin
          };
          req.token = token;
        }
      }
    } catch (tokenError) {
      // Token geçersiz olsa bile devam et
    }
    
    next();
  } catch (error) {
    next(error);
  }
};

// Refresh token middleware
export const refreshAuth = async (req, res, next) => {
  try {
    const token = extractToken(req);
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token bulunamadı',
        code: 'REFRESH_TOKEN_NOT_FOUND'
      });
    }

    if (isBlacklisted(token)) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token geçersiz kılınmış',
        code: 'REFRESH_TOKEN_BLACKLISTED'
      });
    }

    const decoded = verifyToken(token);
    
    if (decoded.type !== 'refresh') {
      return res.status(401).json({
        success: false,
        message: 'Geçerli bir refresh token kullanmalısınız',
        code: 'INVALID_REFRESH_TOKEN'
      });
    }

    const kullanici = await kullaniciService.getById(decoded.KullaniciId);
    
    if (!kullanici || !kullanici.AktifMi) {
      return res.status(401).json({
        success: false,
        message: 'Kullanıcı bulunamadı veya devre dışı',
        code: 'USER_INVALID'
      });
    }

    req.user = kullanici;
    req.refreshToken = token;
    
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Refresh token süresi dolmuş',
        code: 'REFRESH_TOKEN_EXPIRED'
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Geçersiz refresh token',
      code: 'INVALID_REFRESH_TOKEN'
    });
  }
};

// Rate limiting
const loginAttempts = new Map();

export const checkLoginAttempts = (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;
  const attempts = loginAttempts.get(ip) || { count: 0, lastAttempt: Date.now() };
  
  if (Date.now() - attempts.lastAttempt > 15 * 60 * 1000) {
    attempts.count = 0;
  }
  
  if (attempts.count >= 5) {
    return res.status(429).json({
      success: false,
      message: 'Çok fazla başarısız giriş denemesi. 15 dakika sonra tekrar deneyin.',
      code: 'TOO_MANY_ATTEMPTS'
    });
  }
  
  req.loginAttempts = attempts;
  req.loginAttemptsMap = loginAttempts;
  req.clientIp = ip;
  
  next();
};
