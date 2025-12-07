import { useEffect, useState } from "react";

export default function LandownerDashboard({ user, onLogout }) {
  const [myLands, setMyLands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    areaTotal: "",
    areaAvailable: "",
    areaUnit: "acres",
    soilType: "unknown",
    waterSource: "other",
    irrigation: "none",
    address: { street: "", city: "", state: "", pincode: "" },
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSoil, setFilterSoil] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [sortUser, setSortUser] = useState("");
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [selectedLand, setSelectedLand] = useState(null);
  const [requestData, setRequestData] = useState({
    crop: "",
    duration: "",
    message: "",
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/lands/landowner/${user.id}`);
      const data = await res.json();
      console.log("user", user);
      setMyLands(data || []);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLands = myLands
    .filter((land) =>
      land.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((land) =>
      filterSoil ? land.soilType === filterSoil : true
    )
    .filter((land) =>
      filterStatus ? land.status === filterStatus : true
    )
    .filter((land) =>
      sortUser === "my" ? land.landowner === user.id : true
    )
    .sort((a, b) => {
      if (sortOption === "title-asc") return a.title.localeCompare(b.title);
      if (sortOption === "title-desc") return b.title.localeCompare(a.title);
      if (sortOption === "area-asc") return a.area.total - b.area.total;
      if (sortOption === "area-desc") return b.area.total - a.area.total;
      return 0;
    });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [field]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddLand = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/lands", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          landowner: user.id,
          createdBy: user.id,
          location: { address: formData.address },
          area: {
            total: Number(formData.areaTotal),
            available: Number(formData.areaAvailable),
            unit: formData.areaUnit,
          },
          soilType: formData.soilType,
          waterSource: formData.waterSource,
          irrigation: formData.irrigation,
        }),
      });

      if (res.ok) {
        setShowForm(false);
        setFormData({
          title: "",
          description: "",
          areaTotal: "",
          areaAvailable: "",
          areaUnit: "acres",
          soilType: "unknown",
          waterSource: "other",
          irrigation: "none",
          address: { street: "", city: "", state: "", pincode: "" },
        });
        fetchDashboardData();
      } else {
        console.error("Failed to add land");
      }
    } catch (error) {
      console.error("Error adding land:", error);
    }
  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/land-requests/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          landId: selectedLand._id,
          userId: user.id,
          crop: requestData.crop,
          cultivationDuration: Number(requestData.duration),
          message: requestData.message,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Request submitted successfully!");
        setShowRequestForm(false);
        setRequestData({ crop: "", duration: "", message: "" });
      } else {
        alert(data.message || "Failed to submit request");
      }
    } catch (error) {
      console.error("Request Error:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-green-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600 font-medium">Loading your properties...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Hero Section with Background */}
      <div className="relative bg-cover bg-center bg-no-repeat" style={{
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2000&auto=format&fit=crop)',
        minHeight: '280px'
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center text-white">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <span className="text-5xl">🏞️</span>
              <h1 className="text-4xl md:text-5xl font-bold drop-shadow-lg">Landowner Dashboard</h1>
            </div>
            <p className="text-xl drop-shadow-md mb-2">Welcome back, {user.name}</p>
            <p className="text-lg drop-shadow-md opacity-90">Share your land, grow community</p>
          </div>
        </div>
        
        {/* Decorative wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="rgb(240 253 244)"/>
          </svg>
        </div>
      </div>

      {/* Add Land Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8 relative">
            <h2 className="text-2xl font-bold mb-6 text-green-600">Add New Land</h2>
            <form onSubmit={handleAddLand} className="space-y-4 max-h-[75vh] overflow-y-auto pr-2">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows="3"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Total Area</label>
                  <input
                    name="areaTotal"
                    type="number"
                    value={formData.areaTotal}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Available Area</label>
                  <input
                    name="areaAvailable"
                    type="number"
                    value={formData.areaAvailable}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Unit</label>
                <select
                  name="areaUnit"
                  value={formData.areaUnit}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="acres">Acres</option>
                  <option value="cent">Cent</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Soil Type</label>
                  <select
                    name="soilType"
                    value={formData.soilType}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="clay">Clay</option>
                    <option value="sandy">Sandy</option>
                    <option value="loamy">Loamy</option>
                    <option value="silty">Silty</option>
                    <option value="peaty">Peaty</option>
                    <option value="chalky">Chalky</option>
                    <option value="unknown">Unknown</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Water Source</label>
                  <select
                    name="waterSource"
                    value={formData.waterSource}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="well">Well</option>
                    <option value="borewell">Borewell</option>
                    <option value="canal">Canal</option>
                    <option value="rainwater">Rainwater</option>
                    <option value="municipal">Municipal</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Irrigation</label>
                <select
                  name="irrigation"
                  value={formData.irrigation}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="none">None</option>
                  <option value="drip">Drip</option>
                  <option value="sprinkler">Sprinkler</option>
                  <option value="flood">Flood</option>
                  <option value="manual">Manual</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Street</label>
                  <input
                    name="address.street"
                    value={formData.address.street}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">City</label>
                  <input
                    name="address.city"
                    value={formData.address.city}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">State</label>
                  <input
                    name="address.state"
                    value={formData.address.state}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Pincode</label>
                  <input
                    name="address.pincode"
                    value={formData.address.pincode}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-lg"
                >
                  Add Land
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Request Form Modal */}
      {showRequestForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-2xl w-full max-w-lg shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 text-blue-600">Request Cultivation</h2>
            <form onSubmit={handleSubmitRequest} className="space-y-4">
              <input
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Crop Name"
                required
                onChange={(e) => setRequestData({ ...requestData, crop: e.target.value })}
              />
              <input
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Duration (months)"
                required
                onChange={(e) => setRequestData({ ...requestData, duration: e.target.value })}
              />
              <textarea
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Message"
                rows="4"
                onChange={(e) => setRequestData({ ...requestData, message: e.target.value })}
              />
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRequestForm(false)}
                  className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-lg">
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Total Lands</p>
                <p className="text-4xl font-bold mt-2">{myLands.length}</p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-full p-4">
                <span className="text-3xl">🌿</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Available Lands</p>
                <p className="text-4xl font-bold mt-2">
                  {myLands.filter((land) => land.status === "available").length}
                </p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-full p-4">
                <span className="text-3xl">✅</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Allocated Lands</p>
                <p className="text-4xl font-bold mt-2">
                  {myLands.filter((land) => land.status === "allocated").length}
                </p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-full p-4">
                <span className="text-3xl">🌾</span>
              </div>
            </div>
          </div>
        </div>

        {/* My Lands Section */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="relative bg-cover bg-center" style={{
            backgroundImage: 'linear-gradient(rgba(34, 197, 94, 0.9), rgba(34, 197, 94, 0.9)), url(https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2000&auto=format&fit=crop)',
            minHeight: '140px'
          }}>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between px-6 py-6">
              <div className="flex items-center space-x-3">
                <span className="text-4xl">🏞️</span>
                <div>
                  <h2 className="text-2xl font-bold text-white">My Lands</h2>
                  <p className="text-green-100">Manage your land listings</p>
                </div>
              </div>
              <button
                onClick={() => setShowForm(true)}
                className="mt-4 md:mt-0 px-6 py-3 bg-white text-green-600 rounded-lg hover:bg-green-50 transition font-semibold shadow-lg"
              >
                + Add New Land
              </button>
            </div>
          </div>

          {/* Lands List */}
          <div className="p-6">
            {/* Search, Sort, Filter Bar */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6 bg-gray-50 p-4 rounded-xl">
              <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 flex-1">
                <input
                  type="text"
                  placeholder="🔍 Search by title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <select
                  value={filterSoil}
                  onChange={(e) => setFilterSoil(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">All Soils</option>
                  <option value="clay">Clay</option>
                  <option value="sandy">Sandy</option>
                  <option value="loamy">Loamy</option>
                  <option value="silty">Silty</option>
                  <option value="peaty">Peaty</option>
                  <option value="chalky">Chalky</option>
                </select>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">All Status</option>
                  <option value="available">Available</option>
                  <option value="allocated">Allocated</option>
                  <option value="cultivated">Cultivated</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className="flex gap-3">
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Sort By</option>
                  <option value="title-asc">Title (A → Z)</option>
                  <option value="title-desc">Title (Z → A)</option>
                  <option value="area-asc">Area (Low → High)</option>
                  <option value="area-desc">Area (High → Low)</option>
                </select>

                <select
                  value={sortUser}
                  onChange={(e) => setSortUser(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="all">All Lands</option>
                  <option value="my">My Lands</option>
                </select>
              </div>
            </div>

            {/* Land Cards */}
            {filteredLands.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-4">
                  <svg className="h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No lands found</h3>
                <p className="text-gray-500">Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredLands.map((land) => (
                  <div
                    key={land._id}
                    className="group relative rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                  >
                    {/* Card Background Image */}
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
                          <h3 className="font-bold text-xl text-white">{land.title}</h3>
                          <span
                            className={`px-3 py-1 text-xs rounded-full font-semibold shadow-lg ${
                              land.status === "available"
                                ? "bg-green-500 text-white"
                                : land.status === "allocated"
                                ? "bg-blue-500 text-white"
                                : land.status === "cancelled"
                                ? "bg-red-500 text-white"
                                : "bg-gray-500 text-white"
                            }`}
                          >
                            {land.status}
                          </span>
                        </div>
                        <p className="text-gray-200 text-sm mb-4 line-clamp-2">{land.description}</p>
                      </div>

                      <div>
                        <div className="space-y-2 bg-white/10 backdrop-blur-sm rounded-lg p-3 mb-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-300">📏 Area:</span>
                            <span className="text-white font-semibold">{land.area.total} {land.area.unit}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-300">📍 Location:</span>
                            <span className="text-white font-semibold">
                              {land.location?.address?.city}, {land.location?.address?.state}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-300">🌱 Soil:</span>
                            <span className="text-white font-semibold capitalize">{land.soilType}</span>
                          </div>
                        </div>

                        {land.status === "available" && (
                          <button
                            onClick={() => {
                              setSelectedLand(land);
                              setShowRequestForm(true);
                            }}
                            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-semibold transition shadow-lg"
                          >
                            Request Cultivation
                          </button>
                        )}

                        {land.status === "allocated" && (
                          <div className="w-full px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold text-center">
                            ✔ Allocated
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
      </div>
  );
}