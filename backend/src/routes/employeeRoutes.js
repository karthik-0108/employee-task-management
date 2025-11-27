import express from "express";
import { getEmployees, addEmployee } from "../controllers/employeeController.js";
import { adminOnly } from "../middleware/adminOnly.js";

const router = express.Router();

router.get("/", getEmployees);
router.post("/", adminOnly, addEmployee);

export default router;
