import { Op } from "sequelize";
import {Friendship} from "../models/Friendship.model.js"
import { FriendshipRequest } from "../models/friendshipRequest.model.js";

export const blockFriend = async (req, res) => {
    try {
        const {friendId} = req.params;
        const userId = req.user.id

        const friendExist = await user.findByPk(friendId);
        if(!friendExist) {
            return res.status(400).json({error: "el usuario a bloquear no existe"})
        }

        const friendship = await FriendshipRequest.findOne({
            where: {
                [Op.or]: [
                    {requester_id: userId, receiver_id: friendId, status: "accepted" },
                    {requester_id: friendId, receiver_id: userId, status: "accepted"}                   
                 ] 
                }
            })
            if (!friendship) {
                return res.status(400).json({error: "no existe una relacion de amistad entre ustedes"})
            }

            await Friendship.update({
                status: "accepted",
                action_user_id: userId
            });

            res.status(200).json({message: "usuario bloqueado con exito", blockedUser: {
                id: friendExist.id,
                username: friendExist.username
            }})
    } catch (err) {
        console.error("error al bloquear usuario", err);
        res.status(500).json({error: "error interno del servidor"})
    }
}


export const getBlockedUsers  = async (req, res) => {
    try {
        const userId = req.params; 

        const blockedAsActtionUser = await FriendshipRequest.findAll({
            where: {
                action_user_id: userId,
                status: "blocked"
            },
            include: [
                {
                    model: User, 
                    as: 'requester',
                    attributes: ['id','username', 'email']
                },
                {
                    model: User,
                    as: 'receiver',
                    attributes: ['id', 'username', 'email']
                }
            ]
        });
        
        const blockedUsers = blockedAsActtionUser.map(block => {
            
            const blockedUser = block.requester_id === userId ? block.receiver : block.requester;

            return {
                id: blockedUser.id,
                username: blockedUser.username,
                email: blockedUser.email,
                blockedAt: block.updatedAt
            }
        })

        res.status(200).json({blockedUsers})
    } catch (err) {
        console.error("error al obtener la lista de bloqueados", err) 
        res.status(500).json({error: "error interno del servidor"})
    }
}