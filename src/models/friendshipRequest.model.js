import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

export const FriendshipRequest = sequelize.define('FriendshipRequest', {
  requester_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false, 
    references: {
      model: 'users',
      key: 'id'
    }
  },

  receiver_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },

  status: {
    type: DataTypes.ENUM("pending", "accepted", "rejected"),
    defaultValue: "pending",
    allowNull: false
  }
}, {
  tableName: "friendship_requests",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: false
});
