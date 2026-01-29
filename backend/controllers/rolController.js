import rolService from '../services/rolService.js';

class RolController {
  // GET /api/roller
  async getAll(req, res, next) {
    try {
      const roller = await rolService.getAll();
      res.json({
        success: true,
        data: roller
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/roller/:id
  async getById(req, res, next) {
    try {
      const rol = await rolService.getById(req.params.id);
      if (!rol) {
        return res.status(404).json({
          success: false,
          message: 'Rol bulunamadı'
        });
      }
      res.json({
        success: true,
        data: rol
      });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/roller
  async create(req, res, next) {
    try {
      const rol = await rolService.create(req.body);
      res.status(201).json({
        success: true,
        message: 'Rol başarıyla oluşturuldu',
        data: rol
      });
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/roller/:id
  async update(req, res, next) {
    try {
      const rol = await rolService.update(req.params.id, req.body);
      if (!rol) {
        return res.status(404).json({
          success: false,
          message: 'Rol bulunamadı'
        });
      }
      res.json({
        success: true,
        message: 'Rol başarıyla güncellendi',
        data: rol
      });
    } catch (error) {
      next(error);
    }
  }

  // DELETE /api/roller/:id
  async delete(req, res, next) {
    try {
      const deleted = await rolService.delete(req.params.id);
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Rol bulunamadı'
        });
      }
      res.json({
        success: true,
        message: 'Rol başarıyla silindi'
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new RolController();
