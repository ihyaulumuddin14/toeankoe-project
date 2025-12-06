import { Router } from "express"
import {
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  deleteCustomerByAdmin
} from "../controllers/customer.controller.js"
import { authenticate } from "../middleware/authenticate.js"
import { adminOnly } from "../middleware/adminOnly.js"

const router = Router()

router.get("/", adminOnly, getAllCustomers)
router.get("/me", authenticate, getCustomerById)
router.patch("/me", authenticate, updateCustomer)
router.delete("/me", authenticate, deleteCustomer)
router.delete("/:id", adminOnly, deleteCustomerByAdmin)

export default router