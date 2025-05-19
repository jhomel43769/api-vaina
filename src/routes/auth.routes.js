import express from "express";
import { login, register, deleteUser } from "../controllers/auth.controller.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

export const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/login', login);

authRouter.delete('/user', verifyToken, deleteUser);
