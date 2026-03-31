const socketIo = require('socket.io');

let io;

const initializeSocket = (server) => {
  io = socketIo(server, {
    cors: {
      origin: process.env.NODE_ENV === 'production' 
        ? ['https://your-domain.com'] 
        : ['http://localhost:3000'],
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Join user to their personal room for notifications
    socket.on('join_user_room', (userId) => {
      socket.join(`user_${userId}`);
      console.log(`User ${userId} joined their room`);
    });

    // Join vendors to their vendor room
    socket.on('join_vendor_room', (vendorId) => {
      socket.join(`vendor_${vendorId}`);
      console.log(`Vendor ${vendorId} joined their room`);
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  return io;
};

const getIo = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

// Notification functions
const sendNotificationToUser = (userId, notification) => {
  const io = getIo();
  io.to(`user_${userId}`).emit('notification', notification);
};

const sendNotificationToVendor = (vendorId, notification) => {
  const io = getIo();
  io.to(`vendor_${vendorId}`).emit('notification', notification);
};

const broadcastNotification = (notification) => {
  const io = getIo();
  io.emit('notification', notification);
};

// Order notifications
const sendOrderNotification = (order, type) => {
  const notification = {
    type: 'order',
    action: type,
    data: {
      orderId: order._id,
      orderNumber: order.orderNumber,
      status: order.status,
      vendorId: order.vendor,
      consumerId: order.consumer,
      listingTitle: order.listing?.title || 'Food Item'
    },
    message: getNotificationMessage(type, order),
    timestamp: new Date()
  };

  // Send to consumer
  sendNotificationToUser(order.consumer, notification);

  // Send to vendor
  sendNotificationToVendor(order.vendor, notification);
};

// Listing notifications
const sendListingNotification = (listing, type) => {
  const notification = {
    type: 'listing',
    action: type,
    data: {
      listingId: listing._id,
      title: listing.title,
      vendorId: listing.vendor,
      category: listing.category,
      urgency: listing.urgency
    },
    message: getListingNotificationMessage(type, listing),
    timestamp: new Date()
  };

  if (type === 'new_urgent_listing') {
    // Broadcast to all consumers
    broadcastNotification(notification);
  } else {
    // Send to vendor
    sendNotificationToVendor(listing.vendor, notification);
  }
};

// Helper functions
const getNotificationMessage = (type, order) => {
  const messages = {
    'order_created': `New order #${order.orderNumber} for ${order.listing?.title || 'Food Item'}`,
    'order_confirmed': `Order #${order.orderNumber} has been confirmed`,
    'order_ready': `Order #${order.orderNumber} is ready for pickup`,
    'order_delivered': `Order #${order.orderNumber} has been delivered`,
    'order_cancelled': `Order #${order.orderNumber} has been cancelled`
  };
  return messages[type] || `Order #${order.orderNumber} updated`;
};

const getListingNotificationMessage = (type, listing) => {
  const messages = {
    'new_listing': `New listing created: ${listing.title}`,
    'listing_sold': `Listing sold: ${listing.title}`,
    'listing_expired': `Listing expired: ${listing.title}`,
    'new_urgent_listing': `Urgent deal: ${listing.title} - ${listing.urgency} priority!`
  };
  return messages[type] || `Listing ${listing.title} updated`;
};

module.exports = {
  initializeSocket,
  getIo,
  sendNotificationToUser,
  sendNotificationToVendor,
  broadcastNotification,
  sendOrderNotification,
  sendListingNotification
};
