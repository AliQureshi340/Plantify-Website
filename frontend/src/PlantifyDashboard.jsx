import React, { useState } from 'react';
import ForestRestoration from "./components/ForestRestoration";
import PlantShop from './components/PlantShop'; // Import the same PlantShop component
import { useAuth } from './components/AuthSystem';

const PlantifyDashboard = () => {
  const { user, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const navigateToPage = (page) => {
    setCurrentPage(page);
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const menuItems = [
    { id: 'dashboard', icon: 'Home', label: 'Dashboard' },
    { id: 'shop', icon: 'Cart', label: 'Plant Store' },
    { id: 'profile', icon: 'User', label: 'Profile' }
  ];

  const IconComponent = ({ name, className = '' }) => {
    const icons = {
      'Home': <img src="/images/dashboard copy.png" alt="Dashboard" className={`w-20 h-19 ${className}`} />,
      'Cart': <img src="/images/cart.png" alt="Cart" className={`w-190 h-20 ${className}`} />,
      'User': <img src="/images/profile.png" alt="Profile" className={`w-20 h-12 ${className}`} />,
      'Bell': '🔔',
      'Search': '🔍',
      'Leaf': <img src="/images/plantify_logo_400x400.jpg" alt="Plantify" className={`w-80 h-10 ${className}`} />,
      'Camera': <img src="/images/4273907.png" alt="Camera" className={`w-13 h-13 ${className}`} />
    };
    
    return <span className={className}>{icons[name] || '•'}</span>;
  };

const renderDashboard = () => (
  <div className="page-content min-h-screen">
    {/* ForestRestoration - The blue "Get a MOQAH" section */}
    <div>
  <ForestRestoration />
</div>

    
    {/* Stats Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8 mb-16">
      {/* Your existing stat cards */}
    </div>

    {/* How it Works Section */}
    <section className="py-16 bg-white rounded-xl mb-16">
      {/* How it works content */}
    </section>

    

    {/* Transparent Pricing Section */}
    <section className="py-16 bg-white rounded-xl mb-16">
      {/* Pricing content */}
    </section>

    {/* Footer */}
    <footer className="bg-slate-900 text-white py-16 rounded-xl">
      {/* Footer content */}
    </footer>
  </div>
);

  const renderProfile = () => (
    <div className="page-content">
      <div className="page-header">
        <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
        <p className="text-gray-600 mt-2">Manage your account and preferences</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center mb-6">
          <div className="relative mr-6">
            <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center">
              <IconComponent name="User" className="text-3xl text-gray-600" />
            </div>
            <button className="absolute bottom-0 right-0 bg-green-600 text-white p-2 rounded-full">
              <IconComponent name="Camera" className="text-sm" />
            </button>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{user?.name || 'Ali Qureshi'}</h2>
            <p className="text-gray-600">Plant Enthusiast</p>
            <p className="text-gray-600">Member since: January 2024</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 text-center">
          <div>
            <h3 className="text-2xl font-bold text-gray-800">42</h3>
            <p className="text-gray-600">Plants Identified</p>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800">15</h3>
            <p className="text-gray-600">Drives Joined</p>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800">1,240</h3>
            <p className="text-gray-600">Points Earned</p>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <button 
          onClick={handleLogout}
          className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </div>
  );

  const renderPageContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return renderDashboard();
      case 'shop':
        // Return the same PlantShop component used in nursery
        return <PlantShop />;
      case 'profile':
        return renderProfile();
      default:
        return renderDashboard();
    }
  };

  // Only render the dashboard wrapper when not in shop mode
 

  return (
    <div className="dashboard-container min-h-screen bg-gray-100 w-full m-0 p-0">
     <header className="bg-white shadow-md px-6 py-4 flex items-center justify-between sticky top-0 z-50">
  <div className="flex items-center">
    <div className="flex items-center">
      <div className="w-8 h-8 bg-green-600 rounded mr-3 flex items-center justify-center">
        <IconComponent name="Leaf" className="text-white" />
      </div>
      <span className="text-xl font-bold text-gray-800">Plantify</span>
    </div>
  </div>
  
  {/* Center Navigation */}
<nav className="flex space-x-8">
  <button 
    onClick={() => navigateToPage('dashboard')}
    className={`transition-colors font-medium ${
      currentPage === 'dashboard' ? 'text-green-600' : 'text-gray-600 hover:text-green-600'
    }`}
  >
    Dashboard
  </button>
  <button 
    onClick={() => navigateToPage('shop')}
    className={`transition-colors font-medium ${
      currentPage === 'shop' ? 'text-green-600' : 'text-gray-600 hover:text-green-600'
    }`}
  >
    Plant Store
  </button>
  <button 
    onClick={() => navigateToPage('profile')}
    className={`transition-colors font-medium ${
      currentPage === 'profile' ? 'text-green-600' : 'text-gray-600 hover:text-green-600'
    }`}
  >
    Profile
  </button>
</nav>
  
  <div className="flex items-center space-x-4">
    <button className="text-gray-600 hover:text-green-600 transition-colors font-medium">Support</button>
    <button className="text-gray-600 hover:text-green-600 transition-colors font-medium">Sign In</button>
    <button className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition-all duration-200 font-medium shadow-sm">
      Start Plant Journey
    </button>
  </div>
</header>

      {/* Main Content */}
     <main className="w-full m-0 p-0" style={{minHeight: '100vh', marginTop: '0px'}}>
        {renderPageContent()}
      </main>
    </div>
  );
};

export default PlantifyDashboard;