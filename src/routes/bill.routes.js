import Router from "express"
import { authenticate } from "../middlewares/authentication.js"
import { checkRole } from "../middlewares/checkRole.js"
import { deleteBill, generateReport, getBills, getPdf } from "../controllers/bill.controller.js"

const router = Router()

router.get("/getBills", authenticate, getBills)

router.post("/generateReport", authenticate, generateReport)

router.post("/getPdf", authenticate, getPdf)

router.delete("/delete/:id", authenticate, deleteBill)

export default router