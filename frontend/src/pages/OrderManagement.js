import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Package, 
  Truck, 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  Search,
  Filter,
  Eye,
  Phone,
  Mail,
  MapPin,
  Calendar,
  DollarSign,
  TrendingUp,
  Users,
  RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';

const OrderManagement = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: 'all',
    search: ''
  });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Mock order data - in real app, this would be an API call
    const mockOrders = [
      {
        _id: '1',
        orderNumber: 'FS20240325001',
        consumer: {
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+91 98765 43210',
          address: '123 Main St, City'
        },
        vendor: {
          name: 'Green Grocer',
          businessName: 'Fresh Market',
          phone: '+91 98765 43211'
        },
        items: [
          {
            title: 'Fresh Vegetables Bundle',
            quantity: 2,
            price: 750,
            vendor: 'Fresh Market',
            image: '/images/vegetables-bundle.jpg'
          }
        ],
        pricing: {
          subtotal: 1500,
          serviceFee: 75,
          tax: 126,
          total: 1701,
          savings: 750
        },
        status: 'pending',
        payment: {
          method: 'cod',
          status: 'pending'
        },
        delivery: {
          type: 'pickup',
          address: null,
          instructions: 'Pickup between 6-8 PM',
          estimatedTime: 'Today, 6:00 PM - 8:00 PM'
        },
        createdAt: new Date('2024-03-25T10:30:00'),
        updatedAt: new Date('2024-03-25T10:30:00'),
        urgency: 'medium'
      },
      {
        _id: '2',
        orderNumber: 'FS20240325002',
        consumer: {
          name: 'Jane Smith',
          email: 'jane@example.com',
          phone: '+91 98765 43212',
          address: '456 Oak Ave, City'
        },
        vendor: {
          name: 'Sweet Bakery',
          businessName: 'Sweet Bakery',
          phone: '+91 98765 43213'
        },
        items: [
          {
            title: 'Baked Goods Assortment',
            quantity: 1,
            price: 1000,
            vendor: 'Sweet Bakery',
            image: '/images/baked-goods.jpg'
          }
        ],
        pricing: {
          subtotal: 1000,
          serviceFee: 50,
          tax: 84,
          total: 1134,
          savings: 1000
        },
        status: 'confirmed',
        payment: {
          method: 'card',
          status: 'paid'
        },
        delivery: {
          type: 'delivery',
          address: '456 Oak Ave, City',
          instructions: 'Ring doorbell',
          estimatedTime: 'Today, 2:00 PM - 4:00 PM'
        },
        createdAt: new Date('2024-03-25T09:15:00'),
        updatedAt: new Date('2024-03-25T11:00:00'),
        urgency: 'high'
      },
      {
        _id: '3',
        orderNumber: 'FS20240325003',
        consumer: {
          name: 'Bob Johnson',
          email: 'bob@example.com',
          phone: '+91 98765 43214',
          address: '789 Pine Rd, City'
        },
        vendor: {
          name: 'Happy Farms',
          businessName: 'Happy Farms Dairy',
          phone: '+91 98765 43215'
        },
        items: [
          {
            title: 'Organic Dairy Products',
            quantity: 3,
            price: 600,
            vendor: 'Happy Farms Dairy',
            image: '/images/dairy-products.jpg'
          }
        ],
        pricing: {
          subtotal: 1800,
          serviceFee: 90,
          tax: 151,
          total: 2041,
          savings: 900
        },
        status: 'preparing',
        payment: {
          method: 'upi',
          status: 'paid'
        },
        delivery: {
          type: 'pickup',
          address: null,
          instructions: 'Ready for pickup',
          estimatedTime: 'Today, 5:00 PM - 7:00 PM'
        },
        createdAt: new Date('2024-03-25T08:45:00'),
        updatedAt: new Date('2024-03-25T12:30:00'),
        urgency: 'medium'
      },
      {
        _id: '4',
        orderNumber: 'FS20240325004',
        consumer: {
          name: 'Alice Brown',
          email: 'alice@example.com',
          phone: '+91 98765 43216',
          address: '321 Harbor St, City'
        },
        vendor: {
          name: 'Ocean Fresh',
          businessName: 'Ocean Fresh Seafood',
          phone: '+91 98765 43217'
        },
        items: [
          {
            title: 'Fresh Seafood Selection',
            quantity: 1,
            price: 1800,
            vendor: 'Ocean Fresh Seafood',
            image: '/images/seafood-fresh.jpg'
          }
        ],
        pricing: {
          subtotal: 1800,
          serviceFee: 90,
          tax: 151,
          total: 2041,
          savings: 1200
        },
        status: 'ready',
        payment: {
          method: 'cod',
          status: 'pending'
        },
        delivery: {
          type: 'delivery',
          address: '321 Harbor St, City',
          instructions: 'Leave at doorstep',
          estimatedTime: 'Today, 3:00 PM - 5:00 PM'
        },
        createdAt: new Date('2024-03-25T07:30:00'),
        updatedAt: new Date('2024-03-25T13:00:00'),
        urgency: 'urgent'
      },
      {
        _id: '5',
        orderNumber: 'FS20240325005',
        consumer: {
          name: 'Charlie Wilson',
          email: 'charlie@example.com',
          phone: '+91 98765 43218',
          address: '654 Food Court, City'
        },
        vendor: {
          name: 'Quick Meals',
          businessName: 'Quick Kitchen',
          phone: '+91 98765 43219'
        },
        items: [
          {
            title: 'Prepared Meals Package',
            quantity: 2,
            price: 1250,
            vendor: 'Quick Kitchen',
            image: '/images/prepared-meals.jpg'
          }
        ],
        pricing: {
          subtotal: 2500,
          serviceFee: 125,
          tax: 210,
          total: 2835,
          savings: 1250
        },
        status: 'delivered',
        payment: {
          method: 'card',
          status: 'paid'
        },
        delivery: {
          type: 'delivery',
          address: '654 Food Court, City',
          instructions: 'Call on arrival',
          estimatedTime: 'Yesterday, 7:00 PM - 9:00 PM'
        },
        createdAt: new Date('2024-03-24T14:00:00'),
        updatedAt: new Date('2024-03-24T20:30:00'),
        urgency: 'high'
      }
    ];

    setTimeout(() => {
      setOrders(mockOrders);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusClass = (status) => {
    const classes = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      preparing: 'bg-purple-100 text-purple-800',
      ready: 'bg-green-100 text-green-800',
      delivered: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return classes[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: <Clock className="w-4 h-4" />,
      confirmed: <CheckCircle className="w-4 h-4" />,
      preparing: <RefreshCw className="w-4 h-4" />,
      ready: <Package className="w-4 h-4" />,
      delivered: <CheckCircle className="w-4 h-4" />,
      cancelled: <XCircle className="w-4 h-4" />
    };
    return icons[status] || <Clock className="w-4 h-4" />;
  };

  const getPaymentStatusClass = (status) => {
    const classes = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      refunded: 'bg-gray-100 text-gray-800'
    };
    return classes[status] || 'bg-gray-100 text-gray-800';
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setOrders(prev => prev.map(order => 
        order._id === orderId 
          ? { ...order, status: newStatus, updatedAt: new Date() }
          : order
      ));
      
      toast.success(`Order status updated to ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowDetails(true);
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = filters.status === 'all' || order.status === filters.status;
    const matchesSearch = !filters.search || 
      order.orderNumber.toLowerCase().includes(filters.search.toLowerCase()) ||
      order.consumer.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      order.vendor.businessName.toLowerCase().includes(filters.search.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    confirmed: orders.filter(o => o.status === 'confirmed').length,
    preparing: orders.filter(o => o.status === 'preparing').length,
    ready: orders.filter(o => o.status === 'ready').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    totalRevenue: orders.reduce((sum, order) => sum + order.pricing.total, 0),
    totalSavings: orders.reduce((sum, order) => sum + order.pricing.savings, 0)
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="loading-spinner w-12 h-12 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading orders...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-600 mt-2">
            {user?.role === 'admin' ? 'Manage all platform orders' : 'Manage your vendor orders'}
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Pending Orders</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">₹{stats.totalRevenue}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Savings</p>
                <p className="text-2xl font-bold text-gray-900">₹{stats.totalSavings}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="card mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by order number, customer, or vendor..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="input-field pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="input-field"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="preparing">Preparing</option>
                <option value="ready">Ready</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="card">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vendor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {order.orderNumber}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {order.consumer.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {order.consumer.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {order.vendor.businessName}
                        </div>
                        <div className="text-xs text-gray-500">
                          {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        ₹{order.pricing.total}
                      </div>
                      {order.pricing.savings > 0 && (
                        <div className="text-xs text-green-600">
                          Saved ₹{order.pricing.savings}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(order.status)}
                        <span className={`ml-2 px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentStatusClass(order.payment.status)}`}>
                          {order.payment.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => viewOrderDetails(order)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        {(user?.role === 'admin' || user?.role === 'vendor') && (
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                            className="text-xs border border-gray-300 rounded px-2 py-1"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="preparing">Preparing</option>
                            <option value="ready">Ready</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredOrders.length === 0 && (
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No orders found</p>
            </div>
          )}
        </div>

        {/* Order Details Modal */}
        {showDetails && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Order {selectedOrder.orderNumber}
                    </h2>
                    <p className="text-gray-600">
                      Placed on {new Date(selectedOrder.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>

                {/* Order Items */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-4">Order Items</h3>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <div className="flex items-center">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-12 h-12 object-cover rounded mr-3"
                          />
                          <div>
                            <div className="font-medium">{item.title}</div>
                            <div className="text-sm text-gray-600">
                              {item.vendor} • {item.quantity} × ₹{item.price}
                            </div>
                          </div>
                        </div>
                        <div className="font-semibold">
                          ₹{item.price * item.quantity}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Customer & Vendor Info */}
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="font-semibold mb-3">Customer Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-2 text-gray-400" />
                        {selectedOrder.consumer.name}
                      </div>
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                        {selectedOrder.consumer.phone}
                      </div>
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                        {selectedOrder.consumer.email}
                      </div>
                      {selectedOrder.delivery.address && (
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                          {selectedOrder.delivery.address}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Vendor Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <Package className="w-4 h-4 mr-2 text-gray-400" />
                        {selectedOrder.vendor.businessName}
                      </div>
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                        {selectedOrder.vendor.phone}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Delivery & Payment */}
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="font-semibold mb-3">Delivery Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <Truck className="w-4 h-4 mr-2 text-gray-400" />
                        {selectedOrder.delivery.type === 'pickup' ? 'Pickup' : 'Delivery'}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-gray-400" />
                        {selectedOrder.delivery.estimatedTime}
                      </div>
                      {selectedOrder.delivery.instructions && (
                        <div className="text-gray-600">
                          Instructions: {selectedOrder.delivery.instructions}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Payment Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
                        {selectedOrder.payment.method.toUpperCase()}
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2 text-gray-400" />
                        Status: {selectedOrder.payment.status}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pricing Summary */}
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3">Pricing Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>₹{selectedOrder.pricing.subtotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Service Fee</span>
                      <span>₹{selectedOrder.pricing.serviceFee}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax</span>
                      <span>₹{selectedOrder.pricing.tax}</span>
                    </div>
                    {selectedOrder.pricing.savings > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Savings</span>
                        <span>-₹{selectedOrder.pricing.savings}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                      <span>Total</span>
                      <span className="text-green-600">₹{selectedOrder.pricing.total}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderManagement;
