import { AlertCircle, CheckCircle, Plus, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function AllocateResources({ landId, onClose, onSuccess }) {
  const [gardeners, setGardeners] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [experts, setExperts] = useState([]);
  const [selectedGardeners, setSelectedGardeners] = useState([]);
  const [selectedVolunteer, setSelectedVolunteer] = useState('');
  const [selectedExpert, setSelectedExpert] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [usersLoading, setUsersLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setUsersLoading(true);
      const token = localStorage.getItem('token');
      
      const res = await fetch('http://localhost:5000/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error('Failed to fetch users');
      const data = await res.json();
      
      const users = data.users || data || [];
      
      setGardeners(users.filter(u => u.role === 'gardener'));
      setVolunteers(users.filter(u => u.role === 'volunteer'));
      setExperts(users.filter(u => u.role === 'expert'));
    } catch (err) {
      setError('Failed to load users');
      console.error(err);
    } finally {
      setUsersLoading(false);
    }
  };

  const handleAddGardener = (gardenerId) => {
    if (!selectedGardeners.includes(gardenerId)) {
      setSelectedGardeners([...selectedGardeners, gardenerId]);
    }
  };

  const handleRemoveGardener = (gardenerId) => {
    setSelectedGardeners(selectedGardeners.filter(id => id !== gardenerId));
  };

  const handleAllocate = async () => {
    try {
      if (selectedGardeners.length === 0) {
        setError('Please select at least one gardener');
        return;
      }

      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');

      const res = await fetch(`http://localhost:5000/api/lands/allocate/all/${landId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          gardenerIds: selectedGardeners,
          volunteerId: selectedVolunteer || null,
          expertId: selectedExpert || null,
          adminId: user._id
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to allocate resources');
      }

      setSuccess('Resources allocated successfully!');
      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to allocate resources');
    } finally {
      setLoading(false);
    }
  };

  const getSelectedGardenersInfo = () => {
    return selectedGardeners.map(id => 
      gardeners.find(g => g._id === id)
    ).filter(Boolean);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Allocate Resources to Land</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Alert Messages */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
              <AlertCircle size={20} />
              {error}
            </div>
          )}

          {success && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700">
              <CheckCircle size={20} />
              {success}
            </div>
          )}

          {usersLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading users...</p>
            </div>
          ) : (
            <>
              {/* Gardeners Section */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Select Gardeners (Multiple) *
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
                  {gardeners.length === 0 ? (
                    <p className="text-gray-500 text-sm">No gardeners available</p>
                  ) : (
                    gardeners.map(gardener => (
                      <label key={gardener._id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedGardeners.includes(gardener._id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              handleAddGardener(gardener._id);
                            } else {
                              handleRemoveGardener(gardener._id);
                            }
                          }}
                          className="w-4 h-4 text-green-600 rounded"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{gardener.name}</p>
                          <p className="text-xs text-gray-500">{gardener.email}</p>
                        </div>
                      </label>
                    ))
                  )}
                </div>
                {gardeners.length === 0 && (
                  <p className="text-sm text-red-600 mt-2">No gardeners available in the system</p>
                )}
              </div>

              {/* Selected Gardeners Display */}
              {selectedGardeners.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-2">
                    Selected Gardeners ({selectedGardeners.length})
                  </h3>
                  <div className="space-y-2">
                    {getSelectedGardenersInfo().map(gardener => (
                      <div key={gardener._id} className="flex items-center justify-between bg-white p-2 rounded border border-blue-100">
                        <div>
                          <p className="font-medium text-sm text-gray-900">{gardener.name}</p>
                          <p className="text-xs text-gray-500">{gardener.email}</p>
                        </div>
                        <button
                          onClick={() => handleRemoveGardener(gardener._id)}
                          className="text-red-600 hover:bg-red-50 p-1 rounded"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Volunteer Section */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Select Volunteer (Optional)
                </label>
                <select
                  value={selectedVolunteer}
                  onChange={(e) => setSelectedVolunteer(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">-- No Volunteer --</option>
                  {volunteers.map(volunteer => (
                    <option key={volunteer._id} value={volunteer._id}>
                      {volunteer.name} ({volunteer.email})
                    </option>
                  ))}
                </select>
                {volunteers.length === 0 && (
                  <p className="text-sm text-yellow-600 mt-2">No volunteers available in the system</p>
                )}
              </div>

              {/* Expert Section */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Select Expert (Optional)
                </label>
                <select
                  value={selectedExpert}
                  onChange={(e) => setSelectedExpert(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">-- No Expert --</option>
                  {experts.map(expert => (
                    <option key={expert._id} value={expert._id}>
                      {expert.name} ({expert.email})
                    </option>
                  ))}
                </select>
                {experts.length === 0 && (
                  <p className="text-sm text-yellow-600 mt-2">No experts available in the system</p>
                )}
              </div>

              {/* Summary */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">Allocation Summary</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• <strong>Gardeners:</strong> {selectedGardeners.length} selected</li>
                  <li>• <strong>Volunteer:</strong> {selectedVolunteer ? volunteers.find(v => v._id === selectedVolunteer)?.name : 'None'}</li>
                  <li>• <strong>Expert:</strong> {selectedExpert ? experts.find(e => e._id === selectedExpert)?.name : 'None'}</li>
                </ul>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleAllocate}
            disabled={loading || selectedGardeners.length === 0 || usersLoading}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Allocating...
              </>
            ) : (
              <>
                <Plus size={20} />
                Allocate Resources
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
