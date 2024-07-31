import { config } from "dotenv"
import jwt from "jsonwebtoken"
import { ERROR_UNAUTHORIZED } from "../constants/errors.constant.js"

config()

export function authenticate (req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if(token == null) return res.status(401).send({message: ERROR_UNAUTHORIZED})
    
    jwt.verify(token, process.env.ACCESS_TOKEN, (err, payload) => {
        if(err) return res.status(403).send({message: ERROR_NOT_PERMISSION})

        req.user = payload
        next()
    })
}