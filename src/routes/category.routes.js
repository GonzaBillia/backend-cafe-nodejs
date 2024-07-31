import Router from "express"
import {authenticate} from "../middlewares/authentication.js"
import {checkRole} from "../middlewares/checkRole.js"
import { getCategories, postCategory, updateCategory } from "../controllers/category.controller.js"

const router = Router()

router.get("/get", authenticate, getCategories)

router.post("/add", authenticate, checkRole, postCategory)

router.put("/update", authenticate, checkRole, updateCategory)

export default router