import aktivasyonService from '../services/aktivasyonService.js';

class AktivasyonController {
  // GET /api/aktivasyonlar
  async getAll(req, res, next) {
    try {
      const { page, limit, mamaKabiId, kullaniciId, startDate, endDate } = req.query;
      const result = await aktivasyonService.getAll({
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 20,
        mamaKabiId: mamaKabiId ? parseInt(mamaKabiId) : undefined,
        kullaniciId: kullaniciId ? parseInt(kullaniciId) : undefined,
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

  // GET /api/aktivasyonlar/:id
  async getById(req, res, next) {
    try {
      const aktivasyon = await aktivasyonService.getById(req.params.id);
      if (!aktivasyon) {
        return res.status(404).json({
          success: false,
          message: 'Aktivasyon bulunamadı'
        });
      }
      res.json({
        success: true,
        data: aktivasyon
      });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/aktivasyonlar
  async create(req, res, next) {
    try {
      const { MamaKabiId } = req.body;
      const aktivasyon = await aktivasyonService.create({
        MamaKabiId,
        KullaniciId: req.user?.KullaniciId || null
      });
      res.status(201).json({
        success: true,
        message: 'Aktivasyon kaydedildi',
        data: aktivasyon
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/aktivasyonlar/mama-kabi/:mamaKabiId
  async getByMamaKabiId(req, res, next) {
    try {
      const { limit } = req.query;
      const aktivasyonlar = await aktivasyonService.getByMamaKabiId(
        req.params.mamaKabiId,
        parseInt(limit) || 20
      );
      res.json({
        success: true,
        data: aktivasyonlar
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/aktivasyonlar/kullanici/:kullaniciId
  async getByKullaniciId(req, res, next) {
    try {
      const { limit } = req.query;
      const aktivasyonlar = await aktivasyonService.getByKullaniciId(
        req.params.kullaniciId,
        parseInt(limit) || 20
      );
      res.json({
        success: true,
        data: aktivasyonlar
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/aktivasyonlar/son
  async getRecent(req, res, next) {
    try {
      const { limit } = req.query;
      const aktivasyonlar = await aktivasyonService.getRecent(parseInt(limit) || 10);
      res.json({
        success: true,
        data: aktivasyonlar
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AktivasyonController();
