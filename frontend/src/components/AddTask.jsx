import { useEffect, useState } from "react";
import API from "../api";

export default function AddTask() {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    employeeId: ""
  });
  const [saving, setSaving] = useState(false);

  const role = localStorage.getItem("emp_role");

  // Hide this whole component for non-admin users
  if (role !== "admin") {
    return null;
  }

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        // baseURL already /api, so this hits /api/employees
        const res = await API.get("/employees");
        setEmployees(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    loadEmployees();
  }, []);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!form.title || !form.employeeId) {
      alert("Title and employee are required");
      return;
    }
    try {
      setSaving(true);
      // baseURL /api → POST /api/tasks
      await API.post("/tasks", form);
      alert("Task assigned successfully.");
      setForm({ title: "", description: "", employeeId: "" });
    } catch (err) {
      alert(err.response?.data?.message || "Could not assign task");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="mb-5">
      <h2 className="text-lg font-semibold mb-2 text-slate-800">
        Assign Task
      </h2>

      <div className="bg-white border border-slate-200 rounded-lg p-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            placeholder="Task Title"
            className="border border-slate-300 rounded-md px-3 py-2 text-sm"
            value={form.title}
            onChange={(e) => handleChange("title", e.target.value)}
          />

          <select
            className="border border-slate-300 rounded-md px-3 py-2 text-sm bg-white"
            value={form.employeeId}
            onChange={(e) => handleChange("employeeId", e.target.value)}
          >
            <option value="">Select Employee</option>
            {employees.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name} ({e.role})
              </option>
            ))}
          </select>
        </div>

        <textarea
          placeholder="Task Description (optional)"
          className="border border-slate-300 rounded-md px-3 py-2 text-sm w-full mt-3 min-h-[60px]"
          value={form.description}
          onChange={(e) => handleChange("description", e.target.value)}
        />

        <div className="mt-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white 
                       hover:bg-blue-700 disabled:opacity-60"
          >
            {saving ? "Assigning..." : "Assign Task"}
          </button>
        </div>
      </div>
    </section>
  );
}
