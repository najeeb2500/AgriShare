import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Import role-specific dashboard components
import AdminDashboard from '../components/dashboard/AdminDashboard';
import GardenerDashboard from '../components/dashboard/GardenerDashboard';
import LandownerDashboard from '../components/dashboard/LandownerDashboard';
import VolunteerDashboard from '../components/dashboard/VolunteerDashboard';
import ExpertDashboard from '../components/dashboard/ExpertDashboard';
import Navigation from '../components/Navigation';

export default function Dashboard() {
  const { role } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      navigate('/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      // Check if user role matches the dashboard route
      if (parsedUser.role !== role) {
        navigate(`/dashboard/${parsedUser.role}`);
        return;
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
      navigate('/login');
    } finally {
      setLoading(false);
    }
  }, [role, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const renderDashboard = () => {
    switch (role) {
      case 'admin':
        return <AdminDashboard user={user} onLogout={handleLogout} />;
      case 'gardener':
        return <GardenerDashboard user={user} onLogout={handleLogout} />;
      case 'landowner':
        return <LandownerDashboard user={user} onLogout={handleLogout} />;
      case 'volunteer':
        return <VolunteerDashboard user={user} onLogout={handleLogout} />;
      case 'expert':
        return <ExpertDashboard user={user} onLogout={handleLogout} />;
      default:
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-700 mb-4">Invalid Role</h2>
            <p className="text-gray-500">The role "{role}" is not recognized.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation user={user} onLogout={handleLogout} />
      {renderDashboard()}
    </div>
  );
}
