import { Rol } from '../models/index.js';
import { Op } from 'sequelize';

class RolService {
  // Tüm rolleri getir
  async getAll() {
    return await Rol.findAll({
      order: [['MinSkor', 'ASC']]
    });
  }

  // ID'ye göre rol getir
  async getById(rolId) {
    return await Rol.findByPk(rolId);
  }

  // Rol adına göre getir
  async getByName(rolAdi) {
    return await Rol.findOne({ where: { RolAdi: rolAdi } });
  }

  // Yeni rol oluştur
  async create(rolData) {
    return await Rol.create(rolData);
  }

  // Rol güncelle
  async update(rolId, rolData) {
    const rol = await Rol.findByPk(rolId);
    if (!rol) return null;
    
    return await rol.update(rolData);
  }

  // Rol sil
  async delete(rolId) {
    const rol = await Rol.findByPk(rolId);
    if (!rol) return false;
    
    await rol.destroy();
    return true;
  }

  // Skora göre rol bul
  async getRolBySkor(skor) {
    return await Rol.findOne({
      where: {
        MinSkor: { [Op.lte]: skor },
        MaxSkor: { [Op.gte]: skor }
      }
    });
  }
}

export default new RolService();
