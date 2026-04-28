import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const SensorVeri = sequelize.define('SensorVerileri', {
  SensorId: {
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
  OlcumZamani: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  IcHazneAgirlik: {
    type: DataTypes.DECIMAL(6, 2),
    allowNull: true,
    field: 'İçHazneAgirlik'
  },
  DisHazneAgirlik: {
    type: DataTypes.DECIMAL(6, 2),
    allowNull: true,
    field: 'DışHazneAgirlik'
  },
  Yukseklik: {
    type: DataTypes.DECIMAL(6, 2),
    allowNull: true
  },
  SonMamaEklemeZamani: {
    type: DataTypes.DATE,
    allowNull: true
  },
  KapAktifMi: {
    type: DataTypes.TINYINT,
    allowNull: true
  }
}, {
  tableName: 'SensorVerileri'
});

export default SensorVeri;
