import Router from "express"
import { authenticate } from "../middlewares/authentication.js"
import { checkRole } from "../middlewares/checkRole.js"
import { getProducts, getProduct, postProduct, updateProduct, deleteProduct } from "../controllers/product.controller.js"

const router = Router()

router.get("/get", authenticate, getProducts)

router.post("/add", authenticate, checkRole, postProduct)

export default router