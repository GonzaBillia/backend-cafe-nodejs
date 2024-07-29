import { Router } from "express"
import connection from "../db/connection.js"
import { getUsers, signUp } from "../controllers/user.controller.js"

const router = Router()

router.get("/", getUsers)

router.post("/signup", signUp)


export default router