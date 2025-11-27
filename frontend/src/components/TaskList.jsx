import { useEffect, useState } from "react";
import API from "../api";

const statusLabel = {
  pending: "Pending",
  accepted: "Accepted",
  rejected: "Rejected",
  "in-progress": "In progress",
  completed: "Completed"
};

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");

  const employeeEmail = localStorage.getItem("emp_email");
  const userRole = localStorage.getItem("emp_role");

  const loadTasks = async () => {
    try {
      // baseURL is http://localhost:5000/api, so this hits /api/tasks
      const res = await API.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  // Admin sees all tasks; user sees only tasks assigned to them
  const roleFiltered =
    userRole === "admin"
      ? tasks
      : tasks.filter((t) => t.employee?.email === employeeEmail);

  const filteredTasks =
    filterStatus === "all"
      ? roleFiltered
      : roleFiltered.filter((t) => t.status === filterStatus);

  const updateProgress = async (id, value) => {
    try {
      await API.patch(`/tasks/${id}/progress`, { progress: value });
      loadTasks();
    } catch (err) {
      alert("Could not update progress");
    }
  };

  const acceptTask = async (id) => {
    try {
      await API.patch(`/tasks/${id}/accept`);
      loadTasks();
    } catch (err) {
      alert("Error accepting task");
    }
  };

  const rejectTask = async (id) => {
    try {
      await API.patch(`/tasks/${id}/reject`);
      loadTasks();
    } catch (err) {
      alert("Error rejecting task");
    }
  };

  return (
    <section className="mt-6 mb-10">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold text-slate-800">Tasks</h2>
        <select
          className="border border-slate-300 rounded-md px-2 py-1 text-xs bg-white"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">All statuses</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
          <option value="in-progress">In progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="space-y-3">
        {filteredTasks.map((t) => (
          <div
            key={t.id}
            className="bg-white border border-slate-200 rounded-lg p-3"
          >
            <div className="flex items-center justify-between mb-1">
              <p className="font-medium text-slate-800">{t.title}</p>
              <span className="text-xs px-2 py-1 border border-slate-300 rounded-full">
                {statusLabel[t.status] || t.status}
              </span>
            </div>

            {t.description && (
              <p className="text-xs text-slate-600 mb-1">{t.description}</p>
            )}

            <p className="text-xs text-slate-500 mb-1">
              Assigned to: {t.employee?.name}
            </p>

            <p className="text-xs text-slate-500 mb-2">
              Progress: {t.progress || 0}%
            </p>

            {/* Employee Accept/Reject (only for their own pending tasks) */}
            {userRole === "user" &&
              t.employee &&
              t.employee.email === employeeEmail &&
              t.status === "pending" && (
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => acceptTask(t.id)}
                    className="px-3 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Accept
                  </button>

                  <button
                    onClick={() => rejectTask(t.id)}
                    className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Reject
                  </button>
                </div>
              )}

            {/* Employee Progress After Accept */}
            {userRole === "user" &&
              t.employee &&
              t.employee.email === employeeEmail &&
              t.status === "accepted" && (
                <div className="flex gap-2 mt-3">
                  {[25, 50, 75, 100].map((p) => (
                    <button
                      key={p}
                      onClick={() => updateProgress(t.id, p)}
                      className="px-2 py-1 text-xs border border-blue-500 text-blue-600 rounded hover:bg-blue-100"
                    >
                      {p}%
                    </button>
                  ))}
                </div>
              )}
          </div>
        ))}

        {filteredTasks.length === 0 && (
          <p className="text-xs text-slate-500">No tasks found.</p>
        )}
      </div>
    </section>
  );
}
