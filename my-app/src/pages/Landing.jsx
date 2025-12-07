import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

  const features = [
    {
      icon: '🌱',
      title: 'Land Sharing',
      description: 'Connect landowners with gardeners for community farming'
    },
    // {
    //   icon: '👥',
    //   title: 'Community Building',
    //   description: 'Foster knowledge sharing and collaboration among farmers'
    // },
    {
      icon: '📊',
      title: 'Progress Tracking',
      description: 'Monitor farming activities and track yield progress'
    },
    // {
    //   icon: '🛒',
    //   title: 'Marketplace',
    //   description: 'Direct produce sales between farmers and consumers'
    // },
    {
      icon: '🎯',
      title: 'Task Management',
      description: 'Organize and track community work and activities'
    },
    {
      icon: '🎓',
      title: 'Expert Guidance',
      description: 'Agricultural knowledge sharing and expert advice'
    }
  ];

  const userRoles = [
    {
      role: 'Landowner',
      description: 'Share your unused land for community farming',
      features: ['List available lands', 'Monitor activities', 'Track progress']
    },
    {
      role: 'Gardener',
      description: 'Cultivate land and grow fresh produce',
      features: ['Browse available lands', 'Manage tasks', 'Track progress']
    },
    {
      role: 'Volunteer',
      description: 'Help coordinate community activities',
      features: ['Volunteer for tasks', 'Organize events', 'Support community']
    },
    {
      role: 'Expert',
      description: 'Provide agricultural guidance and advice',
      features: ['Share knowledge', 'Give advice', 'Monitor progress']
    },
    // {
    //   role: 'Admin',
    //   description: 'Manage the platform and ensure smooth operation',
    //   features: ['Approve users', 'Allocate lands', 'Oversee activities']
    // }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      {/* Hero Section */}
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-cover bg-center bg-no-repeat" style={{
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2000)',
        minHeight: '600px'
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
              Welcome to{' '}
              <span className="text-green-400">AgriShare</span>
            </h1>
            <p className="text-xl text-white mb-8 max-w-3xl mx-auto drop-shadow-md">
              A community-driven platform that connects landowners, gardeners, volunteers, 
              and agriculture experts to promote sustainable agriculture and local food production.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/signup')}
                className="px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-lg transition-colors shadow-lg"
              >
                Join the Community
              </button>
              <button
                onClick={() => navigate('/login')}
                className="px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-white hover:text-green-600 font-medium text-lg transition-colors shadow-lg"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Platform Features
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to build a thriving agricultural community
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* User Roles Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Join as a...
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose your role and start contributing to the community
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {userRoles.map((userRole, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {userRole.role}
                </h3>
                <p className="text-gray-600 mb-4">
                  {userRole.description}
                </p>
                <ul className="space-y-2">
                  {userRole.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                      <span className="text-green-500 mr-2">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>


      {/* CTA Section */}
      <div className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Ready to Start Your Agricultural Journey?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of farmers, gardeners, and agriculture enthusiasts 
            who are already building sustainable communities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/signup')}
              className="px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-lg transition-colors"
            >
              Get Started Today
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-4 border-2 border-green-600 text-green-600 rounded-lg hover:bg-green-600 hover:text-white font-medium text-lg transition-colors"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-2xl">🌱</span>
                <span className="text-xl font-bold">AgriShare</span>
              </div>
              <p className="text-gray-400">
                Building sustainable agricultural communities through technology and collaboration.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Land Sharing</a></li>
                {/* <li><a href="#" className="hover:text-white">Community</a></li> */}
                {/* <li><a href="#" className="hover:text-white">Marketplace</a></li> */}
                <li><a href="#" className="hover:text-white">Progress Tracking</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                <li><a href="#" className="hover:text-white">Documentation</a></li>
                <li><a href="#" className="hover:text-white">API</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Community</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Events</a></li>
                <li><a href="#" className="hover:text-white">Success Stories</a></li>
                <li><a href="#" className="hover:text-white">Partners</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 AgriShare. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
