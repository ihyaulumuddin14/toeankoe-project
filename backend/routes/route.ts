import { Router } from "express";
import authRoutes from "./auth.route.js"
import userRoutes from "./user.route.js"
import capsterRoutes from "./capster.route.js"

const router = Router()

router.use("/auth", authRoutes)
router.use("/user", userRoutes)
router.use("/capster", capsterRoutes)

export default router