const Product = require('../models/Product');

exports.createProduct = async (productData) => {
  const { name, price, stock } = productData;

  const product = await Product.create({
    name,
    price,
    stock
  });

  return product;
};

exports.getAllProducts = async () => {
  return await Product.find();
};

exports.getProductById = async (productId) => {
  const product = await Product.findById(productId);
  
  if (!product) {
    throw new Error('Product not found');
  }

  return product;
};