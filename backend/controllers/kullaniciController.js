import kullaniciService from '../services/kullaniciService.js';

class KullaniciController {
  // GET /api/kullanicilar
  async getAll(req, res, next) {
    try {
      const { page, limit, aktif } = req.query;
      const result = await kullaniciService.getAll({
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 20,
        aktif: aktif !== undefined ? parseInt(aktif) : undefined
      });
      res.json({
        success: true,
        ...result
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/kullanicilar/:id
  async getById(req, res, next) {
    try {
      const kullanici = await kullaniciService.getById(req.params.id);
      if (!kullanici) {
        return res.status(404).json({
          success: false,
          message: 'Kullanıcı bulunamadı'
        });
      }
      res.json({
        success: true,
        data: kullanici
      });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/kullanicilar
  async create(req, res, next) {
    try {
      const kullanici = await kullaniciService.create(req.body);
      res.status(201).json({
        success: true,
        message: 'Kullanıcı başarıyla oluşturuldu',
        data: kullanici
      });
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/kullanicilar/:id
  async update(req, res, next) {
    try {
      const kullanici = await kullaniciService.update(req.params.id, req.body);
      if (!kullanici) {
        return res.status(404).json({
          success: false,
          message: 'Kullanıcı bulunamadı'
        });
      }
      res.json({
        success: true,
        message: 'Kullanıcı başarıyla güncellendi',
        data: kullanici
      });
    } catch (error) {
      next(error);
    }
  }

  // DELETE /api/kullanicilar/:id
  async delete(req, res, next) {
    try {
      const deleted = await kullaniciService.delete(req.params.id);
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Kullanıcı bulunamadı'
        });
      }
      res.json({
        success: true,
        message: 'Kullanıcı başarıyla silindi'
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/kullanicilar/ara
  async search(req, res, next) {
    try {
      const { q } = req.query;
      if (!q) {
        return res.status(400).json({
          success: false,
          message: 'Arama terimi gerekli'
        });
      }
      const kullanicilar = await kullaniciService.search(q);
      res.json({
        success: true,
        data: kullanicilar
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/kullanicilar/liderlik
  async getLeaderboard(req, res, next) {
    try {
      const { limit } = req.query;
      const leaderboard = await kullaniciService.getLeaderboard(parseInt(limit) || 10);
      res.json({
        success: true,
        data: leaderboard
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/kullanicilar/profil
  async getProfile(req, res, next) {
    try {
      const kullanici = await kullaniciService.getById(req.user.KullaniciId);
      res.json({
        success: true,
        data: kullanici
      });
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/kullanicilar/profil
  async updateProfile(req, res, next) {
    try {
      // Sadece belirli alanların güncellenmesine izin ver
      const { AdSoyad, Email, Sifre } = req.body;
      const kullanici = await kullaniciService.update(req.user.KullaniciId, {
        AdSoyad,
        Email,
        Sifre
      });
      res.json({
        success: true,
        message: 'Profil başarıyla güncellendi',
        data: kullanici
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new KullaniciController();
