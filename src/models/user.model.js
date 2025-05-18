import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";
import bcrypt from "bcrypt";

export const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  hooks: {
    beforeCreate: async (user) => {
      if (!user.password) {
        throw new Error("La contraseña es requerida");
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    },
  },
  timestamps: false,
  tableName: 'users', 
  freezeTableName: true,
  underscored: true
});