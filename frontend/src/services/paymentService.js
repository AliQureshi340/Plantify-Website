// paymentService.js - Payment gateway integration
export const paymentMethods = [
  {
    id: 'easypaisa',
    name: 'EasyPaisa',
    type: 'mobile_wallet',
    icon: '📱',
    color: '#00a651',
    description: 'Pay via EasyPaisa mobile wallet'
  },
  {
    id: 'jazzcash',
    name: 'JazzCash',
    type: 'mobile_wallet', 
    icon: '💳',
    color: '#ff6b35',
    description: 'Pay via JazzCash mobile wallet'
  },
  {
    id: 'hbl',
    name: 'HBL Bank',
    type: 'bank',
    icon: '🏦',
    color: '#0066cc',
    description: 'Habib Bank Limited'
  },
  {
    id: 'ubl',
    name: 'UBL Bank',
    type: 'bank',
    icon: '🏦', 
    color: '#ff0000',
    description: 'United Bank Limited'
  },
  {
    id: 'mcb',
    name: 'MCB Bank',
    type: 'bank',
    icon: '🏦',
    color: '#1e4d8b',
    description: 'Muslim Commercial Bank'
  },
  {
    id: 'allied',
    name: 'Allied Bank',
    type: 'bank',
    icon: '🏦',
    color: '#ff6b00',
    description: 'Allied Bank Limited'
  },
  {
    id: 'cod',
    name: 'Cash on Delivery',
    type: 'cod',
    icon: '💵',
    color: '#28a745',
    description: 'Pay when you receive'
  }
];

export class PaymentService {
  constructor() {
    this.apiUrl = process.env.REACT_APP_PAYMENT_API || 'https://api.plantify.pk/payments';
  }

  // Generate order ID
  generateOrderId() {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `PLT-${timestamp}-${random}`.toUpperCase();
  }

  // Validate payment data
  validatePaymentData(paymentData) {
    const { method, amount, customerInfo } = paymentData;
    
    if (!method || !amount || amount <= 0) {
      return { valid: false, error: 'Invalid payment details' };
    }

    if (!customerInfo || !customerInfo.phone || !customerInfo.name) {
      return { valid: false, error: 'Customer information required' };
    }

    // Phone number validation for Pakistan
    const phoneRegex = /^(\+92|0)?[3][0-9]{9}$/;
    if (!phoneRegex.test(customerInfo.phone)) {
      return { valid: false, error: 'Invalid phone number format' };
    }

    return { valid: true };
  }

  // Process EasyPaisa payment
  async processEasyPaisaPayment(orderData) {
    const { orderId, amount, customerInfo } = orderData;
    
    // Simulate EasyPaisa API integration
    try {
      const response = await fetch(`${this.apiUrl}/easypaisa/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          merchant_id: process.env.REACT_APP_EASYPAISA_MERCHANT_ID,
          order_id: orderId,
          amount: amount,
          customer_phone: customerInfo.phone,
          customer_name: customerInfo.name,
          callback_url: `${window.location.origin}/payment/callback`
        })
      });

      const data = await response.json();
      
      if (data.status === 'success') {
        // Redirect to EasyPaisa payment page
        window.location.href = data.payment_url;
        return { success: true, paymentUrl: data.payment_url };
      }
      
      return { success: false, error: data.message };
    } catch (error) {
      console.error('EasyPaisa payment error:', error);
      return { success: false, error: 'Payment processing failed' };
    }
  }

  // Process JazzCash payment
  async processJazzCashPayment(orderData) {
    const { orderId, amount, customerInfo } = orderData;
    
    try {
      const response = await fetch(`${this.apiUrl}/jazzcash/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          merchant_id: process.env.REACT_APP_JAZZCASH_MERCHANT_ID,
          order_id: orderId,
          amount: amount,
          customer_phone: customerInfo.phone,
          customer_name: customerInfo.name,
          callback_url: `${window.location.origin}/payment/callback`
        })
      });

      const data = await response.json();
      
      if (data.status === 'success') {
        window.location.href = data.payment_url;
        return { success: true, paymentUrl: data.payment_url };
      }
      
      return { success: false, error: data.message };
    } catch (error) {
      console.error('JazzCash payment error:', error);
      return { success: false, error: 'Payment processing failed' };
    }
  }

  // Process bank payment
  async processBankPayment(orderData) {
    const { orderId, amount, customerInfo, bankId } = orderData;
    
    // Generate bank payment instructions
    const bankDetails = this.getBankDetails(bankId);
    
    const paymentInstructions = {
      orderId,
      amount,
      bankDetails,
      reference: orderId,
      instructions: [
        'Transfer amount to the provided account',
        'Use order ID as reference',
        'Share payment screenshot on WhatsApp',
        'Order will be processed after verification'
      ]
    };

    return { 
      success: true, 
      type: 'bank_transfer',
      instructions: paymentInstructions 
    };
  }

  // Get bank details
  getBankDetails(bankId) {
    const bankAccounts = {
      hbl: {
        name: 'Plantify Store',
        accountNumber: '12345678901234',
        branchCode: '1234',
        iban: 'PK12HABB0012345678901234'
      },
      ubl: {
        name: 'Plantify Store', 
        accountNumber: '98765432109876',
        branchCode: '5678',
        iban: 'PK34UNIL0098765432109876'
      },
      mcb: {
        name: 'Plantify Store',
        accountNumber: '11223344556677',
        branchCode: '9012',
        iban: 'PK56MUCB0011223344556677'
      },
      allied: {
        name: 'Plantify Store',
        accountNumber: '99887766554433',
        branchCode: '3456',
        iban: 'PK78ABPA0099887766554433'
      }
    };

    return bankAccounts[bankId] || null;
  }

  // Process Cash on Delivery
  processCODPayment(orderData) {
    const { orderId } = orderData;
    
    return {
      success: true,
      type: 'cod',
      message: 'Order placed successfully. Pay when delivered.',
      orderId
    };
  }

  // Main payment processing function
  async processPayment(paymentData) {
    const validation = this.validatePaymentData(paymentData);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    const orderId = this.generateOrderId();
    const orderData = { ...paymentData, orderId };

    try {
      switch (paymentData.method) {
        case 'easypaisa':
          return await this.processEasyPaisaPayment(orderData);
        
        case 'jazzcash':
          return await this.processJazzCashPayment(orderData);
        
        case 'hbl':
        case 'ubl': 
        case 'mcb':
        case 'allied':
          return await this.processBankPayment({ ...orderData, bankId: paymentData.method });
        
        case 'cod':
          return this.processCODPayment(orderData);
        
        default:
          return { success: false, error: 'Payment method not supported' };
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      return { success: false, error: 'Payment processing failed' };
    }
  }

  // Verify payment status
  async verifyPayment(orderId) {
    try {
      const response = await fetch(`${this.apiUrl}/verify/${orderId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Payment verification error:', error);
      return { success: false, error: 'Verification failed' };
    }
  }

  // Calculate delivery charges
  calculateDeliveryCharges(city, amount) {
    const deliveryRates = {
      'karachi': amount > 2000 ? 0 : 150,
      'lahore': amount > 2000 ? 0 : 200,
      'islamabad': amount > 2000 ? 0 : 200,
      'rawalpindi': amount > 2000 ? 0 : 200,
      'faisalabad': amount > 2000 ? 0 : 250,
      'multan': amount > 2000 ? 0 : 250,
      'peshawar': amount > 2000 ? 0 : 300,
      'quetta': amount > 2000 ? 0 : 350,
      'other': amount > 2000 ? 0 : 300
    };

    const cityKey = city.toLowerCase();
    return deliveryRates[cityKey] || deliveryRates['other'];
  }
}

export const paymentService = new PaymentService();

export default paymentService;
