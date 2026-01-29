import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const GirisGecmisi = sequelize.define('GirisGecmisi', {
  GirisId: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  KullaniciId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Kullanicilar',
      key: 'KullaniciId'
    }
  },
  GirisZamani: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  CihazBilgisi: {
    type: DataTypes.STRING(200),
    allowNull: true
  }
}, {
  tableName: 'GirisGecmisi'
});

export default GirisGecmisi;
