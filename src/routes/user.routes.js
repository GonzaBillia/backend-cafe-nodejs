import { Router } from "express"
import connection from "../db/connection.js"
import { forgotPassword, getUsers, signIn, signUp } from "../controllers/user.controller.js"

const router = Router()

router.get("/", getUsers)

router.post("/signup", signUp)

router.post("/login", signIn)

router.post("/forgotpassword", forgotPassword)


export default router