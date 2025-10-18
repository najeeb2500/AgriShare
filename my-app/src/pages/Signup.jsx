import React, { useState } from "react";

// CreateUser.jsx
// Single-file React component using Tailwind CSS.
// Usage: import CreateUser from './CreateUser'; then render <CreateUser />

export default function Signup() {
  const [form, setForm] = useState({ 
    name: "", 
    role: "gardener", 
    email: "", 
    password: "",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      pincode: ""
    },
    bio: "",
    experience: "",
    skills: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [skillInput, setSkillInput] = useState("");

  const roles = [
    { value: "gardener", label: "Gardener" },
    { value: "volunteer", label: "Volunteer" },
    { value: "landowner", label: "Landowner"},
    { value: "expert", label: "Expert"},
    { value: "admin", label: "Admin" }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setForm((s) => ({ 
        ...s, 
        address: { ...s.address, [addressField]: value } 
      }));
    } else {
      setForm((s) => ({ ...s, [name]: value }));
    }
  };

  const addSkill = () => {
    if (skillInput.trim() && !form.skills.includes(skillInput.trim())) {
      setForm((s) => ({ ...s, skills: [...s.skills, skillInput.trim()] }));
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove) => {
    setForm((s) => ({ ...s, skills: s.skills.filter(skill => skill !== skillToRemove) }));
  };

  const validate = () => {
    if (!form.name.trim()) return "Name is required";
    if (!form.email.trim()) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return "Enter a valid email";
    if (!form.password || form.password.length < 6) return "Password must be at least 6 characters";
    if (!form.phone.trim()) return "Phone number is required";
    if (!form.address.city.trim()) return "City is required";
    if (!form.address.state.trim()) return "State is required";
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
        body: JSON.stringify(form)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create user");

      setSuccess(data.message || "User created successfully");
      setForm({ 
        name: "", 
        role: "gardener", 
        email: "", 
        password: "",
        phone: "",
        address: { street: "", city: "", state: "", pincode: "" },
        bio: "",
        experience: "",
        skills: []
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-3xl font-bold mb-6 text-center text-green-600">Join AgriShare</h2>

      {error && (
        <div className="mb-4 text-sm text-red-700 bg-red-100 p-3 rounded">{error}</div>
      )}
      {success && (
        <div className="mb-4 text-sm text-green-800 bg-green-100 p-3 rounded">{success}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <label className="block text-sm font-medium mb-1">Phone *</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              type="tel"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
              placeholder="+91 9876543210"
              required
            />
          </div>
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

        {/* Address Information */}
        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Address Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Street Address</label>
              <input
                name="address.street"
                value={form.address.street}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
                placeholder="123 Main Street"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">City *</label>
              <input
                name="address.city"
                value={form.address.city}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
                placeholder="Mumbai"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">State *</label>
              <input
                name="address.state"
                value={form.address.state}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
                placeholder="Maharashtra"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Pincode</label>
              <input
                name="address.pincode"
                value={form.address.pincode}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
                placeholder="400001"
              />
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Additional Information</h3>
          <div>
            <label className="block text-sm font-medium mb-1">Bio</label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
              placeholder="Tell us about yourself..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Experience</label>
            <textarea
              name="experience"
              value={form.experience}
              onChange={handleChange}
              rows={2}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
              placeholder="Your relevant experience..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Skills</label>
            <div className="flex gap-2 mb-2">
              <input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
                placeholder="Add a skill and press Enter"
              />
              <button
                type="button"
                onClick={addSkill}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.skills.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="text-green-600 hover:text-green-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
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
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
              </svg>
            ) : (
              "Create Account"
            )}
          </button>

          <button
            type="button"
            onClick={() => setForm({ 
              name: "", 
              role: "gardener", 
              email: "", 
              password: "",
              phone: "",
              address: { street: "", city: "", state: "", pincode: "" },
              bio: "",
              experience: "",
              skills: []
            })}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            Reset
          </button>
        </div>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Already have an account? <a href="/login" className="text-green-600 hover:underline">Login here</a>
      </p>
    </div>
  );
}
