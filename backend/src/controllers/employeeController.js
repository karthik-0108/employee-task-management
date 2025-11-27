import Employee from "../models/Employee.js";
import Task from "../models/Task.js";

export const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });

    const result = await Promise.all(
      employees.map(async (emp) => {
        const count = await Task.countDocuments({ employeeId: emp._id });
        return {
          id: emp._id,
          name: emp.name,
          role: emp.role,
          email: emp.email,
          taskCount: count
        };
      })
    );

    return res.json(result);
  } catch (err) {
    console.error("Get employees error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
};

export const addEmployee = async (req, res) => {
  try {
    const { name, role, email } = req.body;

    if (!name || !role) {
      return res.status(400).json({ message: "Name and role are required" });
    }

    const employee = await Employee.create({ name, role, email });
    return res.status(201).json(employee);
  } catch (err) {
    console.error("Add employee error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
};
