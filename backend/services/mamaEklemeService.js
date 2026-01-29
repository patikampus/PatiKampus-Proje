import { MamaEklemeKayit, MamaKabi, Kullanici, KullaniciSkor } from '../models/index.js';
import { Op, Sequelize } from 'sequelize';
import skorService from './skorService.js';

class MamaEklemeService {
  // Tüm mama ekleme kayıtlarını getir
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
      where.EklemeZamani = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    const { count, rows } = await MamaEklemeKayit.findAndCountAll({
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
      order: [['EklemeZamani', 'DESC']]
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

  // ID'ye göre mama ekleme kaydı getir
  async getById(kayitId) {
    return await MamaEklemeKayit.findByPk(kayitId, {
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

  // Yeni mama ekleme kaydı oluştur
  async create(eklemeData) {
    const { MamaKabiId, KullaniciId, EklenenMiktarKg } = eklemeData;

    // Mama kabı kontrolü
    const mamaKabi = await MamaKabi.findByPk(MamaKabiId);
    if (!mamaKabi) {
      throw new Error('Mama kabı bulunamadı');
    }

    // Kullanıcı kontrolü
    const kullanici = await Kullanici.findByPk(KullaniciId);
    if (!kullanici) {
      throw new Error('Kullanıcı bulunamadı');
    }

    // Mama ekleme kaydı oluştur
    const kayit = await MamaEklemeKayit.create(eklemeData);

    // Kullanıcı skorunu güncelle
    await skorService.updateSkor(KullaniciId, EklenenMiktarKg);

    return this.getById(kayit.KayitId);
  }

  // Kullanıcının mama eklemelerini getir
  async getByKullaniciId(kullaniciId, limit = 20) {
    return await MamaEklemeKayit.findAll({
      where: { KullaniciId: kullaniciId },
      include: [{ model: MamaKabi, as: 'mamaKabi' }],
      order: [['EklemeZamani', 'DESC']],
      limit
    });
  }

  // Mama kabına yapılan eklemeleri getir
  async getByMamaKabiId(mamaKabiId, limit = 20) {
    return await MamaEklemeKayit.findAll({
      where: { MamaKabiId: mamaKabiId },
      include: [{ 
        model: Kullanici, 
        as: 'kullanici',
        attributes: { exclude: ['SifreHash'] }
      }],
      order: [['EklemeZamani', 'DESC']],
      limit
    });
  }

  // İstatistikler
  async getStatistics(options = {}) {
    const { startDate, endDate, mamaKabiId } = options;
    
    const where = {};
    
    if (mamaKabiId) {
      where.MamaKabiId = mamaKabiId;
    }
    
    if (startDate && endDate) {
      where.EklemeZamani = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    const stats = await MamaEklemeKayit.findAll({
      where,
      attributes: [
        [Sequelize.fn('COUNT', Sequelize.col('KayitId')), 'toplamEkleme'],
        [Sequelize.fn('SUM', Sequelize.col('EklenenMiktarKg')), 'toplamMama'],
        [Sequelize.fn('AVG', Sequelize.col('EklenenMiktarKg')), 'ortalamaEkleme']
      ]
    });

    const topContributors = await MamaEklemeKayit.findAll({
      where,
      attributes: [
        'KullaniciId',
        [Sequelize.fn('SUM', Sequelize.col('EklenenMiktarKg')), 'toplamEklenen'],
        [Sequelize.fn('COUNT', Sequelize.col('KayitId')), 'eklemeSayisi']
      ],
      include: [{
        model: Kullanici,
        as: 'kullanici',
        attributes: ['AdSoyad']
      }],
      group: ['KullaniciId'],
      order: [[Sequelize.literal('toplamEklenen'), 'DESC']],
      limit: 10
    });

    return {
      summary: stats[0],
      topContributors
    };
  }

  // Günlük ekleme istatistikleri
  async getDailyStats(days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return await MamaEklemeKayit.findAll({
      where: {
        EklemeZamani: { [Op.gte]: startDate }
      },
      attributes: [
        [Sequelize.fn('DATE', Sequelize.col('EklemeZamani')), 'tarih'],
        [Sequelize.fn('COUNT', Sequelize.col('KayitId')), 'eklemeSayisi'],
        [Sequelize.fn('SUM', Sequelize.col('EklenenMiktarKg')), 'toplamMama']
      ],
      group: [Sequelize.fn('DATE', Sequelize.col('EklemeZamani'))],
      order: [[Sequelize.fn('DATE', Sequelize.col('EklemeZamani')), 'ASC']]
    });
  }
}

export default new MamaEklemeService();
