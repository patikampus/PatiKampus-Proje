import anomaliService from '../services/anomaliService.js';

class AnomaliController {
  // GET /api/anomaliler
  async getAll(req, res, next) {
    try {
      const { page, limit, mamaKabiId, startDate, endDate } = req.query;
      const result = await anomaliService.getAll({
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

  // GET /api/anomaliler/:id
  async getById(req, res, next) {
    try {
      const anomali = await anomaliService.getById(req.params.id);
      if (!anomali) {
        return res.status(404).json({
          success: false,
          message: 'Anomali bulunamadı'
        });
      }
      res.json({
        success: true,
        data: anomali
      });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/anomaliler
  async create(req, res, next) {
    try {
      const anomali = await anomaliService.create(req.body);
      res.status(201).json({
        success: true,
        message: 'Anomali kaydedildi',
        data: anomali
      });
    } catch (error) {
      next(error);
    }
  }

  // DELETE /api/anomaliler/:id
  async delete(req, res, next) {
    try {
      const deleted = await anomaliService.delete(req.params.id);
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Anomali bulunamadı'
        });
      }
      res.json({
        success: true,
        message: 'Anomali silindi'
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/anomaliler/mama-kabi/:mamaKabiId
  async getByMamaKabiId(req, res, next) {
    try {
      const { limit } = req.query;
      const anomaliler = await anomaliService.getByMamaKabiId(
        req.params.mamaKabiId,
        parseInt(limit) || 10
      );
      res.json({
        success: true,
        data: anomaliler
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/anomaliler/son
  async getRecent(req, res, next) {
    try {
      const { limit } = req.query;
      const anomaliler = await anomaliService.getRecent(parseInt(limit) || 10);
      res.json({
        success: true,
        data: anomaliler
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/anomaliler/istatistik
  async getStatistics(req, res, next) {
    try {
      const { startDate, endDate } = req.query;
      const stats = await anomaliService.getStatistics(startDate, endDate);
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AnomaliController();
