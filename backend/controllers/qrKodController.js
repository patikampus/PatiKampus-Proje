import qrKodService from '../services/qrKodService.js';

class QRKodController {
  // GET /api/qr-kodlari
  async getAll(req, res, next) {
    try {
      const qrKodlari = await qrKodService.getAll();
      res.json({
        success: true,
        data: qrKodlari
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/qr-kodlari/:id
  async getById(req, res, next) {
    try {
      const qrKod = await qrKodService.getById(req.params.id);
      if (!qrKod) {
        return res.status(404).json({
          success: false,
          message: 'QR kodu bulunamadı'
        });
      }
      res.json({
        success: true,
        data: qrKod
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/qr-kodlari/mama-kabi/:mamaKabiId
  async getByMamaKabiId(req, res, next) {
    try {
      const qrKod = await qrKodService.getByMamaKabiId(req.params.mamaKabiId);
      if (!qrKod) {
        return res.status(404).json({
          success: false,
          message: 'QR kodu bulunamadı'
        });
      }
      res.json({
        success: true,
        data: qrKod
      });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/qr-kodlari
  async create(req, res, next) {
    try {
      const { MamaKabiId } = req.body;
      const qrKod = await qrKodService.create(MamaKabiId);
      res.status(201).json({
        success: true,
        message: 'QR kodu başarıyla oluşturuldu',
        data: qrKod
      });
    } catch (error) {
      next(error);
    }
  }

  // DELETE /api/qr-kodlari/:id
  async delete(req, res, next) {
    try {
      const deleted = await qrKodService.delete(req.params.id);
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'QR kodu bulunamadı'
        });
      }
      res.json({
        success: true,
        message: 'QR kodu başarıyla silindi'
      });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/qr-kodlari/:id/giris
  async login(req, res, next) {
    try {
      const qrKod = await qrKodService.login(req.params.id, req.user.KullaniciId);
      res.json({
        success: true,
        message: 'QR kod ile giriş başarılı',
        data: qrKod
      });
    } catch (error) {
      next(error);
    }
  }

  // PATCH /api/qr-kodlari/:id/aktif
  async toggleAktif(req, res, next) {
    try {
      const { aktif } = req.body;
      const qrKod = await qrKodService.toggleAktif(req.params.id, aktif);
      if (!qrKod) {
        return res.status(404).json({
          success: false,
          message: 'QR kodu bulunamadı'
        });
      }
      res.json({
        success: true,
        message: `QR kodu ${aktif ? 'aktif' : 'pasif'} edildi`,
        data: qrKod
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new QRKodController();
