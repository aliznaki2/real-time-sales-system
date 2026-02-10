const Order = require('../models/Order');
const DailySales = require('../models/DailySales');
const { appEvents, EVENTS } = require('../events/eventEmitter');

exports.calculateDailySales = async () => {
  const now = new Date();
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

 
  const orders = await Order.find({
    createdAt: { $gte: yesterday }
  });

  const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
  const totalOrders = orders.length;


  const salesDate = new Date(now.setHours(0, 0, 0, 0));
  
  const dailySales = await DailySales.findOneAndUpdate(
    { date: salesDate },
    {
      totalRevenue,
      totalOrders,
      date: salesDate
    },
    { upsert: true, new: true }
  );

 
  appEvents.emit(EVENTS.DAILY_SALES_CALCULATED, {
    date: salesDate,
    totalRevenue,
    totalOrders
  });

  return dailySales;
};

exports.getLatestDailySales = async () => {
  return await DailySales.findOne().sort('-date');
};

exports.getTodayStats = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const orders = await Order.find({
    createdAt: { $gte: today }
  });

  const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
  const totalOrders = orders.length;

  return {
    totalRevenue,
    totalOrders
  };
};