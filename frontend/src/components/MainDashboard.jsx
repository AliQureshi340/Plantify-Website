import React, { useState } from 'react';
import '../styles/MainDashboardStyles.css';
import '../styles/MainDashboardAnimations.js';
import { useNavigate } from 'react-router-dom';
import { AuthModal, useAuth } from './AuthSystem';
import { 
  Leaf, 
  Camera, 
  ShoppingCart, 
  Calendar, 
  Trophy, 
  Bell,
  User,
  Store,
  LogIn,
  ArrowRight,
  Users,
  Heart,
  Star,
  X,
  Package,
  BarChart3,
  Truck
} from 'lucide-react';

const MainDashboard = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalType, setAuthModalType] = useState('login');
  const [selectedUserType, setSelectedUserType] = useState('user'); // Track which type was selected

  const handleLoginClick = (type) => {
    if (isAuthenticated) {
      // User is already logged in, redirect based on their role or selected type
      if (user.role === 'nursery' || type === 'nursery') {
        navigate('/nursery');
      } else {
        navigate('/user');
      }
    } else {
      // User not logged in, show auth modal with proper type
      setSelectedUserType(type); // Set the user type first
      setAuthModalType(type === 'nursery' ? 'register' : 'login');
      setShowAuthModal(true);
    }
  };

  const features = [
    {
      icon: Leaf,
      title: 'Plant Dashboard',
      description: 'Track your plants, get care reminders, and monitor growth progress',
      color: 'bg-green-500'
    },
    {
      icon: Camera,
      title: 'Plant Identification',
      description: 'Upload plant images and get AI-powered analysis and identification',
      color: 'bg-blue-500'
    },
    {
      icon: ShoppingCart,
      title: 'Plant Store',
      description: 'Buy plants, fertilizers, tools and gardening supplies',
      color: 'bg-orange-500'
    },
    {
      icon: Calendar,
      title: 'Plantation Drives',
      description: 'Join community plantation events and environmental initiatives',
      color: 'bg-purple-500'
    },
    {
      icon: Trophy,
      title: 'Community & Rewards',
      description: 'Share stories, earn points, and climb the leaderboards',
      color: 'bg-yellow-500'
    },
    {
      icon: Bell,
      title: 'Smart Notifications',
      description: 'Get timely reminders for plant care and upcoming events',
      color: 'bg-red-500'
    }
  ];

  // Add nursery-specific features
  const nurseryFeatures = [
    {
      icon: Package,
      title: 'Inventory Management',
      description: 'Manage plant stock, track inventory levels, and handle orders efficiently',
      color: 'bg-emerald-500'
    },
    {
      icon: BarChart3,
      title: 'Sales Analytics',
      description: 'Monitor sales performance, generate reports, and track revenue',
      color: 'bg-indigo-500'
    },
    {
      icon: Users,
      title: 'Customer Management',
      description: 'Handle customer orders, track purchases, and build relationships',
      color: 'bg-pink-500'
    },
    {
      icon: Truck,
      title: 'Order Fulfillment',
      description: 'Process orders, manage deliveries, and handle pickup schedules',
      color: 'bg-cyan-500'
    }
  ];

  const stats = [
    { label: 'Active Users', value: '10,000+', icon: Users },
    { label: 'Plants Identified', value: '50,000+', icon: Camera },
    { label: 'Trees Planted', value: '25,000+', icon: Leaf },
    { label: 'Happy Gardeners', value: '8,500+', icon: Heart },
    { label: 'Partner Nurseries', value: '150+', icon: Store },
    { label: 'Plants Sold', value: '75,000+', icon: ShoppingCart }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2 logo">
              <Leaf className="h-8 w-8 text-green-600" />
              <h1 className="text-2xl font-bold text-gray-900">Plantify</h1>
            </div>
            <div className="flex space-x-3">
              {isAuthenticated ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <span style={{ color: '#666' }}>Welcome, {user.name}</span>
                  <button
                    onClick={() => {
                      if (user.role === 'nursery') navigate('/nursery');
                      else navigate('/user');
                    }}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    Go to Dashboard
                  </button>
                  <button
                    onClick={logout}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => handleLoginClick('user')}
                    className="btn btn-primary flex items-center space-x-2 px-4 py-2 rounded-lg"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 16px',
                      backgroundColor: '#16a34a',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '500'
                    }}
                  >
                    <User className="h-4 w-4" />
                    <span>User Login</span>
                  </button>
                  <button
                    onClick={() => handleLoginClick('nursery')}
                    className="btn btn-nursery flex items-center space-x-2 px-4 py-2 rounded-lg"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 16px',
                      backgroundColor: '#059669',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '500'
                    }}
                  >
                    <Store className="h-4 w-4" />
                    <span>Nursery Login</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 hero-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6 hero-title">
            Your Complete Plant Ecosystem
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto hero-subtitle">
            Track, identify, and nurture your plants with AI-powered insights. Join community drives, 
            shop from trusted nurseries, and become part of the green revolution.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => handleLoginClick('user')}
              className="btn btn-primary hero-cta px-8 py-4 rounded-lg text-lg font-semibold flex items-center space-x-2"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '16px 32px',
                backgroundColor: '#16a34a',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '18px',
                fontWeight: '600'
              }}
            >
              <span>Start as User</span>
              <ArrowRight className="h-5 w-5" />
            </button>
            <button
              onClick={() => handleLoginClick('nursery')}
              className="btn btn-nursery hero-cta px-8 py-4 rounded-lg text-lg font-semibold flex items-center space-x-2"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '16px 32px',
                backgroundColor: '#059669',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '18px',
                fontWeight: '600'
              }}
            >
              <span>Join as Nursery</span>
              <Store className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white stats-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '20px' }}>
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center stat-card">
                  <div className="flex justify-center mb-4">
                    <Icon className="h-12 w-12 text-green-600 stat-icon" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2 stat-value">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

    {/* User Features Section */}
<section className="py-20 features-section">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-16">
      <h3 className="text-3xl font-bold text-gray-900 mb-4">For Plant Lovers & Gardeners</h3>
      <p className="text-xl text-gray-600">Comprehensive tools to help you become a better gardener</p>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px' }}>
      {features.map((feature, index) => {
        const Icon = feature.icon;
        return (
          <div key={index} className="feature-card">
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '8px',
              backgroundColor: feature.color === 'bg-green-500' ? '#22c55e' :
                               feature.color === 'bg-blue-500' ? '#3b82f6' :
                               feature.color === 'bg-orange-500' ? '#f97316' :
                               feature.color === 'bg-purple-500' ? '#a855f7' :
                               feature.color === 'bg-yellow-500' ? '#eab308' : '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px'
            }}>
              <Icon className="feature-icon h-6 w-6 text-white" />
            </div>
           <h4 className="feature-title" style={{ fontSize: '20px', marginBottom: '8px' }}>{feature.title}</h4>
<p>{feature.description}</p>
          </div>
        );
      })}
    </div>
  </div>
</section>

      {/* Nursery Features Section */}
<section style={{ padding: '80px 0', backgroundColor: '#ecfdf5' }}>
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-16">
      <h3 className="text-3xl font-bold text-gray-900 mb-4">For Nursery Owners & Plant Retailers</h3>
      <p className="text-xl text-gray-600">Powerful tools to manage your nursery business efficiently</p>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '25px' }}>
      {nurseryFeatures.map((feature, index) => {
        const Icon = feature.icon;
        return (
          <div key={index} className="feature-card">
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '8px',
              backgroundColor: feature.color === 'bg-emerald-500' ? '#10b981' :
                               feature.color === 'bg-indigo-500' ? '#6366f1' :
                               feature.color === 'bg-pink-500' ? '#ec4899' : '#06b6d4',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px'
            }}>
              <Icon className="feature-icon h-6 w-6 text-white" />
            </div>
            <h4 className="feature-title" style={{ fontSize: '20px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>{feature.title}</h4>
            <p style={{ color: '#6b7280' }}>{feature.description}</p>
          </div>
        );
      })}
    </div>
    <div className="text-center mt-12">
      <button
        onClick={() => handleLoginClick('nursery')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '16px 32px',
          backgroundColor: '#059669',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '18px',
          fontWeight: '600',
          margin: '0 auto'
        }}
      >
        <Store className="h-5 w-5" />
        <span>Start Your Nursery Dashboard</span>
      </button>
    </div>
  </div>
</section>

      {/* Two-Panel CTA Section */}
      <section style={{ 
        padding: '80px 0', 
        background: 'linear-gradient(to right, #16a34a, #059669)' 
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-4">Choose Your Plant Journey</h3>
            <p className="text-xl text-green-100">Join our community</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '25px' }}>
            {/* User Panel */}
            <div style={{
              backgroundColor: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '12px',
              padding: '32px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
            }}>
              <User style={{ width: '64px', height: '64px', color: 'white', margin: '0 auto 16px' }} />
              <h4 style={{ fontSize: '24px', fontWeight: 'bold', color: 'white', marginBottom: '16px' }}>Plant Enthusiast</h4>
              <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '24px' }}>
                Track your plants, identify species, join community drives, and shop from local nurseries
              </p>
              <button
                onClick={() => handleLoginClick('user')}
                style={{
                  width: '100%',
                  padding: '12px 24px',
                  backgroundColor: 'white',
                  color: '#16a34a',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Join as User
              </button>
            </div>

            {/* Nursery Panel */}
            <div style={{
              backgroundColor: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '12px',
              padding: '32px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
            }}>
              <Store style={{ width: '64px', height: '64px', color: 'white', margin: '0 auto 16px' }} />
              <h4 style={{ fontSize: '24px', fontWeight: 'bold', color: 'white', marginBottom: '16px' }}>Nursery Owner</h4>
              <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '24px' }}>
                Manage inventory, process orders, track sales, and grow your plant retail business
              </p>
              <button
                onClick={() => handleLoginClick('nursery')}
                style={{
                  width: '100%',
                  padding: '12px 24px',
                  backgroundColor: '#059669',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Join as Nursery
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Auth Modal - Now properly passes the selectedUserType */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        initialMode={authModalType}
        userType={selectedUserType} // This is the key fix - passing the selected user type
      />
    </div>
  );
};

export default MainDashboard;