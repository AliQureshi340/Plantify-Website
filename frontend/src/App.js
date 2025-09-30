import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { AuthProvider, ProtectedRoute } from './components/AuthSystem';


import PlantifyDashboard from './PlantifyDashboard';
import PlantShop from './components/PlantShop';
import MainDashboard from './components/MainDashboard';
import NurseryDashboard from './components/NurseryDashboard';
import ForestRestoration from './components/ForestRestoration';
import Drives from './components/Drives';
import AdminDrives from './components/AdminDrives';
import AdminAnalytics from './components/AdminAnalytics';
import AdminDriveParticipants from './components/AdminDriveParticipants';
import CreateDrive from './components/CreateDrive';
import UserDrives from './components/UserDrives';
import AdminDriveVerification from './components/AdminDriveVerification';

// Wrapper to pass :id param to AdminDriveParticipants
const AdminDriveParticipantsWrapper = () => {
  const { id } = useParams();
  return <AdminDriveParticipants driveId={id} />;
};

function App() {
 return (
   <AuthProvider>
     <Router>
       <div className="App">
         
         <Routes>
           {/* Public Routes */}
           <Route path="/" element={<MainDashboard />} />
           <Route path="/shop" element={<PlantShop />} />
          <Route path="/drives" element={<Drives />} />
           
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
           
           <Route 
             path="/user/create-drive" 
             element={
               <ProtectedRoute requiredRole="user">
                 <CreateDrive />
               </ProtectedRoute>
             } 
           />
           
           <Route 
             path="/user/my-drives" 
             element={
               <ProtectedRoute requiredRole="user">
                 <UserDrives />
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

          {/* Protected Admin Routes */}
          <Route
            path="/admin/drives"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDrives />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/drives/analytics"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminAnalytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/drives/:id/participants"
            element={
              <ProtectedRoute requiredRole="admin">
                {/* we use a wrapper to read :id from url in component */}
                <AdminDriveParticipantsWrapper />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/drives/verification"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDriveVerification />
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