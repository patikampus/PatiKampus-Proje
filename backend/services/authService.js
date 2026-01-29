import crypto from 'crypto';
import { SifreSifirlama, Kullanici, GirisGecmisi } from '../models/index.js';
import kullaniciService from './kullaniciService.js';
import { 
  generateAccessToken, 
  generateRefreshToken, 
  addToBlacklist,
  verifyToken 
} from '../middleware/auth.js';
import config from '../config/index.js';

class AuthService {
  // Giriş yap
  async login(email, password, cihazBilgisi = null) {
    const kullanici = await kullaniciService.validatePassword(email, password);
    
    if (!kullanici) {
      throw new Error('Geçersiz email veya şifre');
    }

    if (!kullanici.AktifMi) {
      throw new Error('Hesabınız devre dışı bırakılmış');
    }

    // Son giriş zamanını güncelle
    await kullaniciService.updateLastLogin(kullanici.KullaniciId);

    // Giriş geçmişi kaydet
    await GirisGecmisi.create({
      KullaniciId: kullanici.KullaniciId,
      CihazBilgisi: cihazBilgisi
    });

    // Access ve Refresh token oluştur
    const accessToken = generateAccessToken(kullanici);
    const refreshToken = generateRefreshToken(kullanici);

    return {
      accessToken,
      refreshToken,
      expiresIn: config.jwt.expiresIn || '1h',
      kullanici: {
        KullaniciId: kullanici.KullaniciId,
        AdSoyad: kullanici.AdSoyad,
        Email: kullanici.Email,
        RolId: kullanici.RolId,
        rol: kullanici.rol,
        isAdmin: !!kullanici.admin
      }
    };
  }

  // Kayıt ol
  async register(userData) {
    const kullanici = await kullaniciService.create(userData);
    
    // Access ve Refresh token oluştur
    const accessToken = generateAccessToken(kullanici);
    const refreshToken = generateRefreshToken(kullanici);

    return {
      accessToken,
      refreshToken,
      expiresIn: config.jwt.expiresIn || '1h',
      kullanici: {
        KullaniciId: kullanici.KullaniciId,
        AdSoyad: kullanici.AdSoyad,
        Email: kullanici.Email,
        RolId: kullanici.RolId
      }
    };
  }

  // Token yenile
  async refreshTokens(kullanici, oldRefreshToken) {
    // Eski refresh token'ı blacklist'e ekle
    addToBlacklist(oldRefreshToken);
    
    // Yeni tokenlar oluştur
    const accessToken = generateAccessToken(kullanici);
    const refreshToken = generateRefreshToken(kullanici);

    return {
      accessToken,
      refreshToken,
      expiresIn: config.jwt.expiresIn || '1h'
    };
  }

  // Çıkış yap
  async logout(token, refreshToken = null) {
    // Token'ları blacklist'e ekle
    if (token) {
      addToBlacklist(token);
    }
    if (refreshToken) {
      addToBlacklist(refreshToken);
    }
    return true;
  }

  // Token doğrula
  validateToken(token) {
    try {
      return verifyToken(token);
    } catch (error) {
      throw new Error('Geçersiz token');
    }
  }

  // Şifre sıfırlama talebi
  async requestPasswordReset(email) {
    const kullanici = await kullaniciService.getByEmail(email);
    if (!kullanici) {
      // Güvenlik için hata fırlatma, başarılı gibi davran
      return true;
    }

    // Token oluştur
    const token = crypto.randomBytes(32).toString('hex');
    const gecerlilikZamani = new Date();
    gecerlilikZamani.setHours(gecerlilikZamani.getHours() + 1); // 1 saat geçerli

    await SifreSifirlama.create({
      KullaniciId: kullanici.KullaniciId,
      Token: token,
      GecerlilikZamani: gecerlilikZamani
    });

    // Burada email gönderme işlemi yapılabilir
    // await emailService.sendPasswordResetEmail(email, token);

    return { token }; // Development için token'ı döndür
  }

  // Şifre sıfırla
  async resetPassword(token, yeniSifre) {
    const sifreSifirlama = await SifreSifirlama.findOne({
      where: {
        Token: token,
        KullanildiMi: 0
      }
    });

    if (!sifreSifirlama) {
      throw new Error('Geçersiz veya kullanılmış token');
    }

    if (new Date() > sifreSifirlama.GecerlilikZamani) {
      throw new Error('Token süresi dolmuş');
    }

    // Şifreyi güncelle
    await kullaniciService.update(sifreSifirlama.KullaniciId, {
      Sifre: yeniSifre
    });

    // Token'ı kullanıldı olarak işaretle
    await sifreSifirlama.update({ KullanildiMi: 1 });

    return true;
  }

  // Giriş geçmişini getir
  async getLoginHistory(kullaniciId, limit = 10) {
    return await GirisGecmisi.findAll({
      where: { KullaniciId: kullaniciId },
      order: [['GirisZamani', 'DESC']],
      limit
    });
  }
}

export default new AuthService();
