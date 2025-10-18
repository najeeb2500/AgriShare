import React, { useState, useEffect } from 'react';

export default function ExpertDashboard({ user, onLogout }) {
  const [pendingAdvice, setPendingAdvice] = useState([]);
  const [myAdvice, setMyAdvice] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch progress records that might need expert advice
      const progressRes = await fetch('http://localhost:5000/api/progress', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const progressData = await progressRes.json();
      
      // Filter for records that might need expert advice
      const needsAdvice = (progressData.progressRecords || []).filter(progress => 
        progress.pestDisease && progress.pestDisease.length > 0 ||
        progress.growthStage === 'fruiting' ||
        progress.yield.actual && progress.yield.actual.quantity < progress.yield.expected.quantity * 0.7
      );
      
      setPendingAdvice(needsAdvice);
      setMyAdvice([]); // TODO: Fetch expert's previous advice

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
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
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Expert Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user.name}</p>
            </div>
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Advice</p>
                <p className="text-2xl font-semibold text-gray-900">{pendingAdvice.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Advice Given</p>
                <p className="text-2xl font-semibold text-gray-900">{myAdvice.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-2xl font-semibold text-gray-900">85%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Advice Requests */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Pending Advice Requests</h2>
            <p className="text-sm text-gray-600">Projects that need your expert guidance</p>
          </div>
          
          <div className="p-6">
            {pendingAdvice.length === 0 ? (
              <div className="text-center py-8">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No pending requests</h3>
                <p className="mt-1 text-sm text-gray-500">All projects are running smoothly.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingAdvice.map((progress) => (
                  <div key={progress._id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {progress.crop.name} - {progress.land.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Gardener: {progress.gardener.name}
                        </p>
                        <div className="mt-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            progress.growthStage === 'fruiting' ? 'bg-green-100 text-green-800' :
                            progress.growthStage === 'flowering' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {progress.growthStage}
                          </span>
                        </div>
                        
                        {progress.pestDisease && progress.pestDisease.length > 0 && (
                          <div className="mt-2">
                            <p className="text-sm text-red-600 font-medium">Issues detected:</p>
                            <ul className="text-sm text-red-600 ml-4">
                              {progress.pestDisease.map((issue, index) => (
                                <li key={index}>• {issue.name} ({issue.severity} severity)</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {progress.yield.actual && progress.yield.expected && 
                         progress.yield.actual.quantity < progress.yield.expected.quantity * 0.7 && (
                          <div className="mt-2">
                            <p className="text-sm text-orange-600 font-medium">Low yield detected</p>
                            <p className="text-sm text-orange-600">
                              Expected: {progress.yield.expected.quantity} {progress.yield.expected.unit}, 
                              Actual: {progress.yield.actual.quantity} {progress.yield.actual.unit}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                          Provide Advice
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* My Advice History */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">My Advice History</h2>
            <p className="text-sm text-gray-600">Previous advice you've provided</p>
          </div>
          
          <div className="p-6">
            {myAdvice.length === 0 ? (
              <div className="text-center py-8">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No advice given yet</h3>
                <p className="mt-1 text-sm text-gray-500">Start helping the community by providing expert advice.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {myAdvice.map((advice) => (
                  <div key={advice._id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{advice.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{advice.advice}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-xs text-gray-500">
                            Given: {new Date(advice.date).toLocaleDateString()}
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            advice.implemented ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {advice.implemented ? 'Implemented' : 'Pending'}
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
      </div>
    </div>
  );
}
