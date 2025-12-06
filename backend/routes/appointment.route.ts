import { Router } from "express"
import { authenticate } from "../middleware/authenticate"
import { createAppointment, getAppointmentById, getAppointments } from "../controllers/appointment.controller"
import { getSlotStatusForDate } from "../helper/slot-status"

const router = Router()

router.get("/slot-status", getSlotStatusForDate)
router.get("/", authenticate, getAppointments)
router.get("/:id", authenticate, getAppointmentById)
router.post("/", authenticate, createAppointment)
router.patch("/reschedule/:id", authenticate, createAppointment)


export default router