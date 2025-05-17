import { User } from './user.model.js';
import { FriendshipRequest } from './friendshipRequest.model.js';

export const setupRelations = () => {
  // Relaciones de solicitudes de amistad
  User.hasMany(FriendshipRequest, { foreignKey: 'requester_id', as: 'sentRequests' });
  User.hasMany(FriendshipRequest, { foreignKey: 'receiver_id', as: 'receivedRequests' });
  
  FriendshipRequest.belongsTo(User, { foreignKey: 'requester_id', as: 'requester' });
  FriendshipRequest.belongsTo(User, { foreignKey: 'receiver_id', as: 'receiver' });
};
