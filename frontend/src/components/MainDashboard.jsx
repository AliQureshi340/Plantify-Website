import React, { useState } from 'react';
import '../styles/MainDashboardStyles.css';
import '../styles/MainDashboardAnimations.js';
import { useNavigate } from 'react-router-dom';
import { 
  Leaf, 
  Camera, 
  ShoppingCart, 
  Calendar, 
  Trophy, 
  Bell,
  User,
  Shield,
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

const handleLoginClick = (type) => {
  if (type === 'admin') {
    navigate('/admin');
  } else if (type === 'nursery') {
    navigate('/nursery');
  } else {
    navigate('/user');
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
              <button
                onClick={() => handleLoginClick('user')}
                className="btn btn-primary flex items-center space-x-2 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
              >
                <User className="h-4 w-4" />
                <span>User Login</span>
              </button>
              <button
                onClick={() => handleLoginClick('nursery')}
                className="btn btn-nursery flex items-center space-x-2 px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
              >
                <Store className="h-4 w-4" />
                <span>Nursery Login</span>
              </button>
              <button
                onClick={() => handleLoginClick('admin')}
                className="btn btn-secondary flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-700 transition-colors"
              >
                <Shield className="h-4 w-4" />
                <span>Admin Login</span>
              </button>
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
              className="btn btn-primary hero-cta px-8 py-4 rounded-lg text-lg font-semibold flex items-center space-x-2 bg-green-600 text-white hover:bg-green-700"
            >
              <span>Start as User</span>
              <ArrowRight className="h-5 w-5" />
            </button>
            <button
              onClick={() => handleLoginClick('nursery')}
              className="btn btn-nursery hero-cta px-8 py-4 rounded-lg text-lg font-semibold flex items-center space-x-2 bg-emerald-600 text-white hover:bg-emerald-700"
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-8">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow feature-card">
                  <div className={`${feature.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                    <Icon className="h-6 w-6 text-white feature-icon" />
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2 feature-title">{feature.title}</h4>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Nursery Features Section */}
      <section className="py-20 bg-emerald-50 nursery-features-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">For Nursery Owners & Plant Retailers</h3>
            <p className="text-xl text-gray-600">Powerful tools to manage your nursery business efficiently</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {nurseryFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow nursery-feature-card">
                  <div className={`${feature.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                    <Icon className="h-6 w-6 text-white nursery-feature-icon" />
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2 nursery-feature-title">{feature.title}</h4>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
          <div className="text-center mt-12">
            <button
              onClick={() => handleLoginClick('nursery')}
              className="btn bg-emerald-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-emerald-700 transition-colors flex items-center space-x-2 mx-auto"
            >
              <Store className="h-5 w-5" />
              <span>Start Your Nursery Dashboard</span>
            </button>
          </div>
        </div>
      </section>

      {/* Three-Panel CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 multi-cta-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-4">Choose Your Plant Journey</h3>
            <p className="text-xl text-green-100">Join our community in different ways</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* User Panel */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center hover:bg-white/20 transition-all cta-panel">
              <User className="h-16 w-16 text-white mx-auto mb-4" />
              <h4 className="text-2xl font-bold text-white mb-4">Plant Enthusiast</h4>
              <p className="text-green-100 mb-6">
                Track your plants, identify species, join community drives, and shop from local nurseries
              </p>
              <button
                onClick={() => handleLoginClick('user')}
                className="btn bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors w-full"
              >
                Join as User
              </button>
            </div>

            {/* Nursery Panel */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center hover:bg-white/20 transition-all cta-panel">
              <Store className="h-16 w-16 text-white mx-auto mb-4" />
              <h4 className="text-2xl font-bold text-white mb-4">Nursery Owner</h4>
              <p className="text-green-100 mb-6">
                Manage inventory, process orders, track sales, and grow your plant retail business
              </p>
              <button
                onClick={() => handleLoginClick('nursery')}
                className="btn bg-emerald-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-600 transition-colors w-full"
              >
                Join as Nursery
              </button>
            </div>

            {/* Admin Panel */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center hover:bg-white/20 transition-all cta-panel">
              <Shield className="h-16 w-16 text-white mx-auto mb-4" />
              <h4 className="text-2xl font-bold text-white mb-4">Administrator</h4>
              <p className="text-green-100 mb-6">
                Manage the platform, oversee operations, and ensure smooth functioning of the ecosystem
              </p>
              <button
                onClick={() => handleLoginClick('admin')}
                className="btn bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors w-full"
              >
                Admin Access
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MainDashboard;