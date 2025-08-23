// routes/userRoutes.js
const express = require('express');
const userAuthController = require('../controllers/userAuthController');
const upload = require('../middleware/upload');

const router = express.Router();

// Authentication Routes
router.post('/signup', userAuthController.signup);
router.post('/login', userAuthController.login);
router.get('/logout', userAuthController.logout);

router.post('/forgot-password', userAuthController.forgotPassword);
router.patch('/reset-password/:token', userAuthController.resetPassword);
router.get('/verify-email/:token', userAuthController.verifyEmail);

// Protected Routes (User must be logged in)
router.use(userAuthController.protect);

router.get('/me', userAuthController.getMe);
router.patch('/update-me', upload.single('profileImage'), userAuthController.updateMe);
router.delete('/delete-me', userAuthController.deleteMe);
router.patch('/update-password', userAuthController.updatePassword);

// Plant-related routes
router.post('/add-plant', userAuthController.addPlantToCollection);
router.post('/record-identification', userAuthController.recordIdentification);

module.exports = router;