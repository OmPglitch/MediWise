'use strict';

const mongoose = require('mongoose');
const path     = require('path');

// Point OpenSSL to our config file BEFORE any TLS handshake
// This fixes the "tlsv1 alert internal error" on Node.js 24 + OpenSSL 3
if (!process.env.OPENSSL_CONF) {
  process.env.OPENSSL_CONF = path.join(__dirname, '..', '..', 'openssl.cnf');
}

const MAX_RETRIES   = 5;
const BASE_DELAY_MS = 1500;

async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('[DB] MONGODB_URI is not set. Add it to backend/.env');
  }

  mongoose.set('strictQuery', true);

  mongoose.connection.on('connected',    () => console.log(`[DB] MongoDB connected → ${mongoose.connection.name}`));
  mongoose.connection.on('error',        (err) => console.error('[DB] MongoDB error:', err.message));
  mongoose.connection.on('disconnected', () => console.warn('[DB] MongoDB disconnected'));

  let attempt = 0;
  while (attempt < MAX_RETRIES) {
    try {
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 30000,
        socketTimeoutMS:          45000,
        connectTimeoutMS:         30000,
      });
      return; // connected
    } catch (err) {
      attempt++;
      if (attempt >= MAX_RETRIES) {
        throw new Error(`[DB] Could not connect after ${MAX_RETRIES} attempts: ${err.message}`);
      }
      const delay = BASE_DELAY_MS * Math.pow(2, attempt - 1);
      console.warn(`[DB] Connection attempt ${attempt} failed. Retrying in ${delay}ms…`);
      console.warn(`[DB] Error: ${err.message}`);
      await new Promise((res) => setTimeout(res, delay));
    }
  }
}

async function disconnectDB() {
  await mongoose.connection.close();
  console.log('[DB] MongoDB connection closed');
}

module.exports = { connectDB, disconnectDB };
