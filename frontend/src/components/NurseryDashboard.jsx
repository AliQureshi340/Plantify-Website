import React, { useState, useEffect } from 'react';
/* eslint-disable no-restricted-globals */
const NurseryDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [plants, setPlants] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [editingPlant, setEditingPlant] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newPlant, setNewPlant] = useState({
    name: '', price: '', stock: '', category: '', image: '', description: '', discount: 0
  });
  const [notification, setNotification] = useState(null);

  const API_BASE = 'http://localhost:5000';

  // Show notification
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Fetch data from backend
  useEffect(() => {
    fetchPlants();
    fetchOrders();
    fetchCustomers();
  }, []);

  const fetchPlants = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/plants`);
      const data = await response.json();
      setPlants(data);
    } catch (error) {
      console.error('Error fetching plants:', error);
      showNotification('Failed to fetch plants', 'error');
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/orders`);
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      showNotification('Failed to fetch orders', 'error');
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/customers`);
      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      console.error('Error fetching customers:', error);
      showNotification('Failed to fetch customers', 'error');
    }
  };

  const handleAddPlant = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE}/api/plants`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPlant)
      });
      if (response.ok) {
        fetchPlants();
        setNewPlant({ name: '', price: '', stock: '', category: '', image: '', description: '', discount: 0 });
        setActiveTab('plants');
        showNotification('Plant added successfully!');
      } else {
        const error = await response.json();
        showNotification(error.error || 'Failed to add plant', 'error');
      }
    } catch (error) {
      console.error('Error adding plant:', error);
      showNotification('Failed to add plant', 'error');
    }
  };

  const handleUpdatePlant = async (id, updatedPlant) => {
    try {
      const response = await fetch(`${API_BASE}/api/plants/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPlant)
      });
      if (response.ok) {
        fetchPlants();
        setEditingPlant(null);
        showNotification('Plant updated successfully!');
      } else {
        const error = await response.json();
        showNotification(error.error || 'Failed to update plant', 'error');
      }
    } catch (error) {
      console.error('Error updating plant:', error);
      showNotification('Failed to update plant', 'error');
    }
  };

  const handleDeletePlant = async (id) => {
    if (!confirm('Are you sure you want to delete this plant?')) return;
    
    try {
      const response = await fetch(`${API_BASE}/api/plants/${id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchPlants();
        showNotification('Plant deleted successfully!');
      } else {
        const error = await response.json();
        showNotification(error.error || 'Failed to delete plant', 'error');
      }
    } catch (error) {
      console.error('Error deleting plant:', error);
      showNotification('Failed to delete plant', 'error');
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const response = await fetch(`${API_BASE}/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (response.ok) {
        fetchOrders();
        showNotification(`Order status updated to ${status}`);
      } else {
        const error = await response.json();
        showNotification(error.error || 'Failed to update order', 'error');
      }
    } catch (error) {
      console.error('Error updating order:', error);
      showNotification('Failed to update order', 'error');
    }
  };

  const generateReport = () => {
    const totalSales = orders.filter(order => order.status === 'completed').reduce((sum, order) => sum + order.total, 0);
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(order => order.status === 'pending').length;
    const completedOrders = orders.filter(order => order.status === 'completed').length;
    const lowStock = plants.filter(plant => plant.stock < 10);
    const topSellingPlants = plants.sort((a, b) => (b.sold || 0) - (a.sold || 0)).slice(0, 5);
    
    return { 
      totalSales, 
      totalOrders, 
      pendingOrders,
      completedOrders,
      lowStock: lowStock.length, 
      totalCustomers: customers.length,
      topSellingPlants,
      averageOrderValue: totalOrders > 0 ? totalSales / completedOrders : 0
    };
  };

  const report = generateReport();

  // Notification component
  const Notification = () => (
    notification && (
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '15px 20px',
        borderRadius: '8px',
        color: 'white',
        fontSize: '14px',
        fontWeight: '600',
        zIndex: 2000,
        backgroundColor: notification.type === 'error' ? '#dc3545' : '#28a745',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        {notification.message}
      </div>
    )
  );

  // Dashboard Overview with enhanced metrics
  const renderDashboard = () => (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Nursery Dashboard Overview</h2>
        <button 
          onClick={() => window.open('/shop', '_blank')}
          style={{ 
            padding: '10px 20px', 
            background: '#28a745', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          🛍️ View Live Shop
        </button>
      </div>
      
      {/* Key Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div style={{ background: 'linear-gradient(135deg, #28a745, #20c997)', padding: '20px', borderRadius: '12px', textAlign: 'center', color: 'white' }}>
          <h3>Total Revenue</h3>
          <p style={{ fontSize: '28px', fontWeight: 'bold', margin: '10px 0' }}>Rs {report.totalSales.toLocaleString()}</p>
          <small>From {report.completedOrders} completed orders</small>
        </div>
        <div style={{ background: 'linear-gradient(135deg, #007bff, #6610f2)', padding: '20px', borderRadius: '12px', textAlign: 'center', color: 'white' }}>
          <h3>Active Orders</h3>
          <p style={{ fontSize: '28px', fontWeight: 'bold', margin: '10px 0' }}>{report.pendingOrders}</p>
          <small>Pending processing</small>
        </div>
        <div style={{ background: 'linear-gradient(135deg, #dc3545, #e83e8c)', padding: '20px', borderRadius: '12px', textAlign: 'center', color: 'white' }}>
          <h3>Low Stock Alert</h3>
          <p style={{ fontSize: '28px', fontWeight: 'bold', margin: '10px 0' }}>{report.lowStock}</p>
          <small>Items need restocking</small>
        </div>
        <div style={{ background: 'linear-gradient(135deg, #6f42c1, #e83e8c)', padding: '20px', borderRadius: '12px', textAlign: 'center', color: 'white' }}>
          <h3>Total Customers</h3>
          <p style={{ fontSize: '28px', fontWeight: 'bold', margin: '10px 0' }}>{report.totalCustomers}</p>
          <small>Registered buyers</small>
        </div>
        <div style={{ background: 'linear-gradient(135deg, #fd7e14, #ffc107)', padding: '20px', borderRadius: '12px', textAlign: 'center', color: 'white' }}>
          <h3>Avg Order Value</h3>
          <p style={{ fontSize: '28px', fontWeight: 'bold', margin: '10px 0' }}>Rs {Math.round(report.averageOrderValue).toLocaleString()}</p>
          <small>Per completed order</small>
        </div>
        <div style={{ background: 'linear-gradient(135deg, #20c997, #17a2b8)', padding: '20px', borderRadius: '12px', textAlign: 'center', color: 'white' }}>
          <h3>Total Plants</h3>
          <p style={{ fontSize: '28px', fontWeight: 'bold', margin: '10px 0' }}>{plants.length}</p>
          <small>In inventory</small>
        </div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
        {/* Recent Orders */}
        <div style={{ background: '#fff', border: '1px solid #ddd', borderRadius: '12px', padding: '20px' }}>
          <h3 style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            📦 Recent Orders
          </h3>
          {orders.slice(0, 5).map(order => (
            <div key={order._id} style={{ padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ margin: '0 0 4px 0', fontWeight: '600' }}>#{order._id.slice(-6)}</p>
                  <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#666' }}>
                    {order.customerName} • Rs {order.total.toLocaleString()}
                  </p>
                  <span style={{ 
                    padding: '2px 8px', 
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '600',
                    background: order.status === 'completed' ? '#d4edda' : 
                               order.status === 'pending' ? '#fff3cd' : 
                               order.status === 'processing' ? '#d1ecf1' : '#f8d7da',
                    color: order.status === 'completed' ? '#155724' : 
                           order.status === 'pending' ? '#856404' : 
                           order.status === 'processing' ? '#0c5460' : '#721c24'
                  }}>
                    {order.status.toUpperCase()}
                  </span>
                </div>
                <button 
                  onClick={() => setSelectedOrder(order)}
                  style={{ 
                    padding: '6px 12px', 
                    background: '#007bff', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '4px',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {/* Low Stock Alert */}
        <div style={{ background: '#fff', border: '1px solid #ddd', borderRadius: '12px', padding: '20px' }}>
          <h3 style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            ⚠️ Low Stock Alert
          </h3>
          {plants.filter(plant => plant.stock < 10).slice(0, 5).map(plant => (
            <div key={plant._id} style={{ padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ margin: '0 0 4px 0', fontWeight: '600' }}>{plant.name}</p>
                  <p style={{ margin: '0', fontSize: '14px', color: '#dc3545', fontWeight: '600' }}>
                    Only {plant.stock} left
                  </p>
                </div>
                <button 
                  onClick={() => setEditingPlant(plant)}
                  style={{ 
                    padding: '6px 12px', 
                    background: '#ffc107', 
                    color: 'black', 
                    border: 'none', 
                    borderRadius: '4px',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  Restock
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Top Selling Plants */}
        <div style={{ background: '#fff', border: '1px solid #ddd', borderRadius: '12px', padding: '20px' }}>
          <h3 style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🏆 Top Sellers
          </h3>
          {report.topSellingPlants.map((plant, index) => (
            <div key={plant._id} style={{ padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ 
                    background: index === 0 ? '#ffd700' : index === 1 ? '#c0c0c0' : index === 2 ? '#cd7f32' : '#f8f9fa',
                    color: index < 3 ? 'white' : 'black',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    {index + 1}
                  </span>
                  <div>
                    <p style={{ margin: '0 0 4px 0', fontWeight: '600' }}>{plant.name}</p>
                    <p style={{ margin: '0', fontSize: '14px', color: '#666' }}>
                      {plant.sold || 0} sold
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Enhanced Plants Management
  const renderPlants = () => (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Plants Inventory Management</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => window.open('/shop', '_blank')}
            style={{ padding: '10px 20px', background: '#17a2b8', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            🛍️ View in Shop
          </button>
          <button 
            onClick={() => setActiveTab('add-plant')} 
            style={{ padding: '10px 20px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            + Add New Plant
          </button>
        </div>
      </div>
      
      <div style={{ background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f8f9fa' }}>
            <tr>
              <th style={{ padding: '15px', border: '1px solid #ddd', textAlign: 'left', fontWeight: '600' }}>Image</th>
              <th style={{ padding: '15px', border: '1px solid #ddd', textAlign: 'left', fontWeight: '600' }}>Plant Details</th>
              <th style={{ padding: '15px', border: '1px solid #ddd', textAlign: 'left', fontWeight: '600' }}>Pricing</th>
              <th style={{ padding: '15px', border: '1px solid #ddd', textAlign: 'left', fontWeight: '600' }}>Stock Status</th>
              <th style={{ padding: '15px', border: '1px solid #ddd', textAlign: 'left', fontWeight: '600' }}>Performance</th>
              <th style={{ padding: '15px', border: '1px solid #ddd', textAlign: 'left', fontWeight: '600' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {plants.map(plant => {
              const stockStatus = plant.stock === 0 ? 'Out of Stock' : 
                                plant.stock < 5 ? 'Critical' : 
                                plant.stock < 10 ? 'Low' : 'Good';
              const stockColor = plant.stock === 0 ? '#dc3545' : 
                               plant.stock < 5 ? '#fd7e14' : 
                               plant.stock < 10 ? '#ffc107' : '#28a745';
              
              return (
                <tr key={plant._id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '15px', border: '1px solid #ddd' }}>
                    <img 
                      src={plant.image || '/api/placeholder/60/60'} 
                      alt={plant.name} 
                      style={{ 
                        width: '60px', 
                        height: '60px', 
                        objectFit: 'cover', 
                        borderRadius: '8px',
                        border: '1px solid #ddd'
                      }} 
                    />
                  </td>
                  <td style={{ padding: '15px', border: '1px solid #ddd' }}>
                    <div>
                      <h4 style={{ margin: '0 0 4px 0', fontSize: '16px' }}>{plant.name}</h4>
                      <p style={{ 
                        margin: '0 0 4px 0', 
                        fontSize: '12px', 
                        color: 'white',
                        background: '#6c757d',
                        padding: '2px 6px',
                        borderRadius: '3px',
                        display: 'inline-block'
                      }}>
                        {plant.category}
                      </p>
                      <p style={{ margin: '0', fontSize: '14px', color: '#666' }}>
                        {plant.description?.substring(0, 50)}...
                      </p>
                    </div>
                  </td>
                  <td style={{ padding: '15px', border: '1px solid #ddd' }}>
                    <div>
                      <p style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: 'bold', color: '#28a745' }}>
                        Rs {plant.price.toLocaleString()}
                      </p>
                      {plant.discount > 0 && (
                        <p style={{ 
                          margin: '0', 
                          fontSize: '12px', 
                          color: 'white',
                          background: '#dc3545',
                          padding: '2px 6px',
                          borderRadius: '3px',
                          display: 'inline-block'
                        }}>
                          -{plant.discount}% OFF
                        </p>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: '15px', border: '1px solid #ddd' }}>
                    <div>
                      <p style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: 'bold', color: stockColor }}>
                        {plant.stock} units
                      </p>
                      <span style={{ 
                        fontSize: '12px',
                        padding: '2px 6px',
                        borderRadius: '3px',
                        background: stockColor,
                        color: 'white',
                        fontWeight: '600'
                      }}>
                        {stockStatus}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '15px', border: '1px solid #ddd' }}>
                    <div>
                      <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#666' }}>
                        Sold: {plant.sold || 0}
                      </p>
                      <p style={{ margin: '0', fontSize: '14px', color: '#666' }}>
                        Revenue: Rs {((plant.sold || 0) * plant.price).toLocaleString()}
                      </p>
                    </div>
                  </td>
                  <td style={{ padding: '15px', border: '1px solid #ddd' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                      <button 
                        onClick={() => setEditingPlant(plant)} 
                        style={{ 
                          padding: '6px 12px', 
                          background: '#007bff', 
                          color: 'white', 
                          border: 'none', 
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeletePlant(plant._id)} 
                        style={{ 
                          padding: '6px 12px', 
                          background: '#dc3545', 
                          color: 'white', 
                          border: 'none', 
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Enhanced Add Plant Form
  const renderAddPlant = () => (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
        <button 
          onClick={() => setActiveTab('plants')}
          style={{ 
            padding: '8px 16px', 
            background: '#6c757d', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          ← Back to Plants
        </button>
        <h2 style={{ margin: 0 }}>Add New Plant to Shop</h2>
      </div>
      
      <div style={{ background: '#fff', padding: '30px', borderRadius: '12px', border: '1px solid #ddd', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <form onSubmit={handleAddPlant}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', marginBottom: '25px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>Plant Name *</label>
              <input 
                type="text" 
                value={newPlant.name}
                onChange={(e) => setNewPlant({...newPlant, name: e.target.value})}
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  border: '2px solid #e9ecef', 
                  borderRadius: '8px',
                  fontSize: '14px',
                  transition: 'border-color 0.2s'
                }}
                required 
                placeholder="e.g., Snake Plant"
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>Category *</label>
              <select 
                value={newPlant.category}
                onChange={(e) => setNewPlant({...newPlant, category: e.target.value})}
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  border: '2px solid #e9ecef', 
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
                required
              >
                <option value="">Select Category</option>
                <option value="Indoor">Indoor Plants</option>
                <option value="Outdoor">Outdoor Plants</option>
                <option value="Flowering">Flowering Plants</option>
                <option value="Herbs">Herbs</option>
                <option value="Succulents">Succulents</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>Price (Rs) *</label>
              <input 
                type="number" 
                value={newPlant.price}
                onChange={(e) => setNewPlant({...newPlant, price: e.target.value})}
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  border: '2px solid #e9ecef', 
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
                required 
                min="1"
                placeholder="e.g., 1500"
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>Initial Stock *</label>
              <input 
                type="number" 
                value={newPlant.stock}
                onChange={(e) => setNewPlant({...newPlant, stock: e.target.value})}
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  border: '2px solid #e9ecef', 
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
                required 
                min="0"
                placeholder="e.g., 25"
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>Discount (%)</label>
              <input 
                type="number" 
                value={newPlant.discount}
                onChange={(e) => setNewPlant({...newPlant, discount: e.target.value})}
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  border: '2px solid #e9ecef', 
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
                min="0" 
                max="100"
                placeholder="e.g., 10"
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>Image URL</label>
              <input 
                type="url" 
                value={newPlant.image}
                onChange={(e) => setNewPlant({...newPlant, image: e.target.value})}
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  border: '2px solid #e9ecef', 
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
                placeholder="https://example.com/plant-image.jpg"
              />
            </div>
          </div>
          
          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>Plant Description</label>
            <textarea 
              value={newPlant.description}
              onChange={(e) => setNewPlant({...newPlant, description: e.target.value})}
              style={{ 
                width: '100%', 
                padding: '12px', 
                border: '2px solid #e9ecef', 
                borderRadius: '8px', 
                height: '120px',
                fontSize: '14px',
                resize: 'vertical'
              }}
              placeholder="Describe the plant, its care requirements, benefits, etc..."
            />
          </div>
          
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
            <button 
              type="button" 
              onClick={() => setActiveTab('plants')} 
              style={{ 
                padding: '12px 24px', 
                background: '#6c757d', 
                color: 'white', 
                border: 'none', 
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              style={{ 
                padding: '12px 24px', 
                background: '#28a745', 
                color: 'white', 
                border: 'none', 
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              Add Plant to Shop
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  // Enhanced Orders Management
  const renderOrders = () => (
    <div style={{ padding: '20px' }}>
      <h2 style={{ marginBottom: '20px' }}>Shop Orders Management</h2>
      
      <div style={{ background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f8f9fa' }}>
            <tr>
              <th style={{ padding: '15px', border: '1px solid #ddd', textAlign: 'left', fontWeight: '600' }}>Order Info</th>
              <th style={{ padding: '15px', border: '1px solid #ddd', textAlign: 'left', fontWeight: '600' }}>Customer</th>
              <th style={{ padding: '15px', border: '1px solid #ddd', textAlign: 'left', fontWeight: '600' }}>Items & Total</th>
              <th style={{ padding: '15px', border: '1px solid #ddd', textAlign: 'left', fontWeight: '600' }}>Status</th>
              <th style={{ padding: '15px', border: '1px solid #ddd', textAlign: 'left', fontWeight: '600' }}>Delivery</th>
              <th style={{ padding: '15px', border: '1px solid #ddd', textAlign: 'left', fontWeight: '600' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '15px', border: '1px solid #ddd' }}>
                  <div>
                    <p style={{ margin: '0 0 4px 0', fontWeight: '600', fontSize: '16px' }}>
                      #{order._id.slice(-6)}
                    </p>
                    <p style={{ margin: '0', fontSize: '12px', color: '#666' }}>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </td>
                <td style={{ padding: '15px', border: '1px solid #ddd' }}>
                  <div>
                    <p style={{ margin: '0 0 4px 0', fontWeight: '600' }}>{order.customerName}</p>
                    <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#666' }}>{order.customerEmail}</p>
                    <p style={{ margin: '0', fontSize: '14px', color: '#666' }}>{order.customerPhone}</p>
                  </div>
                </td>
                <td style={{ padding: '15px', border: '1px solid #ddd' }}>
                  <div>
                    <p style={{ margin: '0 0 4px 0', fontWeight: '600' }}>
                      {order.items?.length || 0} items
                    </p>
                    <p style={{ margin: '0', fontSize: '18px', fontWeight: 'bold', color: '#28a745' }}>
                      Rs {order.total.toLocaleString()}
                    </p>
                  </div>
                </td>
                <td style={{ padding: '15px', border: '1px solid #ddd' }}>
                  <select 
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                    style={{ 
                      padding: '8px 12px', 
                      border: '1px solid #ddd', 
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: '600',
                      background: order.status === 'completed' ? '#d4edda' : 
                                 order.status === 'pending' ? '#fff3cd' : 
                                 order.status === 'processing' ? '#d1ecf1' : '#f8d7da',
                      color: order.status === 'completed' ? '#155724' : 
                             order.status === 'pending' ? '#856404' : 
                             order.status === 'processing' ? '#0c5460' : '#721c24'
                    }}
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td style={{ padding: '15px', border: '1px solid #ddd' }}>
                  <span style={{ 
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '600',
                    background: order.deliveryType === 'delivery' ? '#e3f2fd' : '#f3e5f5',
                    color: order.deliveryType === 'delivery' ? '#1565c0' : '#7b1fa2'
                  }}>
                    {order.deliveryType === 'delivery' ? 'Home Delivery' : 'Store Pickup'}
                  </span>
                </td>
                <td style={{ padding: '15px', border: '1px solid #ddd' }}>
                  <button 
                    onClick={() => setSelectedOrder(order)}
                    style={{ 
                      padding: '8px 16px', 
                      background: '#007bff', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Rest of the render methods (keeping existing code)
  const renderCustomers = () => (
    <div style={{ padding: '20px' }}>
      <h2>Customer Management</h2>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
          <thead>
            <tr style={{ background: '#f8f9fa' }}>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Name</th>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Email</th>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Phone</th>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Orders</th>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Total Spent</th>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map(customer => (
              <tr key={customer._id}>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>{customer.name}</td>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>{customer.email}</td>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>{customer.phone}</td>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>{customer.totalOrders}</td>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>Rs {customer.totalSpent}</td>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                  <button style={{ padding: '5px 10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>
                    View Profile
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderReports = () => (
    <div style={{ padding: '20px' }}>
      <h2>Sales Reports & Analytics</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' }}>
        <div style={{ background: '#fff', border: '1px solid #ddd', borderRadius: '8px', padding: '20px' }}>
          <h3>Monthly Sales</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#28a745' }}>Rs {report.totalSales}</p>
        </div>
        <div style={{ background: '#fff', border: '1px solid #ddd', borderRadius: '8px', padding: '20px' }}>
          <h3>Total Orders</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#007bff' }}>{report.totalOrders}</p>
        </div>
        <div style={{ background: '#fff', border: '1px solid #ddd', borderRadius: '8px', padding: '20px' }}>
          <h3>Average Order Value</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#6f42c1' }}>Rs {Math.round(report.averageOrderValue)}</p>
        </div>
      </div>
      
      <div style={{ background: '#fff', border: '1px solid #ddd', borderRadius: '8px', padding: '20px' }}>
        <h3>Top Selling Plants</h3>
        {plants.slice(0, 10).map(plant => (
          <div key={plant._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #eee' }}>
            <span>{plant.name}</span>
            <span>{plant.sold || 0} units sold</span>
          </div>
        ))}
      </div>
    </div>
  );

  // Order Details Modal
  const OrderDetailsModal = () => (
    selectedOrder && (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '12px',
          width: '90%',
          maxWidth: '600px',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2>Order Details #{selectedOrder._id.slice(-6)}</h2>
            <button 
              onClick={() => setSelectedOrder(null)}
              style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}
            >
              ×
            </button>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h4>Customer Information:</h4>
            <p><strong>Name:</strong> {selectedOrder.customerName}</p>
            <p><strong>Email:</strong> {selectedOrder.customerEmail}</p>
            <p><strong>Phone:</strong> {selectedOrder.customerPhone}</p>
            <p><strong>Address:</strong> {selectedOrder.customerAddress}</p>
            <p><strong>Delivery Type:</strong> {selectedOrder.deliveryType}</p>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h4>Order Items:</h4>
            {selectedOrder.items?.map((item, index) => (
              <div key={index} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                padding: '10px 0',
                borderBottom: '1px solid #eee'
              }}>
                <span>{item.plantName} x {item.quantity}</span>
                <span>Rs {(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
            <div style={{ 
              fontWeight: 'bold', 
              fontSize: '18px', 
              marginTop: '10px',
              textAlign: 'right'
            }}>
              Total: Rs {selectedOrder.total.toLocaleString()}
            </div>
          </div>

          <div>
            <h4>Update Status:</h4>
            <select 
              value={selectedOrder.status}
              onChange={(e) => {
                updateOrderStatus(selectedOrder._id, e.target.value);
                setSelectedOrder({...selectedOrder, status: e.target.value});
              }}
              style={{ 
                padding: '10px', 
                border: '1px solid #ddd', 
                borderRadius: '4px',
                width: '200px'
              }}
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>
    )
  );

  // Edit Plant Modal (keeping existing code)
  const renderEditModal = () => {
    if (!editingPlant) return null;
    
    return (
      <div style={{ 
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
        background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 
      }}>
        <div style={{ background: '#fff', padding: '30px', borderRadius: '8px', width: '500px', maxHeight: '80vh', overflowY: 'auto' }}>
          <h3>Edit Plant</h3>
          <form onSubmit={(e) => {
            e.preventDefault();
            handleUpdatePlant(editingPlant._id, editingPlant);
          }}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Name:</label>
              <input 
                type="text" 
                value={editingPlant.name}
                onChange={(e) => setEditingPlant({...editingPlant, name: e.target.value})}
                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Price:</label>
              <input 
                type="number" 
                value={editingPlant.price}
                onChange={(e) => setEditingPlant({...editingPlant, price: e.target.value})}
                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Stock:</label>
              <input 
                type="number" 
                value={editingPlant.stock}
                onChange={(e) => setEditingPlant({...editingPlant, stock: e.target.value})}
                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Discount (%):</label>
              <input 
                type="number" 
                value={editingPlant.discount}
                onChange={(e) => setEditingPlant({...editingPlant, discount: e.target.value})}
                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => setEditingPlant(null)} style={{ padding: '10px 20px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px' }}>
                Cancel
              </button>
              <button type="submit" style={{ padding: '10px 20px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}>
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fa' }}>
      {/* Sidebar */}
      <div style={{ width: '280px', background: '#343a40', color: 'white', padding: '25px' }}>
        <h2 style={{ marginBottom: '30px', borderBottom: '2px solid #495057', paddingBottom: '15px' }}>
          Nursery Control Panel
        </h2>
        <nav>
          {[
            { key: 'dashboard', icon: '📊', label: 'Dashboard' },
            { key: 'plants', icon: '🌱', label: 'Plant Inventory' },
            { key: 'orders', icon: '📦', label: 'Shop Orders' },
            { key: 'customers', icon: '👥', label: 'Customers' },
            { key: 'reports', icon: '📈', label: 'Reports' }
          ].map(item => (
            <div 
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              style={{ 
                padding: '15px 20px', 
                cursor: 'pointer', 
                background: activeTab === item.key ? '#495057' : 'transparent',
                marginBottom: '8px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                transition: 'all 0.2s'
              }}
            >
              <span style={{ fontSize: '18px' }}>{item.icon}</span>
              <span style={{ fontWeight: '500' }}>{item.label}</span>
            </div>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'plants' && renderPlants()}
        {activeTab === 'add-plant' && renderAddPlant()}
        {activeTab === 'orders' && renderOrders()}
        {activeTab === 'customers' && renderCustomers()}
        {activeTab === 'reports' && renderReports()}
      </div>

      {/* Modals */}
      {renderEditModal()}
      <OrderDetailsModal />
      <Notification />
    </div>
  );
};

export default NurseryDashboard;