import { AlertCircle, CheckCircle, Clock, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ManageVolunteerRequests({ onClose }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [approving, setApproving] = useState(null);
  const [rejecting, setRejecting] = useState(null);
  const [filter, setFilter] = useState('pending');

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
    pending: <Clock size={16} />,
    approved: <CheckCircle size={16} />,
    rejected: <X size={16} />
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const response = await fetch('http://localhost:5000/api/volunteer-requests/all', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch requests');
      }

      const data = await response.json();
      setRequests(data || []);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load requests');
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId) => {
    try {
      setApproving(requestId);
      const token = localStorage.getItem('token');

      const response = await fetch(`http://localhost:5000/api/volunteer-requests/approve/${requestId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to approve request');
      }

      setSuccess('Request approved successfully!');
      fetchRequests();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to approve request');
      setTimeout(() => setError(''), 3000);
    } finally {
      setApproving(null);
    }
  };

  const handleReject = async (requestId) => {
    try {
      setRejecting(requestId);
      const token = localStorage.getItem('token');

      const response = await fetch(`http://localhost:5000/api/volunteer-requests/reject/${requestId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to reject request');
      }

      setSuccess('Request rejected successfully!');
      fetchRequests();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to reject request');
      setTimeout(() => setError(''), 3000);
    } finally {
      setRejecting(null);
    }
  };

  const filteredRequests = requests.filter(req => 
    filter === 'all' ? true : req.status === filter
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex justify-between items-center text-white">
          <h2 className="text-xl font-bold">Volunteer Resource Requests</h2>
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

          {success && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700">
              <CheckCircle size={20} />
              <span className="text-sm">{success}</span>
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
                    ? 'bg-blue-600 text-white'
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
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading requests...</p>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                {filter === 'pending' ? 'No pending requests' : 'No requests found'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredRequests.map(request => (
                <div key={request._id} className={`border rounded-lg p-4 ${statusColors[request.status]}`}>
                  <div className="flex items-start justify-between gap-4">
                    {/* Left Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">
                          {resourceIcons[request.type] || '📦'}
                        </span>
                        <div>
                          <h3 className="font-semibold text-gray-900 capitalize">
                            {request.type}
                            {request.specificType && ` - ${request.specificType}`}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Quantity: <strong>{request.quantity}</strong>
                          </p>
                        </div>
                      </div>

                      {/* Volunteer Info */}
                      {request.volunteer && (
                        <div className="text-sm text-gray-700 mt-2">
                          <p className="font-medium">{request.volunteer.name}</p>
                          <p className="text-gray-600">{request.volunteer.email}</p>
                        </div>
                      )}

                      {/* Timestamps */}
                      <p className="text-xs text-gray-600 mt-2">
                        Requested: {new Date(request.createdAt).toLocaleDateString()} at{' '}
                        {new Date(request.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>

                    {/* Status and Actions */}
                    <div className="flex flex-col items-end gap-3">
                      {/* Status Badge */}
                      <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-opacity-50 bg-white">
                        {statusIcons[request.status]}
                        <span className="text-sm font-semibold capitalize">{request.status}</span>
                      </div>

                      {/* Action Buttons */}
                      {request.status === 'pending' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApprove(request._id)}
                            disabled={approving === request._id}
                            className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition disabled:opacity-50 font-medium"
                          >
                            {approving === request._id ? 'Approving...' : 'Approve'}
                          </button>
                          <button
                            onClick={() => handleReject(request._id)}
                            disabled={rejecting === request._id}
                            className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition disabled:opacity-50 font-medium"
                          >
                            {rejecting === request._id ? 'Rejecting...' : 'Reject'}
                          </button>
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
  );
}
