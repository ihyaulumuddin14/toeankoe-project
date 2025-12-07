import { Router } from "express"
import { createService, deleteService, getAllServices, getServiceById, updateService } from "../controllers/service.controller"
import { adminOnly } from "../middleware/adminOnly"

const router = Router()

router.get("/", getAllServices)
router.get("/:id", getServiceById)
router.post("/", adminOnly, createService)
router.patch("/:id", adminOnly, updateService)
router.delete("/:id", adminOnly, deleteService)
router.delete("/", adminOnly, deleteService)

export default router