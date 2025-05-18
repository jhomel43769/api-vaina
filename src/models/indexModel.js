import { sequelize } from '../db.js';
import { User } from './user.model.js';
import { FriendshipRequest } from './friendshipRequest.model.js';
import { setupRelations } from './relacion.js';

setupRelations();

// Sincroniza la base con los modelos (solo para desarrollo)
await sequelize.sync({ alter: true });

export {
  sequelize,
  User,
  FriendshipRequest
};
