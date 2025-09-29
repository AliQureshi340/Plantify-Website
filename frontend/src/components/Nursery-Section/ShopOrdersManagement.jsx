import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, Eye, Truck, Package, CheckCircle, XCircle, Clock, User, Mail, Phone, MapPin, Calendar, DollarSign, ShoppingCart, AlertCircle, FileText, Printer } from 'lucide-react';

const ShopOrdersManagement = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock data - Replace with actual API calls
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      // Replace with actual API call
      const mockOrders = [
        {
          _id: '65f4a2b3c9d8e7f6',
          orderId: 'ORD-2024-001',
          customer: {
            name: 'John Doe',
            email: 'john.doe@email.com',
            phone: '+91 9876543210',
            address: '123 Garden Street',
            city: 'Mumbai',
            state: 'Maharashtra',
            pincode: '400001',
            customerId: 'CUST001'
          },
          items: [
            { name: 'Rose Plant', quantity: 2, price: 250, total: 500, sku: 'PLT001' },
            { name: 'Money Plant', quantity: 1, price: 150, total: 150, sku: 'PLT002' }
          ],
          payment: {
            method: 'Credit Card',
            status: 'paid',
            transactionId: 'TXN123456',
            paidAt: new Date().toISOString()
          },
          shipping: {
            method: 'delivery',
            charge: 50,
            estimatedDelivery: '2024-03-20',
            trackingNumber: 'TRK123456'
          },
          total: 700,
          subtotal: 650,
          tax: 0,
          discount: 0,
          status: 'processing',
          notes: 'Handle with care',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      setOrders(mockOrders);
      setFilteredOrders(mockOrders);
    } catch (error) {
      showNotification('Failed to fetch orders', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      // API call to update status
      const updatedOrders = orders.map(order => 
        order._id === orderId ? { ...order, status: newStatus, updatedAt: new Date().toISOString() } : order
      );
      setOrders(updatedOrders);
      setFilteredOrders(updatedOrders);
      showNotification(`Order status updated to ${newStatus}`);
      
      // Send notification to customer
      sendStatusNotification(orderId, newStatus);
    } catch (error) {
      showNotification('Failed to update order status', 'error');
    }
  };

  const sendStatusNotification = (orderId, status) => {
    // Implement email/SMS notification logic
    console.log(`Notification sent for order ${orderId}: Status changed to ${status}`);
  };

  const filterOrders = () => {
    let filtered = [...orders];

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(order => order.status === filterStatus);
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.phone.includes(searchTerm)
      );
    }

    // Date range filter
    if (dateRange.start && dateRange.end) {
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= new Date(dateRange.start) && orderDate <= new Date(dateRange.end);
      });
    }

    setFilteredOrders(filtered);
  };

  useEffect(() => {
    filterOrders();
  }, [filterStatus, searchTerm, dateRange, orders]);

  const getStatusColor = (status) => {
    const colors = {
      pending: '#ffc107',
      processing: '#17a2b8',
      shipped: '#6f42c1',
      delivered: '#28a745',
      cancelled: '#dc3545',
      refunded: '#6c757d'
    };
    return colors[status] || '#6c757d';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: <Clock className="w-4 h-4" />,
      processing: <Package className="w-4 h-4" />,
      shipped: <Truck className="w-4 h-4" />,
      delivered: <CheckCircle className="w-4 h-4" />,
      cancelled: <XCircle className="w-4 h-4" />,
      refunded: <AlertCircle className="w-4 h-4" />
    };
    return icons[status] || <Clock className="w-4 h-4" />;
  };

  const exportOrders = () => {
    const csv = [
      ['Order ID', 'Customer', 'Email', 'Phone', 'Total', 'Status', 'Date'],
      ...filteredOrders.map(order => [
        order.orderId,
        order.customer.name,
        order.customer.email,
        order.customer.phone,
        order.total,
        order.status,
        new Date(order.createdAt).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const printInvoice = (order) => {
    const invoiceWindow = window.open('', '_blank');
    invoiceWindow.document.write(`
      <html>
        <head>
          <title>Invoice - ${order.orderId}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .invoice-details { margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
            .total { font-weight: bold; font-size: 18px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>INVOICE</h1>
            <p>Order ID: ${order.orderId}</p>
            <p>Date: ${new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
          <div class="invoice-details">
            <h3>Customer Details:</h3>
            <p>${order.customer.name}</p>
            <p>${order.customer.email}</p>
            <p>${order.customer.phone}</p>
            <p>${order.customer.address}, ${order.customer.city}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.items.map(item => `
                <tr>
                  <td>${item.name}</td>
                  <td>${item.quantity}</td>
                  <td>Rs ${item.price}</td>
                  <td>Rs ${item.total}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div style="text-align: right; margin-top: 20px;">
            <p>Subtotal: Rs ${order.subtotal}</p>
            <p>Shipping: Rs ${order.shipping.charge}</p>
            <p class="total">Total: Rs ${order.total}</p>
          </div>
        </body>
      </html>
    `);
    invoiceWindow.document.close();
    invoiceWindow.print();
  };

  const OrderDetailsModal = () => {
    if (!selectedOrder) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
            <h2 className="text-2xl font-bold">Order Details - {selectedOrder.orderId}</h2>
            <button 
              onClick={() => setSelectedOrder(null)}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Order Status Section */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Package className="w-5 h-5" />
                Order Status
              </h3>
              <div className="flex items-center gap-4">
                <select
                  value={selectedOrder.status}
                  onChange={(e) => {
                    updateOrderStatus(selectedOrder._id, e.target.value);
                    setSelectedOrder({...selectedOrder, status: e.target.value});
                  }}
                  className="px-4 py-2 border rounded-lg font-medium"
                  style={{ backgroundColor: getStatusColor(selectedOrder.status) + '20' }}
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="refunded">Refunded</option>
                </select>
                <span className="text-sm text-gray-600">
                  Last updated: {new Date(selectedOrder.updatedAt).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Customer Information */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Customer Information
                </h3>
                <div className="space-y-2 text-sm">
                  <p className="flex items-center gap-2">
                    <strong>Name:</strong> {selectedOrder.customer.name}
                  </p>
                  <p className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    {selectedOrder.customer.email}
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    {selectedOrder.customer.phone}
                  </p>
                  <p className="flex items-center gap-2">
                    <strong>Customer ID:</strong> {selectedOrder.customer.customerId}
                  </p>
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Shipping Address
                </h3>
                <div className="space-y-2 text-sm">
                  <p>{selectedOrder.customer.address}</p>
                  <p>{selectedOrder.customer.city}, {selectedOrder.customer.state}</p>
                  <p>PIN: {selectedOrder.customer.pincode}</p>
                  <p className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-gray-500" />
                    {selectedOrder.shipping.method === 'delivery' ? 'Home Delivery' : 'Store Pickup'}
                  </p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Order Items
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Item</th>
                      <th className="text-left py-2">SKU</th>
                      <th className="text-center py-2">Qty</th>
                      <th className="text-right py-2">Price</th>
                      <th className="text-right py-2">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items.map((item, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-2">{item.name}</td>
                        <td className="py-2 text-gray-600">{item.sku}</td>
                        <td className="py-2 text-center">{item.quantity}</td>
                        <td className="py-2 text-right">Rs {item.price}</td>
                        <td className="py-2 text-right font-medium">Rs {item.total}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="4" className="py-2 text-right">Subtotal:</td>
                      <td className="py-2 text-right">Rs {selectedOrder.subtotal}</td>
                    </tr>
                    <tr>
                      <td colSpan="4" className="py-2 text-right">Shipping:</td>
                      <td className="py-2 text-right">Rs {selectedOrder.shipping.charge}</td>
                    </tr>
                    {selectedOrder.discount > 0 && (
                      <tr>
                        <td colSpan="4" className="py-2 text-right">Discount:</td>
                        <td className="py-2 text-right text-red-600">-Rs {selectedOrder.discount}</td>
                      </tr>
                    )}
                    <tr className="border-t font-bold text-lg">
                      <td colSpan="4" className="py-2 text-right">Total:</td>
                      <td className="py-2 text-right text-green-600">Rs {selectedOrder.total}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Payment & Shipping Info */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-purple-50 rounded-lg p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Payment Information
                </h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Method:</strong> {selectedOrder.payment.method}</p>
                  <p><strong>Status:</strong> 
                    <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                      selectedOrder.payment.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {selectedOrder.payment.status.toUpperCase()}
                    </span>
                  </p>
                  <p><strong>Transaction ID:</strong> {selectedOrder.payment.transactionId}</p>
                  <p><strong>Paid At:</strong> {new Date(selectedOrder.payment.paidAt).toLocaleString()}</p>
                </div>
              </div>

              <div className="bg-orange-50 rounded-lg p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Truck className="w-5 h-5" />
                  Shipping Details
                </h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Method:</strong> {selectedOrder.shipping.method}</p>
                  <p><strong>Tracking:</strong> {selectedOrder.shipping.trackingNumber}</p>
                  <p><strong>Est. Delivery:</strong> {new Date(selectedOrder.shipping.estimatedDelivery).toLocaleDateString()}</p>
                  <p><strong>Shipping Charge:</strong> Rs {selectedOrder.shipping.charge}</p>
                </div>
              </div>
            </div>

            {/* Notes */}
            {selectedOrder.notes && (
              <div className="bg-yellow-50 rounded-lg p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Order Notes
                </h3>
                <p className="text-sm">{selectedOrder.notes}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t">
              <button
                onClick={() => printInvoice(selectedOrder)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                Print Invoice
              </button>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                Send Email
              </button>
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 ml-auto"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const OrderStats = () => {
    const stats = {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      processing: orders.filter(o => o.status === 'processing').length,
      shipped: orders.filter(o => o.status === 'shipped').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length
    };

    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {Object.entries(stats).map(([key, value]) => (
          <div key={key} className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-2xl font-bold" style={{ color: key === 'total' ? '#333' : getStatusColor(key) }}>
              {value}
            </p>
            <p className="text-sm text-gray-600 capitalize">{key}</p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
          notification.type === 'error' ? 'bg-red-500' : 'bg-green-500'
        } text-white`}>
          {notification.message}
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Shop Orders Management</h1>
        <p className="text-gray-600">Manage and track all customer orders</p>
      </div>

      {/* Statistics */}
      <OrderStats />

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            placeholder="Start Date"
          />

          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            placeholder="End Date"
          />
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={exportOrders}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center">
                    Loading orders...
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                    No orders found
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{order.orderId}</div>
                      <div className="text-xs text-gray-500">#{order._id.slice(-6)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{order.customer.name}</div>
                      <div className="text-xs text-gray-500">{order.customer.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{order.items.length} items</div>
                      <div className="text-xs text-gray-500">
                        {order.items.map(item => item.name).join(', ').substring(0, 30)}...
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-green-600">Rs {order.total}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        order.payment.status === 'paid' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span 
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: getStatusColor(order.status) }}
                        />
                        <span className="text-sm capitalize">{order.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      <OrderDetailsModal />
    </div>
  );
};

export default ShopOrdersManagement;