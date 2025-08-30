import React, { useState } from 'react';
import PlantationDrives from './components/PlantationDrives.jsx';
//import DriveDetail from './components/DriveDetail.jsx';
//import PlantifyShop from './components/shop/ShopComponents';
//import PlantIdentification from './components/plantid/PlantIdentification';
//import { plantationDrivesData } from './data/plantationDrivesData';
import PlantationMap from "./components/PlantationMap";
import ForestRestoration from "./components/ForestRestoration";


const PlantifyDashboard = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const navigateToPage = (page) => {
    setCurrentPage(page);
  };

  
const handleLogout = () => {
  localStorage.removeItem('token'); // remove auth token
  window.location.href = '/login';  // redirect to login
};

  const menuItems = [
  { id: 'dashboard', icon: 'Home', label: 'Dashboard' },
  { id: 'plant-id', icon: 'Camera', label: 'Plant Identification' },
  { id: 'disease-check', icon: 'Heart', label: 'Disease Detection' },
  { id: 'plantation-drives', icon: 'Tree', label: 'Plantation Drives' },
  { id: 'plantation-map', icon: 'Map', label: 'Plantation Map' }, // ✅ add this
  { id: 'shop', icon: 'Cart', label: 'Plant Store' },
  { id: 'planner', icon: 'Calendar', label: 'Plantation Planner' },
  { id: 'rewards', icon: 'Trophy', label: 'Rewards' },
  { id: 'community', icon: 'Users', label: 'Community' },
  { id: 'profile', icon: 'User', label: 'Profile' }
];

  const IconComponent = ({ name, className = '' }) => {
    const icons = {
      'Home': <img src="/images/dashboard copy.png" alt="Camera" className={`w-20 h-19 ${className}`} />,
       Camera: <img src="/images/4273907.png" alt="Camera" className={`w-13 h-13 ${className}`} />,
      'Heart': <img src="/images/reversed.avif" alt="Camera" className={`w-16.5 h-20 ${className}`} />,
      'Tree': <img src="/images/drives.png" alt="Camera" className={`w- h-20 ${className}`} />,
      'Cart': <img src="/images/cart.png" alt="Camera" className={`w-190 h-20 ${className}`} />,
      'Calendar': <img src="/images/Microsoft-Planner.png" alt="Camera" className={`w-23 h-12 ${className}`} />,
      'Trophy': <img src="/images/rewards.png" alt="Camera" className={`w-20 h-20 ${className}`} />,
      'Users': <img src="/images/community copy.jpg" alt="Camera" className={`w-20 h-20 ${className}`} />,
      'User':  <img src="/images/profile.png" alt="Camera" className={`w-20 h-12 ${className}`} />,
      'Map':  <img src="/images/maps.png" alt="Camera" className={`w-15 h-12 ${className}`} />,
      'Seedling': '🌱',
      'Mountain': '⛰',
      'Bell': '🔔',
      'Search': '🔍',
      'Leaf': <img src="/images/plantify_logo_400x400.jpg" alt="Camera" className={`w-80 h-10 ${className}`} />,
      'Rose': '🌹',
      'Tulip': '🌷',
      'Stethoscope': '🩺',
      'Water': '💧',
      'Sun': '☀',
      'Flask': '⚗',
      'Tools': '🔧',
      'Upload': '📁',
      'Settings': '⚙',
      'Stats': '📊',
      'Posts': '💬',
      'Star': '⭐',
      'Gold': '🥇',
      'Silver': '🥈',
      'Bronze': '🥉'
    };
    
    return <span className={className}>{icons[name] || '•'}</span>;
  };

  

const renderDashboard = () => (
  <div className="page-content">
    {/* 🌳 Add Forest Restoration at the Top */}
    <ForestRestoration />
  </div>
);


  

  const renderDiseaseCheck = () => (
    <div className="page-content">
      <div className="page-header">
        <h1 className="text-3xl font-bold text-gray-800">Plant Disease Detection</h1>
        <p className="text-gray-600 mt-2">Check your plant's health and get treatment recommendations</p>
      </div>
      
      <div className="mb-8">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="text-6xl text-gray-400 mb-4">
            <IconComponent name="Stethoscope" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Upload Plant Image for Health Check</h3>
          <p className="text-gray-600 mb-6">Our AI will analyze your plant for diseases</p>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            Check Plant Health
          </button>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Plant Care Tips</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl text-blue-600 mb-4">
              <IconComponent name="Water" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Proper Watering</h3>
            <p className="text-gray-600">Water plants early morning or evening</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl text-yellow-600 mb-4">
              <IconComponent name="Sun" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Sunlight</h3>
            <p className="text-gray-600">Ensure adequate sunlight for growth</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl text-green-600 mb-4">
              <IconComponent name="Leaf" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Fertilization</h3>
            <p className="text-gray-600">Use organic fertilizers for best results</p>
          </div>
        </div>
      </div>
    </div>
  );

 
const renderPlantationDrives = () => (
  <div className="page-content">
    <div className="page-header">
      <h1 className="text-3xl font-bold text-gray-800">Plantation Drives</h1>
      <p className="text-gray-600 mt-2">Join nationwide tree planting initiatives across Pakistan</p>
    </div>
    
    <div className="plantation-drives-wrapper">
      <PlantationDrives />
    </div>
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
            <h2 className="text-2xl font-bold text-gray-800">Ali Qureshi</h2>
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
    </div>
  );

const renderPageContent = () => {
 switch (currentPage) {
   case 'dashboard':
     return renderDashboard();
   case 'disease-check':
     return renderDiseaseCheck();
case 'plantation-drives':
  return renderPlantationDrives();
    case 'plantation-map':
  return <PlantationMap />;
   case 'profile':
     return (
       <div>
         {renderProfile()}
         <button onClick={handleLogout}>Logout</button>
       </div>
     );
   default:
     return renderDashboard();
 }
};


  return (
    <div className="dashboard-container min-h-screen bg-gray-100">
      <header className="bg-white shadow-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="text-gray-600 hover:text-gray-800 mr-4"
          >
            <span className="text-xl">☰</span>
          </button>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-600 rounded mr-3 flex items-center justify-center">
              <IconComponent name="Leaf" className="text-white" />
            </div>
            <span className="text-xl font-bold text-gray-800">Plantify</span>
          </div>
        </div>
        
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <IconComponent name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search plants, drives, products..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <IconComponent name="Bell" className="text-gray-600 text-xl" />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              3
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <IconComponent name="User" className="text-gray-600" />
            </div>
            <span className="text-gray-800">Ali Qureshi</span>
            <span className="text-gray-600">▼</span>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className={`bg-white shadow-md transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-16'}`}>
          <div className="p-4">
            <h3 className={`font-bold text-gray-800 ${sidebarOpen ? 'block' : 'hidden'}`}>
              Dashboard
            </h3>
          </div>
          
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => navigateToPage(item.id)}
                  className={`w-full flex items-center px-4 py-3 text-left hover:bg-gray-100 transition-colors ${
                    currentPage === item.id ? 'bg-green-100 border-r-4 border-green-600' : ''
                  }`}
                >
                  <IconComponent name={item.icon} className={`text-gray-600 ${sidebarOpen ? 'mr-3' : 'mx-auto'}`} />
                  {sidebarOpen && (
                    <span className={`text-gray-800 ${currentPage === item.id ? 'font-semibold' : ''}`}>
                      {item.label}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <main className="flex-1 p-6">
          {renderPageContent()}
        </main>
      </div>
    </div>
  );
};

export default PlantifyDashboard;