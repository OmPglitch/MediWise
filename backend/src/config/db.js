'use strict';

const mongoose = require('mongoose');

const MAX_RETRIES   = 5;
const BASE_DELAY_MS = 1500;

async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error(
      '[DB] MONGODB_URI is not set.\n' +
      '  → Local: add it to backend/.env\n' +
      '  → Render: add it in the Environment tab of your service'
    );
  }

  mongoose.set('strictQuery', true);

  mongoose.connection.on('connected', () =>
    console.log(`[DB] ✅ MongoDB connected → ${mongoose.connection.name}`)
  );
  mongoose.connection.on('error', (err) =>
    console.error('[DB] ❌ MongoDB error:', err.message)
  );
  mongoose.connection.on('disconnected', () =>
    console.warn('[DB] ⚠️  MongoDB disconnected')
  );

  let attempt = 0;
  while (attempt < MAX_RETRIES) {
    try {
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 30000,
        socketTimeoutMS:          45000,
        connectTimeoutMS:         30000,
        // Required for Node 18 compatibility with MongoDB Atlas TLS
        tls:  true,
        family: 4,
      });
      return; // ✅ connected
    } catch (err) {
      attempt++;
      if (attempt >= MAX_RETRIES) {
        throw new Error(
          `[DB] Failed to connect after ${MAX_RETRIES} attempts.\n` +
          `Last error: ${err.message}\n` +
          'Check: 1) MONGODB_URI is correct  2) Atlas IP whitelist includes 0.0.0.0/0'
        );
      }
      const delay = BASE_DELAY_MS * Math.pow(2, attempt - 1);
      console.warn(`[DB] Attempt ${attempt} failed — retrying in ${delay}ms…`);
      await new Promise((res) => setTimeout(res, delay));
    }
  }
}

async function disconnectDB() {
  await mongoose.connection.close();
  console.log('[DB] MongoDB connection closed');
}

module.exports = { connectDB, disconnectDB };
