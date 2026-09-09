export type ActiveTab =
  | 'overview'
  | 'catalog'
  | 'partners'
  | 'compliance'
  | 'settings'
  | 'patient'
  | 'deliveries'
  // Phase 3
  | 'fhir'
  | 'indiastack'
  // Phase 4
  | 'commerce'
  // Phase 5
  | 'federated'
  | 'fleet';

export type TenantScope = 'all' | 'regional' | 'ops';

export type ThemeMode = 'dark' | 'light';

export interface DrugItem {
  id: string;
  brandName: string;
  brandManufacturer: string;
  brandNdc: string;
  brandPrice: number;
  activeSalt: string;
  strength: string;
  dosageForm: string;
  atcCode: string;
  casNumber: string;
  genericPriceAvg: number;
  savingsPercent: number;
  savingsAmount: number;
  parityPercent: number;
  dissolutionStatus: string;
  cmaxParity: number;
  aucParity: number;
  genericsCount: number;
  topGenerics: string[];
  clinicalSignOff: {
    doctor: string;
    role: string;
    date: string;
    hash: string;
  };
  molecularFormula: string;
  smiles: string;
  molecularWeight: string;
  bioavailability: string;
  category: 'Cardiology' | 'Endocrinology' | 'Gastroenterology' | 'Anti-infective' | 'Respiratory';
  partnerOffers: {
    partnerName: string;
    price: number;
    savingsRate: number;
    delivery: string;
    status: 'in_stock' | 'low_stock';
  }[];
}

export interface PartnerPharmacy {
  id: string;
  name: string;
  code: string;
  type: 'National E-Pharmacy' | 'Omnichannel Aggregator' | 'National Hub' | 'Regional Franchise' | 'Independent Chemist';
  category: 'national' | 'regional' | 'local';
  outlets: string;
  protocol: 'REST Webhook / FHIR' | 'Kafka Event Stream' | 'REST Webhook / JSON' | 'Daily SFTP Batch' | 'Direct POS Connector';
  feedStatus: 'live' | 'active' | 'synced' | 'warning';
  syncInfo: string;
  referralClicks: number;
  totalSharePercent: number;
  cvrPercent: number;
  gmvAmount: number;
  cpaTier: 'Tier 1 (8.5%)' | 'Tier 2 (7.0%)' | 'Tier 3 (₹20)' | 'Tier 3 ($0.25)';
  cpaAccrued: number;
  complianceBadge: string;
  hasWarning?: boolean;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  hash: string;
  actor: string;
  actorRole: 'CLINICAL_LEAD' | 'SYSTEM_BOT' | 'PHARMACY_WEBHOOK' | 'SUPER_ADMIN' | 'UNKNOWN_ACTOR';
  action: string;
  resource: string;
  complianceCode: string;
  ip: string;
  status: 'Verified Pass' | 'Action Required' | 'Flagged WAF';
  statusType: 'success' | 'warning' | 'error';
  payloadDiff?: {
    removed: string[];
    added: string[];
    preserved: string[];
  };
}

export interface EventBusMessage {
  id: string;
  timestamp: string;
  source: string;
  title: string;
  description: string;
  badge: string;
  badgeType: 'emerald' | 'secondary' | 'amber' | 'slate';
  meta: string;
}

export interface ServiceGateway {
  id: string;
  code: string;
  name: string;
  type: string;
  description: string;
  endpoint: string;
  authBadge: string;
  quota: string;
  health: '99.9% UP' | 'ACTIVE' | 'HEALTHY' | 'SYNCED' | 'MOUNTED';
  latency: string;
  color: string;
}

export interface SystemConfig {
  clusterEnv: string;
  k8sDiscoveryNamespace: string;
  encryptionAlgorithm: string;
  vaultRotationInterval: string;
  rabbitmqEventExchange: string;
  deadLetterPolicy: string;
  kafkaTelemetryTopic: string;
  bioeqConfidenceFloor: number;
  bioeqCmaxToleranceBand: number;
  redisShardNodes: string;
  elasticNdcSharding: string;
  maxTenantsPerNode: number;
  disclaimerEnforcementLevel: string;
  hipaaExportLogging: boolean;
  auditHashChainAnchor: string;
  stripeWebhookSecretCacheTtl: number;
  configVersion: string;
}

export type UserRole = 'cmio' | 'pharmacy_partner' | 'compliance_officer' | 'patient';

export interface UserPermission {
  key: string;
  name: string;
  description: string;
  granted: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roleTitle: string;
  organization: string;
  avatarInitials: string;
  licenseNumber?: string;
  npiNumber?: string;
  chronicCondition?: string;
  preferredPharmacy?: string;
  authProvider?: 'password' | 'google' | 'saml';
  emailVerified?: boolean;
  googleAccountId?: string;
  twoFactorEnabled: boolean;
  twoFactorMethod: 'totp' | 'fido2' | 'sms';
  lastLogin: string;
  sessionToken: string;
  ipAddress: string;
  location: string;
  device: string;
  permissions: string[];
}

export type AuthMode = 'login' | 'register' | 'forgot_password' | 'two_factor';

export interface RegistrationPayload {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  organization: string;
  licenseOrNpi?: string;
  chronicCondition?: string;
  preferredPharmacy?: string;
  acceptedTerms: boolean;
  acceptedHipaaBaa: boolean;
}

export type DeliverySpeed = 'same_day' | 'next_day' | 'standard' | 'express_cold_chain' | 'in_store_pickup';

export type DeliveryStatus =
  | 'order_placed'
  | 'pharmacist_verified'
  | 'in_transit'
  | 'out_for_delivery'
  | 'delivered'
  | 'delayed';

export interface DeliveryTimelineStep {
  step: number;
  label: string;
  timestamp: string;
  location: string;
  completed: boolean;
  isCurrent?: boolean;
  note?: string;
}

export interface DeliveryAddress {
  recipientName: string;
  street: string;
  aptSuite?: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  instructions: string;
}

export interface DeliveryOrder {
  id: string;
  orderNumber: string;
  trackingNumber: string;
  drugId: string;
  drugName: string;
  activeSalt: string;
  dosageForm: string;
  quantity: number;
  pharmacyPartner: string;
  carrier: string;
  carrierLogo?: string;
  deliverySpeed: DeliverySpeed;
  deliverySpeedLabel: string;
  status: DeliveryStatus;
  statusLabel: string;
  orderDate: string;
  expectedDeliveryDate: string;
  expectedDeliveryTimeWindow: string;
  deliveryCountdownText?: string;
  deliveryAddress: DeliveryAddress;
  unitPrice: number;
  totalPrice: number;
  savingsAmount: number;
  shippingFee: number;
  coldChain: {
    required: boolean;
    currentTempCelsius?: number;
    targetRange: string;
    sensorStatus: 'optimal' | 'warning' | 'critical';
    fipsSealNumber?: string;
  };
  timeline: DeliveryTimelineStep[];
  courier?: {
    name: string;
    phone: string;
    vehicle: string;
    stopsAway?: number;
    currentLocationName?: string;
    rating?: number;
  };
  proofOfDelivery?: {
    deliveredAt: string;
    signedBy: string;
    photoUrl?: string;
    verificationMethod: string;
  };
}

// ==========================================
// PHASE 2: INTELLIGENCE & REAL-TIME TYPES
// ==========================================

export interface RxScanResult {
  drugName: string;
  dosage: string;
  strength: string;
  physicianName: string;
  scheduleFlag: 'H' | 'H1' | 'X' | 'none' | 'unknown';
  confidence: number;             // 0.0 – 1.0
  matchedDrugId: string | null;   // cross-ref to DrugItem.id
  matchedDrugName?: string;
  rawExtractedText: string;
  warnings: string[];
}

export interface RxScanState {
  isScanning: boolean;
  result: RxScanResult | null;
  error: string | null;
  uploadedImageUrl: string | null;
}

export interface WebSocketMessage {
  channel: 'event-bus' | 'delivery-status' | 'partner-sync' | 'cold-chain-temp' | 'fhir-event' | 'telemetry';
  payload: any;
  timestamp: string;
}

export interface DeliveryStatusUpdate {
  orderId: string;
  newStatus: DeliveryStatus;
  statusLabel: string;
  timestamp: string;
  location?: string;
}

export interface PartnerSyncHeartbeat {
  partnerId: string;
  latencyMs: number;
  skuCount: number;
  feedStatus: 'live' | 'active' | 'synced' | 'warning';
  timestamp: string;
}

export interface ColdChainReading {
  orderId: string;
  tempCelsius: number;
  sensorStatus: 'optimal' | 'warning' | 'critical';
  timestamp: string;
}

// ==========================================
// PHASE 3: HEALTHCARE INTEGRATION TYPES
// ==========================================

export interface FHIRMedicationRequest {
  id: string;
  resourceType: 'MedicationRequest';
  status: 'active' | 'completed' | 'cancelled' | 'draft';
  intent: 'order';
  medicationCodeableConcept: {
    coding: Array<{
      system: string; // e.g. "http://www.nlm.nih.gov/research/umls/rxnorm"
      code: string;
      display: string;
    }>;
    text: string;
  };
  subject: {
    reference: string;
    display: string; // Patient ABDM / ABHA ID
  };
  requester: {
    display: string; // Physician name
    identifier?: {
      system: string;
      value: string; // NMC / State Council Reg No.
    };
  };
  dosageInstruction: Array<{
    text: string;
    timing?: { code: { text: string } };
  }>;
  authoredOn: string;
  mappedDrugId?: string;
  complianceStatus: 'validated' | 'rejected' | 'pending';
}

export interface ABHAProfile {
  abhaId: string;           // 14-digit format: 91-XXXX-XXXX-XXXX
  abhaAddress: string;      // e.g. patient@abdm
  fullName: string;
  gender: 'M' | 'F' | 'O';
  dateOfBirth: string;
  mobileVerified: boolean;
  kycStatus: 'VERIFIED' | 'PENDING';
  linkedRecordsCount: number;
}

export interface UHIServiceProvider {
  providerId: string;
  providerName: string;
  serviceType: 'pharmacy' | 'diagnostic' | 'teleconsult';
  distanceKm: number;
  availableStock: boolean;
  rating: number;
  estimatedFulfillmentMins: number;
}

export interface CourierCoordinates {
  orderId: string;
  latitude: number;
  longitude: number;
  headingDegrees: number;
  speedKmh: number;
  batteryLevelPct: number;
  timestamp: string;
}

// ==========================================
// PHASE 4: COMMERCE & ESCROW TYPES
// ==========================================

export interface StripeEscrowPayout {
  id: string;
  payoutNumber: string;
  partnerId: string;
  partnerName: string;
  amount: number;
  currency: 'INR' | 'USD' | 'EUR' | 'GBP' | 'AED';
  status: 'pending_fulfillment' | 'in_escrow' | 'dual_approval_required' | 'disbursed' | 'failed';
  escrowReleaseCondition: string;
  associatedOrderIds: string[];
  requiresDualAuth: boolean;
  cmioApproved: boolean;
  complianceApproved: boolean;
  disbursedAt?: string;
  stripeTransferId?: string;
  createdAt: string;
}

export interface GSTInvoice {
  id: string;
  invoiceNumber: string; // MW/2026-27/INV-00001
  partnerId: string;
  partnerGstin: string;
  buyerName: string;
  buyerAddress: string;
  date: string;
  dueDate: string;
  hsnCode: string;
  taxableAmount: number;
  cgstRatePct: number;
  cgstAmount: number;
  sgstRatePct: number;
  sgstAmount: number;
  igstRatePct: number;
  igstAmount: number;
  totalInvoiceValue: number;
  irnHash?: string;
  status: 'draft' | 'generated' | 'filed';
}

export type SupportedCurrency = 'INR' | 'USD' | 'EUR' | 'GBP' | 'AED';

export interface CurrencyRate {
  currency: SupportedCurrency;
  symbol: string;
  rateToInr: number; // e.g. USD = 86.5, EUR = 93.2, etc.
}

// ==========================================
// PHASE 5: SCALE, FEDERATION & FLEET TYPES
// ==========================================

export type RegulatoryJurisdiction = 'IN_CDSCO' | 'US_FDA' | 'EU_EMA';

export interface RegionalRegulatoryApproval {
  jurisdiction: RegulatoryJurisdiction;
  badgeLabel: string;
  applicationNumber: string; // e.g. ANDA #078912 or EMA/H/C/004521
  status: 'approved' | 'under_evaluation' | 'clinical_trial' | 'not_registered';
  registeredMoiety: string;
  validThrough: string;
}

export interface FLEETVehicleSensor {
  vehicleId: string;
  plateNumber: string;
  driverName: string;
  routeSector: string;
  bleBeaconId: string;
  ambientTempCelsius: number;
  chillerTempCelsius: number;
  chillerTargetMinCelsius: number;
  chillerTargetMaxCelsius: number;
  compressorState: 'active' | 'idle' | 'warning';
  predictedBreachMinutes: number | null; // ML anomaly predictor: null if safe
  lastPingSecondsAgo: number;
}

