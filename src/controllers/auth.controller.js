import { Op } from "sequelize";
import {User} from "../models/user.model.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export const register = async (req, res) => {
    try {
        const {username, email, password} = req.body;
        const existingUser = await User.findOne({
            where: {
                [Op.or]: [
                    {email},
                    {username}
                ]
            }
        })
        if (existingUser) {
            return res.status(400).json({error: "Usuario o email ya están en uso"});
        }
        const createdUser = await User.create({
            username,
            email,
            password
        })
        const userData = createdUser.get({ plain: true });
        delete userData.password;

        res.status(201).json({message: "usuario creado con exito", userData});
    } catch (err) {
        console.error("error al registrar el usuario", err)
        res.status(500).json({error: "Error interno del servidor"});
    }
}

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: "Usuario y contraseña son requeridos" });
        }

        const user = await User.findOne({
            where: {
                [Op.or]: [
                    { username },
                    { email: username } 
                ]
            }
        });

        if (!user) {
            return res.status(401).json({ error: "Credenciales inválidas" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Credenciales inválidas" });
        }

        const userData = user.get({ plain: true });
        delete userData.password;

        const token = jwt.sign(
            {id: user.id, username: user.username},
            process.env.JWT_SECRET || "o&!PR8TueJ@M9Fr7J7udSf",
            {expiresIn: '1h'}
        )

        res.status(201).json({message: "inicio de seccion exitoso", token})

    } catch (err) {
        console.error("Error en login:", err);
        return res.status(500).json({ 
            error: "Error interno del servidor",});
    }
};