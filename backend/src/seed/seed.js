'use strict';

/**
 * MediWise MongoDB Seed Script
 * Populates all collections with realistic demo data matching src/data/mock*.ts
 *
 * Usage:  npm run seed          (from the backend/ directory)
 *          node src/seed/seed.js  (from the backend/ directory)
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

const mongoose      = require('mongoose');
const { connectDB } = require('../config/db');

const Drug         = require('../models/Drug');
const Partner      = require('../models/Partner');
const Delivery     = require('../models/Delivery');
const AuditEvent   = require('../models/AuditEvent');
const User         = require('../models/User');
const EscrowPayout = require('../models/EscrowPayout');
const GSTInvoice   = require('../models/GSTInvoice');

// ─── DRUGS ───────────────────────────────────────────────────────────────────

const DRUGS = [
  {
    drugId: 'drug-atorvastatin',
    brandName: 'Lipitor 20mg',
    brandManufacturer: 'Pfizer Inc. • US/Global Origin',
    brandNdc: '0071-0156-23',
    brandPrice: 142.00,
    activeSalt: 'Atorvastatin Calcium Trihydrate',
    strength: '20mg',
    dosageForm: '30 Film Tablets • Oral Daily',
    atcCode: 'C10AA05',
    casNumber: '344423-98-9',
    genericPriceAvg: 18.50,
    savingsPercent: 87.0,
    savingsAmount: 123.50,
    parityPercent: 99.4,
    dissolutionStatus: 'USP >85% @ 30m',
    cmaxParity: 98.9,
    aucParity: 99.3,
    genericsCount: 14,
    topGenerics: ['Cipla (Atorlip)', 'Sun Pharma (Storvas)', 'Dr. Reddy (Atocor)', 'Zydus (Atorva)'],
    clinicalSignOff: { doctor: 'Dr. K. Mehta (Pharm)', role: 'Clinical Lead', date: '2026-09-02', hash: '0x9f...e4a' },
    molecularFormula: 'C₆₆H₆₈CaF₂N₄O₁₀ • 3H₂O',
    smiles: 'CC(C)C1=C(C(=O)NC2=CC=CC=C2)C(=C(N1CC[C@H](O)C[C@H](O)CC(=O)[O-])C3=CC=C(F)C=C3)C4=CC=CC=C4.[Ca+2]',
    molecularWeight: '1209.4 g/mol',
    bioavailability: '~14% (Extensive First-Pass Metabolism)',
    category: 'Cardiology',
    partnerOffers: [
      { partnerName: 'Tata 1mg',    price: 17.90, savingsRate: 87.4, delivery: 'Express 4h',  status: 'in_stock' },
      { partnerName: 'Apollo 24/7', price: 18.50, savingsRate: 87.0, delivery: 'Pickup / 2h', status: 'in_stock' },
      { partnerName: 'Netmeds',     price: 18.20, savingsRate: 87.2, delivery: 'Tomorrow',    status: 'in_stock' },
      { partnerName: 'MedPlus',     price: 21.00, savingsRate: 85.2, delivery: 'Same Day',    status: 'in_stock' },
    ],
  },
  {
    drugId: 'drug-metformin',
    brandName: 'Glucophage XR 500mg',
    brandManufacturer: 'Merck Sante • Global',
    brandNdc: '50458-540-10',
    brandPrice: 78.00,
    activeSalt: 'Metformin Hydrochloride',
    strength: '500mg ER',
    dosageForm: '60 Extended-Release Tablets',
    atcCode: 'A10BA02',
    casNumber: '1115-70-4',
    genericPriceAvg: 5.30,
    savingsPercent: 93.2,
    savingsAmount: 72.70,
    parityPercent: 99.8,
    dissolutionStatus: 'Zero-order steady kinetics',
    cmaxParity: 99.2,
    aucParity: 99.6,
    genericsCount: 22,
    topGenerics: ['Teva (Metformin XR)', 'Glenmark', 'Lupin (Gluconil)', 'Viatris'],
    clinicalSignOff: { doctor: 'Dr. A. Chen (Pharmacovig)', role: 'Regulatory Lead', date: '2026-08-14', hash: '0x4a...c19' },
    molecularFormula: 'C₄H₁₁N₅ • HCl',
    smiles: 'CN(C)C(=N)NC(=N)N.Cl',
    molecularWeight: '165.62 g/mol',
    bioavailability: '50–60% (Slow Intestinal Uptake)',
    category: 'Endocrinology',
    partnerOffers: [
      { partnerName: 'Apollo 24/7', price: 4.90, savingsRate: 93.7, delivery: 'Express 2h', status: 'in_stock' },
      { partnerName: 'Tata 1mg',    price: 5.30, savingsRate: 93.2, delivery: 'Tomorrow',   status: 'in_stock' },
      { partnerName: 'Netmeds',     price: 5.10, savingsRate: 93.5, delivery: 'Express 4h', status: 'in_stock' },
    ],
  },
  {
    drugId: 'drug-sitagliptin',
    brandName: 'Januvia 100mg',
    brandManufacturer: 'Merck Sharp & Dohme',
    brandNdc: '0006-0277-54',
    brandPrice: 512.80,
    activeSalt: 'Sitagliptin Phosphate Monohydrate',
    strength: '100mg',
    dosageForm: '30 Film Tablets • Oral Daily',
    atcCode: 'A10BH01',
    casNumber: '654671-77-9',
    genericPriceAvg: 44.00,
    savingsPercent: 91.4,
    savingsAmount: 468.80,
    parityPercent: 98.6,
    dissolutionStatus: 'Bioavailability AUC: 99.1%',
    cmaxParity: 98.2,
    aucParity: 99.1,
    genericsCount: 9,
    topGenerics: ['Sun Pharma (Istavel)', 'Glenmark (Zita)', 'Dr. Reddy (Sitaglyn)'],
    clinicalSignOff: { doctor: 'Dr. V. Rao (CMIO)', role: 'CMIO Systems Director', date: '2026-10-01', hash: '0x8e...881' },
    molecularFormula: 'C₁₆H₁₅F₆N₅O • H₃PO₄ • H₂O',
    smiles: 'C1CN2C(=NN=C2C(F)(F)F)CN1C(=O)C[C@@H](CC3=C(C=C(C=C3F)F)F)N',
    molecularWeight: '523.32 g/mol',
    bioavailability: '87% (High oral bioavailability)',
    category: 'Endocrinology',
    partnerOffers: [
      { partnerName: 'Tata 1mg',    price: 42.50, savingsRate: 91.7, delivery: 'Tomorrow',    status: 'in_stock' },
      { partnerName: 'Apollo 24/7', price: 44.00, savingsRate: 91.4, delivery: 'Pickup / 2h', status: 'in_stock' },
      { partnerName: 'Netmeds',     price: 43.80, savingsRate: 91.5, delivery: 'Express 4h',  status: 'in_stock' },
    ],
  },
  {
    drugId: 'drug-nexium',
    brandName: 'Nexium 40mg',
    brandManufacturer: 'AstraZeneca Pharmaceuticals',
    brandNdc: '0186-5040-31',
    brandPrice: 289.00,
    activeSalt: 'Esomeprazole Magnesium Trihydrate',
    strength: '40mg DR',
    dosageForm: '30 Delayed-Release Capsules',
    atcCode: 'A02BC05',
    casNumber: '217087-09-7',
    genericPriceAvg: 22.10,
    savingsPercent: 92.3,
    savingsAmount: 266.90,
    parityPercent: 99.1,
    dissolutionStatus: 'Acid Resistance: >95% in 0.1N HCl',
    cmaxParity: 98.8,
    aucParity: 99.4,
    genericsCount: 18,
    topGenerics: ['Torrent (Nexpro 40)', 'Sun Pharma (Esomac)', 'Dr. Reddy (Raciper)'],
    clinicalSignOff: { doctor: 'Dr. S. Banerji (Clinical)', role: 'Clinical Lead', date: '2026-07-29', hash: '0x3d...72e' },
    molecularFormula: 'C₃₄H₃₆MgN₆O₆S₂ • 3H₂O',
    smiles: 'CC1=CN=C(C(=C1OC)C)CS(=O)C2=NC3=C(N2)C=CC(=C3)OC.[Mg+2]',
    molecularWeight: '767.15 g/mol',
    bioavailability: '64–89% (Repeated Dosing)',
    category: 'Gastroenterology',
    partnerOffers: [
      { partnerName: 'Tata 1mg',    price: 21.80, savingsRate: 92.4, delivery: 'Express 4h',  status: 'in_stock' },
      { partnerName: 'Apollo 24/7', price: 22.10, savingsRate: 92.3, delivery: 'Pickup / 2h', status: 'in_stock' },
      { partnerName: 'Netmeds',     price: 22.00, savingsRate: 92.3, delivery: 'Tomorrow',    status: 'in_stock' },
    ],
  },
  {
    drugId: 'drug-augmentin',
    brandName: 'Augmentin 625 Duo',
    brandManufacturer: 'GlaxoSmithKline (GSK)',
    brandNdc: '43598-022-80',
    brandPrice: 88.40,
    activeSalt: 'Amoxicillin (500mg) + Pot. Clavulanate (125mg)',
    strength: '625mg',
    dosageForm: '10 Strip Film Coated Tablets',
    atcCode: 'J01CR02',
    casNumber: '61336-70-7',
    genericPriceAvg: 14.20,
    savingsPercent: 83.9,
    savingsAmount: 74.20,
    parityPercent: 99.0,
    dissolutionStatus: 'USP Dissolution Profile Passed',
    cmaxParity: 98.7,
    aucParity: 99.2,
    genericsCount: 16,
    topGenerics: ['Alkem (Clavam 625)', 'Mankind (Moxikind-CV)', 'Lupin (Novamox-CV)'],
    clinicalSignOff: { doctor: 'Dr. S. Banerji (Clinical)', role: 'Antimicrobial Specialist', date: '2026-07-29', hash: '0x3d...72e' },
    molecularFormula: 'C₁₆H₁₉N₃O₅S + C₈H₈KNO₅',
    smiles: 'CC1([C@@H](N2[C@H](S1)[C@@H](C2=O)NC(=O)[C@@H](C3=CC=C(C=C3)O)N)C(=O)O)C',
    molecularWeight: '599.7 g/mol (combined)',
    bioavailability: '74–92% (Food enhances clavulanate)',
    category: 'Anti-infective',
    partnerOffers: [
      { partnerName: 'Netmeds',     price: 13.90, savingsRate: 84.3, delivery: 'Tomorrow',    status: 'in_stock' },
      { partnerName: 'Apollo 24/7', price: 14.20, savingsRate: 83.9, delivery: 'Pickup / 1h', status: 'in_stock' },
      { partnerName: 'MedPlus',     price: 14.80, savingsRate: 83.3, delivery: 'Same Day',    status: 'in_stock' },
    ],
  },
];

// ─── PARTNERS ─────────────────────────────────────────────────────────────────

const PARTNERS = [
  {
    partnerId: 'partner-apollo', name: 'Apollo 24/7', code: 'APL24',
    type: 'National E-Pharmacy', category: 'national', outlets: '5,500+',
    protocol: 'REST Webhook / FHIR', feedStatus: 'live',
    syncInfo: 'Last synced 2 min ago • 4,820 SKUs',
    referralClicks: 48200, totalSharePercent: 34.2, cvrPercent: 8.4,
    gmvAmount: 892450, cpaTier: 'Tier 1 (8.5%)', cpaAccrued: 84320,
    complianceBadge: 'CDSCO ✓ ISO 9001', hasWarning: false,
  },
  {
    partnerId: 'partner-1mg', name: 'Tata 1mg', code: '1MG',
    type: 'Omnichannel Aggregator', category: 'national', outlets: '20,000+',
    protocol: 'Kafka Event Stream', feedStatus: 'live',
    syncInfo: 'Kafka stream active • 18,240 SKUs',
    referralClicks: 62100, totalSharePercent: 44.1, cvrPercent: 9.2,
    gmvAmount: 1241800, cpaTier: 'Tier 1 (8.5%)', cpaAccrued: 126450,
    complianceBadge: 'CDSCO ✓ GMP Certified', hasWarning: false,
  },
  {
    partnerId: 'partner-netmeds', name: 'Netmeds', code: 'NMDS',
    type: 'National Hub', category: 'national', outlets: '3,200+',
    protocol: 'REST Webhook / JSON', feedStatus: 'active',
    syncInfo: 'Last synced 8 min ago • 6,102 SKUs',
    referralClicks: 28900, totalSharePercent: 20.5, cvrPercent: 7.1,
    gmvAmount: 514200, cpaTier: 'Tier 2 (7.0%)', cpaAccrued: 41890,
    complianceBadge: 'CDSCO ✓', hasWarning: false,
  },
  {
    partnerId: 'partner-medplus', name: 'MedPlus Health', code: 'MPLX',
    type: 'Regional Franchise', category: 'regional', outlets: '4,100+',
    protocol: 'Daily SFTP Batch', feedStatus: 'synced',
    syncInfo: 'SFTP batch 06:00 UTC • 3,890 SKUs',
    referralClicks: 18400, totalSharePercent: 13.1, cvrPercent: 5.8,
    gmvAmount: 241000, cpaTier: 'Tier 2 (7.0%)', cpaAccrued: 18200,
    complianceBadge: 'State Pharmacy Board ✓', hasWarning: false,
  },
];

// ─── DELIVERIES ───────────────────────────────────────────────────────────────

const DEFAULT_ADDRESS = {
  recipientName: 'Om Patil',
  street: '402 Redwood Boulevard',
  aptSuite: 'Apt 4B (Building 2)',
  city: 'San Jose',
  state: 'CA',
  zipCode: '95128',
  phone: '(408) 555-0192',
  instructions: 'Leave with concierge or ring Apt 4B intercom. Temperature-sensitive medication inside.',
};

const DELIVERIES = [
  {
    deliveryId: 'del-ord-001',
    orderNumber: 'ORD-2026-9481',
    trackingNumber: 'FDX-COLD-8492048',
    drugId: 'drug-atorvastatin',
    drugName: 'Lipitor 20mg (Atorvastatin Generic)',
    activeSalt: 'Atorvastatin Calcium Trihydrate',
    dosageForm: '30 Film Tablets • Oral Daily',
    quantity: 1,
    pharmacyPartner: 'Tata 1mg Clinical Hub',
    carrier: 'FedEx HealthCare Priority Cold-Chain',
    deliverySpeed: 'same_day',
    deliverySpeedLabel: '⚡ Same-Day Priority Cold-Chain',
    status: 'out_for_delivery',
    statusLabel: 'Out for Delivery',
    orderDate: '2026-09-07 08:30 UTC',
    expectedDeliveryDate: 'Today, Sep 8',
    expectedDeliveryTimeWindow: '1:00 PM – 3:30 PM',
    deliveryCountdownText: 'Arriving today in ~45 mins (4 stops away)',
    deliveryAddress: DEFAULT_ADDRESS,
    unitPrice: 18.50,
    totalPrice: 18.50,
    savingsAmount: 123.50,
    shippingFee: 0.00,
    coldChain: {
      required: true,
      currentTempCelsius: 4.1,
      targetRange: '2.0°C – 8.0°C',
      sensorStatus: 'optimal',
      fipsSealNumber: 'FIPS-140-SEAL-88914',
    },
    courier: {
      name: 'Marco Diaz',
      phone: '(408) 555-8371',
      vehicle: 'Refrigerated EV Van #42',
      stopsAway: 4,
      currentLocationName: 'Redwood Medical District (0.8 mi away)',
      rating: 4.95,
    },
    timeline: [
      { step: 1, label: 'Prescription Verified & Order Authorized', timestamp: 'Sep 7, 8:42 AM', location: 'MediWise Digital Gateway', completed: true, note: 'Attending Physician Dr. Vikram Rao signed off.' },
      { step: 2, label: 'Clinical Dispensing & Cold-Chain Packing', timestamp: 'Sep 7, 10:15 AM', location: 'Tata 1mg Fulfillment Hub #7 (San Jose, CA)', completed: true },
      { step: 3, label: 'Courier Pickup — Cold-Chain Handoff', timestamp: 'Sep 7, 12:05 PM', location: 'Tata 1mg Dispatch Dock', completed: true },
      { step: 4, label: 'In Transit — Refrigerated Vehicle Dispatch', timestamp: 'Sep 7, 12:22 PM', location: 'Route 87 Medical Corridor', completed: true },
      { step: 5, label: 'Out for Delivery — Final Mile', timestamp: 'Sep 8, 10:18 AM', location: 'Redwood Medical District', completed: false, isCurrent: true },
    ],
  },
  {
    deliveryId: 'del-ord-002',
    orderNumber: 'ORD-2026-9512',
    trackingNumber: 'UPS-RX-1Z2841',
    drugId: 'drug-metformin',
    drugName: 'Glucophage XR 500mg (Metformin Generic)',
    activeSalt: 'Metformin Hydrochloride',
    dosageForm: '60 Extended-Release Tablets',
    quantity: 2,
    pharmacyPartner: 'Apollo 24/7',
    carrier: 'UPS Healthcare',
    deliverySpeed: 'next_day',
    deliverySpeedLabel: '🚀 Next-Day Express',
    status: 'in_transit',
    statusLabel: 'In Transit',
    orderDate: '2026-09-08 09:00 UTC',
    expectedDeliveryDate: 'Tomorrow, Sep 9',
    expectedDeliveryTimeWindow: '10:00 AM – 12:00 PM',
    deliveryAddress: DEFAULT_ADDRESS,
    unitPrice: 5.30,
    totalPrice: 10.60,
    savingsAmount: 145.40,
    shippingFee: 49.00,
    coldChain: {
      required: false,
      targetRange: 'Room Temp (15–25°C)',
      sensorStatus: 'optimal',
    },
    courier: {
      name: 'Priya Singh',
      phone: '(408) 555-7290',
      vehicle: 'UPS Express Van',
    },
    timeline: [
      { step: 1, label: 'Order Placed', timestamp: 'Sep 8, 9:00 AM', location: 'MediWise Patient Portal', completed: true },
      { step: 2, label: 'Pharmacist Verified', timestamp: 'Sep 8, 9:45 AM', location: 'Apollo 24/7 Hub', completed: true },
      { step: 3, label: 'In Transit', timestamp: 'Sep 8, 11:20 AM', location: 'Sorting Facility', completed: false, isCurrent: true },
      { step: 4, label: 'Out for Delivery', timestamp: '', location: '', completed: false },
      { step: 5, label: 'Delivered', timestamp: '', location: '', completed: false },
    ],
  },
  {
    deliveryId: 'del-ord-003',
    orderNumber: 'ORD-2026-9530',
    trackingNumber: 'DELHIVERY-CC-3391',
    drugId: 'drug-sitagliptin',
    drugName: 'Januvia 100mg (Sitagliptin Generic)',
    activeSalt: 'Sitagliptin Phosphate Monohydrate',
    dosageForm: '30 Film Tablets • Oral Daily',
    quantity: 1,
    pharmacyPartner: 'Netmeds',
    carrier: 'Delhivery Cold',
    deliverySpeed: 'standard',
    deliverySpeedLabel: '📦 Standard 3–5 Days',
    status: 'delivered',
    statusLabel: 'Delivered',
    orderDate: '2026-09-03 14:00 UTC',
    expectedDeliveryDate: 'Sep 7',
    expectedDeliveryTimeWindow: 'Delivered',
    deliveryAddress: DEFAULT_ADDRESS,
    unitPrice: 44.00,
    totalPrice: 44.00,
    savingsAmount: 468.80,
    shippingFee: 0.00,
    coldChain: {
      required: false,
      targetRange: 'Room Temp (15–25°C)',
      sensorStatus: 'optimal',
    },
    proofOfDelivery: {
      deliveredAt: 'Sep 7, 2:14 PM',
      signedBy: 'Om Patil (Digital OTP)',
      verificationMethod: 'HIPAA OTP + Digital Signature Hash',
    },
    timeline: [
      { step: 1, label: 'Order Placed',     timestamp: 'Sep 3, 2:00 PM', location: 'MediWise Portal',       completed: true },
      { step: 2, label: 'Rx Verified',      timestamp: 'Sep 3, 2:45 PM', location: 'Netmeds QC Dept',       completed: true },
      { step: 3, label: 'In Transit',       timestamp: 'Sep 4, 8:00 AM', location: 'Delhivery Sorting Hub', completed: true },
      { step: 4, label: 'Out for Delivery', timestamp: 'Sep 7, 9:00 AM', location: 'San Jose Route',        completed: true },
      { step: 5, label: 'Delivered',        timestamp: 'Sep 7, 2:14 PM', location: '402 Redwood Blvd',      completed: true },
    ],
  },
];

// ─── AUDIT EVENTS ─────────────────────────────────────────────────────────────

const AUDIT_EVENTS = [
  {
    eventId: 'audit-001',
    timestamp: '2026-09-09 08:14:22.441',
    hash: '0x3A9F...82c1',
    actor: 'dr.v.rao@mediwise.io',
    actorRole: 'CLINICAL_LEAD',
    action: 'Generic Substitution Approved: Atorvastatin 20mg',
    resource: 'FormularyDrug: drug-atorvastatin',
    complianceCode: '21 CFR Part 320',
    ip: '10.128.0.1 (K8s Control Plane)',
    status: 'Verified Pass',
    statusType: 'success',
    payloadDiff: { removed: ['brandPrice'], added: ['genericPriceAvg', 'parityPercent'], preserved: ['activeSalt', 'atcCode'] },
  },
  {
    eventId: 'audit-002',
    timestamp: '2026-09-09 08:10:05.120',
    hash: '0xB2C4...11f0',
    actor: 'fhir-gateway@mediwise.io',
    actorRole: 'PHARMACY_WEBHOOK',
    action: 'FHIR R4 MedicationRequest Ingested: Atorvastatin 20mg',
    resource: 'EHR Bundle [FHIR-REQ-001] → Apollo Hospitals',
    complianceCode: 'HL7 FHIR R4 §8.3',
    ip: '203.90.14.21 (Apollo EHR Relay)',
    status: 'Verified Pass',
    statusType: 'success',
  },
  {
    eventId: 'audit-003',
    timestamp: '2026-09-09 07:58:44.882',
    hash: '0xE7D1...43b8',
    actor: 'system@cloudflare-waf',
    actorRole: 'SYSTEM_BOT',
    action: 'WAF: Rate-Limit Triggered — Repeated NDC Scrape Attempt',
    resource: 'API Gateway /api/drugs (RateLimit: 429)',
    complianceCode: 'OWASP API Top 10 - A4',
    ip: '185.220.101.48 (TOR Exit Node)',
    status: 'Flagged WAF',
    statusType: 'error',
  },
  {
    eventId: 'audit-004',
    timestamp: '2026-09-08 22:31:09.003',
    hash: '0x9012...88ea',
    actor: 'stripe-webhook@mediwise.io',
    actorRole: 'SYSTEM_BOT',
    action: 'Stripe CPA Escrow Disbursed: ₹84,320 → Apollo 24/7',
    resource: 'Stripe Transfer [tr_live_9a3f12bc]',
    complianceCode: 'SOC2 CC6.1 / RBI PA Regulations',
    ip: '54.187.174.169 (Stripe)',
    status: 'Verified Pass',
    statusType: 'success',
  },
  {
    eventId: 'audit-005',
    timestamp: '2026-09-08 18:00:00.000',
    hash: '0x4F88...c0d2',
    actor: 'e.vance@mediwise.io',
    actorRole: 'SUPER_ADMIN',
    action: 'Manual Compliance Audit Cycle Completed',
    resource: 'Mesh: 18,924 Active Compositions',
    complianceCode: '21 CFR Part 320',
    ip: '10.128.0.4 (Compliance Console)',
    status: 'Verified Pass',
    statusType: 'success',
  },
];

// ─── USERS ────────────────────────────────────────────────────────────────────

const USERS = [
  {
    userId: 'usr-cmio-01',
    name: 'Dr. Vikram Rao, MD',
    email: 'dr.v.rao@mediwise.io',
    role: 'cmio',
    roleTitle: 'Chief Medical Systems Officer (CMIO)',
    organization: 'MediWise Clinical Governance Board',
    avatarInitials: 'VR',
    twoFactorEnabled: true,
    twoFactorMethod: 'fido2',
    lastLogin: '2026-09-09 08:00 UTC',
    sessionToken: 'demo-token-cmio',
    ipAddress: '10.128.0.1',
    location: 'Mumbai, MH',
    device: 'MacBook Pro 16" (Chrome 120)',
    permissions: ['read:drugs', 'approve:substitutions', 'read:audit', 'manage:config'],
  },
  {
    userId: 'usr-pharmacy-02',
    name: 'Priya Sharma',
    email: 'p.sharma@apollo24.in',
    role: 'pharmacy_partner',
    roleTitle: 'Pharmacy Network Partner',
    organization: 'Apollo 24/7 Pharmacy Network',
    avatarInitials: 'PS',
    twoFactorEnabled: true,
    twoFactorMethod: 'totp',
    lastLogin: '2026-09-09 07:30 UTC',
    sessionToken: 'demo-token-pharmacy',
    ipAddress: '203.90.14.21',
    location: 'Hyderabad, TS',
    device: 'Windows 11 (Edge 119)',
    permissions: ['read:drugs', 'manage:orders', 'read:commissions'],
  },
  {
    userId: 'usr-compliance-03',
    name: 'Elena Vance',
    email: 'e.vance@mediwise.io',
    role: 'compliance_officer',
    roleTitle: 'Clinical Compliance Officer',
    organization: 'MediWise Regulatory Affairs',
    avatarInitials: 'EV',
    twoFactorEnabled: true,
    twoFactorMethod: 'totp',
    lastLogin: '2026-09-09 06:45 UTC',
    sessionToken: 'demo-token-compliance',
    ipAddress: '10.128.0.4',
    location: 'Delhi, DL',
    device: 'Ubuntu 22.04 (Firefox 121)',
    permissions: ['read:audit', 'write:audit', 'approve:payouts', 'read:drugs'],
  },
  {
    userId: 'usr-patient-04',
    name: 'Om Patil',
    email: 'om.patil@gmail.com',
    role: 'patient',
    roleTitle: 'Patient / End-User',
    organization: 'MediWise Patient Network',
    avatarInitials: 'OP',
    chronicCondition: 'Type 2 Diabetes, Hypertension',
    preferredPharmacy: 'Apollo 24/7',
    twoFactorEnabled: false,
    twoFactorMethod: 'sms',
    lastLogin: '2026-09-09 09:15 UTC',
    sessionToken: 'demo-token-patient',
    ipAddress: '49.207.192.41',
    location: 'San Jose, CA',
    device: 'iPhone 15 Pro (Safari 17)',
    permissions: ['read:drugs', 'place:orders', 'read:own_deliveries'],
  },
];

// ─── ESCROW PAYOUTS ───────────────────────────────────────────────────────────

const ESCROW_PAYOUTS = [
  {
    payoutId: 'payout-001', payoutNumber: 'MW-PAY-2026-0001',
    partnerId: 'partner-apollo', partnerName: 'Apollo 24/7',
    amount: 84320, currency: 'INR',
    status: 'disbursed',
    escrowReleaseCondition: 'Verified delivery completion + 48h hold',
    associatedOrderIds: ['del-ord-001', 'del-ord-003'],
    requiresDualAuth: false, cmioApproved: true, complianceApproved: true,
    disbursedAt: '2026-09-07T14:30:00.000Z',
    stripeTransferId: 'tr_live_9a3f12bc',
    createdAt: '2026-09-05T10:00:00.000Z',
  },
  {
    payoutId: 'payout-002', payoutNumber: 'MW-PAY-2026-0002',
    partnerId: 'partner-1mg', partnerName: 'Tata 1mg',
    amount: 126450, currency: 'INR',
    status: 'dual_approval_required',
    escrowReleaseCondition: 'Dual CMIO + Compliance sign-off (>₹1,00,000)',
    associatedOrderIds: ['del-ord-002'],
    requiresDualAuth: true, cmioApproved: true, complianceApproved: false,
    createdAt: '2026-09-08T09:15:00.000Z',
  },
  {
    payoutId: 'payout-003', payoutNumber: 'MW-PAY-2026-0003',
    partnerId: 'partner-netmeds', partnerName: 'Netmeds',
    amount: 41890, currency: 'INR',
    status: 'in_escrow',
    escrowReleaseCondition: 'Awaiting delivery confirmation (ETA Sep 10)',
    associatedOrderIds: [],
    requiresDualAuth: false, cmioApproved: false, complianceApproved: false,
    createdAt: '2026-09-09T07:00:00.000Z',
  },
  {
    payoutId: 'payout-004', payoutNumber: 'MW-PAY-2026-0004',
    partnerId: 'partner-medplus', partnerName: 'MedPlus Health',
    amount: 18200, currency: 'INR',
    status: 'pending_fulfillment',
    escrowReleaseCondition: 'Order fulfillment in progress',
    associatedOrderIds: [],
    requiresDualAuth: false, cmioApproved: false, complianceApproved: false,
    createdAt: '2026-09-09T11:45:00.000Z',
  },
];

// ─── GST INVOICES ─────────────────────────────────────────────────────────────

const GST_INVOICES = [
  {
    invoiceId: 'inv-001', invoiceNumber: 'MW/2026-27/INV-00001',
    partnerId: 'partner-apollo', partnerGstin: '27AABCT1332L1ZT',
    buyerName: 'Apollo 24/7 Pharmacy Pvt Ltd',
    buyerAddress: '5th Floor, Apollo Tower, Jubilee Hills, Hyderabad – 500033',
    date: '2026-09-07', dueDate: '2026-10-07', hsnCode: '30049099',
    taxableAmount: 84320, cgstRatePct: 6, cgstAmount: 5059.2,
    sgstRatePct: 6, sgstAmount: 5059.2, igstRatePct: 0, igstAmount: 0,
    totalInvoiceValue: 94438.4, irnHash: 'SHA256:3f9a8c2e1d04b571af',
    status: 'filed',
  },
  {
    invoiceId: 'inv-002', invoiceNumber: 'MW/2026-27/INV-00002',
    partnerId: 'partner-1mg', partnerGstin: '07AABCT4823M1ZU',
    buyerName: 'Tata 1mg Technologies Pvt Ltd',
    buyerAddress: '19th Floor, One Horizon Centre, Golf Course Road, Gurgaon – 122002',
    date: '2026-09-08', dueDate: '2026-10-08', hsnCode: '30049099',
    taxableAmount: 126450, cgstRatePct: 0, cgstAmount: 0,
    sgstRatePct: 0, sgstAmount: 0, igstRatePct: 12, igstAmount: 15174,
    totalInvoiceValue: 141624, status: 'generated',
    irnHash: 'SHA256:7c2d41f09e83ba5c12',
  },
  {
    invoiceId: 'inv-003', invoiceNumber: 'MW/2026-27/INV-00003',
    partnerId: 'partner-netmeds', partnerGstin: '33AAGCR2681N1Z5',
    buyerName: 'Netmeds Marketplace Ltd',
    buyerAddress: 'No.48, Whites Road, Chennai – 600014',
    date: '2026-09-09', dueDate: '2026-10-09', hsnCode: '30049099',
    taxableAmount: 41890, cgstRatePct: 6, cgstAmount: 2513.4,
    sgstRatePct: 6, sgstAmount: 2513.4, igstRatePct: 0, igstAmount: 0,
    totalInvoiceValue: 46916.8, status: 'draft',
  },
];

// ─── SEED RUNNER ──────────────────────────────────────────────────────────────

async function seed() {
  console.log('\n🌱  MediWise MongoDB Seed Starting…\n');

  await connectDB();

  const collections = [
    { name: 'Drugs',         Model: Drug,         data: DRUGS,          idField: 'drugId' },
    { name: 'Partners',      Model: Partner,       data: PARTNERS,       idField: 'partnerId' },
    { name: 'Deliveries',    Model: Delivery,      data: DELIVERIES,     idField: 'deliveryId' },
    { name: 'AuditEvents',   Model: AuditEvent,    data: AUDIT_EVENTS,   idField: 'eventId' },
    { name: 'Users',         Model: User,          data: USERS,          idField: 'userId' },
    { name: 'EscrowPayouts', Model: EscrowPayout,  data: ESCROW_PAYOUTS, idField: 'payoutId' },
    { name: 'GSTInvoices',   Model: GSTInvoice,    data: GST_INVOICES,   idField: 'invoiceId' },
  ];

  for (const col of collections) {
    let inserted = 0;
    let skipped  = 0;

    for (const item of col.data) {
      try {
        await col.Model.findOneAndUpdate(
          { [col.idField]: item[col.idField] },
          item,
          { upsert: true, runValidators: true, new: true }
        );
        inserted++;
      } catch (err) {
        console.warn(`  ⚠  ${col.name} — skipped '${item[col.idField]}': ${err.message}`);
        skipped++;
      }
    }

    console.log(`  ✅  ${col.name.padEnd(14)} — ${inserted} upserted, ${skipped} skipped`);
  }

  console.log('\n✅  Seed complete.\n');
  await mongoose.connection.close();
}

seed().catch((err) => {
  console.error('\n❌  Seed failed:', err.message);
  process.exit(1);
});
