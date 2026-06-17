module.exports = (err, req, res, next) => {
  console.error('API Error Stack Trace:', err.stack);

  let statusCode = 500;
  let message = 'Internal Server Error';

  if (err.message && err.message.includes('GitHub')) {
    statusCode = err.message.includes('not found') ? 404 : 400;
    message = err.message;
  }

  if (err.name === 'SequelizeValidationError') {
    statusCode = 400;
    message = err.errors.map(e => e.message).join(', ');
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    statusCode = 409;
    message = 'Data conflict: this item already exists.';
  }

  res.status(statusCode).json({
    success: false,
    error: {
      message: message || err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    }
  });
};
