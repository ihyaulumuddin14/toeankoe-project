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

router.get("/", getAllCapster);
router.get("/:id", getCapsterById);
router.post("/", adminOnly, addCapster);
router.patch("/:id", adminOnly, updateCapster);
router.delete("/:id", adminOnly, deleteCapster);
router.delete("/", adminOnly, deleteAllCapster);

export default router;
