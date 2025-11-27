import Task from "../models/Task.js";

export const getDashboard = async (req, res) => {
  try {
    const totalTasks = await Task.countDocuments();
    const completedTasks = await Task.countDocuments({ status: "completed" });
    const inProgressTasks = await Task.countDocuments({ status: "in-progress" });

    const completionRate =
      totalTasks === 0 ? 0 : Number(((completedTasks / totalTasks) * 100).toFixed(2));

    return res.json({
      totalTasks,
      completedTasks,
      inProgressTasks,
      completionRate
    });
  } catch (err) {
    console.error("Dashboard error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
};
