import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Admin = sequelize.define('Adminler', {
  AdminId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  KullaniciId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    references: {
      model: 'Kullanicilar',
      key: 'KullaniciId'
    }
  },
  OlusturmaTarihi: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'Adminler'
});

export default Admin;
