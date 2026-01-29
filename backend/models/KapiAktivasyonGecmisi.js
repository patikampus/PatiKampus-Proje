import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const KapiAktivasyonGecmisi = sequelize.define('KapiAktivasyonGecmisi', {
  AktivasyonId: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  MamaKabiId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'MamaKaplari',
      key: 'MamaKabiId'
    }
  },
  KullaniciId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Kullanicilar',
      key: 'KullaniciId'
    }
  },
  AktivasyonZamani: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'KapiAktivasyonGecmisi'
});

export default KapiAktivasyonGecmisi;
