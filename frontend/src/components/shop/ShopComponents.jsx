import React, { useState } from 'react';
import { ShopProvider, useShop } from './ShopContext';
import { paymentService, paymentMethods } from "../../services/paymentService";
import "./shop.css";

// Product Card Component
const ProductCard = ({ product }) => {
  const { dispatch, isInCart, isInWishlist } = useShop();
  
  return (
    <div className="product-card">
      <div className="product-image">
        {product.category === 1 ? '🪴' : 
         product.category === 2 ? '🌸' :
         product.category === 3 ? '🌱' :
         product.category === 4 ? '🧪' :
         product.category === 5 ? '🏺' :
         product.category === 6 ? '🔧' :
         product.category === 7 ? '🌾' : '💊'}
      </div>
      
      <div className="product-content">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description}</p>
        
        <div className="product-meta">
          <span className="product-price">Rs. {product.price}</span>
          <span className="product-stock">Stock: {product.stock}</span>
        </div>
        
        <div className="product-actions">
          <button
            onClick={() => dispatch({ type: 'ADD_TO_CART', payload: product })}
            disabled={product.stock === 0}
            className={`add-to-cart-btn ${
              isInCart(product.id) 
                ? 'added'
                : product.stock === 0
                ? 'out-of-stock'
                : 'default'
            }`}
          >
            {isInCart(product.id) ? '✓ Added' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
          
          <button
            onClick={() => dispatch({ 
              type: isInWishlist(product.id) ? 'REMOVE_FROM_WISHLIST' : 'ADD_TO_WISHLIST', 
              payload: isInWishlist(product.id) ? product.id : product 
            })}
            className={`wishlist-btn ${isInWishlist(product.id) ? 'active' : ''}`}
          >
            {isInWishlist(product.id) ? '❤️' : '🤍'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Shopping Cart Component
const ShoppingCart = ({ isOpen, onClose }) => {
  const { cart, dispatch, getCartTotal } = useShop();
  const [showCheckout, setShowCheckout] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="cart-overlay">
      <div className="cart-sidebar">
        <div className="cart-header">
          <h2 className="cart-title">Shopping Cart</h2>
          <button onClick={onClose} className="cart-close">✕</button>
        </div>
        
        <div className="cart-content">
          {cart.length === 0 ? (
            <p className="cart-empty">Your cart is empty</p>
          ) : (
            <div className="cart-items">
              {cart.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-image">🪴</div>
                  <div className="cart-item-details">
                    <h4 className="cart-item-name">{item.name}</h4>
                    <p className="cart-item-price">Rs. {item.price}</p>
                  </div>
                  <div className="cart-item-controls">
                    <button
                      onClick={() => dispatch({ 
                        type: 'UPDATE_QUANTITY', 
                        payload: { id: item.id, quantity: Math.max(1, item.quantity - 1) }
                      })}
                      className="quantity-btn"
                    >
                      -
                    </button>
                    <span className="quantity-display">{item.quantity}</span>
                    <button
                      onClick={() => dispatch({ 
                        type: 'UPDATE_QUANTITY', 
                        payload: { id: item.id, quantity: item.quantity + 1 }
                      })}
                      className="quantity-btn"
                    >
                      +
                    </button>
                    <button
                      onClick={() => dispatch({ type: 'REMOVE_FROM_CART', payload: item.id })}
                      className="remove-item-btn"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span>Total: Rs. {getCartTotal()}</span>
            </div>
            <button
              onClick={() => setShowCheckout(true)}
              className="checkout-btn"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
      
      {showCheckout && (
        <CheckoutModal 
          isOpen={showCheckout} 
          onClose={() => setShowCheckout(false)} 
        />
      )}
    </div>
  );
};

// Checkout Modal Component
const CheckoutModal = ({ isOpen, onClose }) => {
  const { cart, getCartTotal, dispatch } = useShop();
  const [customerInfo, setCustomerInfo] = useState({
    name: '', phone: '', email: '', address: '', city: ''
  });
  const [selectedPayment, setSelectedPayment] = useState('');
  const [loading, setLoading] = useState(false);
  const [orderResult, setOrderResult] = useState(null);

  const deliveryCharges = paymentService.calculateDeliveryCharges(customerInfo.city, getCartTotal());
  const totalAmount = getCartTotal() + deliveryCharges;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const paymentData = {
      method: selectedPayment,
      amount: totalAmount,
      customerInfo,
      items: cart,
      deliveryCharges
    };

    try {
      const result = await paymentService.processPayment(paymentData);
      
      if (result.success) {
        const order = {
          id: result.orderId || paymentService.generateOrderId(),
          items: cart,
          customerInfo,
          amount: totalAmount,
          paymentMethod: selectedPayment,
          status: 'pending',
          date: new Date().toISOString()
        };
        
        dispatch({ type: 'ADD_ORDER', payload: order });
        setOrderResult(result);
      } else {
        setOrderResult(result);
      }
    } catch (error) {
      setOrderResult({ success: false, error: 'Payment processing failed' });
    }
    
    setLoading(false);
  };

  if (!isOpen) return null;

  if (orderResult) {
    return (
      <div className="checkout-overlay">
        <div className="checkout-modal">
          {orderResult.success ? (
            <div className="order-success">
              <div className="success-icon">✅</div>
              <h3 className="success-title">Order Placed Successfully!</h3>
              <p className="success-message">
                {orderResult.type === 'cod' 
                  ? 'Your order will be delivered. Pay when you receive it.'
                  : orderResult.type === 'bank_transfer'
                  ? 'Please complete bank transfer as instructed.'
                  : 'Payment processed successfully.'
                }
              </p>
              {orderResult.instructions && (
                <div className="order-summary">
                  <h4 className="section-title">Payment Instructions:</h4>
                  <div className="summary-row">
                    <span>Account:</span>
                    <span>{orderResult.instructions.bankDetails.accountNumber}</span>
                  </div>
                  <div className="summary-row">
                    <span>IBAN:</span>
                    <span>{orderResult.instructions.bankDetails.iban}</span>
                  </div>
                  <div className="summary-row">
                    <span>Amount:</span>
                    <span>Rs. {totalAmount}</span>
                  </div>
                  <div className="summary-row">
                    <span>Reference:</span>
                    <span>{orderResult.instructions.orderId}</span>
                  </div>
                </div>
              )}
              <button
                onClick={onClose}
                className="place-order-btn"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="order-error">
              <div className="error-icon">❌</div>
              <h3 className="error-title">Order Failed</h3>
              <p className="error-message">{orderResult.error}</p>
              <button
                onClick={() => setOrderResult(null)}
                className="place-order-btn"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-overlay">
      <div className="checkout-modal">
        <div className="checkout-header">
          <h2 className="checkout-title">Checkout</h2>
          <button onClick={onClose} className="cart-close">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="checkout-form">
          <div className="form-section">
            <h3 className="section-title">Customer Information</h3>
            <div className="form-grid">
              <input
                type="text"
                placeholder="Full Name"
                value={customerInfo.name}
                onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                className="form-input"
                required
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={customerInfo.phone}
                onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                className="form-input"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={customerInfo.email}
                onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                className="form-input full-width"
              />
              <input
                type="text"
                placeholder="Address"
                value={customerInfo.address}
                onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                className="form-input full-width"
                required
              />
              <select
                value={customerInfo.city}
                onChange={(e) => setCustomerInfo({...customerInfo, city: e.target.value})}
                className="form-input"
                required
              >
                <option value="">Select City</option>
                <option value="karachi">Karachi</option>
                <option value="lahore">Lahore</option>
                <option value="islamabad">Islamabad</option>
                <option value="rawalpindi">Rawalpindi</option>
                <option value="faisalabad">Faisalabad</option>
                <option value="multan">Multan</option>
                <option value="peshawar">Peshawar</option>
                <option value="quetta">Quetta</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">Order Summary</h3>
            <div className="order-summary">
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>Rs. {getCartTotal()}</span>
              </div>
              <div className="summary-row">
                <span>Delivery:</span>
                <span>Rs. {deliveryCharges}</span>
              </div>
              <div className="summary-total">
                <span>Total:</span>
                <span>Rs. {totalAmount}</span>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">Payment Method</h3>
            <div className="payment-methods">
              {paymentMethods.map(method => (
                <label
                  key={method.id}
                  className={`payment-method ${
                    selectedPayment === method.id ? 'selected' : ''
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={method.id}
                    checked={selectedPayment === method.id}
                    onChange={(e) => setSelectedPayment(e.target.value)}
                    style={{ display: 'none' }}
                  />
                  <span className="payment-icon">{method.icon}</span>
                  <div className="payment-info">
                    <div className="payment-name">{method.name}</div>
                    <div className="payment-description">{method.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !selectedPayment}
            className="place-order-btn"
          >
            {loading ? (
              <div className="processing-loader">
                <div className="processing-spinner"></div>
                Processing...
              </div>
            ) : (
              `Place Order - Rs. ${totalAmount}`
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

// Main Shop Component
const Shop = () => {
  const { 
    categories, 
    selectedCategory, 
    searchQuery, 
    sortBy, 
    currentPage,
    getPaginatedProducts,
    getTotalPages,
    getCartItemCount,
    dispatch 
  } = useShop();

  const [showCart, setShowCart] = useState(false);
  const products = getPaginatedProducts();
  const totalPages = getTotalPages();

  return (
    <div className="shop-container">
      <header className="shop-header">
        <div className="shop-header-content">
          <h1 className="shop-logo">🌱 Plantify Store</h1>
          
          <div className="shop-search-container">
            <input
              type="text"
              placeholder="Search plants, tools, fertilizers..."
              value={searchQuery}
              onChange={(e) => dispatch({ type: 'SET_SEARCH', payload: e.target.value })}
              className="shop-search-input"
            />
          </div>
          
          <button
            onClick={() => setShowCart(true)}
            className="cart-button"
          >
            🛒 Cart
            {getCartItemCount() > 0 && (
              <span className="cart-badge">
                {getCartItemCount()}
              </span>
            )}
          </button>
        </div>
      </header>

      <div className="shop-main">
        <div className="shop-sidebar">
          <div className="sidebar-card">
            <h3 className="sidebar-title">Categories</h3>
            <ul className="category-list">
              <li className="category-item">
                <button
                  onClick={() => dispatch({ type: 'SET_CATEGORY', payload: 'all' })}
                  className={`category-button ${
                    selectedCategory === 'all' ? 'active' : ''
                  }`}
                >
                  All Products
                </button>
              </li>
              {categories.map(category => (
                <li key={category.id} className="category-item">
                  <button
                    onClick={() => dispatch({ type: 'SET_CATEGORY', payload: category.id.toString() })}
                    className={`category-button ${
                      selectedCategory === category.id.toString() ? 'active' : ''
                    }`}
                  >
                    <span className="category-icon">{category.icon}</span>
                    {category.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="sidebar-card">
            <h3 className="sidebar-title">Sort By</h3>
            <select
              value={sortBy}
              onChange={(e) => dispatch({ type: 'SET_SORT', payload: e.target.value })}
              className="sort-select"
            >
              <option value="name">Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="stock">Stock</option>
            </select>
          </div>
        </div>

        <div className="products-container">
          <div className="products-grid">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => dispatch({ type: 'SET_PAGE', payload: page })}
                  className={`pagination-btn ${
                    currentPage === page ? 'active' : ''
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <ShoppingCart isOpen={showCart} onClose={() => setShowCart(false)} />
    </div>
  );
};

export default function PlantifyShop() {
  return (
    <ShopProvider>
      <Shop />
    </ShopProvider>
  );
}