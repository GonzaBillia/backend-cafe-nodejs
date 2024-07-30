import { Router } from "express"
import { authenticate } from "../middlewares/authentication.js"
import { changePassword, checkToken, forgotPassword, getUsers, patchStatus, signIn, signUp, updateUser } from "../controllers/user.controller.js"
import { checkRole } from "../middlewares/checkRole.js"

const router = Router()

router.get("/get", authenticate, checkRole, getUsers)

router.get("checkToken", authenticate, checkToken)

router.post("/signup", signUp)

router.post("/login", signIn)

router.post("/forgotpassword", forgotPassword)

router.put("/update", updateUser)

router.patch("/updateStatus", authenticate, patchStatus)

router.post("/changePassword", authenticate, changePassword)


export default router