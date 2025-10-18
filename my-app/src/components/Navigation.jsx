import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Navigation({ user, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const getNavigationItems = () => {
    if (!user) return [];

    const baseItems = [
      { name: 'Dashboard', path: `/dashboard/${user.role}`, icon: '🏠' },
      { name: 'Community', path: '/community', icon: '👥' },
      { name: 'Marketplace', path: '/marketplace', icon: '🛒' }
    ];

    // Role-specific navigation items
    switch (user.role) {
      case 'admin':
        return [
          ...baseItems,
          { name: 'User Management', path: `/dashboard/${user.role}`, icon: '👥' },
          { name: 'Land Allocation', path: `/dashboard/${user.role}`, icon: '🌱' }
        ];
      case 'landowner':
        return [
          ...baseItems,
          { name: 'My Lands', path: `/dashboard/${user.role}`, icon: '🏞️' },
          { name: 'Add Land', path: `/dashboard/${user.role}`, icon: '➕' }
        ];
      case 'gardener':
        return [
          ...baseItems,
          { name: 'Available Lands', path: `/dashboard/${user.role}`, icon: '🌱' },
          { name: 'My Tasks', path: `/dashboard/${user.role}`, icon: '📋' },
          { name: 'Progress', path: `/dashboard/${user.role}`, icon: '📊' }
        ];
      case 'volunteer':
        return [
          ...baseItems,
          { name: 'Volunteer Tasks', path: `/dashboard/${user.role}`, icon: '🤝' },
          { name: 'Community Events', path: `/dashboard/${user.role}`, icon: '📅' }
        ];
      case 'expert':
        return [
          ...baseItems,
          { name: 'Advice Requests', path: `/dashboard/${user.role}`, icon: '🎓' },
          { name: 'Knowledge Base', path: `/dashboard/${user.role}`, icon: '📚' }
        ];
      default:
        return baseItems;
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <button
              onClick={() => navigate(`/dashboard/${user.role}`)}
              className="flex items-center space-x-2"
            >
              <span className="text-2xl">🌱</span>
              <span className="text-xl font-bold text-green-600">AgriShare</span>
            </button>
          </div>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </button>
            ))}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-sm font-medium text-green-700">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-700">{user.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user.role}</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
            >
              Logout
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="text-gray-600 hover:text-gray-900 focus:outline-none focus:text-gray-900"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50">
          {navigationItems.map((item) => (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className={`flex items-center space-x-2 w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors ${
                isActive(item.path)
                  ? 'bg-green-100 text-green-700'
                  : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.name}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
