import { Anomali, MamaKabi, SensorVeri } from '../models/index.js';
import { Op, fn, col, literal } from 'sequelize';

class AnomaliService {
  // Tüm anomalileri getir
  async getAll(options = {}) {
    const { page = 1, limit = 20, mamaKabiId, startDate, endDate } = options;
    const offset = (page - 1) * limit;
    
    const where = {};
    
    if (mamaKabiId) {
      where.MamaKabiId = mamaKabiId;
    }
    
    if (startDate && endDate) {
      where.AnomaliZamani = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    const { count, rows } = await Anomali.findAndCountAll({
      where,
      include: [
        { model: MamaKabi, as: 'mamaKabi' },
        { model: SensorVeri, as: 'sensorVeri' }
      ],
      limit,
      offset,
      order: [['AnomaliZamani', 'DESC']]
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

  // ID'ye göre anomali getir
  async getById(anomaliId) {
    return await Anomali.findByPk(anomaliId, {
      include: [
        { model: MamaKabi, as: 'mamaKabi' },
        { model: SensorVeri, as: 'sensorVeri' }
      ]
    });
  }

  // Yeni anomali oluştur
  async create(anomaliData) {
    return await Anomali.create(anomaliData);
  }

  // Anomali sil
  async delete(anomaliId) {
    const anomali = await Anomali.findByPk(anomaliId);
    if (!anomali) return false;
    
    await anomali.destroy();
    return true;
  }

  // Mama kabına göre anomalileri getir
  async getByMamaKabiId(mamaKabiId, limit = 10) {
    return await Anomali.findAll({
      where: { MamaKabiId: mamaKabiId },
      include: [{ model: SensorVeri, as: 'sensorVeri' }],
      order: [['AnomaliZamani', 'DESC']],
      limit
    });
  }

  // Son anomalileri getir
  async getRecent(limit = 10) {
    return await Anomali.findAll({
      include: [
        { model: MamaKabi, as: 'mamaKabi' },
        { model: SensorVeri, as: 'sensorVeri' }
      ],
      order: [['AnomaliZamani', 'DESC']],
      limit
    });
  }

  // Anomali istatistikleri
  async getStatistics(startDate, endDate) {
    const where = {};
    
    if (startDate && endDate) {
      where.AnomaliZamani = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    const total = await Anomali.count({ where });
    
    const byMamaKabi = await Anomali.findAll({
      where,
      attributes: [
        'MamaKabiId',
        [fn('COUNT', col('AnomaliId')), 'anomaliSayisi']
      ],
      include: [{ model: MamaKabi, as: 'mamaKabi', attributes: ['KapAdi'] }],
      group: ['MamaKabiId'],
      order: [[literal('anomaliSayisi'), 'DESC']]
    });

    return {
      total,
      byMamaKabi
    };
  }
}

export default new AnomaliService();
