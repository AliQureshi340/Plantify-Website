import React, { useState, useEffect, useCallback } from 'react';
import { ShoppingCart, Search, Filter, Star, Heart, Plus, Minus, X, Check, Truck, MapPin, ArrowLeft, Upload, Package, List, User, LogOut } from 'lucide-react';
import AddPlantModal from './AddPlantModal';

const PlantDetailsModal = ({ plant, show, onClose, onAddToCart }) => {
  if (!show || !plant) return null;
  
  return (
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
        borderRadius: '12px',
        width: '90%',
        maxWidth: '800px',
        maxHeight: '90vh',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'row'
      }}>
        <div style={{ flex: '1', position: 'relative' }}>
          <img 
            src={plant.image?.startsWith('http') ? plant.image : `http://localhost:5000${plant.image}` || '/images/placeholder.jpg'}
            alt={plant.name}
            style={{ 
              width: '100%', 
              height: '400px', 
              objectFit: 'cover', 
              borderRadius: '12px 0 0 12px' 
            }}
          />
          {plant.discount > 0 && (
            <div style={{
              position: 'absolute',
              top: '15px',
              right: '15px',
              background: '#dc3545',
              color: 'white',
              padding: '8px 12px',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: 'bold'
            }}>
              SALE
            </div>
          )}
        </div>
        <div style={{ flex: '1', padding: '30px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>{plant.name}</h1>
            <button 
              onClick={onClose}
              style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}
            >
              <X />
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '15px' }}>
            {[1,2,3,4,5].map(star => (
              <Star key={star} size={16} style={{ color: '#ffc107' }} fill="#ffc107" />
            ))}
            <span style={{ marginLeft: '8px', color: '#666' }}>(15 customer reviews)</span>
          </div>
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '28px', fontWeight: 'bold', color: '#28a745' }}>
                Rs {(plant.price - (plant.price * (plant.discount || 0) / 100)).toLocaleString()}
              </span>
              {plant.discount > 0 && (
                <span style={{ fontSize: '18px', color: '#999', textDecoration: 'line-through' }}>
                  Rs {plant.price.toLocaleString()}
                </span>
              )}
            </div>
          </div>
          <div style={{ marginBottom: '20px' }}>
            <p style={{ color: '#666', lineHeight: '1.6' }}>
              {plant.description || 'Beautiful plant perfect for your home or garden. Easy to care for and adds natural beauty to any space.'}
            </p>
          </div>
          <div style={{ marginBottom: '20px', color: '#666' }}>
            <p><strong>CATEGORY:</strong> {plant.category.toUpperCase()}</p>
            <p><strong>Stock:</strong> {plant.stock} units available</p>
          </div>
          <button
            onClick={() => {
              onAddToCart(plant);
              onClose();
            }}
            disabled={plant.stock === 0}
            style={{
              width: '100%',
              padding: '15px',
              backgroundColor: plant.stock === 0 ? '#ccc' : '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: plant.stock === 0 ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            Add To Cart
          </button>
        </div>
      </div>
    </div>
  );
};

const CheckoutModal = ({ 
  showCheckout, 
  setShowCheckout, 
  customerInfo, 
  setCustomerInfo, 
  deliveryType, 
  setDeliveryType, 
  cart, 
  calculateTotal, 
  calculateDiscountAmount, 
  placeOrder 
}) => {
  if (!showCheckout) return null;

  return (
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
        maxWidth: '500px',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0 }}>Checkout</h2>
          <button 
            onClick={() => setShowCheckout(false)}
            style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}
          >
            <X />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Full Name *</label>
            <input 
              type="text"
              value={customerInfo.name}
              onChange={(e) => setCustomerInfo(prev => ({...prev, name: e.target.value}))}
              required
              style={{ 
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '16px'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Email *</label>
            <input 
              type="email"
              value={customerInfo.email}
              onChange={(e) => setCustomerInfo(prev => ({...prev, email: e.target.value}))}
              required
              style={{ 
                width: '100%', 
                padding: '12px', 
                border: '1px solid #ddd', 
                borderRadius: '8px',
                fontSize: '16px'
              }}
            />
          </div>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Phone *</label>
          <input 
            type="tel"
            value={customerInfo.phone}
            onChange={(e) => setCustomerInfo(prev => ({...prev, phone: e.target.value}))}
            required
            style={{ 
              width: '100%', 
              padding: '12px', 
              border: '1px solid #ddd', 
              borderRadius: '8px',
              fontSize: '16px'
            }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Address *</label>
          <textarea 
            value={customerInfo.address}
            onChange={(e) => setCustomerInfo(prev => ({...prev, address: e.target.value}))}
            required
            rows="3"
            style={{ 
              width: '100%', 
              padding: '12px', 
              border: '1px solid #ddd', 
              borderRadius: '8px',
              resize: 'vertical',
              fontSize: '16px'
            }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>City *</label>
            <input 
              type="text"
              value={customerInfo.city}
              onChange={(e) => setCustomerInfo(prev => ({...prev, city: e.target.value}))}
              required
              style={{ 
                width: '100%', 
                padding: '12px', 
                border: '1px solid #ddd', 
                borderRadius: '8px',
                fontSize: '16px'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Postal Code</label>
            <input 
              type="text"
              value={customerInfo.postalCode}
              onChange={(e) => setCustomerInfo(prev => ({...prev, postalCode: e.target.value}))}
              style={{ 
                width: '100%', 
                padding: '12px', 
                border: '1px solid #ddd', 
                borderRadius: '8px',
                fontSize: '16px'
              }}
            />
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600' }}>Delivery Option</label>
          <div style={{ display: 'flex', gap: '15px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input 
                type="radio"
                name="deliveryType"
                value="delivery"
                checked={deliveryType === 'delivery'}
                onChange={(e) => setDeliveryType(e.target.value)}
              />
              <Truck size={18} />
              Home Delivery
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input 
                type="radio"
                name="deliveryType"
                value="pickup"
                checked={deliveryType === 'pickup'}
                onChange={(e) => setDeliveryType(e.target.value)}
              />
              <MapPin size={18} />
              Store Pickup
            </label>
          </div>
        </div>

        <div style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '15px', 
          borderRadius: '8px', 
          marginBottom: '20px' 
        }}>
          <h4 style={{ margin: '0 0 10px 0' }}>Order Summary</h4>
          {cart.map(item => {
            const discountedPrice = item.price - calculateDiscountAmount(item);
            return (
              <div key={item._id} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                marginBottom: '5px' 
              }}>
                <span>{item.name} x {item.quantity}</span>
                <span>Rs {(discountedPrice * item.quantity).toLocaleString()}</span>
              </div>
            );
          })}
          <div style={{ 
            borderTop: '1px solid #ddd', 
            paddingTop: '10px', 
            marginTop: '10px',
            display: 'flex', 
            justifyContent: 'space-between',
            fontWeight: 'bold',
            fontSize: '18px'
          }}>
            <span>Total:</span>
            <span style={{ color: '#28a745' }}>Rs {calculateTotal().toLocaleString()}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={placeOrder}
          style={{
            width: '100%',
            padding: '15px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <Check size={18} />
          Place Order
        </button>
      </div>
    </div>
  );
};

const PlantInventory = ({ onClose, onPlantAdded }) => {
  const [myPlants, setMyPlants] = useState([]);
  const [showAddPlant, setShowAddPlant] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchMyPlants = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/plants/my', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const plants = await response.json();
        setMyPlants(plants);
      } else {
        console.error('Failed to fetch plants');
        setMyPlants([]);
      }
    } catch (error) {
      console.error('Error fetching plants:', error);
      setMyPlants([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyPlants();
  }, []);

  const handlePlantAdded = () => {
    fetchMyPlants(); // Refresh the plants list
    if (onPlantAdded) onPlantAdded();
  };

  return (
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
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        width: '95%',
        maxWidth: '1000px',
        height: '90vh',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{
          padding: '20px',
          borderBottom: '1px solid #eee',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Package size={24} />
            Plant Inventory
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => setShowAddPlant(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 15px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              <Plus size={18} />
              Add Plant
            </button>
            <button
              onClick={onClose}
              style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}
            >
              <X />
            </button>
          </div>
        </div>

        <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '50px' }}>
              <p>Loading your plants...</p>
            </div>
          ) : myPlants.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>
              <Package size={48} style={{ marginBottom: '20px', opacity: 0.5 }} />
              <h3>No plants in your inventory</h3>
              <p>Start by adding your first plant to the inventory.</p>
              <button
                onClick={() => setShowAddPlant(true)}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  marginTop: '10px'
                }}
              >
                Add Your First Plant
              </button>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '20px'
            }}>
              {myPlants.map(plant => (
                <div key={plant._id} style={{
                  backgroundColor: 'white',
                  border: '1px solid #eee',
                  borderRadius: '12px',
                  padding: '15px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                  <div style={{ position: 'relative', marginBottom: '10px' }}>
                    <img
                      src={plant.image?.startsWith('http') ? plant.image : `http://localhost:5000${plant.image}` || '/images/placeholder.jpg'}
                      alt={plant.name}
                      style={{
                        width: '100%',
                        height: '150px',
                        objectFit: 'cover',
                        borderRadius: '8px'
                      }}
                    />
                    {plant.discount > 0 && (
                      <div style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        -{plant.discount}%
                      </div>
                    )}
                  </div>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>{plant.name}</h4>
                  <p style={{
                    margin: '0 0 8px 0',
                    color: '#666',
                    fontSize: '14px',
                    backgroundColor: '#f8f9fa',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    display: 'inline-block'
                  }}>
                    {plant.category}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <div>
                      <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#28a745' }}>
                        Rs {plant.price.toLocaleString()}
                      </span>
                      {plant.discount > 0 && (
                        <div style={{ fontSize: '12px', color: '#dc3545' }}>
                          {plant.discount}% off
                        </div>
                      )}
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '14px', color: '#666' }}>Stock: {plant.stock}</div>
                      <div style={{ fontSize: '12px', color: '#999' }}>Sold: {plant.sold || 0}</div>
                    </div>
                  </div>
<div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
  <button
    style={{
      padding: '6px 12px',
      backgroundColor: '#007bff',
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
    onClick={() => {
      const currentStock = plant.stock;
      const newStock = prompt(
        `Current stock: ${currentStock}\n\nOptions:\n` +
        `• Enter a number to set new stock (e.g., "5" sets stock to 5)\n` +
        `• Enter "-1" to decrease by 1\n` +
        `• Enter "0" to delete all stock\n` +
        `• Enter "delete" to remove plant completely\n\n` +
        `What would you like to do?`
      );
      
      if (newStock === null) return; // User cancelled
      
      const handleStockUpdate = async (updateData) => {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`http://localhost:5000/api/plants/${plant._id}`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(updateData)
          });
          
          if (response.ok) {
            fetchMyPlants();
            alert('Stock updated successfully!');
          } else {
            alert('Failed to update stock');
          }
        } catch (error) {
          console.error('Error updating stock:', error);
          alert('Failed to update stock');
        }
      };
      
      const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to permanently delete this plant?')) return;
        
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`http://localhost:5000/api/plants/${plant._id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            fetchMyPlants();
            alert('Plant deleted successfully!');
          } else {
            alert('Failed to delete plant');
          }
        } catch (error) {
          console.error('Error deleting plant:', error);
          alert('Failed to delete plant');
        }
      };
      
      if (newStock.toLowerCase() === 'delete') {
        handleDelete();
      } else if (newStock === '-1') {
        const updatedStock = Math.max(0, currentStock - 1);
        handleStockUpdate({ stock: updatedStock });
      } else {
        const stockValue = parseInt(newStock);
        if (!isNaN(stockValue) && stockValue >= 0) {
          handleStockUpdate({ stock: stockValue });
        } else {
          alert('Invalid input. Please enter a valid number or "delete"');
        }
      }
    }}
    style={{
      padding: '6px 12px',
      backgroundColor: '#ffc107',
      color: 'black',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '12px'
    }}
  >
    Manage Stock
  </button>
</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Use the external AddPlantModal component */}
      <AddPlantModal
        showAddPlant={showAddPlant}
        setShowAddPlant={setShowAddPlant}
        onPlantAdded={handlePlantAdded}
      />
    </div>
  );
};

const PlantShop = () => {
  const [plants, setPlants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showInventory, setShowInventory] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: ''
  });
  const [deliveryType, setDeliveryType] = useState('delivery');
  const [orderStatus, setOrderStatus] = useState(null);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [showPlantDetails, setShowPlantDetails] = useState(false);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check authentication and user role
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAdmin(parsedUser.role === 'admin' || parsedUser.role === 'nursery');
        
        // Pre-fill customer info from user data
        setCustomerInfo({
          name: parsedUser.name || '',
          email: parsedUser.email || '',
          phone: parsedUser.phone || '',
          address: parsedUser.address || '',
          city: parsedUser.city || '',
          postalCode: parsedUser.postalCode || ''
        });
      } catch (error) {
        console.error('Error parsing user data:', error);
        setIsAdmin(false);
      }
    } else {
      setIsAdmin(false);
    }
  }, []);

  const calculateDiscountAmount = useCallback((item) => {
    return item.price * (item.discount || 0) / 100;
  }, []);

  const calculateTotal = useCallback(() => {
    return cart.reduce((total, item) => {
      const discountedPrice = item.price - (item.price * (item.discount || 0) / 100);
      return total + (discountedPrice * item.quantity);
    }, 0);
  }, [cart]);

  // Fetch plants from API
  const fetchPlants = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (selectedCategory !== 'all') queryParams.append('category', selectedCategory);
      if (searchQuery) queryParams.append('search', searchQuery);
      if (sortBy) queryParams.append('sortBy', sortBy);

      const response = await fetch(`http://localhost:5000/api/store/plants?${queryParams}`);
      if (response.ok) {
        const data = await response.json();
        setPlants(data);
      } else {
        console.error('Failed to fetch plants');
      }
    } catch (error) {
      console.error('Error fetching plants:', error);
    }
  };

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/store/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      } else {
        console.error('Failed to fetch categories');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchPlants();
  }, [selectedCategory, searchQuery, sortBy]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const addToCart = (plant) => {
    const existingItem = cart.find(item => item._id === plant._id);
    if (existingItem) {
      setCart(cart.map(item => 
        item._id === plant._id 
          ? { ...item, quantity: Math.min(item.quantity + 1, plant.stock) }
          : item
      ));
    } else {
      setCart([...cart, { ...plant, quantity: 1 }]);
    }
  };

  const removeFromCart = (plantId) => {
    setCart(cart.filter(item => item._id !== plantId));
  };

  const updateQuantity = (plantId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(plantId);
      return;
    }
    
    setCart(cart.map(item => 
      item._id === plantId 
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };

  const placeOrder = async () => {
    try {
      const orderData = {
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
        customerPhone: customerInfo.phone,
        customerAddress: customerInfo.address,
        deliveryType: deliveryType,
        items: cart.map(item => ({
          plantId: item._id,
          plantName: item.name,
          quantity: item.quantity,
          price: item.price - (item.price * (item.discount || 0) / 100)
        })),
        total: calculateTotal(),
        userId: user?.id || null
      };

      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });

      const result = await response.json();

      if (response.ok) {
        setOrderStatus({ success: true, orderId: result.order.orderNumber });
        setCart([]);
        setShowCheckout(false);
        fetchPlants(); // Refresh plants to update stock
      } else {
        setOrderStatus({ success: false, message: result.error || 'Failed to place order' });
      }
    } catch (error) {
      console.error('Error placing order:', error);
      setOrderStatus({ success: false, message: 'Failed to place order' });
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAdmin(false);
    setCustomerInfo({
      name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      postalCode: ''
    });
  };

  const PlantCard = ({ plant }) => {
    const discountedPrice = plant.price - calculateDiscountAmount(plant);
    
    return (
      <div 
        style={{ 
          background: 'white', 
          borderRadius: '12px', 
          padding: '20px', 
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          transition: 'transform 0.2s, box-shadow 0.2s',
          cursor: 'pointer',
          height: '100%',
          display: 'flex',
          flexDirection: 'column'
        }}
        onClick={() => {
          setSelectedPlant(plant);
          setShowPlantDetails(true);
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-5px)';
          e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
        }}
      >
        <div style={{ position: 'relative', marginBottom: '15px' }}>
          <img 
            src={plant.image?.startsWith('http') ? plant.image : `http://localhost:5000${plant.image}` || '/images/placeholder.jpg'}
            alt={plant.name}
            style={{ 
              width: '100%', 
              height: '200px', 
              objectFit: 'cover', 
              borderRadius: '8px' 
            }}
          />
          {plant.discount > 0 && (
            <div style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              background: '#dc3545',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 'bold'
            }}>
              -{plant.discount}%
            </div>
          )}
          {plant.stock < 5 && plant.stock > 0 && (
            <div style={{
              position: 'absolute',
              top: '10px',
              left: '10px',
              background: '#ffc107',
              color: 'black',
              padding: '4px 8px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 'bold'
            }}>
              Only {plant.stock} left
            </div>
          )}
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '600' }}>{plant.name}</h3>
          <p style={{ 
            margin: '0 0 10px 0', 
            color: '#666', 
            fontSize: '14px',
            background: '#f8f9fa',
            padding: '4px 8px',
            borderRadius: '4px',
            display: 'inline-block',
            width: 'fit-content'
          }}>
            {plant.category}
          </p>
          
          <p style={{ 
            margin: '0 0 15px 0', 
            color: '#666', 
            fontSize: '14px',
            lineHeight: '1.4',
            flex: 1
          }}>
            {plant.description || 'Beautiful plant perfect for your home or garden.'}
          </p>

          <div style={{ marginBottom: '15px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ 
                fontSize: '20px', 
                fontWeight: 'bold', 
                color: '#28a745' 
              }}>
                Rs {discountedPrice.toLocaleString()}
              </span>
              {plant.discount > 0 && (
                <span style={{ 
                  fontSize: '16px', 
                  color: '#999', 
                  textDecoration: 'line-through' 
                }}>
                  Rs {plant.price.toLocaleString()}
                </span>
              )}
            </div>
            <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
              Stock: {plant.stock} units
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart(plant);
            }}
            disabled={plant.stock === 0}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: plant.stock === 0 ? '#ccc' : '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: plant.stock === 0 ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => {
              if (plant.stock > 0) {
                e.target.style.backgroundColor = '#218838';
              }
            }}
            onMouseLeave={(e) => {
              if (plant.stock > 0) {
                e.target.style.backgroundColor = '#28a745';
              }
            }}
          >
            <ShoppingCart size={18} />
            {plant.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    );
  };

  const CartSidebar = () => (
    <div style={{
      position: 'fixed',
      top: 0,
      right: showCart ? 0 : '-400px',
      width: '400px',
      height: '100vh',
      backgroundColor: 'white',
      boxShadow: '-2px 0 10px rgba(0,0,0,0.1)',
      transition: 'right 0.3s ease',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{ 
        padding: '20px', 
        borderBottom: '1px solid #eee',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h3 style={{ margin: 0 }}>Shopping Cart ({cart.length})</h3>
        <button 
          onClick={() => setShowCart(false)}
          style={{ 
            background: 'none', 
            border: 'none', 
            fontSize: '24px', 
            cursor: 'pointer' 
          }}
        >
          <X />
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
        {cart.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#666', marginTop: '50px' }}>
            Your cart is empty
          </p>
        ) : (
          cart.map(item => {
            const discountedPrice = item.price - calculateDiscountAmount(item);
            return (
              <div key={item._id} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '15px',
                padding: '15px 0',
                borderBottom: '1px solid #eee'
              }}>
                <img 
                  src={item.image?.startsWith('http') ? item.image : `http://localhost:5000${item.image}` || '/images/placeholder.jpg'}
                  alt={item.name}
                  style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }}
                />
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 5px 0', fontSize: '14px' }}>{item.name}</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 'bold', color: '#28a745' }}>
                      Rs {discountedPrice.toLocaleString()}
                    </span>
                    {item.discount > 0 && (
                      <span style={{ fontSize: '12px', color: '#999', textDecoration: 'line-through' }}>
                        Rs {item.price.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '8px' }}>
                    <button 
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      style={{ 
                        width: '24px', 
                        height: '24px', 
                        border: '1px solid #ddd', 
                        background: 'white',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Minus size={12} />
                    </button>
                    <span>{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                      style={{ 
                        width: '24px', 
                        height: '24px', 
                        border: '1px solid #ddd', 
                        background: item.quantity >= item.stock ? '#f5f5f5' : 'white',
                        cursor: item.quantity >= item.stock ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Plus size={12} />
                    </button>
                    <button 
                      onClick={() => removeFromCart(item._id)}
                      style={{ 
                        marginLeft: '10px',
                        color: '#dc3545',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {cart.length > 0 && (
        <div style={{ padding: '20px', borderTop: '1px solid #eee' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '15px'
          }}>
            <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Total:</span>
            <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#28a745' }}>
              Rs {calculateTotal().toLocaleString()}
            </span>
          </div>
          <button
            onClick={() => {
              setShowCart(false);
              setShowCheckout(true);
            }}
            style={{
              width: '100%',
              padding: '15px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Checkout
          </button>
        </div>
      )}
    </div>
  );

  const OrderStatusModal = () => {
    if (!orderStatus) return null;
    
    return (
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
        zIndex: 3000
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '12px',
          textAlign: 'center',
          maxWidth: '400px'
        }}>
          {orderStatus.success ? (
            <>
              <div style={{ 
                width: '60px', 
                height: '60px', 
                backgroundColor: '#28a745',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px auto'
              }}>
                <Check size={30} color="white" />
              </div>
              <h3 style={{ margin: '0 0 10px 0', color: '#28a745' }}>Order Placed Successfully!</h3>
              <p style={{ margin: '0 0 20px 0', color: '#666' }}>
                Order ID: {orderStatus.orderId}
              </p>
              <p style={{ margin: '0 0 20px 0', color: '#666' }}>
                Thank you for your purchase. You will receive a confirmation email shortly.
              </p>
              <button
                onClick={() => setOrderStatus(null)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Continue Shopping
              </button>
            </>
          ) : (
            <>
              <div style={{ 
                width: '60px', 
                height: '60px', 
                backgroundColor: '#dc3545',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px auto'
              }}>
                <X size={30} color="white" />
              </div>
              <h3 style={{ margin: '0 0 10px 0', color: '#dc3545' }}>Order Failed</h3>
              <p style={{ margin: '0 0 20px 0', color: '#666' }}>
                {orderStatus.message}
              </p>
              <button
                onClick={() => setOrderStatus(null)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Try Again
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <header style={{ 
        backgroundColor: 'white', 
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        padding: '15px 0',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h1 style={{ margin: 0, color: '#28a745', display: 'flex', alignItems: 'center', gap: '10px' }}>
              🌱 Plantify Shop
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {user && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginRight: '15px' }}>
                  <User size={20} style={{ color: '#666' }} />
                  <span style={{ color: '#666', fontSize: '14px' }}>Welcome, {user.name}</span>
                  <button
                    onClick={logout}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <LogOut size={14} />
                    Logout
                  </button>
                </div>
              )}
              
              {isAdmin && (
                <button
                  onClick={() => setShowInventory(true)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 15px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '16px'
                  }}
                >
                  <Package size={20} />
                  Inventory
                </button>
              )}
              
              <button
                onClick={() => setShowCart(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 15px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  position: 'relative'
                }}
              >
                <ShoppingCart size={20} />
                Cart ({cart.length})
                {cart.length > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-8px',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div style={{ 
        backgroundColor: 'white', 
        borderBottom: '1px solid #eee',
        padding: '20px 0'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '20px', alignItems: 'end' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Search Plants</label>
              <div style={{ position: 'relative' }}>
                <Search style={{ 
                  position: 'absolute', 
                  left: '12px', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  color: '#666'
                }} size={18} />
                <input
                  type="text"
                  placeholder="Search for plants..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 12px 12px 45px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '16px'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '16px'
                }}
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '16px'
                }}
              >
                <option value="name">Name (A-Z)</option>
                <option value="price_low">Price (Low to High)</option>
                <option value="price_high">Price (High to Low)</option>
                <option value="popular">Most Popular</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '30px 20px' }}>
        <div style={{ marginBottom: '20px', color: '#666' }}>
          <p>Showing {plants.length} plants {selectedCategory !== 'all' && `in ${selectedCategory}`}</p>
        </div>

        {plants.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '60px 20px',
            color: '#666'
          }}>
            <p style={{ fontSize: '18px', marginBottom: '10px' }}>No plants found</p>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
            gap: '25px' 
          }}>
            {plants.map(plant => (
              <PlantCard key={plant._id} plant={plant} />
            ))}
          </div>
        )}
      </main>

      <CartSidebar />
      
      <CheckoutModal 
        showCheckout={showCheckout}
        setShowCheckout={setShowCheckout}
        customerInfo={customerInfo}
        setCustomerInfo={setCustomerInfo}
        deliveryType={deliveryType}
        setDeliveryType={setDeliveryType}
        cart={cart}
        calculateTotal={calculateTotal}
        calculateDiscountAmount={calculateDiscountAmount}
        placeOrder={placeOrder}
      />
      
      {showInventory && (
        <PlantInventory 
          onClose={() => setShowInventory(false)}
          onPlantAdded={fetchPlants}
        />
      )}
      
      <OrderStatusModal />
      
      <PlantDetailsModal 
        plant={selectedPlant}
        show={showPlantDetails}
        onClose={() => setShowPlantDetails(false)}
        onAddToCart={addToCart}
      />
      
      {showCart && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.3)',
            zIndex: 999
          }}
          onClick={() => setShowCart(false)}
        />
      )}
    </div>
  );
};

export default PlantShop;