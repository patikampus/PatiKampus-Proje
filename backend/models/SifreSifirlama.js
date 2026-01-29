import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const SifreSifirlama = sequelize.define('SifreSifirlama', {
  SifirlamaId: {
    type: DataTypes.CHAR(36),
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  KullaniciId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Kullanicilar',
      key: 'KullaniciId'
    }
  },
  Token: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  GecerlilikZamani: {
    type: DataTypes.DATE,
    allowNull: false
  },
  KullanildiMi: {
    type: DataTypes.TINYINT,
    allowNull: false,
    defaultValue: 0
  },
  OlusturmaZamani: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'SifreSifirlama'
});

export default SifreSifirlama;
