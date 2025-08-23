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
  LogIn,
  ArrowRight,
  Users,
  Heart,
  Star,
  X
} from 'lucide-react';

const MainDashboard = () => {
  const navigate = useNavigate();

const handleLoginClick = (type) => {
  if (type === 'admin') {
    navigate('/admin');
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

  const stats = [
    { label: 'Active Users', value: '10,000+', icon: Users },
    { label: 'Plants Identified', value: '50,000+', icon: Camera },
    { label: 'Trees Planted', value: '25,000+', icon: Leaf },
    { label: 'Happy Gardeners', value: '8,500+', icon: Heart }
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
            <div className="flex space-x-4">
              <button
                onClick={() => handleLoginClick('user')}
                className="btn btn-primary flex items-center space-x-2 px-4 py-2 rounded-lg"
              >
                <User className="h-4 w-4" />
                <span>User Login</span>
              </button>
              <button
                onClick={() => handleLoginClick('admin')}
                className="btn btn-secondary flex items-center space-x-2 px-4 py-2 rounded-lg"
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
            Your Complete Plant Care Companion
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto hero-subtitle">
            Track, identify, and nurture your plants with AI-powered insights. Join community drives, 
            shop for supplies, and become part of the green revolution.
          </p>
          <button
            onClick={() => handleLoginClick('user')}
            className="btn btn-primary hero-cta px-8 py-4 rounded-lg text-lg font-semibold flex items-center space-x-2 mx-auto"
          >
            <span>Get Started</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white stats-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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

      {/* Features Section */}
      <section className="py-20 features-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Everything You Need for Plant Care</h3>
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

      {/* CTA Section */}
      <section className="py-20 bg-green-600 cta-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center cta-content">
          <h3 className="text-3xl font-bold text-white mb-4">Ready to Start Your Plant Journey?</h3>
          <p className="text-xl text-green-100 mb-8">Join thousands of plant enthusiasts already using Plantify</p>
          <button
            onClick={() => handleLoginClick('user')}
            className="btn bg-white text-green-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Sign Up Now
          </button>
        </div>
      </section>
    </div>
  );
};

export default MainDashboard;