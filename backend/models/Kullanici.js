import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Kullanici = sequelize.define('Kullanicilar', {
  KullaniciId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  AdSoyad: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  Email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  SifreHash: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  KayitTarihi: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  SonGirisZamani: {
    type: DataTypes.DATE,
    allowNull: true
  },
  AktifMi: {
    type: DataTypes.TINYINT,
    allowNull: false,
    defaultValue: 1
  },
  RolId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Roller',
      key: 'RolId'
    }
  }
}, {
  tableName: 'Kullanicilar'
});

export default Kullanici;
