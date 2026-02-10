const { AppError } = require('../utils/errors');

const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err.message);

  
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message
    });
  }

 
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      success: false,
      message: errors[0] || 'Validation failed'
    });
  }

  
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(409).json({
      success: false,
      message: `${field} already exists`
    });
  }

 
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired'
    });
  }


  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
};


const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = { errorHandler, asyncHandler };