const Order = require('../models/Order');
const DailySales = require('../models/DailySales');


exports.getTodayStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const orders = await Order.find({
      createdAt: { $gte: today }
    });

    const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
    const totalOrders = orders.length;

   
    await DailySales.findOneAndUpdate(
      { date: today },
      {
        date: today,
        totalRevenue,
        totalOrders
      },
      { upsert: true, new: true }
    );

    const stats = {
      totalSales: totalOrders,
      totalOrders: totalOrders,
      totalRevenue: totalRevenue
    };

    res.json({ success: true, data: stats });
  } catch (error) {
    console.error('Error fetching today stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.getDailySales = async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const dailySales = await DailySales.find({
      date: { $gte: sevenDaysAgo }
    }).sort({ date: -1 });

    
    if (dailySales.length === 0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todayOrders = await Order.find({
        createdAt: { $gte: today }
      });

      const todayStats = {
        date: today,
        totalRevenue: todayOrders.reduce((sum, order) => sum + order.totalPrice, 0),
        totalOrders: todayOrders.length
      };

      return res.json({ success: true, data: [todayStats] });
    }

    res.json({ success: true, data: dailySales });
  } catch (error) {
    console.error('Error fetching daily sales:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
