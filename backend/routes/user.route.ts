import { Router } from "express"
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} from "../controllers/user.controller.js"
import { authenticate } from "../middleware/authenticate.js"

const router = Router()

router.get("/", getAllUsers)
router.get("/me/:id", getUserById)
router.patch("/me", authenticate, updateUser)
router.delete("/:id", deleteUser)

export default router