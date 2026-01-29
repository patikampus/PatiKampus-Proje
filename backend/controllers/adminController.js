import adminService from '../services/adminService.js';

class AdminController {
  // GET /api/adminler
  async getAll(req, res, next) {
    try {
      const adminler = await adminService.getAll();
      res.json({
        success: true,
        data: adminler
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/adminler/:id
  async getById(req, res, next) {
    try {
      const admin = await adminService.getById(req.params.id);
      if (!admin) {
        return res.status(404).json({
          success: false,
          message: 'Admin bulunamadı'
        });
      }
      res.json({
        success: true,
        data: admin
      });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/adminler
  async create(req, res, next) {
    try {
      const { KullaniciId } = req.body;
      const admin = await adminService.create(KullaniciId);
      res.status(201).json({
        success: true,
        message: 'Admin başarıyla oluşturuldu',
        data: admin
      });
    } catch (error) {
      next(error);
    }
  }

  // DELETE /api/adminler/:id
  async delete(req, res, next) {
    try {
      const deleted = await adminService.delete(req.params.id);
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Admin bulunamadı'
        });
      }
      res.json({
        success: true,
        message: 'Admin yetkisi başarıyla kaldırıldı'
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AdminController();
