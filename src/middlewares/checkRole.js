import { config } from "dotenv"
import { ERROR_UNAUTHORIZED } from "../constants/errors.constant.js"

config()

export function checkRole(req, res, next) {
    if(res.req.user.role === process.env.USER_ROLE){
        return res.status(401).send({message: ERROR_UNAUTHORIZED})
    } else {
        next()
    }
}