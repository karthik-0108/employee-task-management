import { useEffect, useState } from "react";
import API from "../api";

export default function EmployeeList({ role }) {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await API.get("/employees");
        setEmployees(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, []);

  return (
    <section className="mt-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold text-slate-800">
          Employees
        </h2>
        <p className="text-xs text-slate-500">
          Showing {employees.length} employees
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {employees.map((e) => (
          <div
            key={e.id}
            className="bg-white border border-slate-200 rounded-lg p-3"
          >
            <p className="font-medium text-slate-800">{e.name}</p>
            <p className="text-xs text-slate-500 mb-1">{e.role}</p>
            {e.email && (
              <p className="text-xs text-slate-500 mb-1">{e.email}</p>
            )}
            <p className="text-xs text-slate-500">
              Tasks: {e.taskCount}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
