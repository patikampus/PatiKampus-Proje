import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Rol = sequelize.define('Roller', {
  RolId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  RolAdi: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  MinSkor: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  MaxSkor: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'Roller'
});

export default Rol;
