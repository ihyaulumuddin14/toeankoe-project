import { Router } from "express";
import { adminOnly } from "../middleware/adminOnly.js";
import { authenticate } from "../middleware/authenticate";
import {
  getAllCustomers,
  updateCustomer,
  deleteCustomer,
  deleteCustomerById
} from "../controllers/customer.controller.js";

const router = Router()

router.get("/", adminOnly, getAllCustomers)
router.patch("/me", authenticate, updateCustomer)
router.delete("/me", authenticate, deleteCustomer)
router.delete("/:id", adminOnly, deleteCustomerById)

export default router