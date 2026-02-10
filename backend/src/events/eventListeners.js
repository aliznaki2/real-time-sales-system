const { appEvents, EVENTS } = require('./eventEmitter');


appEvents.on(EVENTS.ORDER_CREATED, (orderData) => {
  console.log('📦 New Order Created:', {
    productName: orderData.productName,
    quantity: orderData.quantity,
    totalPrice: orderData.totalPrice,
    timestamp: orderData.timestamp
  });
});


appEvents.on(EVENTS.DAILY_SALES_CALCULATED, (salesData) => {
  console.log('📊 Daily Sales Calculated:', {
    date: salesData.date,
    totalRevenue: salesData.totalRevenue,
    totalOrders: salesData.totalOrders
  });
});

module.exports = { appEvents, EVENTS };