import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PlantifyDashboard from './PlantifyDashboard';
import PlantifyShop from './components/shop/ShopComponents';
import PlantationDrives from './components/PlantationDrives';
import PlantationMap from './components/PlantationMap';
import MainDashboard from './components/MainDashboard';
import AdminDashboard from './components/AdminDashboard';
import PlantIdentification from './components/plantid/PlantIdentification';
import ForestRestoration from './components/ForestRestoration';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Main Routes */}
          <Route path="/" element={<MainDashboard />} />
          <Route path="/user" element={<PlantifyDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          
          {/* Feature Routes */}
          <Route path="/shop" element={<PlantifyShop />} />
          <Route path="/plantation-drives" element={<PlantationDrives />} />
          <Route path="/plantation-map" element={<PlantationMap />} />
          <Route path="/plant-identification" element={<PlantIdentification />} />
          <Route path="/forest-restoration" element={<ForestRestoration />} />
          
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