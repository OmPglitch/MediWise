'use strict';

/**
 * asyncHandler — wraps async route handlers so thrown errors
 * are forwarded to Express error middleware automatically.
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * notFound — 404 handler; mount before errorHandler.
 */
const notFound = (req, res, next) => {
  const err = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  err.statusCode = 404;
  next(err);
};

/**
 * errorHandler — central error response formatter.
 * Always returns JSON so the frontend can parse it uniformly.
 */
const errorHandler = (err, req, res, _next) => {
  const statusCode = err.statusCode || err.status || 500;
  const isDev = process.env.NODE_ENV !== 'production';

  console.error(`[ERROR] ${req.method} ${req.originalUrl} → ${statusCode}: ${err.message}`);

  res.status(statusCode).json({
    error: err.message || 'Internal Server Error',
    ...(isDev && { stack: err.stack }),
  });
};

module.exports = { asyncHandler, notFound, errorHandler };
