import express from  "express"
import {sendFriendRequest, respondToFriendRequest, getReceivedFriendRequests, getSentFriendRequests, getFriends } from "../controllers/friendship.controller.js"
import { verifyToken } from "../middlewares/authMiddleware.js";


export const friendshipRouter = express.Router();


friendshipRouter.use(verifyToken)

friendshipRouter.post('/sendFriendRequest', sendFriendRequest)

friendshipRouter.post('/respondToFriendRequest/:requesterId', respondToFriendRequest)

friendshipRouter.get('/getReceivedFriendRequests', getReceivedFriendRequests)

friendshipRouter.get('/getSentFriendRequests',getSentFriendRequests )

friendshipRouter.get('/getFriends', getFriends)
