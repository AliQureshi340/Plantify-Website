import React, { useState } from 'react';
import { Search, Calendar, MapPin, Users, Star, ArrowRight, Play, Check, Phone, Mail, MessageCircle, Leaf } from 'lucide-react';

export default function PlantifyPlatform() {
  const [activeStep, setActiveStep] = useState(0);
  
  const steps = [
    { icon: '🌱', title: 'Plant Profile Setup', desc: 'Create your plant collection with detailed profiles and care schedules.' },
    { icon: '📷', title: 'Identify & Track', desc: 'Use AI identification and track your plants growth and health progress.' },
    { icon: '🌿', title: 'Care Reminders', desc: 'Get timely watering, fertilizing, and pruning notifications.' },
    { icon: '📊', title: 'Growth Analytics', desc: 'Monitor plant health with detailed analytics and insights.' },
    { icon: '🌳', title: 'Community & Share', desc: 'Connect with plant enthusiasts and share your gardening journey.' }
  ];

  return (
    <div className="bg-gradient-to-br from-gray-50 via-green-50 to-emerald-50">
      {/* Header */}
      <header className="relative z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg flex items-center justify-center">
                <Leaf className="text-white w-6 h-6" />
              </div>
              <span className="text-white font-bold text-xl">PLANTIFY</span>
            </div>
            
            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-600 hover:text-green-600 transition-colors font-medium">How it Works</a>
              <a href="#" className="text-gray-600 hover:text-green-600 transition-colors font-medium">Plant Care</a>
              <a href="#" className="text-gray-600 hover:text-green-600 transition-colors font-medium">Community</a>
            </nav>
            
            {/* Actions */}
            <div className="flex items-center space-x-4">
              <button className="text-gray-600 hover:text-green-600 transition-colors font-medium">Support</button>
              <button className="text-gray-600 hover:text-green-600 transition-colors font-medium">Sign In</button>
              <button className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition-all duration-200 font-medium shadow-sm">
                Start Plant Journey
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-200/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-green-300/40 rounded-full blur-2xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h4 className="text-green-600 font-semibold text-lg tracking-wide">DISCOVER PLANT CARE ONLINE</h4>
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-800 leading-tight">
                  Get <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-600">PLANTIFY</span> to Nurture your plants like never before...
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Plant care and discovery that's easy for beginners, powerful and flexible for all gardening enthusiasts.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-green-600 text-white px-8 py-4 rounded-full hover:bg-green-700 transition-all duration-200 font-semibold text-lg shadow-md hover:shadow-lg">
                  Start Growing
                </button>
                <button className="border-2 border-gray-300 text-gray-700 hover:text-green-600 hover:border-green-500 px-8 py-4 rounded-full transition-all duration-200 font-semibold text-lg">
                  Browse Plants
                </button>
              </div>
            </div>

            {/* Right Content - Plant Care Dashboard */}
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-green-200/30 shadow-2xl">
                {/* Plant Care Interface */}
                <div className="bg-gradient-to-br from-white to-green-50 rounded-xl p-6 mb-6 shadow-lg">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-gray-800 font-bold text-lg">Plant Care</h3>
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <Leaf className="text-white w-4 h-4" />
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <div className="text-sm text-gray-600">Indoor Plants</div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-800 font-medium">Monstera Deliciosa</span>
                          <div className="flex items-center space-x-2">
                            <button className="w-8 h-8 border border-green-300 rounded flex items-center justify-center text-green-600">💧</button>
                            <span className="font-bold text-green-600">Today</span>
                            <button className="w-8 h-8 border border-green-300 rounded flex items-center justify-center text-green-600">☀️</button>
                          </div>
                        </div>
                        <div className="text-green-600 font-bold">Healthy</div>
                      </div>
                      
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-800 font-medium">Snake Plant</span>
                          <div className="flex items-center space-x-2">
                            <button className="w-8 h-8 border border-yellow-300 rounded flex items-center justify-center text-yellow-600">💧</button>
                            <span className="font-bold text-yellow-600">3 days</span>
                            <button className="w-8 h-8 border border-yellow-300 rounded flex items-center justify-center text-yellow-600">☀️</button>
                          </div>
                        </div>
                        <div className="text-yellow-600">Needs Water</div>
                      </div>
                    </div>
                    
                    <button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-lg font-bold hover:from-green-600 hover:to-emerald-600 transition-all">
                      Add New Plant
                    </button>
                  </div>
                </div>

                {/* Dashboard Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-green-200/20">
                    <div className="text-2xl font-bold text-green-800">24</div>
                    <div className="text-green-600 text-sm">Plants in Collection</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-green-200/20">
                    <div className="text-2xl font-bold text-green-800">95%</div>
                    <div className="text-green-600 text-sm">Health Score</div>
                  </div>
                </div>

                {/* Growth Chart */}
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg p-4 text-white">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold">Growth Progress</span>
                    <span className="text-2xl font-bold">78%</span>
                  </div>
                  <div className="flex items-end space-x-1 h-12">
                    {[40, 60, 80, 100, 75, 90, 85].map((height, i) => (
                      <div key={i} className="bg-white/40 rounded-sm flex-1" style={{height: `${height/2}%`}}></div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-gradient-to-r from-lime-400 to-green-500 text-white p-3 rounded-lg shadow-lg">
                <div className="text-sm font-bold">1,240</div>
                <div className="text-xs">Care Points</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Video Hero Section - Right after ForestRestoration */}
    <section className="relative h-96 mb-12 rounded-xl overflow-hidden">
      <iframe
        className="w-full h-full object-cover"
        src="https://www.youtube.com/embed/YOUR_VIDEO_ID?autoplay=1&mute=1&loop=1&playlist=YOUR_VIDEO_ID"
        title="Plant Care Video"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
      
      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Discover Plant Care</h2>
          <p className="text-xl">Learn how to nurture your green companions</p>
        </div>
      </div>
    </section>

      {/* How it Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              How it <span className="text-green-500">Works</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-4">
              While Plantify is a powerful plant care system with comprehensive plant database at your disposal,
              our focus is to make it quick and easy to nurture your green companions.
            </p>
            <p className="text-lg text-gray-500">You'll be growing successfully in a few simple steps</p>
          </div>

          {/* Steps */}
          <div className="relative">
            {/* Connection Lines */}
            <div className="hidden lg:block absolute top-16 left-0 right-0 h-0.5 bg-gradient-to-r from-green-200 via-emerald-300 via-green-300 via-emerald-300 to-green-200"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
              {steps.map((step, index) => (
                <div key={index} className="relative">
                  {/* Icon */}
                  <div className={`w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center text-2xl ${
                    index === 0 ? 'bg-green-100 border-4 border-green-300' :
                    index === 1 ? 'bg-emerald-100 border-4 border-emerald-300' :
                    index === 2 ? 'bg-lime-100 border-4 border-lime-300' :
                    index === 3 ? 'bg-teal-100 border-4 border-teal-300' :
                    'bg-green-100 border-4 border-green-400'
                  }`}>
                    {step.icon}
                  </div>

                  {/* Card */}
                  <div className={`p-6 rounded-xl text-center h-48 flex flex-col justify-center ${
                    index === 0 ? 'bg-green-50 border-2 border-green-200' :
                    index === 1 ? 'bg-emerald-50 border-2 border-emerald-200' :
                    index === 2 ? 'bg-lime-50 border-2 border-lime-200' :
                    index === 3 ? 'bg-teal-50 border-2 border-teal-200' :
                    'bg-green-50 border-2 border-green-200'
                  }`}>
                    <h3 className={`font-bold text-lg mb-3 ${
                      index === 0 ? 'text-green-700' :
                      index === 1 ? 'text-emerald-700' :
                      index === 2 ? 'text-lime-700' :
                      index === 3 ? 'text-teal-700' :
                      'text-green-700'
                    }`}>
                      {step.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Dual Video Section */}
      <section className="py-16 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl mb-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-800 mb-4">See It In Action</h3>
            <p className="text-gray-600">Watch how our platform transforms plant care</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-4 shadow-lg">
              <div className="h-64 bg-gradient-to-br from-green-200 to-emerald-200 rounded-lg flex items-center justify-center">
                <div className="text-center text-green-800">
                  <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Play className="text-white w-8 h-8" />
                  </div>
                  <p className="font-semibold">Plant Identification Demo</p>
                </div>
              </div>
              <h4 className="text-lg font-bold mt-4 text-gray-800">Plant Identification</h4>
              <p className="text-gray-600">AI-powered plant recognition</p>
            </div>
            
            <div className="bg-white rounded-xl p-4 shadow-lg">
              <div className="h-64 bg-gradient-to-br from-emerald-200 to-lime-200 rounded-lg flex items-center justify-center">
                <div className="text-center text-green-800">
                  <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Play className="text-white w-8 h-8" />
                  </div>
                  <p className="font-semibold">Care Tracking Demo</p>
                </div>
              </div>
              <h4 className="text-lg font-bold mt-4 text-gray-800">Care Tracking</h4>
              <p className="text-gray-600">Monitor growth and health</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">Simple Pricing</h2>
            
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {['No Credit Card', 'Free Forever', 'Premium Features', 'Expert Support'].map((feature, i) => (
                <span key={i} className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium border border-green-200">
                  {feature}
                </span>
              ))}
            </div>

            <p className="text-gray-600 max-w-3xl mx-auto mb-4">
              Everyone gets access to basic plant care tools and community support, with unlimited plant profiles and care tracking.
            </p>
            <p className="text-gray-600">
              Premium features help advanced gardeners with detailed analytics and expert consultations.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-8 text-center">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Free Forever</h3>
              <div className="text-sm text-gray-600 mb-6">Perfect for beginners</div>
              
              <div className="mb-8">
                <div className="text-3xl font-bold text-gray-800">Free = Rs. 0</div>
                <div className="text-sm text-gray-600 mt-2">Complete access to basic plant care features.</div>
              </div>
              
              <p className="text-gray-600 text-sm">
                Plant identification, care reminders, and community access included
              </p>
            </div>

            {/* Premium Plan */}
            <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-8 text-center">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Premium Care</h3>
              <div className="text-sm text-gray-600 mb-6">For serious gardeners</div>
              
              <div className="mb-8">
                <div className="text-lg font-bold text-gray-800 mb-2">Monthly plan:</div>
                <div className="text-3xl font-bold text-gray-800">Rs. 299/month</div>
                <div className="text-xl text-gray-600">Advanced analytics</div>
                <div className="text-sm text-gray-600 mt-2">Expert plant consultations included</div>
              </div>
              
              <button className="w-full bg-emerald-600 text-white py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors mb-4">
                Start Premium
              </button>
              
              <p className="text-gray-600 text-sm">
                Advanced care schedules, disease diagnosis, and expert support
              </p>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-green-600 text-white rounded-xl p-8 text-center">
              <h3 className="text-xl font-bold mb-6">Nursery & Business</h3>
              
              <div className="mb-8">
                <p className="mb-6">
                  If you run a nursery or plant business and need custom plant management solutions, let's discuss!
                </p>
              </div>
              
              <button className="w-full bg-white text-green-600 py-3 rounded-lg font-medium hover:bg-green-50 transition-colors">
                Contact Sales
              </button>
            </div>
          </div>

          <div className="text-center mt-12 space-x-4">
            <button className="bg-green-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors">
              Start Growing
            </button>
            <button className="border border-green-300 text-green-700 px-8 py-3 rounded-lg font-medium hover:border-green-400 transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white pt-16 pb-0 mt-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Company Info */}
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg flex items-center justify-center">
                  <Leaf className="text-white w-6 h-6" />
                </div>
                <span className="text-white font-bold text-xl">PLANTIFY</span>
              </div>
              <p className="text-green-200 mb-6">
                Nurture, grow, and discover the joy of plant care like never before
              </p>
            </div>

            {/* Quick Links 1 */}
            <div>
              <ul className="space-y-3">
                <li><a href="#" className="text-green-200 hover:text-white transition-colors">Plant Care Guide</a></li>
                <li><a href="#" className="text-green-200 hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-green-200 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-green-200 hover:text-white transition-colors">Cookie Policy</a></li>
                <li><a href="#" className="text-green-200 hover:text-white transition-colors">Contact Support</a></li>
              </ul>
            </div>

            {/* Quick Links 2 */}
            <div>
              <ul className="space-y-3">
                <li><a href="#" className="text-green-200 hover:text-white transition-colors">Home</a></li>
                <li><a href="#" className="text-green-200 hover:text-white transition-colors">About Plantify</a></li>
                <li><a href="#" className="text-green-200 hover:text-white transition-colors">Plant Database</a></li>
                <li><a href="#" className="text-green-200 hover:text-white transition-colors">Community Garden</a></li>
                <li><a href="#" className="text-green-200 hover:text-white transition-colors">Growing Tips</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-white font-bold text-lg mb-4">Contact Us</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-green-400" />
                  <span className="text-green-200">support@plantify.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-green-400" />
                  <span className="text-green-200">+92 300 1234567</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MessageCircle className="h-4 w-4 text-green-400" />
                  <span className="text-green-200">@plantify_official</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MessageCircle className="h-4 w-4 text-green-400" />
                  <span className="text-green-200">plantify.community</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
<div className="pt-8 pb-0">
  <div className="bg-green-600 text-center py-4">
    <p className="text-white font-medium">
      © 2025 PLANTIFY - PLANT CARE & DISCOVERY PLATFORM
    </p>
  </div>
</div>
        </div>
      </footer>
    </div>
  );
}