import Task from "../models/Task.js";

// =======================
// GET ALL TASKS
// =======================
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("employeeId", "name role email")
      .sort({ createdAt: -1 });

    const formatted = tasks.map((t) => ({
      id: t._id,
      title: t.title,
      description: t.description,
      status: t.status,
      progress: t.progress,
      accepted: t.accepted,
      employee: t.employeeId
        ? {
            id: t.employeeId._id,
            name: t.employeeId.name,
            role: t.employeeId.role,
            email: t.employeeId.email
          }
        : null
    }));

    return res.json(formatted);
  } catch (err) {
    console.error("Get tasks error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
};

// =======================
// ADD TASK (ADMIN)
// =======================
export const addTask = async (req, res) => {
  try {
    const { title, description, employeeId } = req.body;

    if (!title || !employeeId) {
      return res
        .status(400)
        .json({ message: "Title and employee are required" });
    }

    const task = await Task.create({
      title,
      description,
      employeeId
    });

    return res.status(201).json(task);
  } catch (err) {
    console.error("Add task error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
};

// =======================
// ACCEPT TASK (Employee)
// =======================
export const acceptTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: "Task not found" });

    task.accepted = true;
    task.status = "accepted";

    await task.save();

    res.json({ message: "Task accepted", task });
  } catch (err) {
    console.error("Accept task error:", err.message);
    res.status(500).json({ message: "Error updating task" });
  }
};

// =======================
// REJECT TASK (Employee)
// =======================
export const rejectTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: "Task not found" });

    task.accepted = false;
    task.status = "rejected";

    await task.save();

    res.json({ message: "Task rejected", task });
  } catch (err) {
    console.error("Reject task error:", err.message);
    res.status(500).json({ message: "Error updating task" });
  }
};

// =======================
// UPDATE PROGRESS (Employee)
// =======================
export const updateProgress = async (req, res) => {
  try {
    const { progress } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: "Task not found" });

    if (![0, 25, 50, 75, 100].includes(progress)) {
      return res.status(400).json({ message: "Invalid progress value" });
    }

    task.progress = progress;

    if (progress === 100) {
      task.status = "completed";
    } else if (task.accepted) {
      task.status = "in-progress";
    }

    await task.save();

    res.json({ message: "Progress updated", task });
  } catch (err) {
    console.error("Progress update error:", err.message);
    res.status(500).json({ message: "Error updating progress" });
  }
};


// ADMIN: UPDATE STATUS

export const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (
      !["pending", "accepted", "rejected", "in-progress", "completed"].includes(
        status
      )
    ) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  } catch (err) {
    console.error("Update status error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};
