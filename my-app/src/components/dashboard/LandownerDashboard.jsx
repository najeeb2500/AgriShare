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

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/lands/landowner/${user.id}`);
      const data = await res.json();
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
    

      {/* Add Land Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative">
            <h2 className="text-xl font-bold mb-4">Add New Land</h2>
            <form onSubmit={handleAddLand} className="space-y-4 max-h-[75vh] overflow-y-auto pr-2">
              <div>
                <label className="block text-sm font-medium">Title</label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full border rounded p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  className="w-full border rounded p-2"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">Total Area</label>
                  <input
                    name="areaTotal"
                    type="number"
                    value={formData.areaTotal}
                    onChange={handleInputChange}
                    required
                    className="w-full border rounded p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Available Area</label>
                  <input
                    name="areaAvailable"
                    type="number"
                    value={formData.areaAvailable}
                    onChange={handleInputChange}
                    required
                    className="w-full border rounded p-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium">Unit</label>
                <select
                  name="areaUnit"
                  value={formData.areaUnit}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2"
                >
                  <option value="acres">Acres</option>
                  <option value="cent">Cent</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">Soil Type</label>
                  <select
                    name="soilType"
                    value={formData.soilType}
                    onChange={handleInputChange}
                    className="w-full border rounded p-2"
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
                  <label className="block text-sm font-medium">Water Source</label>
                  <select
                    name="waterSource"
                    value={formData.waterSource}
                    onChange={handleInputChange}
                    className="w-full border rounded p-2"
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
                <label className="block text-sm font-medium">Irrigation</label>
                <select
                  name="irrigation"
                  value={formData.irrigation}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2"
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
                  <label className="block text-sm font-medium">Street</label>
                  <input
                    name="address.street"
                    value={formData.address.street}
                    onChange={handleInputChange}
                    className="w-full border rounded p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">City</label>
                  <input
                    name="address.city"
                    value={formData.address.city}
                    onChange={handleInputChange}
                    className="w-full border rounded p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">State</label>
                  <input
                    name="address.state"
                    value={formData.address.state}
                    onChange={handleInputChange}
                    className="w-full border rounded p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Pincode</label>
                  <input
                    name="address.pincode"
                    value={formData.address.pincode}
                    onChange={handleInputChange}
                    className="w-full border rounded p-2"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Add Land
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dashboard Stats & Lands */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                🌿
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Lands</p>
                <p className="text-2xl font-semibold text-gray-900">{myLands.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">✅</div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Available Lands</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {myLands.filter((land) => land.status === "available").length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">🌾</div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Allocated Lands</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {myLands.filter((land) => land.status === "allocated").length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* My Lands Section */}
        <div className="bg-white rounded-lg shadow">
  {/* Header Row */}
  <div className="flex flex-col md:flex-row md:items-center md:justify-between px-6 py-4 border-b border-gray-200">
    <div>
      <h2 className="text-lg font-semibold text-gray-900">My Lands</h2>
      <p className="text-sm text-gray-600">Manage your land listings</p>
    </div>
    <button
      onClick={() => setShowForm(true)}
      className="mt-3 md:mt-0 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
    >
      Add New Land
    </button>
  </div>

  {/* Lands List */}
 <div className="p-6">
  {/* 🔍 Search, Sort, Filter Bar */}
  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
    <div className="flex-1 flex items-center gap-2">
      <input
        type="text"
        placeholder="Search by title..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full md:w-64 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
      />
      <select
        value={filterSoil}
        onChange={(e) => setFilterSoil(e.target.value)}
        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
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
        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        <option value="">All Status</option>
        <option value="available">Available</option>
        <option value="allocated">Allocated</option>
        <option value="unavailable">Unavailable</option>
      </select>
    </div>

    <div>
      <select
        value={sortOption}
        onChange={(e) => setSortOption(e.target.value)}
        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        <option value="">Sort By</option>
        <option value="title-asc">Title (A → Z)</option>
        <option value="title-desc">Title (Z → A)</option>
        <option value="area-asc">Area (Low → High)</option>
        <option value="area-desc">Area (High → Low)</option>
      </select>
    </div>
  </div>

  {/* 🪴 Land Cards */}
  {filteredLands.length === 0 ? (
    <div className="text-center py-8 text-gray-600">
      No lands match your search/filter.
    </div>
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredLands.map((land) => (
        <div
          key={land._id}
          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-gray-900">{land.title}</h3>
            <span
              className={`px-2 py-1 text-xs rounded ${
                land.status === "available"
                  ? "bg-green-100 text-green-800"
                  : land.status === "allocated"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {land.status}
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-3">{land.description}</p>

          <div className="text-xs text-gray-500 space-y-1">
            <p>
              Area: {land.area.total} {land.area.unit}
            </p>
            <p>
              Location: {land.location?.address?.city},{" "}
              {land.location?.address?.state}
            </p>
            <p>Soil Type: {land.soilType}</p>
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
