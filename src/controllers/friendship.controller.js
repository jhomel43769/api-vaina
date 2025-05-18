import { FriendshipRequest } from "../models/friendshipRequest.model.js";
import { User } from "../models/user.model.js";
import { Op } from "sequelize";

export const sendFriendRequest = async (req, res) => {
  try {
    const { receiverId } = req.body;
    const requesterId = req.user.id;

    if (requesterId === parseInt(receiverId)) {
      return res.status(400).json({ error: "No puedes enviarte una solicitud a ti mismo" });
    }

    const receiverExists = await User.findByPk(receiverId);
    if (!receiverExists) {
      return res.status(404).json({ error: "El usuario receptor no existe" });
    }
    const existingRequest = await FriendshipRequest.findOne({
      where: {
        [Op.or]: [
          { requester_id: requesterId, receiver_id: receiverId },
          { requester_id: receiverId, receiver_id: requesterId }
        ]
      }
    });

    if (existingRequest) {
      return res.status(400).json({ 
        error: "Ya existe una solicitud de amistad entre estos usuarios",
        status: existingRequest.status
      });
    }

    const friendRequest = await FriendshipRequest.create({
      requester_id: requesterId,
      receiver_id: receiverId,
      status: "pending"
    });

    res.status(201).json({ 
      message: "Solicitud de amistad enviada con éxito",
      request: friendRequest
    });

  } catch (err) {
    console.error("Error al enviar solicitud de amistad:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const respondToFriendRequest = async (req, res) => {
  try {
    const { requesterId } = req.params;
    const { status } = req.body;
    const receiverId = req.user.id;

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ error: "El estado debe ser 'accepted' o 'rejected'" });
    }

    const friendRequest = await FriendshipRequest.findOne({
      where: {
        requester_id: requesterId,
        receiver_id: receiverId,
        status: "pending"
      }
    });

    if (!friendRequest) {
      return res.status(404).json({ error: "No se encontró ninguna solicitud de amistad pendiente" });
    }

    await friendRequest.update({ status });

    res.status(200).json({ 
      message: `Solicitud de amistad ${status === 'accepted' ? 'aceptada' : 'rechazada'} con éxito` 
    });

  } catch (err) {
    console.error("Error al responder a solicitud de amistad:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const getReceivedFriendRequests = async (req, res) => {
  try {
    const userId = req.user.id;

    const requests = await FriendshipRequest.findAll({
      where: {
        receiver_id: userId
      },
      include: [
        {
          model: User,
          as: 'requester',
          attributes: ['id', 'username', 'email']
        }
      ]
    });

    res.status(200).json({ requests });

  } catch (err) {
    console.error("Error al obtener solicitudes de amistad:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const getSentFriendRequests = async (req, res) => {
  try {
    const userId = req.user.id;

    const requests = await FriendshipRequest.findAll({
      where: {
        requester_id: userId
      },
      include: [
        {
          model: User,
          as: 'receiver',
          attributes: ['id', 'username', 'email']
        }
      ]
    });

    res.status(200).json({ requests });

  } catch (err) {
    console.error("Error al obtener solicitudes de amistad enviadas:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const getFriends = async (req, res) => {
  try {
    const userId = req.user.id;

    const acceptedAsReceiver = await FriendshipRequest.findAll({
      where: {
        receiver_id: userId,
        status: "accepted"
      },
      include: [
        {
          model: User,
          as: 'requester',
          attributes: ['id', 'username', 'email']
        }
      ]
    });

    const acceptedAsRequester = await FriendshipRequest.findAll({
      where: {
        requester_id: userId,
        status: "accepted"
      },
      include: [
        {
          model: User,
          as: 'receiver',
          attributes: ['id', 'username', 'email']
        }
      ]
    });

    const friends = [
      ...acceptedAsReceiver.map(req => ({
        id: req.requester.id,
        username: req.requester.username,
        email: req.requester.email
      })),
      ...acceptedAsRequester.map(req => ({
        id: req.receiver.id,
        username: req.receiver.username,
        email: req.receiver.email
      }))
    ];

    res.status(200).json({ friends });

  } catch (err) {
    console.error("Error al obtener lista de amigos:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
