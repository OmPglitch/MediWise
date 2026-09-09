'use strict';

const mongoose = require('mongoose');

/**
 * Connect to MongoDB with retry logic.
 * Retries up to MAX_RETRIES times with exponential backoff before throwing.
 */
const MAX_RETRIES = 5;
const BASE_DELAY_MS = 1500;

async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('[DB] MONGODB_URI environment variable is not set. Add it to backend/.env');
  }

  mongoose.set('strictQuery', true);

  // Mongoose connection event listeners
  mongoose.connection.on('connected', () => {
    console.log(`[DB] MongoDB connected → ${mongoose.connection.name}`);
  });
  mongoose.connection.on('error', (err) => {
    console.error('[DB] MongoDB connection error:', err.message);
  });
  mongoose.connection.on('disconnected', () => {
    console.warn('[DB] MongoDB disconnected');
  });

  let attempt = 0;
  while (attempt < MAX_RETRIES) {
    try {
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 8000,
        socketTimeoutMS: 45000,
      });
      return; // success
    } catch (err) {
      attempt++;
      if (attempt >= MAX_RETRIES) {
        throw new Error(`[DB] Could not connect to MongoDB after ${MAX_RETRIES} attempts: ${err.message}`);
      }
      const delay = BASE_DELAY_MS * Math.pow(2, attempt - 1);
      console.warn(`[DB] Connection attempt ${attempt} failed. Retrying in ${delay}ms…`);
      await new Promise((res) => setTimeout(res, delay));
    }
  }
}

async function disconnectDB() {
  await mongoose.connection.close();
  console.log('[DB] MongoDB connection closed');
}

module.exports = { connectDB, disconnectDB };
