import Router from "express"
import { authenticate } from "../middlewares/authentication.js"
import { getDetails } from "../controllers/dashboard.controller.js"

const router = Router()

router.get("/details", authenticate, getDetails)

export default router