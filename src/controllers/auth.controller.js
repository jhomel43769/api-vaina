import { Op } from "sequelize";
import {User} from "../models/user.model.js"

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
            return res.status(400).json({error: "Usuario o contraseña ya están en uso"});
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