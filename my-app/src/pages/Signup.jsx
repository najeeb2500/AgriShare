import { useState } from "react";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    role: "gardener",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const roles = [
    { value: "gardener", label: "Gardener" },
    { value: "volunteer", label: "Volunteer" },
    { value: "landowner", label: "Landowner" },
    { value: "expert", label: "Expert" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const validate = () => {
    if (!form.name.trim()) return "Name is required";
    if (!form.email.trim()) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      return "Enter a valid email";
    if (!form.password || form.password.length < 6)
      return "Password must be at least 6 characters";
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
      const res = await fetch("http://localhost:5000/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create user");

      setSuccess(data.message || "User created successfully");
      setForm({
        name: "",
        role: "gardener",
        email: "",
        password: "",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-3xl font-bold mb-6 text-center text-green-600">
        Join AgriShare
      </h2>

      {error && (
        <div className="mb-4 text-sm text-red-700 bg-red-100 p-3 rounded">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 text-sm text-green-800 bg-green-100 p-3 rounded">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1">Full Name *</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
            placeholder="e.g. John Doe"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email *</label>
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            type="email"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
            placeholder="you@example.com"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Password *</label>
          <input
            name="password"
            value={form.password}
            onChange={handleChange}
            type="password"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
            placeholder="At least 6 characters"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Role *</label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
            required
          >
            {roles.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-between pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-60 font-medium"
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                ></path>
              </svg>
            ) : (
              "Create Account"
            )}
          </button>

          <button
            type="button"
            onClick={() =>
              setForm({ name: "", role: "gardener", email: "", password: "" })
            }
            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            Reset
          </button>
        </div>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Already have an account?{" "}
        <a href="/login" className="text-green-600 hover:underline">
          Login here
        </a>
      </p>
    </div>
  );
}
