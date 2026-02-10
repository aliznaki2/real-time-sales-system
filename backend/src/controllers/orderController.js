const Order = require('../models/Order');
const Product = require('../models/Product');
const { appEvents, EVENTS } = require('../events/eventEmitter');

exports.create = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

   
    if (!productId || !quantity) {
      return res.status(400).json({ message: 'Please provide productId and quantity' });
    }

    if (quantity <= 0) {
      return res.status(400).json({ message: 'Quantity must be greater than 0' });
    }

  
    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

  
    if (product.stock < quantity) {
      return res.status(400).json({ message: `Insufficient stock. Available: ${product.stock}` });
    }

    
    const totalPrice = product.price * quantity;

    
    const order = await Order.create({
      user: req.user._id,
      product: productId,
      quantity,
      totalPrice
    });

    
    product.stock -= quantity;
    await product.save();

    
    await order.populate('product');
    await order.populate('user', 'name email');

    console.log('✅ Order created:', order._id);

  
    appEvents.emit(EVENTS.ORDER_CREATED, {
      productName: product.name,
      quantity,
      totalPrice,
      timestamp: new Date()
    });

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('product')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('product')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
