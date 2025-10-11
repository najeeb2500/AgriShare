import React, { useState } from "react";

// CreateUser.jsx
// Single-file React component using Tailwind CSS.
// Usage: import CreateUser from './CreateUser'; then render <CreateUser />

export default function Signup() {
  const [form, setForm] = useState({ name: "", role: "farmer", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const roles = [
    { value: "farmer", label: "Farmer" },
    { value: "volunteer", label: "Volunteer" },
    { value: "admin", label: "Admin" }
  ];

  const handleChange = (e) => {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    if (!form.name.trim()) return "Name is required";
    if (!form.email.trim()) return "Email is required";
    // simple email check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return "Enter a valid email";
    if (!form.password || form.password.length < 6) return "Password must be at least 6 characters";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const err = validate();
    if (err) return setError(err);

    setLoading(true);
    try {
      // Adjust the endpoint if your server expects a different path
      const res = await fetch("http://localhost:5000/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create user");

      setSuccess(data.message || "User created successfully");
      setForm({ name: "", role: "farmer", email: "", password: "" });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-12 p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">Create User</h2>

      {error && (
        <div className="mb-4 text-sm text-red-700 bg-red-100 p-3 rounded">{error}</div>
      )}
      {success && (
        <div className="mb-4 text-sm text-green-800 bg-green-100 p-3 rounded">{success}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Full name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200"
            placeholder="e.g. Najeeb Khan"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Role</label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200"
          >
            {roles.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            type="email"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            name="password"
            value={form.password}
            onChange={handleChange}
            type="password"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200"
            placeholder="At least 6 characters"
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-60"
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
              </svg>
            ) : (
              "Create user"
            )}
          </button>

          <button
            type="button"
            onClick={() => setForm({ name: "", role: "farmer", email: "", password: "" })}
            className="px-3 py-2 border rounded-lg hover:bg-gray-50"
          >
            Reset
          </button>
        </div>
      </form>

      <p className="mt-4 text-xs text-gray-500">Passwords are sent to the server — make sure your server hashes them before saving.</p>
    </div>
  );
}
