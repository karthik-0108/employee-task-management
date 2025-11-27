import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Load env FIRST — before anything else
dotenv.config({ quiet: true });

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import { auth } from "./middleware/auth.js";
import { adminOnly } from "./middleware/adminOnly.js";

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://YOUR_FRONTEND_RENDER_URL"   // <-- REPLACE THIS
  ],
  credentials: true
}));

app.use(express.json());

// Health check
app.get("/", (_, res) => {
  res.send("Emp-Manage API is running");
});

// Public auth routes
app.use("/api/auth", authRoutes);

// Protected routes
app.use("/api/employees", auth, employeeRoutes);
app.use("/api/tasks", auth, taskRoutes);
app.use("/api/dashboard", auth, dashboardRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Emp-Manage backend running on port ${PORT}`);
});
