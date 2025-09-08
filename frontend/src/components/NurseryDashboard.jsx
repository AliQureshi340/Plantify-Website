import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthSystem';
import AddPlantModal from './AddPlantModal';
import ShopOrdersManagement from "./Nursery-Section/ShopOrdersManagement";
import NurseryAnimations from "../styles/NurseryAnimations.jsx";



const NurseryDashboard = () => {
  const { authFetch } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [plants, setPlants] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [editingPlant, setEditingPlant] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showAddPlant, setShowAddPlant] = useState(false);
  const [notification, setNotification] = useState(null);

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
      const response = await fetch('http://localhost:5000/api/plants');
      const data = await response.json();
      setPlants(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching plants:', error);
      showNotification('Failed to fetch plants', 'error');
      setPlants([]);
    }
  };

  const fetchOrders = async () => {
  try {
    const response = await authFetch('/api/orders?limit=100');
    const data = await response.json();
    
    // Handle both array response and object with orders property
    const ordersData = Array.isArray(data) ? data : (data.orders || []);
    setOrders(ordersData);
  } catch (error) {
    console.error('Error fetching orders:', error);
    showNotification('Failed to fetch orders', 'error');
    setOrders([]);
  }
};

  const fetchCustomers = async () => {
    try {
      const response = await authFetch('/api/admin/users');
      const data = await response.json();
      const customerData = Array.isArray(data) ? data.filter(user => user.role === 'user') : [];
      setCustomers(customerData);
    } catch (error) {
      console.error('Error fetching customers:', error);
      showNotification('Failed to fetch customers', 'error');
      setCustomers([]);
    }
  };

  const handleUpdatePlant = async (id, updatedPlant) => {
    try {
      const response = await authFetch(`/api/plants/${id}`, {
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



  const updateOrderStatus = async (orderId, status) => {
    try {
      const response = await authFetch(`/api/orders/${orderId}`, {
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
    if (!orders || !Array.isArray(orders)) {
      return {
        totalSales: 0,
        totalOrders: 0,
        pendingOrders: 0,
        completedOrders: 0,
        lowStock: 0,
        totalCustomers: 0,
        topSellingPlants: [],
        averageOrderValue: 0
      };
    }

    if (!plants || !Array.isArray(plants)) {
      return {
        totalSales: 0,
        totalOrders: orders.length,
        pendingOrders: orders.filter(order => order.status === 'pending').length,
        completedOrders: orders.filter(order => order.status === 'completed').length,
        lowStock: 0,
        totalCustomers: customers?.length || 0,
        topSellingPlants: [],
        averageOrderValue: 0
      };
    }

    const completedOrders = orders.filter(order => order.status === 'completed');
    const totalSales = completedOrders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(order => order.status === 'pending').length;
    const completedOrdersCount = completedOrders.length;
    const lowStock = plants.filter(plant => plant.stock < 10);
    const topSellingPlants = plants.sort((a, b) => (b.sold || 0) - (a.sold || 0)).slice(0, 5);

    return {
      totalSales,
      totalOrders,
      pendingOrders,
      completedOrders: completedOrdersCount,
      lowStock: lowStock.length,
      totalCustomers: customers?.length || 0,
      topSellingPlants,
      averageOrderValue: completedOrdersCount > 0 ? totalSales / completedOrdersCount : 0
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
  const renderDashboard = () => {
    const recentOrders = (orders || []).slice(0, 5);
    const lowStockPlants = (plants || []).filter(plant => plant.stock < 10).slice(0, 5);

    return (
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
            View Live Shop
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
              Recent Orders
            </h3>
            {recentOrders.map(order => (
              <div key={order._id} style={{ padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ margin: '0 0 4px 0', fontWeight: '600' }}>#{order._id.slice(-6)}</p>
                    <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#666' }}>
                      {order.customerName || order.shippingAddress?.fullName || 'N/A'} • Rs {order.total.toLocaleString()}
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
            {recentOrders.length === 0 && (
              <p style={{ textAlign: 'center', color: '#666', fontStyle: 'italic' }}>
                No orders yet
              </p>
            )}
          </div>
          
          {/* Low Stock Alert */}
          <div style={{ background: '#fff', border: '1px solid #ddd', borderRadius: '12px', padding: '20px' }}>
            <h3 style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              Low Stock Alert
            </h3>
            {lowStockPlants.map(plant => (
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
            {lowStockPlants.length === 0 && (
              <p style={{ textAlign: 'center', color: '#666', fontStyle: 'italic' }}>
                All plants well stocked
              </p>
            )}
          </div>

          {/* Top Selling Plants */}
          <div style={{ background: '#fff', border: '1px solid #ddd', borderRadius: '12px', padding: '20px' }}>
            <h3 style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              Top Sellers
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
            {report.topSellingPlants.length === 0 && (
              <p style={{ textAlign: 'center', color: '#666', fontStyle: 'italic' }}>
                No sales data yet
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };

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
            View in Shop
          </button>
          <button 
            onClick={() => setShowAddPlant(true)} 
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
                      
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {plants.length === 0 && (
          <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
            <p>No plants in inventory. Add your first plant to get started!</p>
          </div>
        )}
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
                    <p style={{ margin: '0 0 4px 0', fontWeight: '600' }}>
                      {order.customerName || order.shippingAddress?.fullName || 'N/A'}
                    </p>
                    <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#666' }}>
                      {order.customerEmail || order.shippingAddress?.email || 'N/A'}
                    </p>
                    <p style={{ margin: '0', fontSize: '14px', color: '#666' }}>
                      {order.customerPhone || order.shippingAddress?.phone || 'N/A'}
                    </p>
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
        {orders.length === 0 && (
          <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
            <p>No orders received yet. Start by adding plants to your inventory!</p>
          </div>
        )}
      </div>
    </div>
  );



  // Enhanced Order Details Modal
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
          maxWidth: '700px',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
            <h2>Order Details #{selectedOrder._id.slice(-6)}</h2>
            <button 
              onClick={() => setSelectedOrder(null)}
              style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}
            >
              ×
            </button>
          </div>

          {/* Customer Information */}
          <div style={{ marginBottom: '25px', padding: '20px', background: '#f8f9fa', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 15px 0' }}>Customer Information:</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <p style={{ margin: '0 0 8px 0' }}><strong>Name:</strong> {selectedOrder.customerName || selectedOrder.shippingAddress?.fullName || 'N/A'}</p>
                <p style={{ margin: '0 0 8px 0' }}><strong>Email:</strong> {selectedOrder.customerEmail || selectedOrder.shippingAddress?.email || 'N/A'}</p>
                <p style={{ margin: '0' }}><strong>Phone:</strong> {selectedOrder.customerPhone || selectedOrder.shippingAddress?.phone || 'N/A'}</p>
              </div>
              <div>
                <p style={{ margin: '0 0 8px 0' }}><strong>Address:</strong> {selectedOrder.customerAddress || selectedOrder.shippingAddress?.address || 'N/A'}</p>
                <p style={{ margin: '0 0 8px 0' }}><strong>City:</strong> {selectedOrder.shippingAddress?.city || 'N/A'}</p>
                <p style={{ margin: '0' }}><strong>Delivery Type:</strong> {selectedOrder.deliveryType || 'N/A'}</p>
              </div>
            </div>
            
            {/* Show all customer orders if available */}
            {selectedOrder.allCustomerOrders && selectedOrder.allCustomerOrders.length > 1 && (
              <div style={{ marginTop: '15px', padding: '15px', background: 'white', borderRadius: '6px' }}>
                <h5 style={{ margin: '0 0 10px 0' }}>Customer Order History ({selectedOrder.allCustomerOrders.length} orders):</h5>
                {selectedOrder.allCustomerOrders.slice(0, 5).map((order, index) => (
                  <div key={order._id} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    padding: '8px 0',
                    borderBottom: index < 4 ? '1px solid #eee' : 'none'
                  }}>
                    <span style={{ fontSize: '14px' }}>#{order._id.slice(-6)}</span>
                    <span style={{ fontSize: '14px', color: '#666' }}>{new Date(order.createdAt).toLocaleDateString()}</span>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#28a745' }}>Rs {order.total.toLocaleString()}</span>
                    <span style={{ 
                      fontSize: '12px',
                      padding: '2px 6px',
                      borderRadius: '10px',
                      background: order.status === 'completed' ? '#d4edda' : '#fff3cd',
                      color: order.status === 'completed' ? '#155724' : '#856404'
                    }}>
                      {order.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Order Items */}
          <div style={{ marginBottom: '25px' }}>
            <h4 style={{ margin: '0 0 15px 0' }}>Order Items:</h4>
            <div style={{ background: '#f8f9fa', borderRadius: '8px', padding: '15px' }}>
              {selectedOrder.items?.map((item, index) => (
                <div key={index} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '12px 0',
                  borderBottom: index < selectedOrder.items.length - 1 ? '1px solid #dee2e6' : 'none'
                }}>
                  <div>
                    <p style={{ margin: '0 0 4px 0', fontWeight: '600', fontSize: '16px' }}>{item.plantName || item.name}</p>
                    <p style={{ margin: '0', fontSize: '14px', color: '#666' }}>Quantity: {item.quantity}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#666' }}>Rs {item.price?.toLocaleString()} each</p>
                    <p style={{ margin: '0', fontSize: '16px', fontWeight: '600', color: '#28a745' }}>
                      Rs {((item.price || 0) * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
              <div style={{ 
                fontWeight: 'bold', 
                fontSize: '20px', 
                marginTop: '15px',
                textAlign: 'right',
                padding: '15px 0',
                borderTop: '2px solid #28a745',
                color: '#28a745'
              }}>
                Total: Rs {selectedOrder.total.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Order Status Update */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ margin: '0 0 15px 0' }}>Update Order Status:</h4>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
              <select 
                value={selectedOrder.status}
                onChange={(e) => {
                  updateOrderStatus(selectedOrder._id, e.target.value);
                  setSelectedOrder({...selectedOrder, status: e.target.value});
                }}
                style={{ 
                  padding: '12px 15px', 
                  border: '2px solid #ddd', 
                  borderRadius: '6px',
                  fontSize: '16px',
                  fontWeight: '600',
                  minWidth: '200px'
                }}
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <span style={{ 
                padding: '8px 12px',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '600',
                background: selectedOrder.status === 'completed' ? '#d4edda' : 
                           selectedOrder.status === 'pending' ? '#fff3cd' : 
                           selectedOrder.status === 'processing' ? '#d1ecf1' : '#f8d7da',
                color: selectedOrder.status === 'completed' ? '#155724' : 
                       selectedOrder.status === 'pending' ? '#856404' : 
                       selectedOrder.status === 'processing' ? '#0c5460' : '#721c24'
              }}>
                Current: {selectedOrder.status.toUpperCase()}
              </span>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <button 
              onClick={() => setSelectedOrder(null)}
              style={{ 
                padding: '12px 24px', 
                background: '#6c757d', 
                color: 'white', 
                border: 'none', 
                borderRadius: '6px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )
  );

  // Edit Plant Modal
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
                value={editingPlant.discount || 0}
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
  {activeTab === 'orders' && renderOrders()}
</div>

      {/* Modals */}
      <AddPlantModal 
        showAddPlant={showAddPlant} 
        setShowAddPlant={setShowAddPlant} 
        onPlantAdded={fetchPlants}
      />
      {renderEditModal()}
      <OrderDetailsModal />
      <Notification />
    </div>
  );
};

export default NurseryDashboard;