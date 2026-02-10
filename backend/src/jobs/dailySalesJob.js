const cron = require('node-cron');
const Order = require('../models/Order');
const DailySales = require('../models/DailySales');
const { appEvents, EVENTS } = require('../events/eventEmitter');


const calculateSalesForDate = async (targetDate) => {
  try {
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    console.log(`📊 Calculating sales for ${startOfDay.toDateString()}...`);

    
    const orders = await Order.find({
      createdAt: {
        $gte: startOfDay,
        $lt: endOfDay
      }
    });

    const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
    const totalOrders = orders.length;

   
    const dailySales = await DailySales.findOneAndUpdate(
      { date: startOfDay },
      {
        date: startOfDay,
        totalRevenue,
        totalOrders
      },
      { upsert: true, new: true }
    );

    console.log(`✅ Sales calculated for ${startOfDay.toDateString()}: ${totalOrders} orders, $${totalRevenue.toFixed(2)}`);

   
    appEvents.emit(EVENTS.DAILY_SALES_CALCULATED, {
      date: startOfDay,
      totalRevenue,
      totalOrders
    });

    return dailySales;
  } catch (error) {
    console.error('❌ Error calculating sales:', error);
    throw error;
  }
};


const calculateDailySales = async () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return await calculateSalesForDate(yesterday);
};


const initializeTodaySales = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    
    const existingRecord = await DailySales.findOne({ date: today });
    
    if (!existingRecord) {
      console.log('📊 Initializing today\'s sales record...');
      await DailySales.create({
        date: today,
        totalRevenue: 0,
        totalOrders: 0
      });
      console.log('✅ Today\'s sales record created');
    }
  } catch (error) {
    console.error('❌ Error initializing today\'s sales:', error);
  }
};


const startDailySalesJob = (io) => {
  
  initializeTodaySales();

  
  cron.schedule('0 0 * * *', () => {
    console.log('⏰ Running daily sales calculation...');
    calculateDailySales();
  });

  console.log('📅 Daily sales job scheduled (runs at midnight)');

  
  return {
    calculateDailySales,
    calculateSalesForDate,
    initializeTodaySales
  };
};

module.exports = { startDailySalesJob, calculateDailySales, calculateSalesForDate };
