const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/nursery', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

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
  createdAt: { type: Date, default: Date.now }
});

// Order Schema
const orderSchema = new mongoose.Schema({
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

// Customer Schema
const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  address: { type: String },
  totalOrders: { type: Number, default: 0 },
  totalSpent: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

// Models
const Plant = mongoose.model('Plant', plantSchema);
const Order = mongoose.model('Order', orderSchema);
const Customer = mongoose.model('Customer', customerSchema);

// PLANT ROUTES

// Get all plants
app.get('/api/plants', async (req, res) => {
  try {
    const plants = await Plant.find().sort({ createdAt: -1 });
    res.json(plants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single plant
app.get('/api/plants/:id', async (req, res) => {
  try {
    const plant = await Plant.findById(req.params.id);
    if (!plant) return res.status(404).json({ error: 'Plant not found' });
    res.json(plant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add new plant
app.post('/api/plants', async (req, res) => {
  try {
    const plant = new Plant(req.body);
    await plant.save();
    res.status(201).json(plant);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update plant
app.put('/api/plants/:id', async (req, res) => {
  try {
    const plant = await Plant.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!plant) return res.status(404).json({ error: 'Plant not found' });
    res.json(plant);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete plant
app.delete('/api/plants/:id', async (req, res) => {
  try {
    const plant = await Plant.findByIdAndDelete(req.params.id);
    if (!plant) return res.status(404).json({ error: 'Plant not found' });
    res.json({ message: 'Plant deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ORDER ROUTES

// Get all orders
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().populate('items.plantId').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single order
app.get('/api/orders/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.plantId');
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new order
app.post('/api/orders', async (req, res) => {
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
    
    // Create order
    const order = new Order({
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
    
    // Update or create customer
    const existingCustomer = await Customer.findOne({ email: customerEmail });
    if (existingCustomer) {
      await Customer.findByIdAndUpdate(existingCustomer._id, {
        $inc: { totalOrders: 1, totalSpent: total }
      });
    } else {
      const newCustomer = new Customer({
        name: customerName,
        email: customerEmail,
        phone: customerPhone,
        address: customerAddress,
        totalOrders: 1,
        totalSpent: total
      });
      await newCustomer.save();
    }
    
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update order status
app.put('/api/orders/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete order
app.delete('/api/orders/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CUSTOMER ROUTES

// Get all customers
app.get('/api/customers', async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single customer
app.get('/api/customers/:id', async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update customer
app.put('/api/customers/:id', async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    res.json(customer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete customer
app.delete('/api/customers/:id', async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DASHBOARD/ANALYTICS ROUTES

// Get dashboard stats
app.get('/api/dashboard/stats', async (req, res) => {
  try {
    const totalPlants = await Plant.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalCustomers = await Customer.countDocuments();
    const lowStockPlants = await Plant.countDocuments({ stock: { $lt: 10 } });
    
    const completedOrders = await Order.find({ status: 'completed' });
    const totalSales = completedOrders.reduce((sum, order) => sum + order.total, 0);
    
    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5).populate('items.plantId');
    const lowStockItems = await Plant.find({ stock: { $lt: 10 } }).limit(5);
    
    res.json({
      totalPlants,
      totalOrders,
      totalCustomers,
      lowStockPlants,
      totalSales,
      recentOrders,
      lowStockItems
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get sales report
app.get('/api/reports/sales', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let dateFilter = {};
    
    if (startDate && endDate) {
      dateFilter = {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      };
    }
    
    const orders = await Order.find({ ...dateFilter, status: 'completed' });
    const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = orders.length;
    const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;
    
    // Top selling plants
    const plantSales = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        if (plantSales[item.plantName]) {
          plantSales[item.plantName] += item.quantity;
        } else {
          plantSales[item.plantName] = item.quantity;
        }
      });
    });
    
    const topSellingPlants = Object.entries(plantSales)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([name, quantity]) => ({ name, quantity }));
    
    res.json({
      totalSales,
      totalOrders,
      averageOrderValue,
      topSellingPlants,
      orders
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// STORE FRONT API (for customers)

// Get plants for store (with filtering)
app.get('/api/store/plants', async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, sortBy } = req.query;
    let filter = { stock: { $gt: 0 } }; // Only show plants in stock
    
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
    
    // Sorting
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

// Initialize with sample data (run once)
app.post('/api/init-sample-data', async (req, res) => {
  try {
    // Check if data already exists
    const existingPlants = await Plant.countDocuments();
    if (existingPlants > 0) {
      return res.json({ message: 'Sample data already exists' });
    }
    
    const samplePlants = [
      {
        name: 'Snake Plant',
        category: 'Indoor',
        price: 1500,
        stock: 25,
        discount: 10,
        description: 'Easy care indoor plant perfect for beginners',
        image: 'https://example.com/snake-plant.jpg'
      },
      {
        name: 'Rose Bush',
        category: 'Flowering',
        price: 800,
        stock: 15,
        discount: 0,
        description: 'Beautiful flowering rose bush',
        image: 'https://example.com/rose.jpg'
      },
      {
        name: 'Mint Plant',
        category: 'Herbs',
        price: 300,
        stock: 50,
        discount: 5,
        description: 'Fresh mint for cooking and tea',
        image: 'https://example.com/mint.jpg'
      }
    ];
    
    const sampleCustomers = [
      {
        name: 'Ahmed Khan',
        email: 'ahmed@example.com',
        phone: '03001234567',
        address: 'Lahore, Punjab',
        totalOrders: 2,
        totalSpent: 3000
      }
    ];
    
    const sampleOrders = [
      {
        customerName: 'Ahmed Khan',
        customerEmail: 'ahmed@example.com',
        customerPhone: '03001234567',
        customerAddress: 'Lahore, Punjab',
        items: [
          { plantName: 'Snake Plant', quantity: 2, price: 1500 }
        ],
        total: 3000,
        status: 'completed',
        deliveryType: 'delivery'
      }
    ];
    
    await Plant.insertMany(samplePlants);
    await Customer.insertMany(sampleCustomers);
    await Order.insertMany(sampleOrders);
    
    res.json({ message: 'Sample data created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Nursery server running on port ${PORT}`);
});

module.exports = app;