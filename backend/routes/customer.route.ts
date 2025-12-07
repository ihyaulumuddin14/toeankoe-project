import { Router } from "express";
import { adminOnly } from "../middleware/adminOnly.js";
import { authenticate } from "../middleware/authenticate";
import {
  getAllCustomers,
  updateCustomer,
  deleteMe
} from "../controllers/customer.controller.js";

const router = Router()

router.get("/", adminOnly, getAllCustomers)
router.patch("/me", authenticate, updateCustomer)
router.delete("/me", authenticate, deleteMe)

export default router