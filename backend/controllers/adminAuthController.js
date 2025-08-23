// controllers/adminAuthController.js
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const Admin = require('../models/Admin');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Email = require('../utils/email');

// Generate JWT Token
const signToken = (id) => {
  return jwt.sign({ id, type: 'admin' }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '90d'
  });
};

// Send JWT Token Response
const createSendToken = (admin, statusCode, res, req) => {
  const token = signToken(admin._id);
  
  const cookieOptions = {
    expires: new Date(
      Date.now() + (process.env.JWT_COOKIE_EXPIRES_IN || 90) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
  };

  res.cookie('adminJwt', token, cookieOptions);

  // Remove password from output
  admin.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      admin
    }
  });
};

// Admin Registration (Super Admin Only)
exports.createAdmin = catchAsync(async (req, res, next) => {
  // Check if requesting user is super admin
  if (req.admin.role !== 'super-admin') {
    return next(new AppError('Only super admins can create new admin accounts', 403));
  }

  const {
    firstName,
    lastName,
    email,
    password,
    passwordConfirm,
    role,
    department,
    phone,
    officeLocation,
    permissions
  } = req.body;

  // Check if passwords match
  if (password !== passwordConfirm) {
    return next(new AppError('Passwords do not match', 400));
  }

  // Check if admin already exists
  const existingAdmin = await Admin.findOne({ email });
  if (existingAdmin) {
    return next(new AppError('Admin with this email already exists', 400));
  }

  // Create new admin
  const newAdmin = await Admin.create({
    firstName,
    lastName,
    email,
    password,
    role: role || 'admin',
    department,
    phone,
    officeLocation,
    permissions: permissions || {}
  });

  // Send welcome email with login credentials
  try {
    const loginURL = `${req.protocol}://${req.get('host')}/admin/login`;
    
    await new Email(newAdmin, loginURL).sendAdminWelcome();

    res.status(201).json({
      status: 'success',
      message: 'Admin account created successfully! Welcome email sent.',
      data: {
        admin: {
          id: newAdmin._id,
          adminId: newAdmin.adminId,
          firstName: newAdmin.firstName,
          lastName: newAdmin.lastName,
          email: newAdmin.email,
          role: newAdmin.role,
          department: newAdmin.department
        }
      }
    });
  } catch (err) {
    return next(new AppError('Admin created but failed to send welcome email.', 500));
  }
});

// Admin Login
exports.login = catchAsync(async (req, res, next) => {
  const { email, password, adminId } = req.body;

  // Check if credentials are provided
  if ((!email && !adminId) || !password) {
    return next(new AppError('Please provide email/admin ID and password', 400));
  }

  // Find admin by email or adminId
  const query = email ? { email } : { adminId: adminId.toUpperCase() };
  const admin = await Admin.findOne(query).select('+password');

  // Check if admin exists and account is not locked
  if (!admin) {
    return next(new AppError('Invalid credentials', 401));
  }

  if (admin.isLocked) {
    return next(new AppError('Account is temporarily locked due to too many failed login attempts. Please try again later.', 423));
  }

  // Check password
  if (!(await admin.correctPassword(password, admin.password))) {
    await admin.incLoginAttempts();
    return next(new AppError('Invalid credentials', 401));
  }

  // Check if account is active
  if (!admin.isActive) {
    return next(new AppError('Your admin account has been deactivated. Please contact IT support.', 401));
  }

  // Reset login attempts on successful login
  if (admin.loginAttempts > 0) {
    await admin.resetLoginAttempts();
  }

  // Update last login and log activity
  const sessionInfo = {
    ipAddress: req.ip || req.connection.remoteAddress,
    userAgent: req.headers['user-agent']
  };

  await admin.updateLastLogin(sessionInfo);
  await admin.logActivity('login', 'system', 'Admin logged in', req);

  // Send token to client
  createSendToken(admin, 200, res, req);
});

// Admin Logout
exports.logout = catchAsync(async (req, res, next) => {
  // Log logout activity
  if (req.admin) {
    await req.admin.logActivity('logout', 'system', 'Admin logged out', req);
    
    // Mark session as inactive
    const sessionId = req.headers['session-id'];
    if (sessionId) {
      const session = req.admin.activeSessions.find(s => s.sessionId === sessionId);
      if (session) {
        session.isActive = false;
        await req.admin.save({ validateBeforeSave: false });
      }
    }
  }

  res.cookie('adminJwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  
  res.status(200).json({ 
    status: 'success',
    message: 'Logged out successfully'
  });
});

// Protect Admin Routes Middleware
exports.protect = catchAsync(async (req, res, next) => {
  // Get token from headers or cookies
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.adminJwt) {
    token = req.cookies.adminJwt;
  }

  if (!token) {
    return next(new AppError('You are not logged in! Please log in to access admin panel.', 401));
  }

  // Verify token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // Check if it's an admin token
  if (decoded.type !== 'admin') {
    return next(new AppError('Invalid admin token', 401));
  }

  // Check if admin still exists
  const currentAdmin = await Admin.findById(decoded.id);
  if (!currentAdmin) {
    return next(new AppError('The admin belonging to this token does no longer exist.', 401));
  }

  // Check if admin account is active
  if (!currentAdmin.isActive) {
    return next(new AppError('Your admin account has been deactivated.', 401));
  }

  // Check if account is locked
  if (currentAdmin.isLocked) {
    return next(new AppError('Your admin account is temporarily locked.', 423));
  }

  // Update last activity for session management
  const sessionId = req.headers['session-id'];
  if (sessionId) {
    const session = currentAdmin.activeSessions.find(s => s.sessionId === sessionId && s.isActive);
    if (session) {
      session.lastActivity = new Date();
      await currentAdmin.save({ validateBeforeSave: false });
    }
  }

  // Grant access to protected route
  req.admin = currentAdmin;
  next();
});

// Check Permissions Middleware
exports.restrictTo = (...permissions) => {
  return (req, res, next) => {
    if (req.admin.role === 'super-admin') {
      return next(); // Super admin has all permissions
    }

    const hasPermission = permissions.some(permission => {
      const [resource, action] = permission.split(':');
      return req.admin.hasPermission(resource, action);
    });

    if (!hasPermission) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }

    next();
  };
};

// Restrict by Role
exports.restrictToRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.admin.role)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }
    next();
  };
};

// Forgot Password
exports.forgotPassword = catchAsync(async (req, res, next) => {
  // Get admin based on email or adminId
  const { email, adminId } = req.body;
  
  if (!email && !adminId) {
    return next(new AppError('Please provide email or admin ID', 400));
  }

  const query = email ? { email } : { adminId: adminId.toUpperCase() };
  const admin = await Admin.findOne(query);

  if (!admin) {
    return next(new AppError('No admin found with that email/ID.', 404));
  }

  // Generate the random reset token
  const resetToken = crypto.randomBytes(32).toString('hex');
  admin.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  admin.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

  await admin.save({ validateBeforeSave: false });

  // Send it to admin's email
  try {
    const resetURL = `${req.protocol}://${req.get('host')}/api/admin/reset-password/${resetToken}`;

    await new Email(admin, resetURL).sendPasswordReset();

    // Log activity
    await admin.logActivity('password-reset-request', 'security', 'Password reset requested', req);

    res.status(200).json({
      status: 'success',
      message: 'Password reset token sent to your email!'
    });
  } catch (err) {
    admin.passwordResetToken = undefined;
    admin.passwordResetExpires = undefined;
    await admin.save({ validateBeforeSave: false });

    return next(new AppError('There was an error sending the email. Try again later.', 500));
  }
});

// Reset Password
exports.resetPassword = catchAsync(async (req, res, next) => {
  // Get admin based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const admin = await Admin.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  // If token has not expired, and there is an admin, set the new password
  if (!admin) {
    return next(new AppError('Token is invalid or has expired', 400));
  }

  const { password, passwordConfirm } = req.body;

  if (password !== passwordConfirm) {
    return next(new AppError('Passwords do not match', 400));
  }

  admin.password = password;
  admin.passwordResetToken = undefined;
  admin.passwordResetExpires = undefined;
  await admin.save();

  // Log activity
  await admin.logActivity('password-reset', 'security', 'Password reset completed', req);

  // Log the admin in, send JWT
  createSendToken(admin, 200, res, req);
});

// Update Password
exports.updatePassword = catchAsync(async (req, res, next) => {
  // Get admin from collection
  const admin = await Admin.findById(req.admin.id).select('+password');

  // Check if current password is correct
  if (!(await admin.correctPassword(req.body.passwordCurrent, admin.password))) {
    return next(new AppError('Your current password is incorrect.', 401));
  }

  // Check if new passwords match
  if (req.body.password !== req.body.passwordConfirm) {
    return next(new AppError('New passwords do not match', 400));
  }

  // If so, update password
  admin.password = req.body.password;
  await admin.save();

  // Log activity
  await admin.logActivity('password-change', 'security', 'Password updated', req);

  // Log admin in, send JWT
  createSendToken(admin, 200, res, req);
});

// Get Current Admin
exports.getMe = catchAsync(async (req, res, next) => {
  const admin = await Admin.findById(req.admin.id)
    .populate('plantationDrives.driveId')
    .select('-activities'); // Exclude activities for performance

  res.status(200).json({
    status: 'success',
    data: {
      admin
    }
  });
});

// Update Admin Profile
exports.updateMe = catchAsync(async (req, res, next) => {
  // Create error if admin POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('This route is not for password updates. Please use /update-password.', 400));
  }

  // Filter out unwanted fields
  const allowedFields = [
    'firstName', 'lastName', 'phone', 'officeLocation', 'profileImage',
    'bio', 'emergencyContact', 'workSchedule'
  ];
  
  const filteredBody = {};
  Object.keys(req.body).forEach(el => {
    if (allowedFields.includes(el)) filteredBody[el] = req.body[el];
  });

  // Update admin document
  const updatedAdmin = await Admin.findByIdAndUpdate(req.admin.id, filteredBody, {
    new: true,
    runValidators: true
  });

  // Log activity
  await updatedAdmin.logActivity('profile-update', 'profile', 'Profile information updated', req);

  res.status(200).json({
    status: 'success',
    data: {
      admin: updatedAdmin
    }
  });
});

// Get Admin Activity Log
exports.getActivityLog = catchAsync(async (req, res, next) => {
  const admin = await Admin.findById(req.admin.id).select('activities');
  
  // Sort activities by timestamp (newest first)
  const activities = admin.activities.sort((a, b) => b.timestamp - a.timestamp);

  res.status(200).json({
    status: 'success',
    results: activities.length,
    data: {
      activities
    }
  });
});

// Get All Active Sessions
exports.getActiveSessions = catchAsync(async (req, res, next) => {
  const admin = await Admin.findById(req.admin.id).select('activeSessions');
  
  const activeSessions = admin.activeSessions.filter(session => session.isActive);

  res.status(200).json({
    status: 'success',
    results: activeSessions.length,
    data: {
      sessions: activeSessions
    }
  });
});

// Terminate Session
exports.terminateSession = catchAsync(async (req, res, next) => {
  const { sessionId } = req.params;
  
  const admin = await Admin.findById(req.admin.id);
  const session = admin.activeSessions.find(s => s.sessionId === sessionId);
  
  if (!session) {
    return next(new AppError('Session not found', 404));
  }

  session.isActive = false;
  await admin.save({ validateBeforeSave: false });

  // Log activity
  await admin.logActivity('session-terminate', 'security', `Session ${sessionId} terminated`, req);

  res.status(200).json({
    status: 'success',
    message: 'Session terminated successfully'
  });
});

// Enable Two-Factor Authentication
exports.enableTwoFactor = catchAsync(async (req, res, next) => {
  const admin = await Admin.findById(req.admin.id);
  
  // Generate 2FA secret (you would use a library like speakeasy)
  const secret = require('crypto').randomBytes(32).toString('hex');
  
  admin.twoFactorSecret = secret;
  admin.twoFactorEnabled = true;
  await admin.save({ validateBeforeSave: false });

  // Log activity
  await admin.logActivity('2fa-enable', 'security', 'Two-factor authentication enabled', req);

  res.status(200).json({
    status: 'success',
    message: 'Two-factor authentication enabled successfully',
    data: {
      secret: secret // In production, return QR code instead
    }
  });
});

// Disable Two-Factor Authentication
exports.disableTwoFactor = catchAsync(async (req, res, next) => {
  const admin = await Admin.findById(req.admin.id);
  
  admin.twoFactorSecret = undefined;
  admin.twoFactorEnabled = false;
  await admin.save({ validateBeforeSave: false });

  // Log activity
  await admin.logActivity('2fa-disable', 'security', 'Two-factor authentication disabled', req);

  res.status(200).json({
    status: 'success',
    message: 'Two-factor authentication disabled successfully'
  });
});