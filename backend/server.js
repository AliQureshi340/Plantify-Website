const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key';

// Middleware
app.use(cors());
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
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', async () => {
  console.log('Connected to MongoDB');
  
  // Drop problematic indexes
  try {
    await mongoose.connection.db.collection('orders').dropIndex('orderNumber_1');
  } catch (error) {
    console.log('No existing orderNumber index to drop');
  }
});

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// ==================== SCHEMAS ====================

// User Schema (for all user types)
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String },
  city: { type: String },
  postalCode: { type: String },
  role: { type: String, enum: ['user', 'admin', 'nursery'], default: 'user' },
  profileImage: { type: String },
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

// Create compound unique index for email + role
userSchema.index({ email: 1, role: 1 }, { unique: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

// Plant Schema
const plantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  image: { type: String },
  description: { type: String },
  sold: { type: Number, default: 0 },
  nurseryId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Link to nursery owner
  createdAt: { type: Date, default: Date.now }
});

// Order Schema with user reference
const orderSchema = new mongoose.Schema({
  orderNumber: { 
    type: String, 
    unique: true,
    default: function() {
      return 'ORD' + Date.now() + Math.floor(Math.random() * 10000);
    }
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerPhone: { type: String, required: true },
  customerAddress: { type: String, required: true },
  items: [{
    plantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Plant' },
    plantName: String,
    quantity: Number,
    price: Number
  }],
  total: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'processing', 'completed', 'cancelled'], default: 'pending' },
  deliveryType: { type: String, enum: ['delivery', 'pickup'], default: 'delivery' },
  createdAt: { type: Date, default: Date.now }
});

// Models
const User = mongoose.model('User', userSchema);
const Plant = mongoose.model('Plant', plantSchema);
const Order = mongoose.model('Order', orderSchema);

// ==================== AUTH MIDDLEWARE ====================

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

const requireRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
};

// ==================== AUTH ROUTES ====================

// Register
app.post('/api/auth/register', upload.single('profileImage'), async (req, res) => {
  try {
    const { name, email, password, phone, address, city, postalCode, role } = req.body;
    
    // Check if user exists with same email and role
    const existingUser = await User.findOne({ email, role: role || 'user' });
    if (existingUser) {
      return res.status(400).json({ error: `Account already exists for this email as ${role || 'user'}` });
    }

    // Create user
    const userData = {
      name,
      email,
      password,
      phone,
      address,
      city,
      postalCode,
      role: role || 'user'
    };

    if (req.file) {
      userData.profileImage = `/uploads/${req.file.filename}`;
    }

    const user = new User(userData);
    await user.save();

    // Generate token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
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
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Email already registered for different account type' });
    }
    res.status(400).json({ error: error.message });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password, expectedRole } = req.body;

    // Find user with specific role (passed from frontend route)
    const user = await User.findOne({ email, role: expectedRole });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Check password
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
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
        profileImage: user.profileImage
      }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get current user profile
app.get('/api/auth/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user profile
app.put('/api/auth/profile', authenticateToken, upload.single('profileImage'), async (req, res) => {
  try {
    const updateData = { ...req.body };
    delete updateData.password; // Don't allow password update through this route
    delete updateData.role; // Don't allow role change

    if (req.file) {
      updateData.profileImage = `/uploads/${req.file.filename}`;
    }

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      updateData,
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Change password
app.put('/api/auth/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    const user = await User.findById(req.user.userId);
    const isValidPassword = await user.comparePassword(currentPassword);
    
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ==================== USER'S ORDERS ====================

// Get user's orders
app.get('/api/user/orders', authenticateToken, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.userId })
      .populate('items.plantId')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single user order
app.get('/api/user/orders/:id', authenticateToken, async (req, res) => {
  try {
    const order = await Order.findOne({ 
      _id: req.params.id, 
      userId: req.user.userId 
    }).populate('items.plantId');
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== PLANT ROUTES ====================

// Get all plants (public)
app.get('/api/plants', async (req, res) => {
  try {
    const plants = await Plant.find().sort({ createdAt: -1 });
    res.json(plants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add new plant (nursery only)
app.post('/api/plants', authenticateToken, requireRole(['nursery', 'admin']), upload.single('image'), async (req, res) => {
  try {
    const plantData = { ...req.body };
    if (req.user.role === 'nursery') {
      plantData.nurseryId = req.user.userId;
    }
    if (req.file) {
      plantData.image = `/uploads/${req.file.filename}`;
    }
    const plant = new Plant(plantData);
    await plant.save();
    res.status(201).json(plant);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update plant (nursery/admin only)
app.put('/api/plants/:id', authenticateToken, requireRole(['nursery', 'admin']), upload.single('image'), async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    let query = { _id: req.params.id };
    if (req.user.role === 'nursery') {
      query.nurseryId = req.user.userId; // Nursery can only update their own plants
    }

    const plant = await Plant.findOneAndUpdate(query, updateData, { new: true });
    if (!plant) return res.status(404).json({ error: 'Plant not found or unauthorized' });
    res.json(plant);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete plant (nursery/admin only)
app.delete('/api/plants/:id', authenticateToken, requireRole(['nursery', 'admin']), async (req, res) => {
  try {
    let query = { _id: req.params.id };
    if (req.user.role === 'nursery') {
      query.nurseryId = req.user.userId;
    }

    const plant = await Plant.findOneAndDelete(query);
    if (!plant) return res.status(404).json({ error: 'Plant not found or unauthorized' });
    res.json({ message: 'Plant deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== ORDER ROUTES ====================

// Create order (authenticated users only)
app.post('/api/orders', authenticateToken, async (req, res) => {
  try {
    const { customerName, customerEmail, customerPhone, customerAddress, items, total, deliveryType } = req.body;
    
    // Check stock availability
    for (let item of items) {
      const plant = await Plant.findById(item.plantId);
      if (!plant) return res.status(404).json({ error: `Plant ${item.plantName} not found` });
      if (plant.stock < item.quantity) {
        return res.status(400).json({ error: `Insufficient stock for ${plant.name}` });
      }
    }
    
    // Create order with user ID
    const order = new Order({
      userId: req.user.userId,
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      items,
      total,
      deliveryType
    });
    
    await order.save();
    
    // Update plant stock and sold count
    for (let item of items) {
      await Plant.findByIdAndUpdate(item.plantId, {
        $inc: { stock: -item.quantity, sold: item.quantity }
      });
    }
    
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all orders (admin/nursery only)
app.get('/api/orders', authenticateToken, requireRole(['admin', 'nursery']), async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'nursery') {
      // Nursery sees orders for their plants only
      const nurseryPlants = await Plant.find({ nurseryId: req.user.userId }).select('_id');
      const plantIds = nurseryPlants.map(p => p._id);
      query = { 'items.plantId': { $in: plantIds } };
    }

    const orders = await Order.find(query).populate('items.plantId').populate('userId', 'name email').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update order status (admin/nursery only)
app.put('/api/orders/:id', authenticateToken, requireRole(['admin', 'nursery']), async (req, res) => {
  try {
    const { status } = req.body;
    
    let query = { _id: req.params.id };
    if (req.user.role === 'nursery') {
      const order = await Order.findById(req.params.id).populate('items.plantId');
      const hasNurseryPlant = order.items.some(item => 
        item.plantId && item.plantId.nurseryId && 
        item.plantId.nurseryId.toString() === req.user.userId
      );
      if (!hasNurseryPlant) {
        return res.status(403).json({ error: 'Unauthorized to update this order' });
      }
    }

    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ==================== STORE FRONT API ====================

// Get plants for store (with filtering)
app.get('/api/store/plants', async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, sortBy } = req.query;
    let filter = { stock: { $gt: 0 } };
    
    if (category && category !== 'all') {
      filter.category = category;
    }
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }
    
    let query = Plant.find(filter);
    
    switch (sortBy) {
      case 'price_low':
        query = query.sort({ price: 1 });
        break;
      case 'price_high':
        query = query.sort({ price: -1 });
        break;
      case 'popular':
        query = query.sort({ sold: -1 });
        break;
      case 'newest':
        query = query.sort({ createdAt: -1 });
        break;
      default:
        query = query.sort({ name: 1 });
    }
    
    const plants = await query;
    res.json(plants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get plant categories
app.get('/api/store/categories', async (req, res) => {
  try {
    const categories = await Plant.distinct('category');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== ADMIN ROUTES ====================

// Get all users (admin only)
app.get('/api/admin/users', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user role (admin only)
app.put('/api/admin/users/:id/role', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id, 
      { role }, 
      { new: true }
    ).select('-password');
    
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ==================== DASHBOARD STATS ====================

app.get('/api/dashboard/stats', authenticateToken, requireRole(['admin', 'nursery']), async (req, res) => {
  try {
    let plantFilter = {};
    let orderFilter = {};
    
    if (req.user.role === 'nursery') {
      plantFilter.nurseryId = req.user.userId;
      const nurseryPlants = await Plant.find(plantFilter).select('_id');
      const plantIds = nurseryPlants.map(p => p._id);
      orderFilter = { 'items.plantId': { $in: plantIds } };
    }

    const totalPlants = await Plant.countDocuments(plantFilter);
    const totalOrders = await Order.countDocuments(orderFilter);
    const lowStockPlants = await Plant.countDocuments({ ...plantFilter, stock: { $lt: 10 } });
    
    const completedOrders = await Order.find({ ...orderFilter, status: 'completed' });
    const totalSales = completedOrders.reduce((sum, order) => sum + order.total, 0);
    
    res.json({
      totalPlants,
      totalOrders,
      totalUsers: req.user.role === 'admin' ? await User.countDocuments() : 0,
      lowStockPlants,
      totalSales
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== BASIC ROUTES ====================

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Plantify MERN API with Auth is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`Auth-enabled Plantify API ready!`);
});