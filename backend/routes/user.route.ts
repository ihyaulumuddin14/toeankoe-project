import { Router } from "express"
import { getUserById } from "../controllers/customer.controller.js"
import { authenticate } from "../middleware/authenticate.js"

const router = Router()

router.get("/me", authenticate, getUserById)

export default router