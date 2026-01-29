import bcrypt from 'bcryptjs';
import { Kullanici, Rol, KullaniciSkor, Admin } from '../models/index.js';
import { Op } from 'sequelize';

class KullaniciService {
  // Tüm kullanıcıları getir
  async getAll(options = {}) {
    const { page = 1, limit = 20, aktif } = options;
    const offset = (page - 1) * limit;
    
    const where = {};
    if (aktif !== undefined) {
      where.AktifMi = aktif;
    }

    const { count, rows } = await Kullanici.findAndCountAll({
      where,
      include: [
        { model: Rol, as: 'rol' },
        { model: KullaniciSkor, as: 'skor' }
      ],
      attributes: { exclude: ['SifreHash'] },
      limit,
      offset,
      order: [['KayitTarihi', 'DESC']]
    });

    return {
      data: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit)
      }
    };
  }

  // ID'ye göre kullanıcı getir
  async getById(kullaniciId) {
    return await Kullanici.findByPk(kullaniciId, {
      include: [
        { model: Rol, as: 'rol' },
        { model: KullaniciSkor, as: 'skor' },
        { model: Admin, as: 'admin' }
      ],
      attributes: { exclude: ['SifreHash'] }
    });
  }

  // Email'e göre kullanıcı getir
  async getByEmail(email) {
    return await Kullanici.findOne({
      where: { Email: email },
      include: [
        { model: Rol, as: 'rol' },
        { model: Admin, as: 'admin' }
      ]
    });
  }

  // Yeni kullanıcı oluştur
  async create(userData) {
    const { AdSoyad, Email, Sifre, RolId } = userData;
    
    // Email kontrolü
    const existingUser = await Kullanici.findOne({ where: { Email } });
    if (existingUser) {
      throw new Error('Bu email adresi zaten kullanılıyor');
    }

    // Şifre hash'le
    const salt = await bcrypt.genSalt(10);
    const SifreHash = await bcrypt.hash(Sifre, salt);

    // Kullanıcı oluştur
    const kullanici = await Kullanici.create({
      AdSoyad,
      Email,
      SifreHash,
      RolId
    });

    // Skor kaydı oluştur
    await KullaniciSkor.create({
      KullaniciId: kullanici.KullaniciId
    });

    return this.getById(kullanici.KullaniciId);
  }

  // Kullanıcı güncelle
  async update(kullaniciId, userData) {
    const kullanici = await Kullanici.findByPk(kullaniciId);
    if (!kullanici) return null;

    const updateData = { ...userData };
    
    // Şifre güncellenmek isteniyorsa hash'le
    if (updateData.Sifre) {
      const salt = await bcrypt.genSalt(10);
      updateData.SifreHash = await bcrypt.hash(updateData.Sifre, salt);
      delete updateData.Sifre;
    }

    await kullanici.update(updateData);
    return this.getById(kullaniciId);
  }

  // Kullanıcı sil
  async delete(kullaniciId) {
    const kullanici = await Kullanici.findByPk(kullaniciId);
    if (!kullanici) return false;
    
    await kullanici.destroy();
    return true;
  }

  // Şifre doğrula
  async validatePassword(email, password) {
    const kullanici = await this.getByEmail(email);
    if (!kullanici) return null;
    
    const isMatch = await bcrypt.compare(password, kullanici.SifreHash);
    if (!isMatch) return null;
    
    return kullanici;
  }

  // Son giriş zamanını güncelle
  async updateLastLogin(kullaniciId) {
    await Kullanici.update(
      { SonGirisZamani: new Date() },
      { where: { KullaniciId: kullaniciId } }
    );
  }

  // Kullanıcı ara
  async search(query) {
    return await Kullanici.findAll({
      where: {
        [Op.or]: [
          { AdSoyad: { [Op.like]: `%${query}%` } },
          { Email: { [Op.like]: `%${query}%` } }
        ]
      },
      include: [{ model: Rol, as: 'rol' }],
      attributes: { exclude: ['SifreHash'] },
      limit: 20
    });
  }

  // Liderlik tablosu
  async getLeaderboard(limit = 10) {
    return await Kullanici.findAll({
      include: [{
        model: KullaniciSkor,
        as: 'skor',
        required: true
      }, {
        model: Rol,
        as: 'rol'
      }],
      attributes: { exclude: ['SifreHash'] },
      order: [[{ model: KullaniciSkor, as: 'skor' }, 'Skor', 'DESC']],
      limit
    });
  }
}

export default new KullaniciService();
