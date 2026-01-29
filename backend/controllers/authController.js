import authService from '../services/authService.js';

class AuthController {
  // POST /api/auth/giris
  async login(req, res, next) {
    try {
      const { Email, Sifre } = req.body;
      const cihazBilgisi = req.headers['user-agent'] || null;
      
      const result = await authService.login(Email, Sifre, cihazBilgisi);
      
      // Başarılı giriş - rate limit sıfırla
      if (req.loginAttemptsMap && req.clientIp) {
        req.loginAttemptsMap.delete(req.clientIp);
      }
      
      res.json({
        success: true,
        message: 'Giriş başarılı',
        data: result
      });
    } catch (error) {
      // Başarısız giriş - rate limit artır
      if (req.loginAttemptsMap && req.clientIp) {
        const attempts = req.loginAttempts || { count: 0 };
        req.loginAttemptsMap.set(req.clientIp, {
          count: attempts.count + 1,
          lastAttempt: Date.now()
        });
      }
      next(error);
    }
  }

  // POST /api/auth/kayit
  async register(req, res, next) {
    try {
      const result = await authService.register(req.body);
      
      res.status(201).json({
        success: true,
        message: 'Kayıt başarılı',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/auth/token-yenile
  async refreshToken(req, res, next) {
    try {
      const result = await authService.refreshTokens(req.user, req.refreshToken);
      
      res.json({
        success: true,
        message: 'Token yenilendi',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/auth/cikis
  async logout(req, res, next) {
    try {
      const { refreshToken } = req.body;
      await authService.logout(req.token, refreshToken);
      
      res.json({
        success: true,
        message: 'Çıkış başarılı'
      });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/auth/sifre-sifirlama-talebi
  async requestPasswordReset(req, res, next) {
    try {
      const { Email } = req.body;
      await authService.requestPasswordReset(Email);
      
      res.json({
        success: true,
        message: 'Şifre sıfırlama talimatları email adresinize gönderildi'
      });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/auth/sifre-sifirlama
  async resetPassword(req, res, next) {
    try {
      const { Token, YeniSifre } = req.body;
      await authService.resetPassword(Token, YeniSifre);
      
      res.json({
        success: true,
        message: 'Şifreniz başarıyla güncellendi'
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/auth/giris-gecmisi
  async getLoginHistory(req, res, next) {
    try {
      const { limit } = req.query;
      const history = await authService.getLoginHistory(
        req.user.KullaniciId,
        parseInt(limit) || 10
      );
      
      res.json({
        success: true,
        data: history
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/auth/ben
  async getMe(req, res, next) {
    try {
      res.json({
        success: true,
        data: req.user
      });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/auth/token-dogrula
  async validateToken(req, res, next) {
    try {
      res.json({
        success: true,
        message: 'Token geçerli',
        data: {
          kullanici: req.user
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
