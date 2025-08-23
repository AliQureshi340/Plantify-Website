// orderService.js - Order management and tracking
export class OrderService {
  constructor() {
    this.apiUrl = process.env.REACT_APP_API_URL || 'https://api.plantify.pk';
  }

  // Order status types
  static STATUS = {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    PROCESSING: 'processing',
    SHIPPED: 'shipped',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled'
  };

  // Create new order
  async createOrder(orderData) {
    const order = {
      id: this.generateOrderId(),
      ...orderData,
      status: OrderService.STATUS.PENDING,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      trackingId: this.generateTrackingId(),
      estimatedDelivery: this.calculateEstimatedDelivery(orderData.customerInfo.city)
    };

    try {
      // Save to backend
      const response = await fetch(`${this.apiUrl}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
      });

      if (!response.ok) throw new Error('Failed to create order');
      
      // Send confirmation SMS/Email
      await this.sendOrderConfirmation(order);
      
      return { success: true, order };
    } catch (error) {
      console.error('Order creation failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Update order status
  async updateOrderStatus(orderId, status, notes = '') {
    try {
      const response = await fetch(`${this.apiUrl}/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status, 
          notes,
          updatedAt: new Date().toISOString() 
        })
      });

      if (!response.ok) throw new Error('Failed to update order');
      
      const order = await response.json();
      
      // Send status update notification
      await this.sendStatusUpdate(order);
      
      return { success: true, order };
    } catch (error) {
      console.error('Status update failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Get order by ID
  async getOrder(orderId) {
    try {
      const response = await fetch(`${this.apiUrl}/orders/${orderId}`);
      if (!response.ok) throw new Error('Order not found');
      
      const order = await response.json();
      return { success: true, order };
    } catch (error) {
      console.error('Failed to fetch order:', error);
      return { success: false, error: error.message };
    }
  }

  // Get orders by customer phone
  async getCustomerOrders(phone) {
    try {
      const response = await fetch(`${this.apiUrl}/orders?phone=${phone}`);
      if (!response.ok) throw new Error('Failed to fetch orders');
      
      const orders = await response.json();
      return { success: true, orders };
    } catch (error) {
      console.error('Failed to fetch customer orders:', error);
      return { success: false, error: error.message };
    }
  }

  // Track order
  async trackOrder(trackingId) {
    try {
      const response = await fetch(`${this.apiUrl}/orders/track/${trackingId}`);
      if (!response.ok) throw new Error('Tracking ID not found');
      
      const tracking = await response.json();
      return { success: true, tracking };
    } catch (error) {
      console.error('Order tracking failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Cancel order
  async cancelOrder(orderId, reason) {
    try {
      const response = await fetch(`${this.apiUrl}/orders/${orderId}/cancel`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          reason,
          cancelledAt: new Date().toISOString() 
        })
      });

      if (!response.ok) throw new Error('Failed to cancel order');
      
      const order = await response.json();
      await this.sendCancellationNotice(order);
      
      return { success: true, order };
    } catch (error) {
      console.error('Order cancellation failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Generate order ID
  generateOrderId() {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `PLT-${timestamp}-${random}`.toUpperCase();
  }

  // Generate tracking ID
  generateTrackingId() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    let result = 'PLT';
    
    for (let i = 0; i < 3; i++) {
      result += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    for (let i = 0; i < 6; i++) {
      result += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }
    
    return result;
  }

  // Calculate estimated delivery
  calculateEstimatedDelivery(city) {
    const deliveryDays = {
      'karachi': 2,
      'lahore': 2,
      'islamabad': 3,
      'rawalpindi': 3,
      'faisalabad': 3,
      'multan': 4,
      'peshawar': 5,
      'quetta': 6,
      'other': 5
    };

    const days = deliveryDays[city.toLowerCase()] || deliveryDays['other'];
    const estimatedDate = new Date();
    estimatedDate.setDate(estimatedDate.getDate() + days);
    
    return estimatedDate.toISOString();
  }

  // Send order confirmation
  async sendOrderConfirmation(order) {
    try {
      // SMS confirmation
      await fetch(`${this.apiUrl}/notifications/sms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: order.customerInfo.phone,
          message: `Order confirmed! Order ID: ${order.id}. Track: ${order.trackingId}. Delivery in ${this.calculateDeliveryDays(order.customerInfo.city)} days. - Plantify`
        })
      });

      // Email confirmation if provided
      if (order.customerInfo.email) {
        await fetch(`${this.apiUrl}/notifications/email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: order.customerInfo.email,
            subject: 'Order Confirmation - Plantify',
            template: 'order_confirmation',
            data: order
          })
        });
      }
    } catch (error) {
      console.error('Failed to send confirmation:', error);
    }
  }

  // Send status update
  async sendStatusUpdate(order) {
    const statusMessages = {
      [OrderService.STATUS.CONFIRMED]: 'Your order has been confirmed and is being prepared.',
      [OrderService.STATUS.PROCESSING]: 'Your order is being processed and will ship soon.',
      [OrderService.STATUS.SHIPPED]: `Your order has been shipped! Track: ${order.trackingId}`,
      [OrderService.STATUS.DELIVERED]: 'Your order has been delivered! Thank you for shopping with Plantify.',
      [OrderService.STATUS.CANCELLED]: 'Your order has been cancelled. Refund will be processed if applicable.'
    };

    try {
      await fetch(`${this.apiUrl}/notifications/sms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: order.customerInfo.phone,
          message: `${statusMessages[order.status]} Order: ${order.id} - Plantify`
        })
      });
    } catch (error) {
      console.error('Failed to send status update:', error);
    }
  }

  // Send cancellation notice
  async sendCancellationNotice(order) {
    try {
      await fetch(`${this.apiUrl}/notifications/sms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: order.customerInfo.phone,
          message: `Your order ${order.id} has been cancelled. Any payment will be refunded within 3-5 business days. - Plantify`
        })
      });
    } catch (error) {
      console.error('Failed to send cancellation notice:', error);
    }
  }

  // Calculate delivery days
  calculateDeliveryDays(city) {
    const deliveryDays = {
      'karachi': 2,
      'lahore': 2,
      'islamabad': 3,
      'rawalpindi': 3,
      'faisalabad': 3,
      'multan': 4,
      'peshawar': 5,
      'quetta': 6,
      'other': 5
    };

    return deliveryDays[city.toLowerCase()] || deliveryDays['other'];
  }

  // Get order analytics
  async getOrderAnalytics(startDate, endDate) {
    try {
      const response = await fetch(`${this.apiUrl}/orders/analytics?start=${startDate}&end=${endDate}`);
      if (!response.ok) throw new Error('Failed to fetch analytics');
      
      const analytics = await response.json();
      return { success: true, analytics };
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      return { success: false, error: error.message };
    }
  }

  // Bulk update orders
  async bulkUpdateOrders(orderIds,