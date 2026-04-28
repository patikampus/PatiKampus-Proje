import { SensorVeri, MamaKabi } from '../models/index.js';
import { Op, fn, col } from 'sequelize';
import anomaliService from './anomaliService.js';

const toNumber = (v) => (v === null || v === undefined ? null : parseFloat(v));

class SensorVeriService {
  // Tüm sensör verilerini getir
  async getAll(options = {}) {
    const { page = 1, limit = 20, mamaKabiId, startDate, endDate } = options;
    const offset = (page - 1) * limit;

    const where = {};

    if (mamaKabiId) {
      where.MamaKabiId = mamaKabiId;
    }

    if (startDate && endDate) {
      where.OlcumZamani = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    const { count, rows } = await SensorVeri.findAndCountAll({
      where,
      include: [{ model: MamaKabi, as: 'mamaKabi' }],
      limit,
      offset,
      order: [['OlcumZamani', 'DESC']]
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

  // ID'ye göre sensör verisi getir
  async getById(sensorId) {
    return await SensorVeri.findByPk(sensorId, {
      include: [{ model: MamaKabi, as: 'mamaKabi' }]
    });
  }

  // Yeni sensör verisi oluştur (IoT cihazından gelen veri)
  async create(sensorData) {
    const { MamaKabiId } = sensorData;

    // Mama kabı var mı kontrol et
    const mamaKabi = await MamaKabi.findByPk(MamaKabiId);
    if (!mamaKabi) {
      throw new Error('Mama kabı bulunamadı');
    }

    // Son veriyi al ve anomali kontrolü yap
    const lastData = await this.getLatestByMamaKabiId(MamaKabiId);

    const newSensorVeri = await SensorVeri.create({
      MamaKabiId,
      OlcumZamani: sensorData.OlcumZamani,
      IcHazneAgirlik: sensorData.IcHazneAgirlik ?? sensorData['İçHazneAgirlik'],
      DisHazneAgirlik: sensorData.DisHazneAgirlik ?? sensorData['DışHazneAgirlik'],
      Yukseklik: sensorData.Yukseklik,
      SonMamaEklemeZamani: sensorData.SonMamaEklemeZamani,
      KapAktifMi: mamaKabi.AktifMi
    });

    // Anomali kontrolü
    if (lastData) {
      await this.checkAndCreateAnomaly(lastData, newSensorVeri);
    }

    return newSensorVeri;
  }

  // Anomali kontrolü
  async checkAndCreateAnomaly(lastData, newData) {
    const lastIc = toNumber(lastData.IcHazneAgirlik);
    const newIc = toNumber(newData.IcHazneAgirlik);
    const lastYuk = toNumber(lastData.Yukseklik);
    const newYuk = toNumber(newData.Yukseklik);

    const agirlikFark = lastIc != null && newIc != null ? Math.abs(lastIc - newIc) : 0;
    const yukseklikFark = lastYuk != null && newYuk != null ? Math.abs(lastYuk - newYuk) : 0;

    // Ani değişim varsa anomali oluştur (örn: %50'den fazla değişim)
    const anomaliOlustu =
      (lastIc != null && lastIc > 0 && agirlikFark > lastIc * 0.5) ||
      (lastYuk != null && lastYuk > 0 && yukseklikFark > lastYuk * 0.5);

    if (anomaliOlustu) {
      await anomaliService.create({
        MamaKabiId: newData.MamaKabiId,
        SensorId: newData.SensorId,
        Agirlik: newData.IcHazneAgirlik,
        Yukseklik: newData.Yukseklik
      });
    }
  }

  // Mama kabının son sensör verisini getir
  async getLatestByMamaKabiId(mamaKabiId) {
    return await SensorVeri.findOne({
      where: { MamaKabiId: mamaKabiId },
      order: [['OlcumZamani', 'DESC']]
    });
  }

  // Mama kabına göre sensör verilerini getir
  async getByMamaKabiId(mamaKabiId, limit = 100) {
    return await SensorVeri.findAll({
      where: { MamaKabiId: mamaKabiId },
      order: [['OlcumZamani', 'DESC']],
      limit
    });
  }

  // Tarih aralığına göre sensör verilerini getir
  async getByDateRange(mamaKabiId, startDate, endDate) {
    return await SensorVeri.findAll({
      where: {
        MamaKabiId: mamaKabiId,
        OlcumZamani: {
          [Op.between]: [new Date(startDate), new Date(endDate)]
        }
      },
      order: [['OlcumZamani', 'ASC']]
    });
  }

  // İstatistikler
  async getStatistics(mamaKabiId, days = 7) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const data = await SensorVeri.findAll({
      where: {
        MamaKabiId: mamaKabiId,
        OlcumZamani: {
          [Op.gte]: startDate
        }
      },
      attributes: [
        [fn('AVG', col('İçHazneAgirlik')), 'avgIcHazneAgirlik'],
        [fn('MIN', col('İçHazneAgirlik')), 'minIcHazneAgirlik'],
        [fn('MAX', col('İçHazneAgirlik')), 'maxIcHazneAgirlik'],
        [fn('AVG', col('DışHazneAgirlik')), 'avgDisHazneAgirlik'],
        [fn('MIN', col('DışHazneAgirlik')), 'minDisHazneAgirlik'],
        [fn('MAX', col('DışHazneAgirlik')), 'maxDisHazneAgirlik'],
        [fn('AVG', col('Yukseklik')), 'avgYukseklik'],
        [fn('COUNT', col('SensorId')), 'olcumSayisi']
      ]
    });

    return data[0];
  }
}

export default new SensorVeriService();
