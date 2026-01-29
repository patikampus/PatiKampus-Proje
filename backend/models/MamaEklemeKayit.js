import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const MamaEklemeKayit = sequelize.define('MamaEklemeKayitlari', {
  KayitId: {
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
    allowNull: false,
    references: {
      model: 'Kullanicilar',
      key: 'KullaniciId'
    }
  },
  EklenenMiktarKg: {
    type: DataTypes.DECIMAL(6, 2),
    allowNull: true
  },
  EklemeZamani: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'MamaEklemeKayitlari'
});

export default MamaEklemeKayit;
