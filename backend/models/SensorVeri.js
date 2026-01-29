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
  Agirlik: {
    type: DataTypes.DECIMAL(6, 2),
    allowNull: true
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
  },
  Konum: {
    type: DataTypes.STRING(255),
    allowNull: true
  }
}, {
  tableName: 'SensorVerileri'
});

export default SensorVeri;
