import { useState } from "react";
import API from "../../api";

export default function Register({ onSwitch }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user"
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleRegister = async () => {
    if (!form.name || !form.email || !form.password) {
      alert("Please fill in all fields");
      return;
    }
    try {
      setLoading(true);
      await API.post("/auth/register", form);
      alert("Registration successful. You can now log in.");
      onSwitch();
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
      <h2 className="text-lg font-semibold mb-3 text-slate-800">Register</h2>

      <input
        placeholder="Name"
        className="w-full border border-slate-300 rounded-md px-3 py-2 mb-2 text-sm"
        value={form.name}
        onChange={(e) => handleChange("name", e.target.value)}
      />

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
        className="w-full border border-slate-300 rounded-md px-3 py-2 mb-2 text-sm"
        value={form.password}
        onChange={(e) => handleChange("password", e.target.value)}
      />

      <select
        className="w-full border border-slate-300 rounded-md px-3 py-2 mb-3 text-sm bg-white"
        value={form.role}
        onChange={(e) => handleChange("role", e.target.value)}
      >
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>

      <button
        onClick={handleRegister}
        disabled={loading}
        className="w-full py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
      >
        {loading ? "Registering..." : "Register"}
      </button>

      <p className="text-xs text-slate-500 mt-3 text-center">
        Already have an account?{" "}
        <button
          className="text-blue-600 hover:underline"
          type="button"
          onClick={onSwitch}
        >
          Login
        </button>
      </p>
    </div>
  );
}
