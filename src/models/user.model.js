import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";
import bcrypt from "bcrypt";

export const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
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
  timestamps: false, // Desactivamos los timestamps automáticos
  tableName: 'users', // Forzamos el nombre de la tabla
  freezeTableName: true, // Evitamos la pluralización
  underscored: true // Usamos snake_case para los campos
});