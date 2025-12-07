import { useEffect, useState } from 'react';
import ManageVolunteerRequests from '../ManageVolunteerRequests';

export default function AdminDashboard({ user, onLogout }) {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRequestManager, setShowRequestManager] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingApprovals: 0,
    totalLands: 0,
    activeTasks: 0
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch pending users
      const pendingRes = await fetch('http://localhost:5000/api/users/getusers', {
        
      });
      const pendingData = await pendingRes.json();
      setPendingUsers(pendingData);

      // TODO: Fetch other stats when endpoints are ready
      setStats(prev => ({
        ...prev,
        pendingApprovals: pendingData.length
      }));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

   

  const handleApproveUser = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/users/approve-user/${userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ adminId: user.id })
      });

      if (response.ok) {
        setPendingUsers(prev => prev.filter(u => u._id !== userId));
        setStats(prev => ({ ...prev, pendingApprovals: prev.pendingApprovals - 1 }));
      }
    } catch (error) {
      console.error('Error approving user:', error);
    }
  };

  const handleRejectUser = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/users/reject-user/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason: 'Admin rejection' })
      });

      if (response.ok) {
        setPendingUsers(prev => prev.filter(u => u._id !== userId));
        setStats(prev => ({ ...prev, pendingApprovals: prev.pendingApprovals - 1 }));
      }
    } catch (error) {
      console.error('Error rejecting user:', error);
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
      {/* <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back, {user.name}</p>
          </div>
        </div>
      </div> */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
          </div>
          <div className="p-6 flex flex-wrap gap-3">
            <button
              onClick={() => setShowRequestManager(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition"
            >
              📦 Manage Resource Requests
            </button>
          </div>
        </div>

        {/* Pending Users Section */}
        {/* <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Pending User Approvals</h2>
            <p className="text-sm text-gray-600">Review and approve new user registrations</p>
          </div>
          
          <div className="p-6">
            {pendingUsers.length === 0 ? (
              <div className="text-center py-8">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No pending approvals</h3>
                <p className="mt-1 text-sm text-gray-500">All user registrations have been processed.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingUsers.map((pendingUser) => (
                  <div key={pendingUser._id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-700">
                                {pendingUser.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {pendingUser.name}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                              {pendingUser.email}
                            </p>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {pendingUser.role}
                              </span>
                              <span className="text-xs text-gray-500">
                                Registered: {new Date(pendingUser.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleApproveUser(pendingUser._id)}
                          className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleRejectUser(pendingUser._id)}
                          className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div> */}
      </div>

      {/* Request Manager Modal */}
      {showRequestManager && (
        <ManageVolunteerRequests
          onClose={() => setShowRequestManager(false)}
        />
      )}
    </div>
  );
}
