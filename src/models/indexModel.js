import { sequelize } from '../db.js';
import { User } from './user.model.js';
import { FriendshipRequest } from './friendshipRequest.model.js';
import { setupRelations } from './relacion.js';  // o como hayas llamado al archivo de relaciones

// Configura las relaciones entre los modelos
setupRelations();

// Sincroniza la base con los modelos (solo para desarrollo)
await sequelize.sync({ alter: true });

export {
  sequelize,
  User,
  FriendshipRequest
};
