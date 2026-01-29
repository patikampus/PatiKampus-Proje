import { QRKod, MamaKabi, Kullanici } from '../models/index.js';

class QRKodService {
  // Tüm QR kodlarını getir
  async getAll() {
    return await QRKod.findAll({
      include: [
        { model: MamaKabi, as: 'mamaKabi' },
        { 
          model: Kullanici, 
          as: 'girisYapanKullanici',
          attributes: { exclude: ['SifreHash'] }
        }
      ],
      order: [['OlusturmaTarihi', 'DESC']]
    });
  }

  // ID'ye göre QR kodu getir
  async getById(qrId) {
    return await QRKod.findByPk(qrId, {
      include: [
        { model: MamaKabi, as: 'mamaKabi' },
        { 
          model: Kullanici, 
          as: 'girisYapanKullanici',
          attributes: { exclude: ['SifreHash'] }
        }
      ]
    });
  }

  // Mama kabı ID'sine göre QR kodu getir
  async getByMamaKabiId(mamaKabiId) {
    return await QRKod.findOne({
      where: { MamaKabiId: mamaKabiId },
      include: [
        { model: MamaKabi, as: 'mamaKabi' },
        { 
          model: Kullanici, 
          as: 'girisYapanKullanici',
          attributes: { exclude: ['SifreHash'] }
        }
      ]
    });
  }

  // Yeni QR kodu oluştur
  async create(mamaKabiId) {
    // Mama kabı var mı kontrol et
    const mamaKabi = await MamaKabi.findByPk(mamaKabiId);
    if (!mamaKabi) {
      throw new Error('Mama kabı bulunamadı');
    }

    // Zaten QR kodu var mı kontrol et
    const existingQR = await QRKod.findOne({ where: { MamaKabiId: mamaKabiId } });
    if (existingQR) {
      throw new Error('Bu mama kabı için zaten QR kodu mevcut');
    }

    return await QRKod.create({ MamaKabiId: mamaKabiId });
  }

  // QR kodu güncelle
  async update(qrId, qrData) {
    const qrKod = await QRKod.findByPk(qrId);
    if (!qrKod) return null;

    await qrKod.update(qrData);
    return this.getById(qrId);
  }

  // QR kodu sil
  async delete(qrId) {
    const qrKod = await QRKod.findByPk(qrId);
    if (!qrKod) return false;
    
    await qrKod.destroy();
    return true;
  }

  // QR kod ile giriş yap
  async login(qrId, kullaniciId) {
    const qrKod = await QRKod.findByPk(qrId);
    if (!qrKod) {
      throw new Error('QR kodu bulunamadı');
    }

    if (!qrKod.AktifMi) {
      throw new Error('Bu QR kodu aktif değil');
    }

    await qrKod.update({ GirisyapanKullaniciId: kullaniciId });
    return this.getById(qrId);
  }

  // QR kod aktif/pasif yap
  async toggleAktif(qrId, aktif) {
    const qrKod = await QRKod.findByPk(qrId);
    if (!qrKod) return null;

    await qrKod.update({ AktifMi: aktif ? 1 : 0 });
    return this.getById(qrId);
  }
}

export default new QRKodService();
