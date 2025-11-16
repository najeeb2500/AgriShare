import axios from "axios";
import {
  Edit,
  Loader2,
  Search,
  Trash2,
  X
} from "lucide-react";
import { useEffect, useState } from "react";

export default function LandManagement() {
  const [lands, setLands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingLand, setEditingLand] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    area: { total: "", unit: "acres", available: "" },
    location: { address: { city: "", state: "" } },
    soilType: "unknown",
  });
  const [showRequests, setShowRequests] = useState(false);
const [requests, setRequests] = useState([]);


  const BASE_URL = "http://localhost:5000/api/lands"; // update as needed

  // 🔹 Fetch all available lands
  const fetchLands = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/available`);
      setLands(res.data.lands || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRequests = async () => {
  try {
    const res = await axios.get("http://localhost:5000/api/land-requests/all");
    setRequests(res.data || []);
    setShowRequests(true);
  } catch (err) {
    console.error(err);
    alert("Failed to load requests");
  }
};


  useEffect(() => {
    fetchLands();
    fetchRequests()
  }, []);

  // 🔹 Handle input
  const handleInputChange = (path, value) => {
    const parts = path.split(".");
    setFormData((prev) => {
      const updated = { ...prev };
      let current = updated;
      for (let i = 0; i < parts.length - 1; i++) {
        current = current[parts[i]];
      }
      current[parts[parts.length - 1]] = value;
      return updated;
    });
  };

  // 🔹 Open form (Add or Edit)
  const openForm = (land = null) => {
    if (land) {
      setEditingLand(land);
      setFormData(land);
    } else {
      setEditingLand(null);
      setFormData({
        title: "",
        description: "",
        area: { total: "", unit: "acres", available: "" },
        location: { address: { city: "", state: "" } },
        soilType: "unknown",
      });
    }
    setShowForm(true);
  };

  // 🔹 Create or Update Land
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingLand) {
        // Update
        const res = await axios.put(`${BASE_URL}/${editingLand._id}`, formData);
        alert(res.data.message || "Land updated successfully");
      } else {
        // Create
        const res = await axios.post(BASE_URL, {
          ...formData,
          createdBy: "landowner123",
          landowner: "landowner123",
        });
        alert(res.data.message || "Land created successfully");
      }
      setShowForm(false);
      fetchLands();
    } catch (err) {
      alert(err.response?.data?.message || "Error saving land");
    }
  };

  // 🔹 Delete land
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this land?")) return;
    try {
      await axios.delete(`${BASE_URL}/${id}`);
      fetchLands();
    } catch (err) {
      console.error(err);
    }
  };


  const approveRequest = async (id) => {
  try {
    await axios.put(`http://localhost:5000/api/land-requests/approve/${id}`, {
      adminId: "admin123",
    });
    alert("Request approved");
    fetchRequests();
    fetchLands();
  } catch (err) {
    console.error(err);
  }
};

const rejectRequest = async (id) => {
  try {
    await axios.put(`http://localhost:5000/api/land-requests/reject/${id}`, {
      adminId: "admin123",
    });
    alert("Request rejected");
    fetchRequests();
  } catch (err) {
    console.error(err);
  }
};


  // 🔹 Filter & Sort
  const filteredLands = lands
    .filter((l) => l.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter((l) => (filterStatus ? l.status === filterStatus : true))
    .sort((a, b) => {
      if (sortOption === "title-asc") return a.title.localeCompare(b.title);
      if (sortOption === "title-desc") return b.title.localeCompare(a.title);
      if (sortOption === "area-asc") return a.area.total - b.area.total;
      if (sortOption === "area-desc") return b.area.total - a.area.total;
      return 0;
    });

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-green-700">🌾 Land Management</h1>
          <p className="text-gray-600 text-sm">Manage, edit, and allocate lands.</p>
        </div>
        {/* <button
          onClick={() => openForm()}
          className="mt-3 md:mt-0 flex items-center gap-2 px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <Plus className="w-4 h-4" /> Add New Land
        </button> */}
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex gap-2 items-center flex-1">
          <Search className="text-gray-500" />
          <input
            type="text"
            placeholder="Search land..."
            className="border px-3 py-2 rounded-lg flex-1"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
  onClick={() => fetchRequests()}
  className="mt-3 md:mt-0 flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
>
  View Requests
</button>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border px-3 py-2 rounded-lg"
          >
            <option value="">All Status</option>
            <option value="available">Available</option>
            <option value="allocated">Allocated</option>
          </select>
        </div>
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="border px-3 py-2 rounded-lg"
        >
          <option value="">Sort By</option>
          <option value="title-asc">Title A → Z</option>
          <option value="title-desc">Title Z → A</option>
          <option value="area-asc">Area ↑</option>
          <option value="area-desc">Area ↓</option>
        </select>
      </div>

      {/* Land Cards */}
      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin text-green-600 w-8 h-8" />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLands.map((land) => (
            <div
              key={land._id}
              className="bg-white border rounded-xl p-4 hover:shadow-md transition"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-gray-900">{land.title}</h3>
                <span
                  className={`px-2 py-1 text-xs rounded ${
                    land.status === "available"
                      ? "bg-green-100 text-green-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {land.status}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-3">{land.description}</p>
              <p className="text-xs text-gray-500">
                📍 {land.location?.address?.city}, {land.location?.address?.state}
              </p>
              <p className="text-xs text-gray-500">
                🌱 {land.soilType} | {land.area.total} {land.area.unit}
              </p>
              <div className="flex justify-end gap-3 mt-3">
                <button
                  onClick={() => openForm(land)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(land._id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Popup Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 relative">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-semibold mb-4 text-green-700">
              {editingLand ? "Edit Land" : "Add New Land"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="Title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className="border w-full px-3 py-2 rounded-lg"
                required
              />
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                className="border w-full px-3 py-2 rounded-lg"
                required
              />
              <input
                type="text"
                placeholder="City"
                value={formData.location.address.city}
                onChange={(e) =>
                  handleInputChange("location.address.city", e.target.value)
                }
                className="border w-full px-3 py-2 rounded-lg"
              />
              <input
                type="text"
                placeholder="State"
                value={formData.location.address.state}
                onChange={(e) =>
                  handleInputChange("location.address.state", e.target.value)
                }
                className="border w-full px-3 py-2 rounded-lg"
              />
              <input
                type="number"
                placeholder="Total Area"
                value={formData.area.total}
                onChange={(e) => handleInputChange("area.total", e.target.value)}
                className="border w-full px-3 py-2 rounded-lg"
              />
              <select
                value={formData.soilType}
                onChange={(e) => handleInputChange("soilType", e.target.value)}
                className="border w-full px-3 py-2 rounded-lg"
              >
                <option value="unknown">Soil Type</option>
                <option value="clay">Clay</option>
                <option value="sandy">Sandy</option>
                <option value="loamy">Loamy</option>
                <option value="silty">Silty</option>
                <option value="peaty">Peaty</option>
                <option value="chalky">Chalky</option>
              </select>

              <button
                type="submit"
                className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                {editingLand ? "Update Land" : "Add Land"}
              </button>
            </form>
          </div>
        </div>
      )}

      {showRequests && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white w-full max-w-3xl p-6 rounded-xl relative">
      <button
        onClick={() => setShowRequests(false)}
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
      >
        <X className="w-5 h-5" />
      </button>

      <h2 className="text-xl font-bold mb-4 text-blue-700">Cultivation Requests</h2>

      {requests.length === 0 ? (
        <p className="text-gray-600">No requests found.</p>
      ) : (
        <div className="space-y-4 max-h-[400px] overflow-y-auto">
          {requests.map((req) => (
            <div key={req._id} className="border p-4 rounded-lg shadow-sm bg-gray-50">
              <h3 className="font-semibold">{req.crop}</h3>
              <p className="text-sm text-gray-600">
                User: {req.userId} <br />
                Land: {req.landId} <br />
                Duration: {req.cultivationDuration} months
              </p>
              <p className="mt-2 text-xs text-gray-500 italic">{req.message}</p>

              <div className="flex gap-3 mt-3 justify-end">
                <button
                  onClick={() => approveRequest(req._id)}
                  className="px-3 py-1 rounded bg-green-600 text-white"
                >
                  Approve
                </button>
                <button
                  onClick={() => rejectRequest(req._id)}
                  className="px-3 py-1 rounded bg-red-600 text-white"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
)}

    </div>
  );
}
