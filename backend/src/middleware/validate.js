'use strict';

/**
 * Lightweight request body validator.
 * Pass an array of required field names; returns 400 if any are missing.
 */
const requireFields = (...fields) => (req, res, next) => {
  const missing = fields.filter((f) => req.body[f] === undefined || req.body[f] === null || req.body[f] === '');
  if (missing.length > 0) {
    return res.status(400).json({ error: `Missing required fields: ${missing.join(', ')}` });
  }
  next();
};

module.exports = { requireFields };
