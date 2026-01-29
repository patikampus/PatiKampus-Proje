import mamaKabiService from '../services/mamaKabiService.js';

class MamaKabiController {
  // GET /api/mama-kaplari
  async getAll(req, res, next) {
    try {
      const { page, limit, aktif } = req.query;
      const result = await mamaKabiService.getAll({
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

  // GET /api/mama-kaplari/:id
  async getById(req, res, next) {
    try {
      const mamaKabi = await mamaKabiService.getById(req.params.id);
      if (!mamaKabi) {
        return res.status(404).json({
          success: false,
          message: 'Mama kabı bulunamadı'
        });
      }
      res.json({
        success: true,
        data: mamaKabi
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/mama-kaplari/:id/detay
  async getByIdWithDetails(req, res, next) {
    try {
      const mamaKabi = await mamaKabiService.getByIdWithDetails(req.params.id);
      if (!mamaKabi) {
        return res.status(404).json({
          success: false,
          message: 'Mama kabı bulunamadı'
        });
      }
      res.json({
        success: true,
        data: mamaKabi
      });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/mama-kaplari
  async create(req, res, next) {
    try {
      const mamaKabi = await mamaKabiService.create(req.body);
      res.status(201).json({
        success: true,
        message: 'Mama kabı başarıyla oluşturuldu',
        data: mamaKabi
      });
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/mama-kaplari/:id
  async update(req, res, next) {
    try {
      const mamaKabi = await mamaKabiService.update(req.params.id, req.body);
      if (!mamaKabi) {
        return res.status(404).json({
          success: false,
          message: 'Mama kabı bulunamadı'
        });
      }
      res.json({
        success: true,
        message: 'Mama kabı başarıyla güncellendi',
        data: mamaKabi
      });
    } catch (error) {
      next(error);
    }
  }

  // DELETE /api/mama-kaplari/:id
  async delete(req, res, next) {
    try {
      const deleted = await mamaKabiService.delete(req.params.id);
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Mama kabı bulunamadı'
        });
      }
      res.json({
        success: true,
        message: 'Mama kabı başarıyla silindi'
      });
    } catch (error) {
      next(error);
    }
  }

  // PATCH /api/mama-kaplari/:id/aktif
  async toggleAktif(req, res, next) {
    try {
      const { aktif } = req.body;
      const mamaKabi = await mamaKabiService.toggleAktif(req.params.id, aktif);
      if (!mamaKabi) {
        return res.status(404).json({
          success: false,
          message: 'Mama kabı bulunamadı'
        });
      }
      res.json({
        success: true,
        message: `Mama kabı ${aktif ? 'aktif' : 'pasif'} edildi`,
        data: mamaKabi
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/mama-kaplari/sensor-durumu
  async getAllWithLatestSensorData(req, res, next) {
    try {
      const mamaKaplari = await mamaKabiService.getAllWithLatestSensorData();
      res.json({
        success: true,
        data: mamaKaplari
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/mama-kaplari/ara
  async searchByLocation(req, res, next) {
    try {
      const { konum } = req.query;
      if (!konum) {
        return res.status(400).json({
          success: false,
          message: 'Konum parametresi gerekli'
        });
      }
      const mamaKaplari = await mamaKabiService.searchByLocation(konum);
      res.json({
        success: true,
        data: mamaKaplari
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/mama-kaplari/dusuk-seviye
  async getLowFoodContainers(req, res, next) {
    try {
      const { threshold } = req.query;
      const mamaKaplari = await mamaKabiService.getLowFoodContainers(
        parseFloat(threshold) || 20
      );
      res.json({
        success: true,
        data: mamaKaplari
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new MamaKabiController();
