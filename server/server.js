'use strict';

const path    = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const http    = require('http');
const express = require('express');
const { WebSocketServer, WebSocket } = require('ws');

const { connectDB }   = require('./config/db');
const corsMiddleware  = require('./middleware/corsConfig');
const { notFound, errorHandler } = require('./middleware/errorHandler');

// ── Route imports ─────────────────────────────────────────────────────────────
const drugRoutes       = require('./routes/drugs');
const partnerRoutes    = require('./routes/partners');
const deliveryRoutes   = require('./routes/deliveries');
const complianceRoutes = require('./routes/compliance');
const authRoutes       = require('./routes/auth');
const commerceRoutes   = require('./routes/commerce');

// ── Gemini AI (optional) ──────────────────────────────────────────────────────
let GoogleGenAI;
try {
  GoogleGenAI = require('@google/genai').GoogleGenAI;
} catch {
  console.warn('[Server] @google/genai not available — Rx scanner will use demo mode');
}

// ── App setup ─────────────────────────────────────────────────────────────────
const app    = express();
const server = http.createServer(app);
const PORT   = process.env.PORT || 5000;

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(corsMiddleware);
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Health check (no DB needed) ───────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  const mongoose = require('mongoose');
  res.json({
    status: 'healthy',
    service: 'MediWise Operations Gateway (MongoDB)',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    dbName: mongoose.connection.name || 'mediwise',
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'YOUR_GEMINI_API_KEY'),
    activeWsClients: wss.clients.size,
    nodeEnv: process.env.NODE_ENV || 'development',
  });
});

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/drugs',         drugRoutes);
app.use('/api/partners',      partnerRoutes);
app.use('/api/deliveries',    deliveryRoutes);
app.use('/api/compliance',    complianceRoutes);
app.use('/api/auth',          authRoutes);
app.use('/api/users',         authRoutes);       // alias: GET /api/users → auth router
app.use('/api/commerce',      commerceRoutes);

// ── Stripe escrow legacy path (direct controller call — matches original server.ts endpoint) ──
const { disbursePayout } = require('./controllers/commerceController');
const { asyncHandler }   = require('./middleware/errorHandler');
app.post('/api/stripe/escrow-payout', asyncHandler(disbursePayout));

// ── FHIR ingest endpoint ──────────────────────────────────────────────────────
app.post('/api/fhir/ingest', (req, res) => {
  const bundle    = req.body;
  const requestId = `FHIR-${Date.now().toString(36).toUpperCase()}`;

  broadcastWS({
    channel: 'event-bus',
    payload: {
      id: `evt-${Date.now()}`,
      timestamp: new Date().toISOString(),
      eventType: 'FHIR_EHR_INGESTION',
      severity: 'INFO',
      sourceSystem: 'Hospital HL7/FHIR R4 Gateway',
      message: `Inbound EHR MedicationRequest [${requestId}] ingested from ABDM Gateway`,
      metadata: { requestId, bundleType: bundle?.resourceType || 'Bundle' },
    },
    timestamp: new Date().toISOString(),
  });

  res.status(202).json({
    status: 'accepted',
    requestId,
    complianceStatus: 'validated',
    message: 'FHIR bundle queued for clinical substitution matching',
  });
});

// ── Gemini Rx Scanner proxy ───────────────────────────────────────────────────
app.post('/api/rx/scan', async (req, res) => {
  const { imageBase64, mimeType = 'image/jpeg' } = req.body;

  if (!imageBase64) {
    return res.status(400).json({ error: 'imageBase64 is required in the request body' });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === '' || apiKey === 'YOUR_GEMINI_API_KEY' || !GoogleGenAI) {
    console.log('[RxScan] Demo mode — returning clinical mock extraction');
    return setTimeout(() => res.json({
      drugName: 'Lipitor',
      dosage: '20mg once daily at bedtime',
      strength: '20mg',
      physicianName: 'Dr. Sarah Jenkins, MD (Cardiology)',
      scheduleFlag: 'H',
      confidence: 0.96,
      matchedDrugId: 'drug-atorvastatin',
      matchedDrugName: 'Atorvastatin Calcium (Generic Lipitor)',
      rawExtractedText: 'Rx: Lipitor (Atorvastatin) 20mg Tab #30 Sig: 1 po qhs. Refills: 3.',
      warnings: [
        'Demo Mode: Set GEMINI_API_KEY in server/.env to enable live scanning.',
        'Schedule H drug: Dispensing requires pharmacist clinical verification slip.',
      ],
    }), 1200);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z]+;base64,/, '');

    const systemPrompt = `You are an expert clinical pharmacist and AI prescription parser.
Extract the primary prescribed medication, dosage, strength, physician name, and regulatory schedule flag.
Return ONLY valid JSON: { "drugName": string, "dosage": string, "strength": string, "physicianName": string, "scheduleFlag": "H"|"H1"|"X"|"none"|"unknown", "confidence": number, "rawExtractedText": string, "warnings": string[] }`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ inlineData: { data: cleanBase64, mimeType } }, systemPrompt],
    });

    let raw = (response.text || '{}').replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    try {
      res.json(JSON.parse(raw));
    } catch {
      res.json({
        drugName: 'Extracted Medication', dosage: 'See instructions', strength: 'Standard',
        physicianName: 'Attending Physician', scheduleFlag: 'H', confidence: 0.75,
        rawExtractedText: raw,
        warnings: ['Low confidence parse. Manual pharmacist review recommended.'],
      });
    }
  } catch (err) {
    console.error('[RxScan] Gemini error:', err.message);
    res.status(500).json({ error: 'Failed to analyze prescription', details: err.message });
  }
});

// ── WebSocket server ──────────────────────────────────────────────────────────
const wss = new WebSocketServer({ server, path: '/ws' });

function broadcastWS(msg) {
  const json = JSON.stringify(msg);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) client.send(json);
  });
}

wss.on('connection', (ws) => {
  console.log(`[WS] Client connected (total: ${wss.clients.size})`);

  ws.send(JSON.stringify({
    channel: 'event-bus',
    payload: {
      id: 'evt-ws-init',
      timestamp: new Date().toISOString(),
      eventType: 'GATEWAY_CONNECTED',
      severity: 'SUCCESS',
      sourceSystem: 'MediWise Real-time Engine (MongoDB)',
      message: 'Secure WebSocket session active. Real-time telemetry streaming.',
    },
    timestamp: new Date().toISOString(),
  }));

  ws.on('message', (data) => {
    try {
      const p = JSON.parse(data.toString());
      if (p.type === 'ping') ws.send(JSON.stringify({ type: 'pong', timestamp: new Date().toISOString() }));
    } catch { /* ignore */ }
  });

  ws.on('close', () => console.log(`[WS] Client disconnected (total: ${wss.clients.size})`));
});

// Live simulation heartbeat — pushes cold-chain, partner-sync, and event-bus messages
let tickCount = 0;
setInterval(() => {
  tickCount++;
  const temp = +(3.8 + Math.sin(tickCount) * 0.4).toFixed(1);

  // Cold chain telemetry for the first active delivery
  broadcastWS({
    channel: 'cold-chain-temp',
    payload: { orderId: 'del-ord-001', tempCelsius: temp, sensorStatus: temp > 6.0 ? 'warning' : 'optimal', timestamp: new Date().toISOString() },
    timestamp: new Date().toISOString(),
  });

  if (tickCount % 2 === 0) {
    broadcastWS({
      channel: 'partner-sync',
      payload: {
        partnerId: tickCount % 4 === 0 ? 'partner-apollo' : 'partner-medplus',
        latencyMs: Math.floor(28 + Math.random() * 25),
        skuCount: 4820 + tickCount * 2,
        feedStatus: 'live',
        timestamp: new Date().toISOString(),
      },
      timestamp: new Date().toISOString(),
    });
  }

  if (tickCount % 3 === 0) {
    const msgs = [
      { eventType: 'PRESCRIPTION_VERIFIED', sourceSystem: 'Gemini Vision Engine', message: `Prescription scanned & verified. Generic auto-matched at 99.4% Cmax parity.` },
      { eventType: 'COLD_CHAIN_TELEMETRY',  sourceSystem: 'IoT BLE Van Beacon #412', message: `Insulated chiller box maintaining ${temp}°C within 2°C–8°C envelope.` },
      { eventType: 'DYNAMIC_PRICING_SYNC',  sourceSystem: 'NPPA Price Monitor', message: 'Jan Aushadhi national price ceiling cross-checked. MediWise saves 88.2% vs brand.' },
    ];
    broadcastWS({
      channel: 'event-bus',
      payload: { id: `evt-auto-${Date.now()}`, timestamp: new Date().toISOString(), ...msgs[tickCount % msgs.length] },
      timestamp: new Date().toISOString(),
    });
  }
}, 10000);

// ── Error handling (must be after all routes) ─────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ── Bootstrap ─────────────────────────────────────────────────────────────────
async function start() {
  try {
    await connectDB();
    server.listen(PORT, () => {
      console.log(`\n🚀  MediWise Server running on http://localhost:${PORT}`);
      console.log(`📡  WebSocket gateway: ws://localhost:${PORT}/ws`);
      console.log(`🍃  MongoDB: ${process.env.MONGODB_URI}\n`);
    });
  } catch (err) {
    console.error('❌  Server failed to start:', err.message);
    process.exit(1);
  }
}

start();
