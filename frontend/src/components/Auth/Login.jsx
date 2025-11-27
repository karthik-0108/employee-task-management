import { useState } from "react";
import API from "../../api";

export default function Login({ onLoginSuccess, onSwitch }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      alert("Please fill in both fields");
      return;
    }
    try {
      setLoading(true);
      const res = await API.post("/auth/login", form);

      //  Save user details
      localStorage.setItem("emp_token", res.data.token);
      localStorage.setItem("emp_role", res.data.role);
      localStorage.setItem("emp_name", res.data.name);
      localStorage.setItem("emp_email", res.data.email); // ⭐ REQUIRED for progress update

      onLoginSuccess();
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
      <h2 className="text-lg font-semibold mb-3 text-slate-800">Login</h2>

      <input
        type="email"
        placeholder="Email"
        className="w-full border border-slate-300 rounded-md px-3 py-2 mb-2 text-sm"
        value={form.email}
        onChange={(e) => handleChange("email", e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        className="w-full border border-slate-300 rounded-md px-3 py-2 mb-3 text-sm"
        value={form.password}
        onChange={(e) => handleChange("password", e.target.value)}
      />

      <button
        onClick={handleLogin}
        disabled={loading}
        className="w-full py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
      >
        {loading ? "Signing in..." : "Sign in"}
      </button>

      <p className="text-xs text-slate-500 mt-3 text-center">
        Don&apos;t have an account?{" "}
        <button
          className="text-blue-600 hover:underline"
          type="button"
          onClick={onSwitch}
        >
          Register
        </button>
      </p>
    </div>
  );
}
