import express from "express"
import { register } from "../controllers/auth.controller.js"

export const router = express.Router();

router.post('/register', register)

