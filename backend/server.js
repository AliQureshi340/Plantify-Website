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
app.use('/images', express.static('uploads')); // Serve images at /images path

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
    if (!fs.existsSync('uploads')) {
      fs.mkdirSync('uploads');
    }
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, uniqueName);
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

// Configure nodemailer
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
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
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

// Send OTP Route
app.post('/api/auth/send-otp', async (req, res) => {
  try {
    const { email, role } = req.body;

    if (!email || !role) {
      return res.status(400).json({ error: 'Email and role are required' });
    }

    if (!['user', 'nursery', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role specified' });
    }

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

    const otp = crypto.randomInt(100000, 999999).toString();
    
    await OTP.deleteMany({ email: email.toLowerCase().trim(), role });
    
    const newOTP = new OTP({ 
      email: email.toLowerCase().trim(), 
      otp, 
      role,
      createdAt: new Date()
    });
    await newOTP.save();

    const roleTitle = role === 'nursery' ? 'Nursery Owner' : role === 'admin' ? 'Administrator' : 'User';
    const roleEmoji = role === 'nursery' ? '🌿' : role === 'admin' ? '👑' : '🌱';

    if (transporter) {
      const mailOptions = {
        from: {
          name: 'Plantify Authentication',
          address: process.env.EMAIL_USER
        },
        to: email,
        subject: `Plantify Login OTP - ${roleTitle} Portal`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>${roleEmoji} Plantify - ${roleTitle} Portal</h2>
            <p>Your OTP code is: <strong>${otp}</strong></p>
            <p>This code expires in 5 minutes.</p>
            <p>If you didn't request this login, please ignore this email.</p>
          </div>
        `,
        text: `Plantify ${roleTitle} Portal - Your OTP code is: ${otp}. This code expires in 5 minutes.`
      };

      await transporter.sendMail(mailOptions);
    }
    
    console.log(`📧 OTP sent to ${email} for ${role} role: ${otp}`);
    
    res.json({ 
      success: true,
      message: 'OTP sent successfully to your email',
      email: email.replace(/(.{2}).*(@.*)/, '$1***$2'),
      expiresIn: 300
    });

  } catch (error) {
    console.error('❌ OTP Send Error:', error);
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
    
    const existingUser = await User.findOne({ 
      email: email.toLowerCase().trim(), 
      role: userRole 
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        error: `Account already exists with this email as ${userRole}` 
      });
    }

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

    if (req.file) {
      userData.profileImage = `/uploads/${req.file.filename}`;
    }

    const user = new User(userData);
    await user.save();

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

    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const otpRecord = await OTP.findOne({ 
      email: email.toLowerCase().trim(), 
      role: expectedRole, 
      otp: otp.toString().trim()
    });

    if (!otpRecord) {
      return res.status(400).json({ 
        error: 'Invalid or expired OTP. Please request a new one.' 
      });
    }

    await OTP.deleteOne({ _id: otpRecord._id });

    user.lastLogin = new Date();
    await user.save();

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
    
    delete updateData.password;
    delete updateData.role;
    delete updateData.email;
    
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

// ==================== PLANT MANAGEMENT ROUTES ====================

// Get all plants for store
app.get('/api/store/plants', async (req, res) => {
  try {
    const { category, search, sortBy } = req.query;
    let query = { isActive: true };
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    let sortOption = {};
    switch (sortBy) {
      case 'price_low':
        sortOption = { price: 1 };
        break;
      case 'price_high':
        sortOption = { price: -1 };
        break;
      case 'popular':
        sortOption = { sold: -1 };
        break;
      case 'newest':
        sortOption = { createdAt: -1 };
        break;
      default:
        sortOption = { name: 1 };
    }
    
    const plants = await Plant.find(query).sort(sortOption);
    res.json(plants);
  } catch (error) {
    console.error('Error fetching plants:', error);
    res.status(500).json({ error: 'Failed to fetch plants' });
  }
});

// Get categories
app.get('/api/store/categories', async (req, res) => {
  try {
    const categories = await Plant.distinct('category', { isActive: true });
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Get plants by nursery owner or all plants for admin
app.get('/api/plants/my', authenticateToken, requireRole(['admin', 'nursery']), async (req, res) => {
  try {
    const query = req.user.role === 'nursery' 
      ? { nurseryId: req.user.userId }
      : {}; // Admin can see all plants
      
    const plants = await Plant.find(query)
      .populate('nurseryId', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(plants);
  } catch (error) {
    console.error('Error fetching my plants:', error);
    res.status(500).json({ error: 'Failed to fetch plants' });
  }
});

// Create plant (admin/nursery only)
app.post('/api/plants', authenticateToken, requireRole(['admin', 'nursery']), upload.single('image'), async (req, res) => {
  try {
    const plantData = {
      ...req.body,
      nurseryId: req.user.role === 'nursery' ? req.user.userId : null,
      updatedAt: new Date()
    };
    
    if (req.file) {
      plantData.image = `/uploads/${req.file.filename}`;
    }
    
    const plant = new Plant(plantData);
    await plant.save();
    
    console.log(`✅ Plant created: ${plant.name} by ${req.user.role}: ${req.user.email}`);
    
    res.status(201).json({
      success: true,
      message: 'Plant created successfully',
      plant
    });
  } catch (error) {
    console.error('Error creating plant:', error);
    res.status(500).json({ error: 'Failed to create plant' });
  }
});

// Update plant (admin/nursery only - only their own plants)
app.put('/api/plants/:id', authenticateToken, requireRole(['admin', 'nursery']), upload.single('image'), async (req, res) => {
  try {
    const plantId = req.params.id;
    
    // Check if plant exists and user has permission
    let query = { _id: plantId };
    if (req.user.role === 'nursery') {
      query.nurseryId = req.user.userId; // Nursery can only update their own plants
    }
    
    const plant = await Plant.findOne(query);
    if (!plant) {
      return res.status(404).json({ error: 'Plant not found or unauthorized' });
    }
    
    const updateData = { 
      ...req.body,
      updatedAt: new Date()
    };
    
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }
    
    const updatedPlant = await Plant.findByIdAndUpdate(
      plantId,
      updateData,
      { new: true, runValidators: true }
    );
    
    res.json({
      success: true,
      message: 'Plant updated successfully',
      plant: updatedPlant
    });
  } catch (error) {
    console.error('Error updating plant:', error);
    res.status(500).json({ error: 'Failed to update plant' });
  }
});

// Delete/Deactivate plant (admin/nursery only - only their own plants)
app.delete('/api/plants/:id', authenticateToken, requireRole(['admin', 'nursery']), async (req, res) => {
  try {
    const plantId = req.params.id;
    
    // Check if plant exists and user has permission
    let query = { _id: plantId };
    if (req.user.role === 'nursery') {
      query.nurseryId = req.user.userId; // Nursery can only delete their own plants
    }
    
    const plant = await Plant.findOne(query);
    if (!plant) {
      return res.status(404).json({ error: 'Plant not found or unauthorized' });
    }
    
    // Soft delete - just deactivate the plant
    await Plant.findByIdAndUpdate(plantId, { 
      isActive: false,
      updatedAt: new Date()
    });
    
    res.json({
      success: true,
      message: 'Plant deactivated successfully'
    });
  } catch (error) {
    console.error('Error deactivating plant:', error);
    res.status(500).json({ error: 'Failed to deactivate plant' });
  }
});

// Toggle plant status (activate/deactivate)
app.patch('/api/plants/:id/toggle-status', authenticateToken, requireRole(['admin', 'nursery']), async (req, res) => {
  try {
    const plantId = req.params.id;
    
    // Check if plant exists and user has permission
    let query = { _id: plantId };
    if (req.user.role === 'nursery') {
      query.nurseryId = req.user.userId;
    }
    
    const plant = await Plant.findOne(query);
    if (!plant) {
      return res.status(404).json({ error: 'Plant not found or unauthorized' });
    }
    
    const updatedPlant = await Plant.findByIdAndUpdate(
      plantId,
      { 
        isActive: !plant.isActive,
        updatedAt: new Date()
      },
      { new: true }
    );
    
    res.json({
      success: true,
      message: `Plant ${updatedPlant.isActive ? 'activated' : 'deactivated'} successfully`,
      plant: updatedPlant
    });
  } catch (error) {
    console.error('Error toggling plant status:', error);
    res.status(500).json({ error: 'Failed to toggle plant status' });
  }
});

// ==================== ORDER ROUTES ====================

// Create order
app.post('/api/orders', async (req, res) => {
  try {
    const orderData = {
      ...req.body,
      userId: req.body.userId || null
    };
    
    // Validate stock availability before creating order
    for (const item of req.body.items) {
      const plant = await Plant.findById(item.plantId);
      if (!plant) {
        return res.status(400).json({ error: `Plant ${item.plantName} not found` });
      }
      if (plant.stock < item.quantity) {
        return res.status(400).json({ 
          error: `Insufficient stock for ${item.plantName}. Available: ${plant.stock}, Requested: ${item.quantity}` 
        });
      }
    }
    
    const order = new Order(orderData);
    await order.save();
    
    // Update plant stock and sold count
    for (const item of req.body.items) {
      await Plant.findByIdAndUpdate(item.plantId, {
        $inc: { 
          stock: -item.quantity, 
          sold: item.quantity 
        },
        updatedAt: new Date()
      });
    }
    
    console.log(`✅ Order created: ${order.orderNumber} - Total: Rs ${order.total}`);
    
    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Get user orders
app.get('/api/orders/my', authenticateToken, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.userId })
      .populate('items.plantId', 'name image category')
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get all orders (admin and nursery) - UPDATED
app.get('/api/orders', authenticateToken, requireRole(['admin', 'nursery']), async (req, res) => {
  try {
    const { status, limit = 100, customerId } = req.query;
    
    let query = {};
    
    // For nursery owners, only show orders containing their plants
    if (req.user.role === 'nursery') {
      const nurseryPlants = await Plant.find({ nurseryId: req.user.userId }).select('_id');
      const plantIds = nurseryPlants.map(p => p._id);
      query['items.plantId'] = { $in: plantIds };
    }
    
    // Filter by customer if specified
    if (customerId) {
      const customer = await User.findById(customerId);
      if (customer) {
        query.$or = [
          { userId: customerId },
          { customerEmail: customer.email }
        ];
      }
    }
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    const orders = await Order.find(query)
      .populate('userId', 'name email phone')
      .populate('items.plantId', 'name image category price')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));
      
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Update order status (admin and nursery)
app.put('/api/orders/:id', authenticateToken, requireRole(['admin', 'nursery']), async (req, res) => {
  try {
    const { status } = req.body;
    const orderId = req.params.id;
    
    if (!['pending', 'processing', 'shipped', 'delivered', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    const order = await Order.findByIdAndUpdate(
      orderId,
      { 
        status,
        updatedAt: new Date()
      },
      { new: true }
    ).populate('items.plantId', 'name image category');
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    console.log(`✅ Order ${order.orderNumber} status updated to: ${status}`);
    
    res.json({
      success: true,
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// Update order status (admin only)
app.patch('/api/orders/:id/status', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { status } = req.body;
    const orderId = req.params.id;
    
    if (!['pending', 'processing', 'shipped', 'delivered', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    const order = await Order.findByIdAndUpdate(
      orderId,
      { 
        status,
        updatedAt: new Date()
      },
      { new: true }
    ).populate('items.plantId', 'name image category');
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    console.log(`✅ Order ${order.orderNumber} status updated to: ${status}`);
    
    res.json({
      success: true,
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// Get order by ID
app.get('/api/orders/:id', authenticateToken, async (req, res) => {
  try {
    const orderId = req.params.id;
    
    let query = { _id: orderId };
    
    // Regular users can only see their own orders
    if (req.user.role === 'user') {
      query.userId = req.user.userId;
    }
    
    const order = await Order.findOne(query)
      .populate('userId', 'name email phone')
      .populate('items.plantId', 'name image category');
      
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// ==================== DASHBOARD ANALYTICS ROUTES ====================

// Get dashboard statistics (admin only) - UPDATED
app.get('/api/dashboard/stats', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user', isActive: true });
    const totalNurseries = await User.countDocuments({ role: 'nursery', isActive: true });
    const totalPlants = await Plant.countDocuments({ isActive: true });
    const totalOrders = await Order.countDocuments();
    
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const completedOrders = await Order.countDocuments({ status: 'delivered' });
    
    const totalRevenue = await Order.aggregate([
      { $match: { status: { $in: ['delivered', 'shipped'] } } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);
    
    const lowStockPlants = await Plant.find({ 
      isActive: true, 
      stock: { $lt: 5, $gt: 0 } 
    }).select('name stock category');
    
    const outOfStockPlants = await Plant.countDocuments({ 
      isActive: true, 
      stock: 0 
    });
    
    const recentOrders = await Order.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(5)
      .select('orderNumber customerName total status createdAt');
    
    // Customer metrics
    const thisMonth = new Date();
    const lastMonth = new Date(thisMonth.getFullYear(), thisMonth.getMonth() - 1, 1);
    
    const newCustomersThisMonth = await User.countDocuments({
      role: 'user',
      createdAt: { $gte: new Date(thisMonth.getFullYear(), thisMonth.getMonth(), 1) }
    });
    
    const newCustomersLastMonth = await User.countDocuments({
      role: 'user',
      createdAt: { 
        $gte: lastMonth,
        $lt: new Date(thisMonth.getFullYear(), thisMonth.getMonth(), 1)
      }
    });
    
    // Active customers (ordered in last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const activeCustomers = await Order.distinct('userId', {
      createdAt: { $gte: thirtyDaysAgo },
      userId: { $exists: true }
    });
    
    res.json({
      stats: {
        totalUsers,
        totalNurseries,
        totalPlants,
        totalOrders,
        pendingOrders,
        completedOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        outOfStockPlants,
        // New customer metrics
        newCustomersThisMonth,
        newCustomersLastMonth,
        customerGrowth: newCustomersLastMonth > 0 ? 
          ((newCustomersThisMonth - newCustomersLastMonth) / newCustomersLastMonth * 100).toFixed(1) : 0,
        activeCustomers: activeCustomers.length
      },
      lowStockPlants,
      recentOrders
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
  }
});

// Get nursery dashboard statistics (nursery only)
app.get('/api/dashboard/nursery-stats', authenticateToken, requireRole(['nursery']), async (req, res) => {
  try {
    const nurseryId = req.user.userId;
    
    const totalPlants = await Plant.countDocuments({ 
      nurseryId, 
      isActive: true 
    });
    
    const totalSold = await Plant.aggregate([
      { $match: { nurseryId: new mongoose.Types.ObjectId(nurseryId) } },
      { $group: { _id: null, total: { $sum: '$sold' } } }
    ]);
    
    const totalRevenue = await Order.aggregate([
      { $unwind: '$items' },
      { 
        $lookup: {
          from: 'plants',
          localField: 'items.plantId',
          foreignField: '_id',
          as: 'plant'
        }
      },
      { $unwind: '$plant' },
      { $match: { 'plant.nurseryId': new mongoose.Types.ObjectId(nurseryId) } },
      { $group: { _id: null, total: { $sum: { $multiply: ['$items.quantity', '$items.price'] } } } }
    ]);
    
    const lowStockPlants = await Plant.find({ 
      nurseryId,
      isActive: true, 
      stock: { $lt: 5, $gt: 0 } 
    }).select('name stock category');
    
    const outOfStockPlants = await Plant.countDocuments({ 
      nurseryId,
      isActive: true, 
      stock: 0 
    });
    
    const topSellingPlants = await Plant.find({ nurseryId })
      .sort({ sold: -1 })
      .limit(5)
      .select('name sold price stock image');
    
    res.json({
      stats: {
        totalPlants,
        totalSold: totalSold[0]?.total || 0,
        totalRevenue: totalRevenue[0]?.total || 0,
        outOfStockPlants
      },
      lowStockPlants,
      topSellingPlants
    });
  } catch (error) {
    console.error('Error fetching nursery dashboard stats:', error);
    res.status(500).json({ error: 'Failed to fetch nursery dashboard statistics' });
  }
});

// ==================== UPDATED USER MANAGEMENT ROUTES ====================

// Get all users with better filtering (UPDATED)
app.get('/api/admin/users', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { role, page = 1, limit = 100, search, format = 'paginated' } = req.query;
    
    let query = {};
    if (role && role !== 'all') {
      query.role = role;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }
    
    const skip = (page - 1) * limit;
    
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
      
    const totalUsers = await User.countDocuments(query);
    
    // For customer management component, return simple array format
    if (format === 'simple') {
      return res.json(users);
    }
    
    // Default paginated response
    res.json({
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalUsers / limit),
        totalUsers,
        hasNext: page < Math.ceil(totalUsers / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get customer statistics (NEW ENDPOINT)
app.get('/api/admin/customer-stats', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { customerId } = req.query;
    
    if (customerId) {
      // Get stats for specific customer
      const customer = await User.findById(customerId).select('-password');
      if (!customer) {
        return res.status(404).json({ error: 'Customer not found' });
      }
      
      const customerOrders = await Order.find({
        $or: [
          { userId: customerId },
          { customerEmail: customer.email }
        ]
      }).populate('items.plantId', 'name image category');
      
      const totalOrders = customerOrders.length;
      const completedOrders = customerOrders.filter(order => order.status === 'delivered');
      const totalSpent = completedOrders.reduce((sum, order) => sum + order.total, 0);
      const averageOrderValue = completedOrders.length > 0 ? totalSpent / completedOrders.length : 0;
      const lastOrderDate = customerOrders.length > 0 
        ? new Date(Math.max(...customerOrders.map(order => new Date(order.createdAt))))
        : null;
      
      return res.json({
        customer,
        stats: {
          totalOrders,
          completedOrders: completedOrders.length,
          totalSpent,
          averageOrderValue,
          lastOrderDate
        },
        orders: customerOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      });
    }
    
    // Get overall customer statistics
    const totalCustomers = await User.countDocuments({ role: 'user', isActive: true });
    
    // Get all orders to calculate customer stats
    const allOrders = await Order.find({}).populate('userId', 'email');
    const allUsers = await User.find({ role: 'user' }).select('email createdAt');
    
    // Calculate customer metrics
    const customerMetrics = allUsers.map(user => {
      const userOrders = allOrders.filter(order => 
        (order.userId && order.userId.email === user.email) || 
        order.customerEmail === user.email
      );
      
      const totalOrders = userOrders.length;
      const completedOrders = userOrders.filter(order => order.status === 'delivered');
      const totalSpent = completedOrders.reduce((sum, order) => sum + order.total, 0);
      const averageOrderValue = completedOrders.length > 0 ? totalSpent / completedOrders.length : 0;
      const lastOrderDate = userOrders.length > 0 
        ? new Date(Math.max(...userOrders.map(order => new Date(order.createdAt))))
        : null;
      
      return {
        userId: user._id,
        email: user.email,
        createdAt: user.createdAt,
        totalOrders,
        completedOrders: completedOrders.length,
        totalSpent,
        averageOrderValue,
        lastOrderDate
      };
    });
    
    const activeCustomers = customerMetrics.filter(customer => customer.totalOrders > 0);
    const totalRevenue = activeCustomers.reduce((sum, customer) => sum + customer.totalSpent, 0);
    const averageLifetimeValue = activeCustomers.length > 0 ? totalRevenue / activeCustomers.length : 0;
    
    // Customer segmentation
    const vipCustomers = activeCustomers.filter(c => c.totalSpent > 10000);
    const regularCustomers = activeCustomers.filter(c => c.totalSpent >= 5000 && c.totalSpent <= 10000);
    const newCustomers = activeCustomers.filter(c => c.totalSpent > 0 && c.totalSpent < 5000);
    const inactiveCustomers = customerMetrics.filter(c => c.totalOrders === 0);
    
    // Recent activity
    const now = Date.now();
    const recentlyActive = activeCustomers.filter(c => 
      c.lastOrderDate && (now - c.lastOrderDate.getTime()) < 7 * 24 * 60 * 60 * 1000
    );
    const atRisk = activeCustomers.filter(c => 
      c.lastOrderDate && (now - c.lastOrderDate.getTime()) > 30 * 24 * 60 * 60 * 1000
    );
    
    // Monthly growth
    const thisMonth = new Date();
    const newThisMonth = allUsers.filter(user => {
      const joinDate = new Date(user.createdAt);
      return joinDate.getMonth() === thisMonth.getMonth() && 
             joinDate.getFullYear() === thisMonth.getFullYear();
    });
    
    res.json({
      overview: {
        totalCustomers,
        activeCustomers: activeCustomers.length,
        totalRevenue,
        averageLifetimeValue,
        newThisMonth: newThisMonth.length
      },
      segmentation: {
        vip: vipCustomers.length,
        regular: regularCustomers.length,
        new: newCustomers.length,
        inactive: inactiveCustomers.length
      },
      activity: {
        recentlyActive: recentlyActive.length,
        atRisk: atRisk.length,
        retentionRate: activeCustomers.length > 0 ? 
          (activeCustomers.filter(c => c.totalOrders > 1).length / activeCustomers.length) * 100 : 0
      },
      topCustomers: activeCustomers
        .sort((a, b) => b.totalSpent - a.totalSpent)
        .slice(0, 10)
        .map(customer => ({
          ...customer,
          customerDetails: allUsers.find(u => u._id.toString() === customer.userId.toString())
        }))
    });
    
  } catch (error) {
    console.error('Error fetching customer stats:', error);
    res.status(500).json({ error: 'Failed to fetch customer statistics' });
  }
});

// Get customer order history (NEW ENDPOINT)
app.get('/api/admin/customer/:id/orders', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const customerId = req.params.id;
    
    const customer = await User.findById(customerId).select('-password');
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    
    const orders = await Order.find({
      $or: [
        { userId: customerId },
        { customerEmail: customer.email }
      ]
    })
    .populate('items.plantId', 'name image category price')
    .sort({ createdAt: -1 });
    
    res.json({
      customer,
      orders
    });
    
  } catch (error) {
    console.error('Error fetching customer orders:', error);
    res.status(500).json({ error: 'Failed to fetch customer orders' });
  }
});

// Customer activity report (NEW ENDPOINT)
app.get('/api/admin/customer-activity-report', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { period = '30' } = req.query; // days
    const daysAgo = parseInt(period);
    const startDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
    
    // Get customers and their recent orders
    const recentOrders = await Order.find({
      createdAt: { $gte: startDate }
    }).populate('userId', 'name email');
    
    const allCustomers = await User.find({ role: 'user' }).select('name email createdAt');
    
    // Group by customer
    const customerActivity = {};
    
    recentOrders.forEach(order => {
      const customerKey = order.userId ? order.userId.email : order.customerEmail;
      if (!customerActivity[customerKey]) {
        customerActivity[customerKey] = {
          customerInfo: order.userId || { email: order.customerEmail, name: order.customerName },
          orders: [],
          totalSpent: 0,
          orderCount: 0
        };
      }
      customerActivity[customerKey].orders.push(order);
      customerActivity[customerKey].totalSpent += order.total;
      customerActivity[customerKey].orderCount += 1;
    });
    
    // Convert to array and sort
    const activityReport = Object.values(customerActivity)
      .sort((a, b) => b.totalSpent - a.totalSpent);
    
    // Get inactive customers (no orders in period)
    const activeEmails = Object.keys(customerActivity);
    const inactiveCustomers = allCustomers.filter(customer => 
      !activeEmails.includes(customer.email)
    );
    
    res.json({
      period: `Last ${daysAgo} days`,
      summary: {
        activeCustomers: activityReport.length,
        inactiveCustomers: inactiveCustomers.length,
        totalRevenue: activityReport.reduce((sum, customer) => sum + customer.totalSpent, 0),
        totalOrders: activityReport.reduce((sum, customer) => sum + customer.orderCount, 0)
      },
      activeCustomers: activityReport,
      inactiveCustomers: inactiveCustomers.slice(0, 50) // Limit to 50 for performance
    });
    
  } catch (error) {
    console.error('Error generating customer activity report:', error);
    res.status(500).json({ error: 'Failed to generate activity report' });
  }
});

// Toggle user status (admin only)
app.patch('/api/admin/users/:id/toggle-status', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const userId = req.params.id;
    
    if (userId === req.user.userId.toString()) {
      return res.status(400).json({ error: 'Cannot deactivate your own account' });
    }
    
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { 
        isActive: !user.isActive,
        updatedAt: new Date()
      },
      { new: true }
    ).select('-password');
    
    console.log(`✅ User ${updatedUser.email} ${updatedUser.isActive ? 'activated' : 'deactivated'} by admin`);
    
    res.json({
      success: true,
      message: `User ${updatedUser.isActive ? 'activated' : 'deactivated'} successfully`,
      user: updatedUser
    });
  } catch (error) {
    console.error('Error toggling user status:', error);
    res.status(500).json({ error: 'Failed to toggle user status' });
  }
});

// ==================== UTILITY ROUTES ====================

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Plantify API with OTP Authentication is running',
    timestamp: new Date().toISOString(),
    version: '2.1.0',
    features: [
      'OTP Authentication',
      'Plant Management',
      'File Upload',
      'Order Management',
      'User Management',
      'Dashboard Analytics',
      'Customer Management'
    ]
  });
});

// Get server statistics
app.get('/api/server-info', (req, res) => {
  res.json({
    server: 'Plantify API Server',
    version: '2.1.0',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    environment: process.env.NODE_ENV || 'development',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    emailService: process.env.EMAIL_USER ? 'Configured' : 'Not Configured'
  });
});

// Test email endpoint (for debugging)
app.post('/api/test-email', async (req, res) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return res.status(400).json({ error: 'Email configuration not found' });
    }
    
    const { to } = req.body;
    if (!to) {
      return res.status(400).json({ error: 'Recipient email required' });
    }
    
    const mailOptions = {
      from: {
        name: 'Plantify Test',
        address: process.env.EMAIL_USER
      },
      to: to,
      subject: 'Plantify Email Test',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>🌱 Plantify Email Test</h2>
          <p>This is a test email from Plantify API server.</p>
          <p>If you received this email, the email configuration is working correctly!</p>
          <p>Timestamp: ${new Date().toISOString()}</p>
        </div>
      `,
      text: `Plantify Email Test - This is a test email from Plantify API server. Timestamp: ${new Date().toISOString()}`
    };
    
    await transporter.sendMail(mailOptions);
    
    res.json({
      success: true,
      message: 'Test email sent successfully',
      to: to
    });
  } catch (error) {
    console.error('Error sending test email:', error);
    res.status(500).json({ error: 'Failed to send test email' });
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
  
  if (error.name === 'ValidationError') {
    const errors = Object.values(error.errors).map(err => err.message);
    return res.status(400).json({ error: errors.join(', ') });
  }
  
  if (error.name === 'CastError') {
    return res.status(400).json({ error: 'Invalid ID format' });
  }
  
  if (error.code === 11000) {
    const field = Object.keys(error.keyPattern)[0];
    return res.status(400).json({ error: `${field} already exists` });
  }
  
  res.status(500).json({ 
    error: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { details: error.message })
  });
});

// Handle 404 routes
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method,
    suggestion: 'Check the API documentation for available endpoints'
  });
});

// Graceful shutdown handler
process.on('SIGTERM', async () => {
  console.log('🔄 Received SIGTERM, shutting down gracefully...');
  
  try {
    await mongoose.connection.close();
    console.log('✅ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
    process.exit(1);
  }
});

process.on('SIGINT', async () => {
  console.log('🔄 Received SIGINT, shutting down gracefully...');
  
  try {
    await mongoose.connection.close();
    console.log('✅ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
    process.exit(1);
  }
});

// Start server
app.listen(PORT, () => {
  console.log('🚀 =================================');
  console.log(`🌱 Plantify API Server Started`);
  console.log(`📍 Port: ${PORT}`);
  console.log(`🔗 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`📧 Email Service: ${process.env.EMAIL_USER ? 'Configured' : 'Not Configured'}`);
  console.log(`🗄️  Database: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
  console.log(`🛡️  JWT Secret: ${JWT_SECRET ? 'Configured' : 'Using Default'}`);
  console.log(`📁 Uploads Directory: ${fs.existsSync('uploads') ? 'Ready' : 'Not Found'}`);
  console.log('🚀 =================================');
  
  console.log('\n📋 Available API Endpoints:');
  console.log('   🔐 Authentication:');
  console.log('      POST /api/auth/register');
  console.log('      POST /api/auth/login');
  console.log('      POST /api/auth/send-otp');
  console.log('      GET  /api/auth/profile');
  console.log('      PUT  /api/auth/profile');
  
  console.log('   🌱 Plants:');
  console.log('      GET  /api/store/plants');
  console.log('      GET  /api/store/categories');
  console.log('      GET  /api/plants/my');
  console.log('      POST /api/plants');
  console.log('      PUT  /api/plants/:id');
  console.log('      DELETE /api/plants/:id');
  
  console.log('   🛒 Orders:');
  console.log('      POST /api/orders');
  console.log('      GET  /api/orders/my');
  console.log('      GET  /api/orders');
  console.log('      GET  /api/orders/:id');
  
  console.log('   📊 Dashboard:');
  console.log('      GET  /api/dashboard/stats');
  console.log('      GET  /api/dashboard/nursery-stats');
  
  console.log('   👥 Admin & Customer Management:');
  console.log('      GET  /api/admin/users');
  console.log('      GET  /api/admin/customer-stats');
  console.log('      GET  /api/admin/customer/:id/orders');
  console.log('      GET  /api/admin/customer-activity-report');
  console.log('      PATCH /api/admin/users/:id/toggle-status');
  
  console.log('\n✨ Ready to serve requests!');
});