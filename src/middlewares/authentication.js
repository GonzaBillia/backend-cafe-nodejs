import { config } from "dotenv"
import jwt from "jsonwebtoken"

config()

export function authenticate (req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if(token == null) return res.sendStatus(401)
    
    jwt.verify(token, process.env.ACCESS_TOKEN, (err, payload) => {
        if(err) return res.sendStatus(403)

        req.user = payload
        next()
    })
}