import { useState, useEffect } from "react";
import Dashboard from "./components/Dashboard";
import EmployeeList from "./components/EmployeeList";
import TaskList from "./components/TaskList";
import AddTask from "./components/AddTask";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("emp_token")
  );
  const [showRegister, setShowRegister] = useState(false);
  const [role, setRole] = useState(localStorage.getItem("emp_role") || "");
  const [name, setName] = useState(localStorage.getItem("emp_name") || "");

  useEffect(() => {
    setRole(localStorage.getItem("emp_role") || "");
    setName(localStorage.getItem("emp_name") || "");
  }, [isAuthenticated]);

  const handleLogout = () => {
    localStorage.removeItem("emp_token");
    localStorage.removeItem("emp_role");
    localStorage.removeItem("emp_name");
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-semibold text-center mb-4 text-slate-800">
            Emp-Manage
          </h1>
          {showRegister ? (
            <Register onSwitch={() => setShowRegister(false)} />
          ) : (
            <Login
              onLoginSuccess={() => setIsAuthenticated(true)}
              onSwitch={() => setShowRegister(true)}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-800">Emp-Manage</h1>
            <p className="text-sm text-slate-500">
              Signed in as {name || "User"} ({role})
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm px-3 py-1 border border-slate-300 rounded-md hover:bg-slate-100"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        <Dashboard />
        {role === "admin" && <AddTask />}
        <EmployeeList role={role} />
        <TaskList />
      </main>
    </div>
  );
}
