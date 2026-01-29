import { sequelize } from '../config/database.js';

// Models
import Rol from './Rol.js';
import Kullanici from './Kullanici.js';
import Admin from './Admin.js';
import MamaKabi from './MamaKabi.js';
import Anomali from './Anomali.js';
import QRKod from './QRKod.js';
import SensorVeri from './SensorVeri.js';
import MamaEklemeKayit from './MamaEklemeKayit.js';
import KullaniciSkor from './KullaniciSkor.js';
import SifreSifirlama from './SifreSifirlama.js';
import GirisGecmisi from './GirisGecmisi.js';
import KapiAktivasyonGecmisi from './KapiAktivasyonGecmisi.js';

// ==================== İLİŞKİLER ====================

// Rol - Kullanici (1:N)
Rol.hasMany(Kullanici, { foreignKey: 'RolId', as: 'kullanicilar' });
Kullanici.belongsTo(Rol, { foreignKey: 'RolId', as: 'rol' });

// Kullanici - Admin (1:1)
Kullanici.hasOne(Admin, { foreignKey: 'KullaniciId', as: 'admin' });
Admin.belongsTo(Kullanici, { foreignKey: 'KullaniciId', as: 'kullanici' });

// MamaKabi - SensorVeri (1:N)
MamaKabi.hasMany(SensorVeri, { foreignKey: 'MamaKabiId', as: 'sensorVerileri' });
SensorVeri.belongsTo(MamaKabi, { foreignKey: 'MamaKabiId', as: 'mamaKabi' });

// MamaKabi - Anomali (1:N)
MamaKabi.hasMany(Anomali, { foreignKey: 'MamaKabiId', as: 'anomaliler' });
Anomali.belongsTo(MamaKabi, { foreignKey: 'MamaKabiId', as: 'mamaKabi' });

// SensorVeri - Anomali (1:N)
SensorVeri.hasMany(Anomali, { foreignKey: 'SensorId', as: 'anomaliler' });
Anomali.belongsTo(SensorVeri, { foreignKey: 'SensorId', as: 'sensorVeri' });

// MamaKabi - QRKod (1:1)
MamaKabi.hasOne(QRKod, { foreignKey: 'MamaKabiId', as: 'qrKod' });
QRKod.belongsTo(MamaKabi, { foreignKey: 'MamaKabiId', as: 'mamaKabi' });

// Kullanici - QRKod (1:N) - Giriş yapan kullanıcı
Kullanici.hasMany(QRKod, { foreignKey: 'GirisyapanKullaniciId', as: 'qrKodlari' });
QRKod.belongsTo(Kullanici, { foreignKey: 'GirisyapanKullaniciId', as: 'girisYapanKullanici' });

// MamaKabi - MamaEklemeKayit (1:N)
MamaKabi.hasMany(MamaEklemeKayit, { foreignKey: 'MamaKabiId', as: 'mamaEklemeleri' });
MamaEklemeKayit.belongsTo(MamaKabi, { foreignKey: 'MamaKabiId', as: 'mamaKabi' });

// Kullanici - MamaEklemeKayit (1:N)
Kullanici.hasMany(MamaEklemeKayit, { foreignKey: 'KullaniciId', as: 'mamaEklemeleri' });
MamaEklemeKayit.belongsTo(Kullanici, { foreignKey: 'KullaniciId', as: 'kullanici' });

// Kullanici - KullaniciSkor (1:1)
Kullanici.hasOne(KullaniciSkor, { foreignKey: 'KullaniciId', as: 'skor' });
KullaniciSkor.belongsTo(Kullanici, { foreignKey: 'KullaniciId', as: 'kullanici' });

// Kullanici - SifreSifirlama (1:N)
Kullanici.hasMany(SifreSifirlama, { foreignKey: 'KullaniciId', as: 'sifreSifirlamalari' });
SifreSifirlama.belongsTo(Kullanici, { foreignKey: 'KullaniciId', as: 'kullanici' });

// Kullanici - GirisGecmisi (1:N)
Kullanici.hasMany(GirisGecmisi, { foreignKey: 'KullaniciId', as: 'girisGecmisi' });
GirisGecmisi.belongsTo(Kullanici, { foreignKey: 'KullaniciId', as: 'kullanici' });

// MamaKabi - KapiAktivasyonGecmisi (1:N)
MamaKabi.hasMany(KapiAktivasyonGecmisi, { foreignKey: 'MamaKabiId', as: 'aktivasyonGecmisi' });
KapiAktivasyonGecmisi.belongsTo(MamaKabi, { foreignKey: 'MamaKabiId', as: 'mamaKabi' });

// Kullanici - KapiAktivasyonGecmisi (1:N)
Kullanici.hasMany(KapiAktivasyonGecmisi, { foreignKey: 'KullaniciId', as: 'aktivasyonGecmisi' });
KapiAktivasyonGecmisi.belongsTo(Kullanici, { foreignKey: 'KullaniciId', as: 'kullanici' });

export {
  sequelize,
  Rol,
  Kullanici,
  Admin,
  MamaKabi,
  Anomali,
  QRKod,
  SensorVeri,
  MamaEklemeKayit,
  KullaniciSkor,
  SifreSifirlama,
  GirisGecmisi,
  KapiAktivasyonGecmisi
};
