import { KapiAktivasyonGecmisi, MamaKabi, Kullanici } from '../models/index.js';
import { Op } from 'sequelize';

class AktivasyonService {
  // Tüm aktivasyonları getir
  async getAll(options = {}) {
    const { page = 1, limit = 20, mamaKabiId, kullaniciId, startDate, endDate } = options;
    const offset = (page - 1) * limit;
    
    const where = {};
    
    if (mamaKabiId) {
      where.MamaKabiId = mamaKabiId;
    }
    
    if (kullaniciId) {
      where.KullaniciId = kullaniciId;
    }
    
    if (startDate && endDate) {
      where.AktivasyonZamani = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    const { count, rows } = await KapiAktivasyonGecmisi.findAndCountAll({
      where,
      include: [
        { model: MamaKabi, as: 'mamaKabi' },
        { 
          model: Kullanici, 
          as: 'kullanici',
          attributes: { exclude: ['SifreHash'] }
        }
      ],
      limit,
      offset,
      order: [['AktivasyonZamani', 'DESC']]
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

  // ID'ye göre aktivasyon getir
  async getById(aktivasyonId) {
    return await KapiAktivasyonGecmisi.findByPk(aktivasyonId, {
      include: [
        { model: MamaKabi, as: 'mamaKabi' },
        { 
          model: Kullanici, 
          as: 'kullanici',
          attributes: { exclude: ['SifreHash'] }
        }
      ]
    });
  }

  // Yeni aktivasyon kaydı oluştur
  async create(aktivasyonData) {
    const { MamaKabiId, KullaniciId } = aktivasyonData;

    // Mama kabı kontrolü
    const mamaKabi = await MamaKabi.findByPk(MamaKabiId);
    if (!mamaKabi) {
      throw new Error('Mama kabı bulunamadı');
    }

    return await KapiAktivasyonGecmisi.create(aktivasyonData);
  }

  // Mama kabına göre aktivasyonları getir
  async getByMamaKabiId(mamaKabiId, limit = 20) {
    return await KapiAktivasyonGecmisi.findAll({
      where: { MamaKabiId: mamaKabiId },
      include: [{
        model: Kullanici,
        as: 'kullanici',
        attributes: { exclude: ['SifreHash'] }
      }],
      order: [['AktivasyonZamani', 'DESC']],
      limit
    });
  }

  // Kullanıcının aktivasyonlarını getir
  async getByKullaniciId(kullaniciId, limit = 20) {
    return await KapiAktivasyonGecmisi.findAll({
      where: { KullaniciId: kullaniciId },
      include: [{ model: MamaKabi, as: 'mamaKabi' }],
      order: [['AktivasyonZamani', 'DESC']],
      limit
    });
  }

  // Son aktivasyonları getir
  async getRecent(limit = 10) {
    return await KapiAktivasyonGecmisi.findAll({
      include: [
        { model: MamaKabi, as: 'mamaKabi' },
        { 
          model: Kullanici, 
          as: 'kullanici',
          attributes: { exclude: ['SifreHash'] }
        }
      ],
      order: [['AktivasyonZamani', 'DESC']],
      limit
    });
  }
}

export default new AktivasyonService();
