import express from "express";
import {
  getTasks,
  addTask,
  acceptTask,
  rejectTask,
  updateProgress,
  updateTaskStatus
} from "../controllers/taskController.js";
import { adminOnly } from "../middleware/adminOnly.js";

const router = express.Router();

// Get all tasks
router.get("/", getTasks);

// Create new task (Admin only)
router.post("/", adminOnly, addTask);

// Employee: Accept / Reject
router.patch("/:id/accept", acceptTask);
router.patch("/:id/reject", rejectTask);

// Employee: Update progress
router.patch("/:id/progress", updateProgress);

// Admin: Force update status
router.put("/:id/status", adminOnly, updateTaskStatus);

export default router;
