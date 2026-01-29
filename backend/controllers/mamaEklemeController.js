import mamaEklemeService from '../services/mamaEklemeService.js';

class MamaEklemeController {
  // GET /api/mama-eklemeleri
  async getAll(req, res, next) {
    try {
      const { page, limit, mamaKabiId, kullaniciId, startDate, endDate } = req.query;
      const result = await mamaEklemeService.getAll({
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

  // GET /api/mama-eklemeleri/:id
  async getById(req, res, next) {
    try {
      const kayit = await mamaEklemeService.getById(req.params.id);
      if (!kayit) {
        return res.status(404).json({
          success: false,
          message: 'Mama ekleme kaydı bulunamadı'
        });
      }
      res.json({
        success: true,
        data: kayit
      });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/mama-eklemeleri
  async create(req, res, next) {
    try {
      const { MamaKabiId, EklenenMiktarKg } = req.body;
      const kayit = await mamaEklemeService.create({
        MamaKabiId,
        KullaniciId: req.user.KullaniciId,
        EklenenMiktarKg
      });
      res.status(201).json({
        success: true,
        message: 'Mama ekleme kaydedildi',
        data: kayit
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/mama-eklemeleri/kullanici/:kullaniciId
  async getByKullaniciId(req, res, next) {
    try {
      const { limit } = req.query;
      const kayitlar = await mamaEklemeService.getByKullaniciId(
        req.params.kullaniciId,
        parseInt(limit) || 20
      );
      res.json({
        success: true,
        data: kayitlar
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/mama-eklemeleri/benim
  async getMyRecords(req, res, next) {
    try {
      const { limit } = req.query;
      const kayitlar = await mamaEklemeService.getByKullaniciId(
        req.user.KullaniciId,
        parseInt(limit) || 20
      );
      res.json({
        success: true,
        data: kayitlar
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/mama-eklemeleri/mama-kabi/:mamaKabiId
  async getByMamaKabiId(req, res, next) {
    try {
      const { limit } = req.query;
      const kayitlar = await mamaEklemeService.getByMamaKabiId(
        req.params.mamaKabiId,
        parseInt(limit) || 20
      );
      res.json({
        success: true,
        data: kayitlar
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/mama-eklemeleri/istatistik
  async getStatistics(req, res, next) {
    try {
      const { startDate, endDate, mamaKabiId } = req.query;
      const stats = await mamaEklemeService.getStatistics({
        startDate,
        endDate,
        mamaKabiId: mamaKabiId ? parseInt(mamaKabiId) : undefined
      });
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/mama-eklemeleri/gunluk-istatistik
  async getDailyStats(req, res, next) {
    try {
      const { days } = req.query;
      const stats = await mamaEklemeService.getDailyStats(parseInt(days) || 30);
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new MamaEklemeController();
