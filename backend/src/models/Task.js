import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },

    // Assigned Employee
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true
    },

    // Status
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "in-progress", "completed"],
      default: "pending"
    },

    // Accept / Reject flag
    accepted: {
      type: Boolean,
      default: false
    },

    // Employee progress %
    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    }
  },
  { timestamps: true }
);

export default mongoose.model("Task", taskSchema);
