import sensorVeriService from '../services/sensorVeriService.js';

class SensorVeriController {
  // GET /api/sensor-verileri
  async getAll(req, res, next) {
    try {
      const { page, limit, mamaKabiId, startDate, endDate } = req.query;
      const result = await sensorVeriService.getAll({
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 20,
        mamaKabiId: mamaKabiId ? parseInt(mamaKabiId) : undefined,
        startDate,
        endDate
      });
      res.json({
        success: true,
        ...result
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/sensor-verileri/:id
  async getById(req, res, next) {
    try {
      const sensorVeri = await sensorVeriService.getById(req.params.id);
      if (!sensorVeri) {
        return res.status(404).json({
          success: false,
          message: 'Sensör verisi bulunamadı'
        });
      }
      res.json({
        success: true,
        data: sensorVeri
      });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/sensor-verileri
  async create(req, res, next) {
    try {
      const sensorVeri = await sensorVeriService.create(req.body);
      res.status(201).json({
        success: true,
        message: 'Sensör verisi kaydedildi',
        data: sensorVeri
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/sensor-verileri/mama-kabi/:mamaKabiId
  async getByMamaKabiId(req, res, next) {
    try {
      const { limit } = req.query;
      const veriler = await sensorVeriService.getByMamaKabiId(
        req.params.mamaKabiId,
        parseInt(limit) || 100
      );
      res.json({
        success: true,
        data: veriler
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/sensor-verileri/mama-kabi/:mamaKabiId/son
  async getLatest(req, res, next) {
    try {
      const veri = await sensorVeriService.getLatestByMamaKabiId(req.params.mamaKabiId);
      if (!veri) {
        return res.status(404).json({
          success: false,
          message: 'Sensör verisi bulunamadı'
        });
      }
      res.json({
        success: true,
        data: veri
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/sensor-verileri/mama-kabi/:mamaKabiId/tarih-araligi
  async getByDateRange(req, res, next) {
    try {
      const { startDate, endDate } = req.query;
      if (!startDate || !endDate) {
        return res.status(400).json({
          success: false,
          message: 'startDate ve endDate parametreleri gerekli'
        });
      }
      const veriler = await sensorVeriService.getByDateRange(
        req.params.mamaKabiId,
        startDate,
        endDate
      );
      res.json({
        success: true,
        data: veriler
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/sensor-verileri/mama-kabi/:mamaKabiId/istatistik
  async getStatistics(req, res, next) {
    try {
      const { days } = req.query;
      const stats = await sensorVeriService.getStatistics(
        req.params.mamaKabiId,
        parseInt(days) || 7
      );
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new SensorVeriController();
