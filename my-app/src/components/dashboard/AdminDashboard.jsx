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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600 font-medium">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Hero Section with Background */}
      <div className="relative bg-cover bg-center bg-no-repeat" style={{
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2000&auto=format&fit=crop)',
        minHeight: '280px'
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center text-white">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <span className="text-5xl">👑</span>
              <h1 className="text-4xl md:text-5xl font-bold drop-shadow-lg">Admin Dashboard</h1>
            </div>
            <p className="text-xl drop-shadow-md mb-2">Welcome back, {user.name}</p>
            <p className="text-lg drop-shadow-md opacity-90">Managing the AgriShare community</p>
          </div>
        </div>
        
        {/* Decorative wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="rgb(238 242 255)"/>
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-8">
        

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-xl mb-8 overflow-hidden">
          <div className="relative bg-cover bg-center" style={{
            backgroundImage: 'linear-gradient(rgba(59, 130, 246, 0.9), rgba(59, 130, 246, 0.9)), url(https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2000&auto=format&fit=crop)',
            minHeight: '120px'
          }}>
            <div className="px-6 py-6">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">⚡</span>
                <div>
                  <h2 className="text-2xl font-bold text-white">Quick Actions</h2>
                  <p className="text-blue-100">Manage platform operations</p>
                </div>
              </div>
            </div>
          </div>
          <div className="p-6 flex flex-wrap gap-4">
            <button
              onClick={() => setShowRequestManager(true)}
              className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium transition shadow-lg transform hover:scale-105"
            >
              <span className="text-xl">📦</span>
              <span>Manage Resource Requests</span>
            </button>
          </div>
        </div>

        

        {/* Admin Info Banner */}
        <div className="relative rounded-2xl overflow-hidden shadow-xl mt-8">
          <div 
            className="bg-cover bg-center"
            style={{
              backgroundImage: 'linear-gradient(rgba(99, 102, 241, 0.9), rgba(79, 70, 229, 0.9)), url(https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=2000&auto=format&fit=crop)'
            }}
          >
            <div className="px-8 py-12 text-center">
              <h3 className="text-3xl font-bold text-white mb-3">Platform Administrator 🛡️</h3>
              <p className="text-indigo-100 text-lg max-w-2xl mx-auto">
                You have the power to shape and manage the AgriShare community. 
                Use your administrative privileges responsibly to create a thriving agricultural ecosystem.
              </p>
            </div>
          </div>
        </div>
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