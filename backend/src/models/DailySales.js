const mongoose = require('mongoose');

const dailySalesSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    unique: true
  },
  totalRevenue: {
    type: Number,
    required: true,
    default: 0
  },
  totalOrders: {
    type: Number,
    required: true,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('DailySales', dailySalesSchema);