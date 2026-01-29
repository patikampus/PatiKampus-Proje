import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const KullaniciSkor = sequelize.define('KullaniciSkorlari', {
  KullaniciId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'Kullanicilar',
      key: 'KullaniciId'
    }
  },
  ToplamEklemeSayisi: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  ToplamMama: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  },
  Skor: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  SonGuncelleme: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'KullaniciSkorlari'
});

export default KullaniciSkor;
