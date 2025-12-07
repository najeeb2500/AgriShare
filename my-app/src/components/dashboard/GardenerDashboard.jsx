import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function GardenerDashboard({ user, onLogout }) {
  const navigate = useNavigate();
  const [availableLands, setAvailableLands] = useState([]);
  const [myAllocatedLands, setMyAllocatedLands] = useState([]);
  const [myTasks, setMyTasks] = useState([]);
  const [myProgress, setMyProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch available lands
      const landsRes = await fetch('http://localhost:5000/api/lands/available', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const landsData = await landsRes.json();
      const allLands = landsData.lands || [];
      setAvailableLands(allLands);
      
      // Filter lands where current user is allocated as gardener
      const allocatedLands = allLands.filter(land => 
        land.allocatedTo?.gardener?._id === user.id || 
        land.allocatedTo?.gardener === user.id
      );
      setMyAllocatedLands(allocatedLands);

      // Fetch my tasks
      const tasksRes = await fetch(`http://localhost:5000/api/tasks/user/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const tasksData = await tasksRes.json();
      setMyTasks(tasksData.tasks || []);

      // Fetch my progress
      const progressRes = await fetch(`http://localhost:5000/api/progress/gardener/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const progressData = await progressRes.json();
      setMyProgress(progressData || []);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-green-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600 font-medium">Loading your garden...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Hero Section with Background */}
      <div className="relative bg-cover bg-center bg-no-repeat" style={{
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(https://images.unsplash.com/photo-1592982537447-7440770cbfc9?q=80&w=2000&auto=format&fit=crop)',
        minHeight: '280px'
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center text-white">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <span className="text-5xl">🌱</span>
              <h1 className="text-4xl md:text-5xl font-bold drop-shadow-lg">Gardener Dashboard</h1>
            </div>
            <p className="text-xl drop-shadow-md mb-2">Welcome back, {user.name}</p>
            <p className="text-lg drop-shadow-md opacity-90">Cultivating nature's bounty</p>
          </div>
        </div>
        
        {/* Decorative wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="rgb(240 253 244)"/>
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg p-8 text-white transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium mb-2">Allocated Lands</p>
                <p className="text-5xl font-bold">{myAllocatedLands.length}</p>
                <p className="text-green-100 text-sm mt-2">Ready for cultivation</p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-full p-5">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-8 text-white transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium mb-2">My Tasks</p>
                <p className="text-5xl font-bold">{myTasks.length}</p>
                <p className="text-blue-100 text-sm mt-2">Activities to complete</p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-full p-5">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* My Allocated Lands */}
        <div className="bg-white rounded-2xl shadow-xl mb-8 overflow-hidden">
          <div className="relative bg-cover bg-center" style={{
            backgroundImage: 'linear-gradient(rgba(34, 197, 94, 0.9), rgba(34, 197, 94, 0.9)), url(https://images.unsplash.com/photo-1574943320219-553eb213f72d?q=80&w=2000&auto=format&fit=crop)',
            minHeight: '120px'
          }}>
            <div className="px-6 py-6">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">🌾</span>
                <div>
                  <h2 className="text-2xl font-bold text-white">My Allocated Lands</h2>
                  <p className="text-green-100">Lands allocated to you for cultivation</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            {myAllocatedLands.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-4">
                  <svg className="h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No allocated lands</h3>
                <p className="text-gray-500">You don't have any lands allocated yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myAllocatedLands.map((land) => (
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
                      <div className="absolute inset-0 bg-gradient-to-t from-green-900 via-green-900/70 to-transparent"></div>
                    </div>
                    
                    {/* Card Content */}
                    <div className="relative p-6 min-h-[280px] flex flex-col justify-end">
                      <div className="absolute top-4 right-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-500 text-white shadow-lg">
                          Active
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-bold text-white mb-2">{land.title}</h3>
                      <p className="text-green-100 text-sm mb-4 line-clamp-2">{land.description}</p>
                      
                      <div className="space-y-2 bg-white/10 backdrop-blur-sm rounded-lg p-3">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-green-200">📏 Area:</span>
                          <span className="text-white font-semibold">{land.area.total} {land.area.unit}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-green-200">📍 Location:</span>
                          <span className="text-white font-semibold">{land.location.address.city}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-green-200">🌱 Soil:</span>
                          <span className="text-white font-semibold capitalize">{land.soilType}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* My Tasks */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="relative bg-cover bg-center" style={{
            backgroundImage: 'linear-gradient(rgba(59, 130, 246, 0.9), rgba(59, 130, 246, 0.9)), url(https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=2000&auto=format&fit=crop)',
            minHeight: '120px'
          }}>
            <div className="px-6 py-6">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">📋</span>
                <div>
                  <h2 className="text-2xl font-bold text-white">My Tasks</h2>
                  <p className="text-blue-100">Tasks assigned to you</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            {myTasks.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-4">
                  <svg className="h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No tasks assigned</h3>
                <p className="text-gray-500">You'll see assigned tasks here once you're allocated land.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {myTasks.map((task) => (
                  <div key={task._id} className="border-l-4 border-blue-500 bg-gradient-to-r from-blue-50 to-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{task.title}</h3>
                        <p className="text-gray-600 mb-3">{task.description}</p>
                        <div className="flex items-center space-x-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium shadow-sm ${
                            task.status === 'completed' ? 'bg-green-100 text-green-800 border border-green-200' :
                            task.status === 'in_progress' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                            'bg-yellow-100 text-yellow-800 border border-yellow-200'
                          }`}>
                            {task.status === 'completed' ? '✓ Completed' :
                             task.status === 'in_progress' ? '⏳ In Progress' :
                             '📌 Pending'}
                          </span>
                          <span className="flex items-center text-sm text-gray-500">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Motivational Section */}
        <div className="relative rounded-2xl overflow-hidden shadow-xl mt-8">
          <div 
            className="bg-cover bg-center"
            style={{
              backgroundImage: 'linear-gradient(rgba(16, 185, 129, 0.9), rgba(5, 150, 105, 0.9)), url(https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=2000&auto=format&fit=crop)'
            }}
          >
            <div className="px-8 py-12 text-center">
              <h3 className="text-3xl font-bold text-white mb-3">Growing Together 🌿</h3>
              <p className="text-green-50 text-lg max-w-2xl mx-auto">
                Every seed you plant is a step towards a sustainable future. 
                Keep nurturing, keep growing! 
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}