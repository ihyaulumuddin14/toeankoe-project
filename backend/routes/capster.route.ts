import express from "express";
import { adminOnly } from "../middleware/adminOnly.js";

import {
  addCapster,
  getAllCapster,
  getCapsterById,
  updateCapster,
  deleteCapster,
  deleteAllCapster
} from "../controllers/capster.controller.js";

const router = express.Router();

router.post("/", adminOnly, addCapster);
router.get("/", adminOnly, getAllCapster);
router.get("/:id", adminOnly, getCapsterById);
router.patch("/:id", adminOnly, updateCapster);
router.delete("/:id", adminOnly, deleteCapster);
router.delete("/", adminOnly, deleteAllCapster);

export default router;
