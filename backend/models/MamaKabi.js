import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const MamaKabi = sequelize.define('MamaKaplari', {
  MamaKabiId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  KapAdi: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  KonumAciklama: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  Konum: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  AktifMi: {
    type: DataTypes.TINYINT,
    allowNull: false,
    defaultValue: 1
  },
  AktifEdilmeZamani: {
    type: DataTypes.DATE,
    allowNull: true
  },
  OlusturmaTarihi: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'MamaKaplari'
});

export default MamaKabi;
