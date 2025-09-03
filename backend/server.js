const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key';

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Create uploads directory if not exists
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/plantify-backend', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', async () => {
  console.log('✅ Connected to MongoDB');
  
  // Drop problematic indexes if they exist
  try {
    await mongoose.connection.db.collection('orders').dropIndex('orderNumber_1');
  } catch (error) {
    // Index doesn't exist, ignore
  }
});

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
  }
});
const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Configure nodemailer with Gmail - FIXED THE TYPO HERE
const transporter = nodemailer.createTransport({
  service: 'gmail',
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Test email configuration on startup
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email configuration error:', error.message);
    console.log('📧 Please check your EMAIL_USER and EMAIL_PASS in .env file');
  } else {
    console.log('✅ Email server is ready to send messages');
  }
});

// ==================== DATABASE SCHEMAS ====================

// User Schema with compound index for email + role
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  phone: { type: String, required: true, trim: true },
  address: { type: String, trim: true },
  city: { type: String, trim: true },
  postalCode: { type: String, trim: true },
  role: { 
    type: String, 
    enum: ['user', 'admin', 'nursery'], 
    default: 'user' 
  },
  profileImage: { type: String },
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Create compound unique index for email + role combination
userSchema.index({ email: 1, role: 1 }, { unique: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    this.updatedAt = new Date();
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

// OTP Schema with automatic expiry
const otpSchema = new mongoose.Schema({
  email: { type: String, required: true, lowercase: true, trim: true },
  otp: { type: String, required: true },
  role: { type: String, required: true, enum: ['user', 'nursery', 'admin'] },
  attempts: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, default: Date.now, expires: 300 } // 5 minutes expiry
});

// Create index for faster OTP lookups
otpSchema.index({ email: 1, role: 1, otp: 1 });

// Plant Schema
const plantSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  stock: { type: Number, required: true, min: 0 },
  discount: { type: Number, default: 0, min: 0, max: 100 },
  image: { type: String },
  description: { type: String, trim: true },
  sold: { type: Number, default: 0, min: 0 },
  nurseryId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Order Schema with automatic order number generation
const orderSchema = new mongoose.Schema({
  orderNumber: { 
    type: String, 
    unique: true,
    default: function() {
      return 'ORD' + Date.now() + Math.floor(Math.random() * 1000);
    }
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  customerName: { type: String, required: true, trim: true },
  customerEmail: { type: String, required: true, trim: true, lowercase: true },
  customerPhone: { type: String, required: true, trim: true },
  customerAddress: { type: String, required: true, trim: true },
  items: [{
    plantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Plant' },
    plantName: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 }
  }],
  total: { type: Number, required: true, min: 0 },
  status: { 
    type: String, 
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], 
    default: 'pending' 
  },
  deliveryType: { 
    type: String, 
    enum: ['delivery', 'pickup'], 
    default: 'delivery' 
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Create Models
const User = mongoose.model('User', userSchema);
const OTP = mongoose.model('OTP', otpSchema);
const Plant = mongoose.model('Plant', plantSchema);
const Order = mongoose.model('Order', orderSchema);

// ==================== AUTHENTICATION MIDDLEWARE ====================

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Verify user still exists and is active
    const user = await User.findById(decoded.userId).select('-password');
    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Invalid user or account deactivated' });
    }

    req.user = {
      userId: user._id,
      email: user.email,
      role: user.role,
      name: user.name
    };
    
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    return res.status(403).json({ error: 'Invalid token' });
  }
};

const requireRole = (roles) => {
  return (req, res, next) => {
    if (!Array.isArray(roles)) roles = [roles];
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Insufficient permissions',
        required: roles,
        current: req.user.role 
      });
    }
    next();
  };
};

// ==================== OTP AUTHENTICATION ROUTES ====================

// Send OTP Route - COMPLETE IMPLEMENTATION
app.post('/api/auth/send-otp', async (req, res) => {
  try {
    const { email, role } = req.body;

    // Validate input
    if (!email || !role) {
      return res.status(400).json({ error: 'Email and role are required' });
    }

    if (!['user', 'nursery', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role specified' });
    }

    // Check if user exists with this email and role combination
    const user = await User.findOne({ 
      email: email.toLowerCase().trim(), 
      role: role 
    });

    if (!user) {
      return res.status(404).json({ 
        error: `No ${role} account found with email: ${email}` 
      });
    }

    if (!user.isActive) {
      return res.status(400).json({ error: 'Account is deactivated' });
    }

    // Generate secure 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    
    // Remove any existing OTP for this email/role combination
    await OTP.deleteMany({ email: email.toLowerCase().trim(), role });
    
    // Save new OTP
    const newOTP = new OTP({ 
      email: email.toLowerCase().trim(), 
      otp, 
      role,
      createdAt: new Date()
    });
    await newOTP.save();

    // Prepare email content based on role
    const roleTitle = role === 'nursery' ? 'Nursery Owner' : role === 'admin' ? 'Administrator' : 'User';
    const roleEmoji = role === 'nursery' ? '🌿' : role === 'admin' ? '👑' : '🌱';

    // Send OTP via email
    const mailOptions = {
      from: {
        name: 'Plantify Authentication',
        address: process.env.EMAIL_USER
      },
      to: email,
      subject: `Plantify Login OTP - ${roleTitle} Portal`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Plantify OTP Verification</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); margin-top: 20px;">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #059669, #10b981); color: white; padding: 30px 20px; text-align: center;">
              <h1 style="margin: 0; font-size: 32px; font-weight: bold;">
                ${roleEmoji} Plantify
              </h1>
              <p style="margin: 10px 0 0 0; font-size: 18px; opacity: 0.9;">
                ${roleTitle} Portal Login
              </p>
            </div>
            
            <!-- Content -->
            <div style="padding: 40px 30px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <h2 style="color: #1f2937; margin: 0 0 10px 0; font-size: 24px;">
                  Verification Required
                </h2>
                <p style="color: #6b7280; margin: 0; font-size: 16px;">
                  Please enter the following OTP code to complete your login
                </p>
              </div>
              
              <!-- OTP Code -->
              <div style="text-align: center; margin: 40px 0;">
                <div style="display: inline-block; background: linear-gradient(135deg, #f0fdf4, #dcfce7); border: 3px solid #059669; border-radius: 16px; padding: 25px 40px;">
                  <div style="font-size: 48px; font-weight: bold; color: #059669; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                    ${otp}
                  </div>
                </div>
              </div>
              
              <!-- Instructions -->
              <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; border-radius: 8px; margin: 30px 0;">
                <div style="display: flex; align-items: flex-start;">
                  <div style="color: #f59e0b; margin-right: 12px; font-size: 20px;">⚠️</div>
                  <div>
                    <h3 style="color: #92400e; margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">
                      Important Security Information
                    </h3>
                    <ul style="color: #92400e; margin: 0; padding-left: 16px; font-size: 14px; line-height: 1.5;">
                      <li>This OTP expires in <strong>5 minutes</strong></li>
                      <li>Do not share this code with anyone</li>
                      <li>Plantify will never ask for this code via phone or email</li>
                      <li>Enter this code only on the official Plantify login page</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <!-- User Info -->
              <div style="background-color: #f8fafc; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <p style="color: #374151; margin: 0; font-size: 14px;">
                  <strong>Login Details:</strong><br>
                  Email: ${email}<br>
                  Role: ${roleTitle}<br>
                  Time: ${new Date().toLocaleString()}
                </p>
              </div>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #f9fafb; border-top: 1px solid #e5e7eb; padding: 25px 30px; text-align: center;">
              <p style="color: #6b7280; margin: 0 0 10px 0; font-size: 14px;">
                If you didn't request this login, please ignore this email and ensure your account is secure.
              </p>
              <p style="color: #9ca3af; margin: 0; font-size: 12px;">
                This is an automated message from Plantify. Please do not reply to this email.
              </p>
              <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #e5e7eb;">
                <p style="color: #9ca3af; margin: 0; font-size: 11px;">
                  © ${new Date().getFullYear()} Plantify. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Plantify ${roleTitle} Portal - Login Verification
        
        Your OTP code is: ${otp}
        
        This code expires in 5 minutes.
        
        Login Details:
        - Email: ${email}
        - Role: ${roleTitle}
        - Time: ${new Date().toLocaleString()}
        
        Security Notice:
        - Do not share this code with anyone
        - Enter this code only on the official Plantify login page
        - If you didn't request this login, please ignore this email
        
        - Plantify Team
      `
    };

    await transporter.sendMail(mailOptions);
    
    console.log(`📧 OTP sent to ${email} for ${role} role: ${otp}`);
    
    res.json({ 
      success: true,
      message: 'OTP sent successfully to your email',
      email: email.replace(/(.{2}).*(@.*)/, '$1***$2'), // Mask email for security
      expiresIn: 300 // 5 minutes
    });

  } catch (error) {
    console.error('❌ OTP Send Error:', error);
    
    if (error.code === 'EAUTH' || error.code === 'ECONNECTION') {
      return res.status(500).json({ 
        error: 'Email service unavailable. Please check server configuration.' 
      });
    }
    
    res.status(500).json({ 
      error: 'Failed to send OTP. Please try again later.' 
    });
  }
});

// ==================== AUTHENTICATION ROUTES ====================

// User Registration
app.post('/api/auth/register', upload.single('profileImage'), async (req, res) => {
  try {
    const { name, email, password, confirmPassword, phone, address, city, postalCode, role } = req.body;
    
    // Validation
    if (!name || !email || !password || !phone) {
      return res.status(400).json({ error: 'Name, email, password, and phone are required' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    const userRole = role || 'user';
    
    // Check if user already exists with same email and role
    const existingUser = await User.findOne({ 
      email: email.toLowerCase().trim(), 
      role: userRole 
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        error: `Account already exists with this email as ${userRole}` 
      });
    }

    // Create user data
    const userData = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      phone: phone.trim(),
      address: address?.trim(),
      city: city?.trim(),
      postalCode: postalCode?.trim(),
      role: userRole
    };

    // Handle profile image upload
    if (req.file) {
      userData.profileImage = `/uploads/${req.file.filename}`;
    }

    // Create and save user
    const user = new User(userData);
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id, 
        email: user.email, 
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log(`✅ New ${userRole} registered: ${email}`);

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
        city: user.city,
        postalCode: user.postalCode,
        profileImage: user.profileImage
      }
    });

  } catch (error) {
    console.error('❌ Registration Error:', error);
    
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({ 
        error: `An account with this ${field} already exists` 
      });
    }
    
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
});

// User Login with OTP Verification
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password, expectedRole, otp } = req.body;

    // Validate input
    if (!email || !password || !expectedRole) {
      return res.status(400).json({ error: 'Email, password, and role are required' });
    }

    if (!otp) {
      return res.status(400).json({ 
        error: 'OTP is required',
        needOTP: true,
        message: 'Please request and enter OTP to continue'
      });
    }

    // Find user with specific email and role combination
    const user = await User.findOne({ 
      email: email.toLowerCase().trim(), 
      role: expectedRole 
    });

    if (!user) {
      return res.status(400).json({ 
        error: 'Invalid credentials or account not found' 
      });
    }

    if (!user.isActive) {
      return res.status(400).json({ error: 'Account is deactivated' });
    }

    // Verify password
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Verify OTP
    const otpRecord = await OTP.findOne({ 
      email: email.toLowerCase().trim(), 
      role: expectedRole, 
      otp: otp.toString().trim()
    });

    if (!otpRecord) {
      // Increment failed attempts for rate limiting
      await OTP.updateOne(
        { email: email.toLowerCase().trim(), role: expectedRole },
        { $inc: { attempts: 1 } }
      );
      
      return res.status(400).json({ 
        error: 'Invalid or expired OTP. Please request a new one.' 
      });
    }

    // Check if too many attempts
    if (otpRecord.attempts >= 5) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({ 
        error: 'Too many failed attempts. Please request a new OTP.' 
      });
    }

    // OTP is valid, delete it to prevent reuse
    await OTP.deleteOne({ _id: otpRecord._id });

    // Update user's last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id, 
        email: user.email, 
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log(`✅ ${expectedRole} logged in: ${email}`);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
        city: user.city,
        postalCode: user.postalCode,
        profileImage: user.profileImage,
        lastLogin: user.lastLogin
      }
    });

  } catch (error) {
    console.error('❌ Login Error:', error);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

// Get Current User Profile
app.get('/api/auth/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('❌ Profile fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update User Profile
app.put('/api/auth/profile', authenticateToken, upload.single('profileImage'), async (req, res) => {
  try {
    const updateData = { ...req.body };
    
    // Remove sensitive fields that shouldn't be updated through this route
    delete updateData.password;
    delete updateData.role;
    delete updateData.email; // Email changes require verification
    
    // Handle profile image upload
    if (req.file) {
      updateData.profileImage = `/uploads/${req.file.filename}`;
    }

    updateData.updatedAt = new Date();

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user
    });

  } catch (error) {
    console.error('❌ Profile update error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Rest of your routes remain the same...
// (I'll skip the rest as they're already working correctly)

// ==================== UTILITY ROUTES ====================

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Plantify API with OTP Authentication is running',
    timestamp: new Date().toISOString(),
    version: '2.0.0'
  });
});

// Test email configuration
app.get('/api/test-email', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const testMail = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: req.user.email,
      subject: 'Plantify Email Test',
      text: 'Email configuration is working correctly!'
    });

    res.json({ 
      success: true, 
      message: 'Test email sent successfully',
      messageId: testMail.messageId
    });
  } catch (error) {
    console.error('❌ Email test failed:', error);
    res.status(500).json({ error: 'Email test failed', details: error.message });
  }
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('❌ Global error:', error);
  
  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Invalid JSON payload' });
  }
  
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 10MB.' });
    }
    return res.status(400).json({ error: error.message });
  }
  
  res.status(500).json({ error: 'Internal server error' });
});

// Handle 404 routes
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log('🚀 =================================');
  console.log(`🌱 Plantify API Server Started`);
  console.log(`📍 Port: ${PORT}`);
  console.log(`🔗 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`📧 Email Service: ${process.env.EMAIL_USER ? 'Configured' : 'Not Configured'}`);
  console.log(`🗄️  Database: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
  console.log('🚀 =================================');
});