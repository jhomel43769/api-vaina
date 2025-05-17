import jwt from "jsonwebtoken"

export const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if(!token) {
        return res.status(401).json({error: 'token no proporcionado'})
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'o&!PR8TueJ@M9Fr7J7udSf')
        req.user = decoded;
        next()
    } catch (err) {
        return res.status(403).json({error: 'token invalido o expirado'})
    }
}