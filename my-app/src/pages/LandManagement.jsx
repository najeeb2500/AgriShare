import axios from "axios";
import {
  Edit,
  Loader2,
  Search,
  Trash2,
  Users,
  X
} from "lucide-react";
import { useEffect, useState } from "react";
import AllocateResources from "../components/AllocateResources";

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
  const [showAllocateModal, setShowAllocateModal] = useState(false);
  const [selectedLandForAllocation, setSelectedLandForAllocation] = useState(null);

  const BASE_URL = "http://localhost:5000/api/lands";

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
      console.log("data", res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load requests");
    }
  };

  useEffect(() => {
    fetchLands();
    fetchRequests();
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingLand) {
        const res = await axios.put(`${BASE_URL}/${editingLand._id}`, formData);
        alert(res.data.message || "Land updated successfully");
      } else {
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Hero Section with Background */}
      <div className="relative bg-cover bg-center bg-no-repeat" style={{
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2000&auto=format&fit=crop)',
        minHeight: '250px'
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center text-white">
            <div className="flex items-center justify-center space-x-3 mb-3">
              <span className="text-5xl">🌾</span>
              <h1 className="text-4xl md:text-5xl font-bold drop-shadow-lg">Land Management</h1>
            </div>
            <p className="text-lg drop-shadow-md opacity-90">Manage, edit, and allocate lands efficiently</p>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="rgb(240 253 244)"/>
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-8">
        {/* Search + Filter Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex gap-3 items-center flex-1">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search lands..."
                  className="border border-gray-300 pl-10 pr-4 py-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button
                onClick={() => fetchRequests()}
                className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium shadow-lg transition transform hover:scale-105"
              >
                📋 View Requests
              </button>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">All Status</option>
                <option value="available">Available</option>
                <option value="allocated">Allocated</option>
              </select>
            </div>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Sort By</option>
              <option value="title-asc">Title A → Z</option>
              <option value="title-desc">Title Z → A</option>
              <option value="area-asc">Area ↑</option>
              <option value="area-desc">Area ↓</option>
            </select>
          </div>
        </div>

        {/* Land Cards */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-green-600 w-16 h-16 mb-4" />
            <p className="text-gray-600 font-medium">Loading lands...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLands.map((land) => (
              <div
                key={land._id}
                className="group relative rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                {/* Card Background */}
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: 'url(https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=800&auto=format&fit=crop)'
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent"></div>
                </div>

                {/* Card Content */}
                <div className="relative p-6 min-h-[320px] flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-bold text-xl text-white pr-2">{land.title}</h3>
                      <span
                        className={`px-3 py-1 text-xs rounded-full font-semibold shadow-lg ${
                          land.status === "available"
                            ? "bg-green-500 text-white"
                            : "bg-blue-500 text-white"
                        }`}
                      >
                        {land.status}
                      </span>
                    </div>
                    <p className="text-gray-200 text-sm mb-4 line-clamp-2">{land.description}</p>
                    
                    <div className="space-y-2 bg-white/10 backdrop-blur-sm rounded-lg p-3 mb-3">
                      <p className="text-sm text-gray-200 flex items-center">
                        <span className="mr-2">📍</span>
                        {land.location?.address?.city}, {land.location?.address?.state}
                      </p>
                      <p className="text-sm text-gray-200 flex items-center">
                        <span className="mr-2">🌱</span>
                        {land.soilType} | {land.area.total} {land.area.unit}
                      </p>
                    </div>
                    
                    {/* Allocated Resources */}
                    {land.status === "allocated" && land.allocatedTo && (
                      <div className="bg-blue-500/90 backdrop-blur-sm rounded-lg p-3 space-y-1">
                        <p className="text-xs font-bold text-white mb-1">📍 Allocated To:</p>
                        {land.allocatedTo.gardener && (
                          <p className="text-xs text-white">👨‍🌾 Gardener: {land.allocatedTo.gardener?.name || 'Unknown'}</p>
                        )}
                        {land.allocatedTo.volunteer && (
                          <p className="text-xs text-white">🙋 Volunteer: {land.allocatedTo.volunteer?.name || 'Unknown'}</p>
                        )}
                        {land.allocatedTo.expert && (
                          <p className="text-xs text-white">🎓 Expert: {land.allocatedTo.expert?.name || 'Unknown'}</p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-3 mt-4">
                    <button
                      onClick={() => {
                        setSelectedLandForAllocation(land);
                        setShowAllocateModal(true);
                      }}
                      className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-lg"
                      title="Allocate resources"
                    >
                      <Users className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => openForm(land)}
                      className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-lg"
                      title="Edit"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(land._id)}
                      className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition shadow-lg"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit/Add Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 relative">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold mb-6 text-green-700">
              {editingLand ? "✏️ Edit Land" : "➕ Add New Land"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className="border border-gray-300 w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                className="border border-gray-300 w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                rows="3"
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="City"
                  value={formData.location.address.city}
                  onChange={(e) => handleInputChange("location.address.city", e.target.value)}
                  className="border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <input
                  type="text"
                  placeholder="State"
                  value={formData.location.address.state}
                  onChange={(e) => handleInputChange("location.address.state", e.target.value)}
                  className="border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <input
                type="number"
                placeholder="Total Area"
                value={formData.area.total}
                onChange={(e) => handleInputChange("area.total", e.target.value)}
                className="border border-gray-300 w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <select
                value={formData.soilType}
                onChange={(e) => handleInputChange("soilType", e.target.value)}
                className="border border-gray-300 w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="unknown">Select Soil Type</option>
                <option value="clay">Clay</option>
                <option value="sandy">Sandy</option>
                <option value="loamy">Loamy</option>
                <option value="silty">Silty</option>
                <option value="peaty">Peaty</option>
                <option value="chalky">Chalky</option>
              </select>

              <button
                type="submit"
                className="w-full py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 font-semibold shadow-lg transition"
              >
                {editingLand ? "Update Land" : "Add Land"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Requests Modal */}
      {showRequests && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-4xl p-8 rounded-2xl shadow-2xl relative max-h-[80vh] overflow-hidden flex flex-col">
            <button
              onClick={() => setShowRequests(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold mb-6 text-blue-700">📋 Cultivation Requests</h2>

            <div className="overflow-y-auto flex-1">
              {requests.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No requests found.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {requests.map((req) => (
                    <div
                      key={req._id}
                      className="border-l-4 border-blue-500 bg-gradient-to-r from-blue-50 to-white rounded-lg p-6 shadow-md hover:shadow-lg transition"
                    >
                      <h3 className="font-bold text-lg text-gray-900 mb-2">🌱 {req.crop}</h3>

                      <div className="space-y-1 mb-3">
                        <p className="text-sm text-gray-700">
                          <span className="font-semibold">👤 User:</span> {req?.userId?.name || "Unknown User"}
                        </p>
                        <p className="text-sm text-gray-700">
                          <span className="font-semibold">🌾 Land:</span> {req?.landId?.title || "Unnamed Land"} (
                          {req?.landId?.location?.address?.city || "Unknown City"}, {req?.landId?.location?.address?.state || "Unknown State"})
                        </p>
                        <p className="text-sm text-gray-700">
                          <span className="font-semibold">⏳ Duration:</span> {req.cultivationDuration} months
                        </p>
                      </div>

                      {req.message && (
                        <p className="text-sm text-gray-600 italic bg-gray-50 p-3 rounded-lg mb-4">
                          "{req.message}"
                        </p>
                      )}

                      <div className="flex gap-3 justify-end">
                        <button
                          onClick={() => approveRequest(req._id)}
                          className="px-5 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 font-semibold shadow-lg transition"
                        >
                          ✓ Approve
                        </button>
                        <button
                          onClick={() => rejectRequest(req._id)}
                          className="px-5 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 font-semibold shadow-lg transition"
                        >
                          ✗ Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Allocate Resources Modal */}
      {showAllocateModal && selectedLandForAllocation && (
        <AllocateResources
          landId={selectedLandForAllocation._id}
          onClose={() => {
            setShowAllocateModal(false);
            setSelectedLandForAllocation(null);
          }}
          onSuccess={() => {
            fetchLands();
          }}
        />
      )}
    </div>
  );
}