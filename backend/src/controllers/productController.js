const Product = require('../models/Product');


exports.getAll = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({ success: true, data: products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.create = async (req, res) => {
  try {
    const { name, price, stock } = req.body;

    
    if (!name || !price || stock === undefined) {
      return res.status(400).json({ message: 'Please provide name, price, and stock' });
    }

    if (price <= 0) {
      return res.status(400).json({ message: 'Price must be greater than 0' });
    }

    if (stock < 0) {
      return res.status(400).json({ message: 'Stock cannot be negative' });
    }

    const product = await Product.create({
      name,
      price,
      stock
    });

    console.log('✅ Product created:', product.name);
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.getById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ success: true, data: product });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.update = async (req, res) => {
  try {
    const { name, price, stock } = req.body;

    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (name) product.name = name;
    if (price !== undefined) product.price = price;
    if (stock !== undefined) product.stock = stock;

    await product.save();

    res.json({ success: true, data: product });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.delete = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await product.deleteOne();

    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Server error' });
  }
};