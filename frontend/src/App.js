import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PlantifyDashboard from './PlantifyDashboard';
import PlantShop from './components/PlantShop';
import PlantationDrives from './components/PlantationDrives';
import PlantationMap from './components/PlantationMap';
import MainDashboard from './components/MainDashboard';
import AdminDashboard from './components/AdminDashboard';
import NurseryDashboard from './components/NurseryDashboard';
import ForestRestoration from './components/ForestRestoration';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Main Dashboard - Landing Page */}
          <Route path="/" element={<MainDashboard />} />
          
          {/* User Dashboard & Features */}
          <Route path="/user" element={<PlantifyDashboard />} />
          <Route path="/shop" element={<PlantShop />} />
          <Route path="/plantation-drives" element={<PlantationDrives />} />
          <Route path="/plantation-map" element={<PlantationMap />} />
          
          <Route path="/forest-restoration" element={<ForestRestoration />} />
          
          {/* Admin Dashboard */}
          <Route path="/admin" element={<AdminDashboard />} />
          
          {/* Nursery Dashboard */}
          <Route path="/nursery" element={<NurseryDashboard />} />
          
          {/* Legacy Routes */}
          <Route path="/plantify" element={<Navigate to="/user" replace />} />
          
          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;