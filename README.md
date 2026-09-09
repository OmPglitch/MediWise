# MediWise Operations

Enterprise clinical and logistics platform for generic medicine discovery, pharmacy partner management, regulatory compliance, and prescription delivery logistics.

---

## Project Structure

```
MediWise/
├── frontend/          # React 19 + Vite 6 + TypeScript SPA
│   ├── src/
│   │   ├── components/   # UI screens, modals, shell components
│   │   ├── data/         # Mock/seed data used as fallback
│   │   ├── hooks/        # useWebSocket, usePersistedState
│   │   ├── lib/          # apiClient.ts, db.ts (MongoDB proxy layer)
│   │   ├── utils/        # PDF generation (jsPDF)
│   │   ├── types.ts      # All TypeScript domain types
│   │   ├── App.tsx       # Root application component
│   │   └── main.tsx      # React entry point
│   ├── e2e/              # Playwright end-to-end test specs
│   ├── index.html
│   ├── vite.config.ts    # Proxies /api and /ws → backend:5000
│   ├── tsconfig.json
│   ├── playwright.config.ts
│   └── package.json
│
├── backend/           # Node.js + Express + MongoDB server
│   ├── src/
│   │   ├── config/       # db.js — Mongoose connection with retry
│   │   ├── controllers/  # Business logic (drug, delivery, audit…)
│   │   ├── middleware/   # CORS, error handler, validation
│   │   ├── models/       # Mongoose schemas (Drug, Delivery, User…)
│   │   ├── routes/       # Express route definitions
│   │   ├── seed/         # seed.js — populate MongoDB with demo data
│   │   └── server.js     # Main entry point
│   ├── .env.example
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## Prerequisites

| Tool | Version |
|---|---|
| Node.js | ≥ 18.0.0 |
| npm | ≥ 9.0.0 |
| MongoDB | ≥ 6.0 (local) or MongoDB Atlas |

---

## Setup

### 1. Install frontend dependencies

```bash
cd frontend
npm install
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Configure backend environment

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` and set your MongoDB URI:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/mediwise
GEMINI_API_KEY=YOUR_GEMINI_API_KEY   # optional — demo mode works without it
APP_URL=http://localhost:3000
NODE_ENV=development
```

### 4. Configure frontend environment (optional)

```bash
cd frontend
cp .env.example .env
```

The default (`VITE_BACKEND_PORT=5000`) works out of the box for local development.

### 5. Seed the database

Populate MongoDB with demo drugs, partners, deliveries, users, and invoices:

```bash
cd backend
npm run seed
```

---

## Running the Application

### Start the backend

```bash
cd backend
npm run dev        # nodemon (auto-restart on file changes)
# or
npm start          # plain node
```

Backend runs on **http://localhost:5000**
WebSocket gateway: **ws://localhost:5000/ws**

### Start the frontend

```bash
cd frontend
npm run dev
```

Frontend runs on **http://localhost:3000**
Vite automatically proxies all `/api/*` and `/ws` requests to the backend.

### Running both together (two terminals)

**Terminal 1 — Backend:**
```bash
cd backend && npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd frontend && npm run dev
```

Then open **http://localhost:3000** in your browser.

---

## API Overview

The backend exposes the following REST endpoints at `http://localhost:5000`:

| Method | Path | Description |
|---|---|---|
| GET | `/api/health` | Server + DB health check |
| GET/POST/PUT/DELETE | `/api/drugs` | Drug formulary CRUD |
| POST | `/api/drugs/parity-check` | Bioequivalence confidence score |
| GET/PATCH | `/api/partners` | Pharmacy partner registry |
| POST | `/api/partners/:id/sync` | Trigger inventory sync |
| GET/POST/PUT/DELETE | `/api/deliveries` | Prescription delivery orders |
| PATCH | `/api/deliveries/:id/temp` | IoT cold-chain temperature update |
| GET/POST | `/api/compliance/ledger` | Cryptographic audit ledger |
| POST | `/api/compliance/override` | Log emergency override |
| POST | `/api/auth/login` | User authentication |
| POST | `/api/auth/register` | New user registration |
| GET | `/api/auth/profile` | Current user profile |
| GET/PATCH | `/api/commerce/escrow-payouts` | Stripe escrow management |
| GET/PATCH | `/api/commerce/gst-invoices` | GST invoice lifecycle |
| POST | `/api/rx/scan` | Gemini AI prescription scanner |
| POST | `/api/fhir/ingest` | FHIR R4 EHR bundle ingestion |

WebSocket pushes real-time events on channels: `event-bus`, `cold-chain-temp`, `partner-sync`, `delivery-status`.

---

## End-to-End Tests

```bash
cd frontend
npm run test:e2e          # headless (all browsers)
npm run test:e2e:ui       # Playwright interactive UI
npm run test:e2e:report   # open HTML report
```

> The backend must be running before E2E tests execute.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend framework | React 19 + TypeScript 5.8 |
| Build tool | Vite 6 |
| Styling | Tailwind CSS v4 |
| Animation | Motion (Framer) |
| Icons | Lucide React |
| PDF generation | jsPDF |
| Backend | Node.js + Express 4 |
| Database | MongoDB + Mongoose 8 |
| Real-time | WebSocket (`ws`) |
| AI | Google Gemini 2.5 Flash (`@google/genai`) |
| E2E testing | Playwright |
