import { MamaKabi, SensorVeri, QRKod, Anomali } from '../models/index.js';
import { Op } from 'sequelize';

class MamaKabiService {
  // Tüm mama kaplarını getir
  async getAll(options = {}) {
    const { page = 1, limit = 20, aktif } = options;
    const offset = (page - 1) * limit;
    
    const where = {};
    if (aktif !== undefined) {
      where.AktifMi = aktif;
    }

    const { count, rows } = await MamaKabi.findAndCountAll({
      where,
      include: [
        { model: QRKod, as: 'qrKod' }
      ],
      limit,
      offset,
      order: [['OlusturmaTarihi', 'DESC']]
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

  // ID'ye göre mama kabı getir
  async getById(mamaKabiId) {
    return await MamaKabi.findByPk(mamaKabiId, {
      include: [
        { model: QRKod, as: 'qrKod' },
        { 
          model: SensorVeri, 
          as: 'sensorVerileri',
          limit: 1,
          order: [['OlcumZamani', 'DESC']]
        }
      ]
    });
  }

  // Detaylı bilgi ile mama kabı getir
  async getByIdWithDetails(mamaKabiId) {
    const mamaKabi = await MamaKabi.findByPk(mamaKabiId, {
      include: [
        { model: QRKod, as: 'qrKod' },
        { 
          model: SensorVeri, 
          as: 'sensorVerileri',
          limit: 10,
          order: [['OlcumZamani', 'DESC']]
        },
        {
          model: Anomali,
          as: 'anomaliler',
          limit: 5,
          order: [['AnomaliZamani', 'DESC']]
        }
      ]
    });

    return mamaKabi;
  }

  // Yeni mama kabı oluştur
  async create(mamaKabiData) {
    const mamaKabi = await MamaKabi.create(mamaKabiData);
    
    // Otomatik QR kodu oluştur
    await QRKod.create({
      MamaKabiId: mamaKabi.MamaKabiId
    });

    return this.getById(mamaKabi.MamaKabiId);
  }

  // Mama kabı güncelle
  async update(mamaKabiId, mamaKabiData) {
    const mamaKabi = await MamaKabi.findByPk(mamaKabiId);
    if (!mamaKabi) return null;

    await mamaKabi.update(mamaKabiData);
    return this.getById(mamaKabiId);
  }

  // Mama kabı sil
  async delete(mamaKabiId) {
    const mamaKabi = await MamaKabi.findByPk(mamaKabiId);
    if (!mamaKabi) return false;
    
    await mamaKabi.destroy();
    return true;
  }

  // Mama kabını aktif/pasif yap
  async toggleAktif(mamaKabiId, aktif) {
    const mamaKabi = await MamaKabi.findByPk(mamaKabiId);
    if (!mamaKabi) return null;

    const updateData = {
      AktifMi: aktif ? 1 : 0
    };
    
    if (aktif) {
      updateData.AktifEdilmeZamani = new Date();
    }

    await mamaKabi.update(updateData);
    return this.getById(mamaKabiId);
  }

  // Son sensör verisi ile mama kaplarını getir
  async getAllWithLatestSensorData() {
    const mamaKaplari = await MamaKabi.findAll({
      where: { AktifMi: 1 },
      include: [{
        model: SensorVeri,
        as: 'sensorVerileri',
        limit: 1,
        order: [['OlcumZamani', 'DESC']]
      }],
      order: [['KapAdi', 'ASC']]
    });

    return mamaKaplari;
  }

  // Konuma göre mama kaplarını ara
  async searchByLocation(konum) {
    return await MamaKabi.findAll({
      where: {
        [Op.or]: [
          { Konum: { [Op.like]: `%${konum}%` } },
          { KonumAciklama: { [Op.like]: `%${konum}%` } }
        ]
      },
      include: [{ model: QRKod, as: 'qrKod' }]
    });
  }

  // Düşük mama seviyeli kapları getir
  async getLowFoodContainers(threshold = 20) {
    const mamaKaplari = await MamaKabi.findAll({
      where: { AktifMi: 1 },
      include: [{
        model: SensorVeri,
        as: 'sensorVerileri',
        limit: 1,
        order: [['OlcumZamani', 'DESC']],
        where: {
          Agirlik: { [Op.lt]: threshold }
        }
      }]
    });

    return mamaKaplari.filter(mk => mk.sensorVerileri.length > 0);
  }
}

export default new MamaKabiService();
