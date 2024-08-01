import Router from "express"
import { authenticate } from "../middlewares/authentication.js"
import { checkRole } from "../middlewares/checkRole.js"
import { getProducts, getProduct, postProduct, updateProduct, deleteProduct, getByCategory } from "../controllers/product.controller.js"

const router = Router()

router.get("/get", authenticate, getProducts)

router.get("/getById/:id", authenticate, getProduct)

router.get("/getByCategory/:id", authenticate, getByCategory)

router.post("/add", authenticate, checkRole, postProduct)

router.put("/update/:id", authenticate, checkRole, updateProduct)

router.delete("/delete/:id", authenticate, checkRole, deleteProduct)

export default router