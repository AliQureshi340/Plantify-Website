// routes/adminRoutes.js
const express = require('express');
const adminAuthController = require('../controllers/adminAuthController');
const upload = require('../middleware/upload');

const router = express.Router();

// Authentication Routes (Public)
router.post('/login', adminAuthController.login);
router.get('/logout', adminAuthController.logout);
router.post('/forgot-password', adminAuthController.forgotPassword);
router.patch('/reset-password/:token', adminAuthController.resetPassword);

// Protected Routes (Admin must be logged in)
router.use(adminAuthController.protect);

// Profile Management
router.get('/me', adminAuthController.getMe);
router.patch('/update-me', upload.single('profileImage'), adminAuthController.updateMe);
router.patch('/update-password', adminAuthController.updatePassword);

// Activity & Security
router.get('/activity-log', adminAuthController.getActivityLog);
router.get('/active-sessions', adminAuthController.getActiveSessions);
router.delete('/sessions/:sessionId', adminAuthController.terminateSession);

// Two-Factor Authentication
router.patch('/enable-2fa', adminAuthController.enableTwoFactor);
router.patch('/disable-2fa', adminAuthController.disableTwoFactor);

// Admin Management (Super Admin Only)
router.post('/create-admin', 
  adminAuthController.restrictToRole('super-admin'),
  adminAuthController.createAdmin
);

// User Management Routes (with permission checks)
router.get('/users', 
  adminAuthController.restrictTo('users:view'),
  require('../controllers/userController').getAllUsers
);

router.get('/users/:id', 
  adminAuthController.restrictTo('users:view'),
  require('../controllers/userController').getUser
);

router.patch('/users/:id', 
  adminAuthController.restrictTo('users:edit'),
  require('../controllers/userController').updateUser
);

router.delete('/users/:id', 
  adminAuthController.restrictTo('users:delete'),
  require('../controllers/userController').deleteUser
);

// Plant Management Routes
router.get('/plants', 
  adminAuthController.restrictTo('plants:view'),
  require('../controllers/plantController').getAllPlants
);

router.post('/plants', 
  adminAuthController.restrictTo('plants:create'),
  upload.single('plantImage'),
  require('../controllers/plantController').createPlant
);

router.patch('/plants/:id', 
  adminAuthController.restrictTo('plants:edit'),
  upload.single('plantImage'),
  require('../controllers/plantController').updatePlant
);

router.delete('/plants/:id', 
  adminAuthController.restrictTo('plants:delete'),
  require('../controllers/plantController').deletePlant
);

// Content Management Routes
router.get('/content', 
  adminAuthController.restrictTo('content:view'),
  require('../controllers/contentController').getAllContent
);

router.post('/content', 
  adminAuthController.restrictTo('content:create'),
  upload.single('contentImage'),
  require('../controllers/contentController').createContent
);

router.patch('/content/:id', 
  adminAuthController.restrictTo('content:edit'),
  upload.single('contentImage'),
  require('../controllers/contentController').updateContent
);

router.patch('/content/:id/publish', 
  adminAuthController.restrictTo('content:publish'),
  require('../controllers/contentController').publishContent
);

router.delete('/content/:id', 
  adminAuthController.restrictTo('content:delete'),
  require('../controllers/contentController').deleteContent
);

// Analytics Routes
router.get('/analytics/dashboard', 
  adminAuthController.restrictTo('analytics:view'),
  require('../controllers/analyticsController').getDashboardStats
);

router.get('/analytics/users', 
  adminAuthController.restrictTo('analytics:view'),
  require('../controllers/analyticsController').getUserAnalytics
);

router.get('/analytics/plants', 
  adminAuthController.restrictTo('analytics:view'),
  require('../controllers/analyticsController').getPlantAnalytics
);

router.post('/analytics/export', 
  adminAuthController.restrictTo('analytics:export'),
  require('../controllers/analyticsController').exportData
);

// System Management Routes (Super Admin Only)
router.post('/system/backup', 
  adminAuthController.restrictToRole('super-admin'),
  require('../controllers/systemController').createBackup
);

router.post('/system/maintenance', 
  adminAuthController.restrictToRole('super-admin'),
  require('../controllers/systemController').toggleMaintenance
);

router.get('/system/logs', 
  adminAuthController.restrictToRole('super-admin'),
  require('../controllers/systemController').getSystemLogs
);

module.exports = router;