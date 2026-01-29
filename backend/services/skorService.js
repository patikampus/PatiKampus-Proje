import { KullaniciSkor, Kullanici, Rol } from '../models/index.js';
import { Op, Sequelize } from 'sequelize';
import rolService from './rolService.js';

class SkorService {
  // Tüm skorları getir (liderlik tablosu)
  async getAll(options = {}) {
    const { page = 1, limit = 20 } = options;
    const offset = (page - 1) * limit;

    const { count, rows } = await KullaniciSkor.findAndCountAll({
      include: [{
        model: Kullanici,
        as: 'kullanici',
        attributes: { exclude: ['SifreHash'] },
        include: [{ model: Rol, as: 'rol' }]
      }],
      limit,
      offset,
      order: [['Skor', 'DESC']]
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

  // Kullanıcı ID'sine göre skor getir
  async getByKullaniciId(kullaniciId) {
    return await KullaniciSkor.findByPk(kullaniciId, {
      include: [{
        model: Kullanici,
        as: 'kullanici',
        attributes: { exclude: ['SifreHash'] },
        include: [{ model: Rol, as: 'rol' }]
      }]
    });
  }

  // Skor oluştur (yeni kullanıcı için)
  async create(kullaniciId) {
    const existing = await KullaniciSkor.findByPk(kullaniciId);
    if (existing) {
      throw new Error('Bu kullanıcı için skor kaydı zaten mevcut');
    }

    return await KullaniciSkor.create({ KullaniciId: kullaniciId });
  }

  // Skor güncelle
  async updateSkor(kullaniciId, eklenenMiktar) {
    let skor = await KullaniciSkor.findByPk(kullaniciId);
    
    if (!skor) {
      skor = await KullaniciSkor.create({ KullaniciId: kullaniciId });
    }

    const miktar = parseFloat(eklenenMiktar) || 0;
    
    // Skor hesaplama: Her kg için 10 puan
    const kazanilanPuan = Math.floor(miktar * 10);

    await skor.update({
      ToplamEklemeSayisi: skor.ToplamEklemeSayisi + 1,
      ToplamMama: parseFloat(skor.ToplamMama) + miktar,
      Skor: skor.Skor + kazanilanPuan,
      SonGuncelleme: new Date()
    });

    // Rol güncelleme kontrolü
    await this.updateUserRole(kullaniciId, skor.Skor + kazanilanPuan);

    return this.getByKullaniciId(kullaniciId);
  }

  // Kullanıcı rolünü skora göre güncelle
  async updateUserRole(kullaniciId, skor) {
    const uygunRol = await rolService.getRolBySkor(skor);
    
    if (uygunRol) {
      await Kullanici.update(
        { RolId: uygunRol.RolId },
        { where: { KullaniciId: kullaniciId } }
      );
    }
  }

  // Kullanıcının sıralamasını getir
  async getRank(kullaniciId) {
    const userSkor = await KullaniciSkor.findByPk(kullaniciId);
    if (!userSkor) return null;

    const rank = await KullaniciSkor.count({
      where: {
        Skor: { [Op.gt]: userSkor.Skor }
      }
    });

    return {
      kullaniciId,
      skor: userSkor.Skor,
      siralama: rank + 1
    };
  }

  // Liderlik tablosu (Top N)
  async getLeaderboard(limit = 10) {
    return await KullaniciSkor.findAll({
      include: [{
        model: Kullanici,
        as: 'kullanici',
        attributes: ['KullaniciId', 'AdSoyad', 'Email'],
        include: [{ model: Rol, as: 'rol' }]
      }],
      order: [['Skor', 'DESC']],
      limit
    });
  }

  // İstatistikler
  async getStatistics() {
    const stats = await KullaniciSkor.findAll({
      attributes: [
        [Sequelize.fn('SUM', Sequelize.col('ToplamMama')), 'toplamMama'],
        [Sequelize.fn('SUM', Sequelize.col('ToplamEklemeSayisi')), 'toplamEkleme'],
        [Sequelize.fn('AVG', Sequelize.col('Skor')), 'ortalamaSkor'],
        [Sequelize.fn('MAX', Sequelize.col('Skor')), 'enYuksekSkor']
      ]
    });

    const aktifKullanici = await KullaniciSkor.count({
      where: { ToplamEklemeSayisi: { [Op.gt]: 0 } }
    });

    return {
      ...stats[0].dataValues,
      aktifKullaniciSayisi: aktifKullanici
    };
  }
}

export default new SkorService();
