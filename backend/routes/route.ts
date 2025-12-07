import { Router } from "express";
import authRoutes from "./auth.route.js"
import customerRoutes from "./customer.route.js"
import userRoutes from "./user.route.js"
import capsterRoutes from "./capster.route.js"
import appointmentRoutes from "./appointment.route.js"
import serviceRoutes from "./service.route.js"

const router = Router()

router.use("/auth", authRoutes)
router.use("/user", userRoutes)
router.use("/capster", capsterRoutes)
router.use("/customer", customerRoutes)
router.use("/appointment", appointmentRoutes)
router.use("/service", serviceRoutes)

export default router