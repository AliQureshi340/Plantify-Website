import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, ProtectedRoute } from './components/AuthSystem';
import PlantifyDashboard from './PlantifyDashboard';
import PlantShop from './components/PlantShop';
import MainDashboard from './components/MainDashboard';
import NurseryDashboard from './components/NurseryDashboard';
import ForestRestoration from './components/ForestRestoration';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<MainDashboard />} />
            <Route path="/shop" element={<PlantShop />} />
            
            {/* Protected User Routes */}
            <Route 
              path="/user" 
              element={
                <ProtectedRoute requiredRole="user">
                  <PlantifyDashboard />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/forest-restoration" 
              element={
                <ProtectedRoute>
                  <ForestRestoration />
                </ProtectedRoute>
              } 
            />
            
           
            
            {/* Protected Nursery Routes */}
            <Route 
              path="/nursery" 
              element={
                <ProtectedRoute requiredRole="nursery">
                  <NurseryDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Legacy Routes */}
            <Route path="/plantify" element={<Navigate to="/user" replace />} />
            
            {/* Fallback Route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
