export type ActiveTab = 'overview' | 'catalog' | 'partners' | 'compliance' | 'settings' | 'patient' | 'deliveries';

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

