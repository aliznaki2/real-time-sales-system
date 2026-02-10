const Order = require('../models/Order');
const Product = require('../models/Product');
const { appEvents, EVENTS } = require('../events/eventEmitter');

exports.createOrder = async (orderData, userId) => {
  const { productId, quantity } = orderData;

  
  const product = await Product.findById(productId);

  if (!product) {
    throw new Error('Product not found');
  }

 
  if (product.stock < quantity) {
    throw new Error('Insufficient stock');
  }

 
  const totalPrice = product.price * quantity;

  
  const order = await Order.create({
    productId,
    userId,
    quantity,
    totalPrice
  });

 
  product.stock -= quantity;
  await product.save();

  await order.populate('productId', 'name price');

 
  appEvents.emit(EVENTS.ORDER_CREATED, {
    productName: product.name,
    quantity,
    totalPrice,
    timestamp: new Date()
  });

  return order;
};

exports.getUserOrders = async (userId) => {
  return await Order.find({ userId }).populate('productId', 'name price').sort('-createdAt');
};

exports.getAllOrders = async () => {
  return await Order.find().populate('productId', 'name price').populate('userId', 'name email').sort('-createdAt');
};