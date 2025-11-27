import { useEffect, useState } from "react";
import API from "../api";

export default function Dashboard() {
  const [data, setData] = useState({
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    completionRate: 0
  });

  useEffect(() => {
    const load = async () => {
      try {
        const res = await API.get("/dashboard");
        setData(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, []);

  return (
    <section className="mb-6">
      <h2 className="text-lg font-semibold mb-3 text-slate-800">Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white border border-slate-200 rounded-lg p-3">
          <p className="text-xs text-slate-500">Total tasks</p>
          <p className="text-xl font-semibold text-slate-800">
            {data.totalTasks}
          </p>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-3">
          <p className="text-xs text-slate-500">Completed</p>
          <p className="text-xl font-semibold text-slate-800">
            {data.completedTasks}
          </p>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-3">
          <p className="text-xs text-slate-500">Completion rate</p>
          <p className="text-xl font-semibold text-slate-800">
            {data.completionRate}%
          </p>
        </div>
      </div>
    </section>
  );
}
