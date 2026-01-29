import { Admin, Kullanici, Rol } from '../models/index.js';

class AdminService {
  // Tüm adminleri getir
  async getAll() {
    return await Admin.findAll({
      include: [{
        model: Kullanici,
        as: 'kullanici',
        attributes: { exclude: ['SifreHash'] },
        include: [{ model: Rol, as: 'rol' }]
      }],
      order: [['OlusturmaTarihi', 'DESC']]
    });
  }

  // ID'ye göre admin getir
  async getById(adminId) {
    return await Admin.findByPk(adminId, {
      include: [{
        model: Kullanici,
        as: 'kullanici',
        attributes: { exclude: ['SifreHash'] },
        include: [{ model: Rol, as: 'rol' }]
      }]
    });
  }

  // Kullanıcı ID'sine göre admin getir
  async getByKullaniciId(kullaniciId) {
    return await Admin.findOne({
      where: { KullaniciId: kullaniciId },
      include: [{
        model: Kullanici,
        as: 'kullanici',
        attributes: { exclude: ['SifreHash'] }
      }]
    });
  }

  // Yeni admin oluştur
  async create(kullaniciId) {
    // Kullanıcı kontrolü
    const kullanici = await Kullanici.findByPk(kullaniciId);
    if (!kullanici) {
      throw new Error('Kullanıcı bulunamadı');
    }

    // Zaten admin mi kontrol et
    const existingAdmin = await Admin.findOne({ where: { KullaniciId: kullaniciId } });
    if (existingAdmin) {
      throw new Error('Bu kullanıcı zaten admin');
    }

    return await Admin.create({ KullaniciId: kullaniciId });
  }

  // Admin sil (kullanıcıyı silmez, sadece admin yetkisini kaldırır)
  async delete(adminId) {
    const admin = await Admin.findByPk(adminId);
    if (!admin) return false;
    
    await admin.destroy();
    return true;
  }

  // Kullanıcının admin olup olmadığını kontrol et
  async isAdmin(kullaniciId) {
    const admin = await Admin.findOne({ where: { KullaniciId: kullaniciId } });
    return !!admin;
  }
}

export default new AdminService();
