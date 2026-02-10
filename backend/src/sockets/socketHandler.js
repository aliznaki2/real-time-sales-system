const { appEvents, EVENTS } = require('../events/eventEmitter');

const setupSocketHandlers = (io) => {
  
  appEvents.on(EVENTS.ORDER_CREATED, (orderData) => {
    console.log('📡 Broadcasting NEW_ORDER event to all clients:', orderData);
    io.emit('NEW_ORDER', {
      type: 'NEW_ORDER',
      productName: orderData.productName,
      quantity: orderData.quantity,
      totalPrice: orderData.totalPrice,
      timestamp: orderData.timestamp
    });
  });

  appEvents.on(EVENTS.DAILY_SALES_CALCULATED, (salesData) => {
    console.log('📡 Broadcasting DAILY_SALES event to all clients:', salesData);
    io.emit('DAILY_SALES_CALCULATED', {
      date: salesData.date,
      totalRevenue: salesData.totalRevenue,
      totalOrders: salesData.totalOrders
    });
  });

  io.on('connection', (socket) => {
    console.log('🔌 Client connected:', socket.id);

    socket.on('disconnect', () => {
      console.log('🔌 Client disconnected:', socket.id);
    });
  });
};

module.exports = setupSocketHandlers;
