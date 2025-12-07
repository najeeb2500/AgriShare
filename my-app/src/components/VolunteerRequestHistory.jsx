import { AlertCircle, CheckCircle, Clock, X, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function VolunteerRequestHistory({ volunteerId, onClose }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  const resourceIcons = {
    seeds: '🌱',
    tools: '🛠️',
    fertilizer: '🥕',
    water: '💧'
  };

  const statusColors = {
    pending: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    approved: 'bg-green-50 border-green-200 text-green-800',
    rejected: 'bg-red-50 border-red-200 text-red-800'
  };

  const statusIcons = {
    pending: <Clock size={18} />,
    approved: <CheckCircle size={18} />,
    rejected: <XCircle size={18} />
  };

  const statusLabels = {
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected'
  };

  useEffect(() => {
    fetchMyRequests();
  }, []);

  const fetchMyRequests = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      console.log('Fetching requests for volunteerId:', volunteerId);

      // Fetch requests for current volunteer using the new endpoint
      const response = await fetch(`http://localhost:5000/api/volunteer-requests/my-requests/${volunteerId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch requests');
      }

      const data = await response.json();
      console.log('Requests received:', data);
      
      setRequests(data || []);
      setError('');
    } catch (err) {
      console.error('Error fetching requests:', err);
      setError(err.message || 'Failed to load your requests');
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredRequests = requests.filter(req =>
    filter === 'all' ? true : req.status === filter
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4 flex justify-between items-center text-white">
          <h2 className="text-xl font-bold">My Resource Requests</h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Alerts */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
              <AlertCircle size={20} />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Filter Tabs */}
          <div className="flex gap-2 flex-wrap">
            {[
              { value: 'all', label: 'All Requests' },
              { value: 'pending', label: '⏳ Pending' },
              { value: 'approved', label: '✅ Approved' },
              { value: 'rejected', label: '❌ Rejected' }
            ].map(tab => (
              <button
                key={tab.value}
                onClick={() => setFilter(tab.value)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
                  filter === tab.value
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Loading */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading your requests...</p>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg mb-2">
                {filter === 'pending' && 'No pending requests'}
                {filter === 'approved' && 'No approved requests yet'}
                {filter === 'rejected' && 'No rejected requests'}
                {filter === 'all' && 'You haven\'t made any requests yet'}
              </p>
              <p className="text-gray-400 text-sm">
                {filter === 'all' && 'Click "Request Resources" to create your first request'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRequests.map(request => (
                <div key={request._id} className={`border-2 rounded-lg p-4 ${statusColors[request.status]}`}>
                  <div className="flex items-start justify-between gap-4">
                    {/* Left Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-3xl">
                          {resourceIcons[request.type] || '📦'}
                        </span>
                        <div>
                          <h3 className="font-bold text-lg text-gray-900 capitalize">
                            {request.type}
                            {request.specificType && ` - ${request.specificType}`}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            Quantity: <strong className="text-gray-900">{request.quantity}</strong>
                          </p>
                        </div>
                      </div>

                      {/* Status Message */}
                      <div className="mt-3 p-3 bg-white bg-opacity-60 rounded">
                        <p className="text-sm text-gray-700">
                          <strong>Status:</strong>{' '}
                          <span className="font-semibold capitalize">{statusLabels[request.status]}</span>
                        </p>
                        {request.status === 'pending' && (
                          <p className="text-xs text-gray-600 mt-1">
                            ⏱️ Your request is pending admin review
                          </p>
                        )}
                        {request.status === 'approved' && (
                          <p className="text-xs text-green-700 mt-1">
                            ✅ Admin has approved your request!
                          </p>
                        )}
                        {request.status === 'rejected' && (
                          <p className="text-xs text-red-700 mt-1">
                            ❌ Admin has rejected your request
                          </p>
                        )}
                      </div>

                      {/* Timestamps */}
                      <p className="text-xs text-gray-600 mt-3">
                        Requested: {new Date(request.createdAt).toLocaleDateString()} at{' '}
                        {new Date(request.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>

                    {/* Status Badge */}
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-white bg-opacity-70">
                        {statusIcons[request.status]}
                        <span className="font-bold text-sm capitalize">{request.status}</span>
                      </div>

                      {request.status === 'pending' && (
                        <span className="text-xs px-2 py-1 bg-yellow-200 text-yellow-800 rounded font-medium">
                          Waiting
                        </span>
                      )}
                      {request.status === 'approved' && (
                        <span className="text-xs px-2 py-1 bg-green-200 text-green-800 rounded font-medium">
                          Ready
                        </span>
                      )}
                      {request.status === 'rejected' && (
                        <span className="text-xs px-2 py-1 bg-red-200 text-red-800 rounded font-medium">
                          Denied
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Info Box */}
          {!loading && requests.length > 0 && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>💡 Tip:</strong> Your requests are reviewed by admins within 24-48 hours. You can check the status here anytime.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
