import React, { useState, useEffect, useCallback } from 'react';
import ForestRestoration from "./components/ForestRestoration";
import PlantShop from './components/PlantShop';
import UserDrives from './components/UserDrives';
import { useAuth } from './components/AuthSystem';

const PlantifyDashboard = () => {
  const { user, logout, authFetch } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [toast, setToast] = useState(null);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const loadNotifications = useCallback(async () => {
    try {
      const res = await authFetch('/api/notifications');
      if (!res.ok) return;
      const data = await res.json();
      
      const prevUnreadIds = new Set(notifications.filter(n => !n.read).map(n => n._id));
      const newUnread = data.filter(n => !n.read && !prevUnreadIds.has(n._id));
      
      if (newUnread.length > 0) {
        setToast({ 
          title: newUnread[0].title, 
          message: newUnread[0].message, 
          link: newUnread[0].link 
        });
        setTimeout(() => setToast(null), 5000);
      }
      
      setNotifications(data);
    } catch (err) {
      console.error('Failed to load notifications:', err);
    }
  }, [authFetch, notifications]);

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 30000); // Increased to 30s
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = async () => {
    try {
      const unread = notifications.filter(n => !n.read);
      await Promise.all(unread.map(n => 
        authFetch(`/api/notifications/${n._id}/read`, { method: 'PATCH' })
      ));
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const navigateToPage = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const IconComponent = ({ name, className = '' }) => {
    const icons = {
      'Home': <img src="/images/dashboard copy.png" alt="Dashboard" className={`w-20 h-19 ${className}`} />,
      'Cart': <img src="/images/cart.png" alt="Cart" className={`w-190 h-20 ${className}`} />,
      'Drive': <img src="/images/drive.png" alt="Drive" className={`w-20 h-12 ${className}`} />,
      'User': <img src="/images/profile.png" alt="Profile" className={`w-20 h-12 ${className}`} />,
      'Bell': '🔔',
      'Leaf': <img src="/images/plantify_logo_400x400.jpg" alt="Plantify" className={`w-80 h-10 ${className}`} />,
      'Camera': <img src="/images/4273907.png" alt="Camera" className={`w-13 h-13 ${className}`} />
    };
    return <span className={className}>{icons[name] || '•'}</span>;
  };

  const PageLoader = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-10 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-green-500 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/3 w-72 h-72 bg-lime-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>
      </div>
      <div className="relative z-10 text-center">
        <div className="mb-8">
          <div className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center animate-pulse">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full animate-spin"></div>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-white mb-8 animate-pulse">Loading...</h2>
        <div className="w-80 mx-auto">
          <div className="bg-gray-700 rounded-full h-2 mb-4 overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full w-full"></div>
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  );

  const renderDashboard = () => (
    <div className="page-content min-h-screen">
      <div className="animate-fade-in-up">
        <ForestRestoration />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8 mb-16 animate-fade-in-up" style={{animationDelay: '200ms'}}>
        <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-full">
              <IconComponent name="Leaf" className="text-green-600 text-xl" />
            </div>
            <span className="text-2xl font-bold text-gray-800">156</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Plants Identified</h3>
          <p className="text-sm text-gray-500">+12 this week</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <span className="text-blue-600 text-xl">🌱</span>
            </div>
            <span className="text-2xl font-bold text-gray-800">42</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Tree Drives</h3>
          <p className="text-sm text-gray-500">+3 this month</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-full">
              <span className="text-purple-600 text-xl">🏆</span>
            </div>
            <span className="text-2xl font-bold text-gray-800">2,456</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Points Earned</h3>
          <p className="text-sm text-gray-500">+180 today</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-100 rounded-full">
              <span className="text-orange-600 text-xl">🌿</span>
            </div>
            <span className="text-2xl font-bold text-gray-800">89</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Plants Purchased</h3>
          <p className="text-sm text-gray-500">+5 this week</p>
        </div>
      </div>

      <section className="py-16 bg-white rounded-xl mb-16 shadow-lg border border-gray-100">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">How Plantify Works</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Join our mission to make the world greener, one plant at a time</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-8">
          <div className="text-center group">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
              <span className="text-green-600 text-2xl">📱</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Identify Plants</h3>
            <p className="text-gray-600">Use AI to identify plants instantly with your camera</p>
          </div>
          
          <div className="text-center group">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
              <span className="text-blue-600 text-2xl">🛒</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Shop Plants</h3>
            <p className="text-gray-600">Browse and purchase plants from our curated collection</p>
          </div>
          
          <div className="text-center group">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
              <span className="text-purple-600 text-2xl">🌳</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Join Drives</h3>
            <p className="text-gray-600">Participate in tree plantation drives in your area</p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-green-50 to-blue-50 rounded-xl mb-16 shadow-lg">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Simple Pricing</h2>
          <p className="text-gray-600">Choose the plan that works best for you</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-8 max-w-4xl mx-auto">
          <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Free Plan</h3>
            <div className="text-4xl font-bold text-green-600 mb-4">$0<span className="text-lg text-gray-500">/month</span></div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center text-gray-600">
                <span className="text-green-600 mr-2">✓</span>
                Basic plant identification
              </li>
              <li className="flex items-center text-gray-600">
                <span className="text-green-600 mr-2">✓</span>
                Access to plant shop
              </li>
              <li className="flex items-center text-gray-600">
                <span className="text-green-600 mr-2">✓</span>
                Community access
              </li>
            </ul>
            <button className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold">
              Get Started
            </button>
          </div>
          
          <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-green-500 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
              Popular
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Pro Plan</h3>
            <div className="text-4xl font-bold text-green-600 mb-4">$9<span className="text-lg text-gray-500">/month</span></div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center text-gray-600">
                <span className="text-green-600 mr-2">✓</span>
                Advanced plant identification
              </li>
              <li className="flex items-center text-gray-600">
                <span className="text-green-600 mr-2">✓</span>
                Plant health analysis
              </li>
              <li className="flex items-center text-gray-600">
                <span className="text-green-600 mr-2">✓</span>
                Priority drive access
              </li>
              <li className="flex items-center text-gray-600">
                <span className="text-green-600 mr-2">✓</span>
                Plant care reminders
              </li>
            </ul>
            <button className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold">
              Upgrade Now
            </button>
          </div>
        </div>
      </section>

      <footer className="bg-gradient-to-r from-slate-800 to-slate-900 text-white py-16 rounded-xl shadow-2xl">
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mr-4">
              <IconComponent name="Leaf" className="text-white text-xl" />
            </div>
            <h3 className="text-3xl font-bold">Plantify</h3>
          </div>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of plant enthusiasts in making the world a greener place. 
            Every plant identified, every tree planted makes a difference.
          </p>
          <div className="flex justify-center space-x-8 mb-8">
            <button className="text-gray-300 hover:text-white transition-colors">About Us</button>
            <button className="text-gray-300 hover:text-white transition-colors">Contact</button>
            <button className="text-gray-300 hover:text-white transition-colors">Privacy</button>
            <button className="text-gray-300 hover:text-white transition-colors">Terms</button>
          </div>
          <p className="text-gray-400 text-sm">© 2024 Plantify. All rights reserved. Made with 💚 for nature.</p>
        </div>
      </footer>
    </div>
  );

  const renderProfile = () => (
    <div className="page-content">
      <div className="page-header">
        <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
        <p className="text-gray-600 mt-2">Manage your account and preferences</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
        <div className="flex items-center mb-6">
          <div className="relative mr-6 group">
            <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center shadow-lg">
              <IconComponent name="User" className="text-3xl text-green-600" />
            </div>
            <button className="absolute bottom-0 right-0 bg-green-600 text-white p-2 rounded-full shadow-lg hover:bg-green-700 transition-all">
              <IconComponent name="Camera" className="text-sm" />
            </button>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{user?.name || 'Ali Qureshi'}</h2>
            <p className="text-gray-600">Plant Enthusiast</p>
            <p className="text-gray-600">Member since: January 2024</p>
            <div className="flex items-center mt-2">
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-sm">⭐</span>
                ))}
              </div>
              <span className="text-sm text-gray-500 ml-2">Plant Expert</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 text-center">
          <div className="group cursor-pointer">
            <div className="bg-green-50 rounded-lg p-4 group-hover:bg-green-100 transition-colors">
              <h3 className="text-2xl font-bold text-gray-800">42</h3>
              <p className="text-gray-600">Plants Identified</p>
            </div>
          </div>
          <div className="group cursor-pointer">
            <div className="bg-blue-50 rounded-lg p-4 group-hover:bg-blue-100 transition-colors">
              <h3 className="text-2xl font-bold text-gray-800">15</h3>
              <p className="text-gray-600">Drives Joined</p>
            </div>
          </div>
          <div className="group cursor-pointer">
            <div className="bg-purple-50 rounded-lg p-4 group-hover:bg-purple-100 transition-colors">
              <h3 className="text-2xl font-bold text-gray-800">1000</h3>
              <p className="text-gray-600">Points Earned</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Achievements</h3>
        <div className="flex flex-wrap gap-3">
          <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold hover:bg-green-200 transition-colors cursor-pointer">
            🌱 Plant Lover
          </div>
          <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold hover:bg-blue-200 transition-colors cursor-pointer">
            📱 Tech Savvy
          </div>
          <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold hover:bg-purple-200 transition-colors cursor-pointer">
            🏆 Top Contributor
          </div>
          <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold hover:bg-yellow-200 transition-colors cursor-pointer">
            ⭐ Expert Identifier
          </div>
        </div>
      </div>

      <div className="mt-6">
        <button 
          onClick={handleLogout}
          className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition-all font-semibold shadow-lg"
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
        return <PlantShop />;
      case 'my-drives':
        return <UserDrives />;
      case 'profile':
        return renderProfile();
      default:
        return renderDashboard();
    }
  };

  if (isLoading) return <PageLoader />;

  return (
    <div className="dashboard-container min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50 w-full m-0 p-0">
      <header className="bg-white/90 backdrop-blur-md shadow-lg px-6 py-4 flex items-center justify-between sticky top-0 z-50 border-b border-gray-200/50">
        <div className="flex items-center">
          <div className="flex items-center group">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-full mr-3 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all">
              <IconComponent name="Leaf" className="text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
              Plantify
            </span>
          </div>
        </div>
        
        <nav className="flex space-x-8">
          <button 
            onClick={() => navigateToPage('dashboard')}
            className={`transition-all duration-300 font-medium px-4 py-2 rounded-lg hover:bg-green-50 transform hover:scale-105 ${
              currentPage === 'dashboard' ? 'text-green-600 bg-green-50 shadow-md' : 'text-gray-600 hover:text-green-600'
            }`}
          >
            Dashboard
          </button>
          <button 
            onClick={() => navigateToPage('shop')}
            className={`transition-all duration-300 font-medium px-4 py-2 rounded-lg hover:bg-green-50 transform hover:scale-105 ${
              currentPage === 'shop' ? 'text-green-600 bg-green-50 shadow-md' : 'text-gray-600 hover:text-green-600'
            }`}
          >
            Plant Store
          </button>
          <button 
            onClick={() => { window.location.href = '/drives'; }}
            className="transition-all duration-300 font-medium px-4 py-2 rounded-lg hover:bg-green-50 transform hover:scale-105 text-gray-600 hover:text-green-600"
          >
            Plantation Drives
          </button>
          <button 
            onClick={() => { window.location.href = '/user/create-drive'; }}
            className="transition-all duration-300 font-medium px-4 py-2 rounded-lg hover:bg-green-50 transform hover:scale-105 text-gray-600 hover:text-green-600"
          >
            Create Drive
          </button>
          <button 
            onClick={() => navigateToPage('profile')}
            className={`transition-all duration-300 font-medium px-4 py-2 rounded-lg hover:bg-green-50 transform hover:scale-105 ${
              currentPage === 'profile' ? 'text-green-600 bg-green-50 shadow-md' : 'text-gray-600 hover:text-green-600'
            }`}
          >
            Profile
          </button>
        </nav>
        
        <div className="flex items-center space-x-4">
          <button className="text-gray-600 hover:text-green-600 transition-all font-medium hover:scale-105 transform">
            Support
          </button>
          <div className="relative">
            <button
              onClick={() => setShowNotifications(prev => !prev)}
              className="text-gray-600 hover:text-green-600 transition-all font-medium hover:scale-105 transform relative"
            >
              🔔
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full px-1 min-w-[16px] h-4 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                <div className="flex items-center justify-between px-3 py-2 border-b">
                  <div className="text-sm font-semibold text-gray-700">Notifications</div>
                  {unreadCount > 0 && (
                    <button onClick={markAllRead} className="text-xs text-green-600">Mark all read</button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-sm text-gray-500">No notifications</div>
                  ) : (
                    notifications.map(n => (
                      <button
                        key={n._id}
                        onClick={async () => {
                          if (!n.read) {
                            await authFetch(`/api/notifications/${n._id}/read`, { method: 'PATCH' });
                            setNotifications(prev => prev.map(x => x._id === n._id ? { ...x, read: true } : x));
                          }
                          if (n.link) window.location.href = n.link;
                        }}
                        className={`w-full text-left px-3 py-2 border-b last:border-0 hover:bg-gray-50 ${n.read ? 'bg-white' : 'bg-green-50'}`}
                      >
                        <div className="text-sm font-medium text-gray-800">{n.title}</div>
                        <div className="text-xs text-gray-600">{n.message}</div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
          <button className="text-gray-600 hover:text-green-600 transition-all font-medium hover:scale-105 transform">
            Sign In
          </button>
          <button className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-2 rounded-full hover:from-green-700 hover:to-green-800 transition-all font-medium shadow-lg hover:shadow-xl hover:scale-105 transform">
            Start Plant Journey
          </button>
        </div>
      </header>

      <main className="w-full m-0 p-0" style={{minHeight: '100vh'}}>
        {renderPageContent()}
      </main>

      {toast && (
        <div className="fixed bottom-6 right-6 bg-white border border-green-200 shadow-xl rounded-lg p-4 z-50 min-w-[280px] animate-slide-up">
          <div className="font-semibold text-gray-800 mb-1">{toast.title}</div>
          <div className="text-sm text-gray-600 mb-3">{toast.message}</div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setToast(null)}
              className="px-3 py-1 rounded-md text-gray-600 hover:bg-gray-100"
            >
              Dismiss
            </button>
            {toast.link && (
              <button
                onClick={() => {
                  window.location.href = toast.link;
                  setToast(null);
                }}
                className="px-3 py-1 rounded-md text-white bg-green-600 hover:bg-green-700"
              >
                View
              </button>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in { animation: fade-in 0.6s ease-out; }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out; }
        .animate-slide-up { animation: slide-up 0.3s ease-out; }
      `}</style>
    </div>
    );
};

export default PlantifyDashboard;