import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Anomali = sequelize.define('Anomaliler', {
  AnomaliId: {
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
  SensorId: {
    type: DataTypes.BIGINT,
    allowNull: true,
    references: {
      model: 'SensorVerileri',
      key: 'SensorId'
    }
  },
  AnomaliZamani: {
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
  }
}, {
  tableName: 'Anomaliler',
  indexes: [
    { fields: ['MamaKabiId'], name: 'IX_Anomali_MamaKabi' },
    { fields: ['SensorId'], name: 'IX_Anomali_Sensor' },
    { fields: ['AnomaliZamani'], name: 'IX_Anomali_Zaman' }
  ]
});

export default Anomali;
