import skorService from '../services/skorService.js';

class SkorController {
  // GET /api/skorlar
  async getAll(req, res, next) {
    try {
      const { page, limit } = req.query;
      const result = await skorService.getAll({
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 20
      });
      res.json({
        success: true,
        ...result
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/skorlar/kullanici/:kullaniciId
  async getByKullaniciId(req, res, next) {
    try {
      const skor = await skorService.getByKullaniciId(req.params.kullaniciId);
      if (!skor) {
        return res.status(404).json({
          success: false,
          message: 'Skor bulunamadı'
        });
      }
      res.json({
        success: true,
        data: skor
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/skorlar/benim
  async getMySkor(req, res, next) {
    try {
      const skor = await skorService.getByKullaniciId(req.user.KullaniciId);
      res.json({
        success: true,
        data: skor
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/skorlar/siralama/:kullaniciId
  async getRank(req, res, next) {
    try {
      const rank = await skorService.getRank(req.params.kullaniciId);
      if (!rank) {
        return res.status(404).json({
          success: false,
          message: 'Kullanıcı skoru bulunamadı'
        });
      }
      res.json({
        success: true,
        data: rank
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/skorlar/benim-siralama
  async getMyRank(req, res, next) {
    try {
      const rank = await skorService.getRank(req.user.KullaniciId);
      res.json({
        success: true,
        data: rank
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/skorlar/liderlik
  async getLeaderboard(req, res, next) {
    try {
      const { limit } = req.query;
      const leaderboard = await skorService.getLeaderboard(parseInt(limit) || 10);
      res.json({
        success: true,
        data: leaderboard
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/skorlar/istatistik
  async getStatistics(req, res, next) {
    try {
      const stats = await skorService.getStatistics();
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new SkorController();
