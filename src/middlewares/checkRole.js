import { config } from "dotenv"

config()

export function checkRole(req, res, next) {
    if(res.req.user.role === process.env.USER_ROLE){
        return res.sendStatus(401)
    } else {
        next()
    }
}