const Log = require('../models/Log');

const errorHandler = (err, req, res, next) => {
  let error = err;

  // Mongoose bad ObjectId
  if (err.name === 'CastError') error.statusCode = 404;
  // Mongoose duplicate key
  if (err.code === 11000) error.statusCode = 400;
  // Mongoose validation error
  if (err.name === 'ValidationError') error.statusCode = 400;

  const statusCode = error.statusCode || (res.statusCode === 200 ? 500 : res.statusCode);
  
  console.error(`[Error]: ${err.message}`);

  // Log to Database (Async, don't await to keep response fast)
  Log.create({
    message: err.message,
    stack: err.stack,
    method: req.method,
    url: req.originalUrl,
    statusCode,
    user: req.user?.userId,
    tenant: req.user?.tenantId,
    ip: req.ip
  }).catch(logErr => console.error("Failed to save system log:", logErr.message));

  if (process.env.NODE_ENV !== 'production') {
    console.error(err.stack);
  }

  res.status(statusCode).json({
    status: err.status || 'error',
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = errorHandler;
