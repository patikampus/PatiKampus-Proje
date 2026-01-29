import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const QRKod = sequelize.define('QRKodlari', {
  QRId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  MamaKabiId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    references: {
      model: 'MamaKaplari',
      key: 'MamaKabiId'
    }
  },
  GirisyapanKullaniciId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Kullanicilar',
      key: 'KullaniciId'
    }
  },
  OlusturmaTarihi: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  AktifMi: {
    type: DataTypes.TINYINT,
    allowNull: false,
    defaultValue: 1
  }
}, {
  tableName: 'QRKodlari'
});

export default QRKod;
