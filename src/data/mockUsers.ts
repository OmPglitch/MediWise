import { UserProfile, UserRole } from '../types';

export const DEMO_USERS: Record<UserRole, UserProfile> = {
  cmio: {
    id: 'usr-cmio-01',
    name: 'Dr. Vikram Rao, MD',
    email: 'dr.v.rao@mediwise.io',
    role: 'cmio',
    roleTitle: 'Chief Medical Systems Officer (CMIO)',
    organization: 'MediWise Clinical Governance Board',
    avatarInitials: 'VR',
    licenseNumber: 'MD-84920-MA',
    npiNumber: '1942083921',
    twoFactorEnabled: true,
    twoFactorMethod: 'fido2',
    lastLogin: '2026-09-07 22:45:10 UTC',
    sessionToken: 'jwt_live_cmio_98bfa2e1c9',
    ipAddress: '10.128.0.1 (K8s Control Plane)',
    location: 'Boston, MA (Direct VPC)',
    device: 'MacBook Pro M3 Max • Chrome 128 / macOS 15.1',
    permissions: [
      'BIOEQUIVALENCE_SIGN_OFF',
      'EMERGENCY_OVERRIDE_EXECUTE',
      'PRODUCTION_ROLLBACK_AUTH',
      'AUDIT_LEDGER_FULL_READ',
      'CATALOG_COMPOSITION_WRITE',
      'REGULATORY_EXPORT_GENERATE',
      'DISPENSARY_SLA_INSPECT'
    ],
  },
  pharmacy_partner: {
    id: 'usr-pharm-02',
    name: 'Priya Sharma, RPh',
    email: 'priya.sharma@apollo247.com',
    role: 'pharmacy_partner',
    roleTitle: 'VP Pharmacy Network Operations',
    organization: 'Apollo Health & Retail Dispensaries Ltd.',
    avatarInitials: 'PS',
    licenseNumber: 'RPH-61029-DL',
    twoFactorEnabled: true,
    twoFactorMethod: 'totp',
    lastLogin: '2026-09-07 21:12:04 UTC',
    sessionToken: 'jwt_live_pharm_3421ad87e0',
    ipAddress: '14.143.12.88 (Apollo Corporate Gateway)',
    location: 'Hyderabad, IN (Edge Proxy)',
    device: 'ThinkPad X1 Carbon • Edge 127 / Windows 11',
    permissions: [
      'STOCK_FEED_MANUAL_SYNC',
      'CPA_COMMISSION_ESCROW_VIEW',
      'RETAIL_PRICE_OVERRIDE',
      'INVENTORY_WEBHOOK_CONFIGURE',
      'CATALOG_COMPOSITION_READ',
      'PARTNER_ANALYTICS_EXPORT'
    ],
  },
  compliance_officer: {
    id: 'usr-comp-03',
    name: 'Elena Vance, CISA, CISSP',
    email: 'elena.vance@audit-cert.org',
    role: 'compliance_officer',
    roleTitle: 'Principal Regulatory & HIPAA Auditor',
    organization: 'HealthTech Compliance Standards Institute',
    avatarInitials: 'EV',
    licenseNumber: 'CISA-2021-9981',
    twoFactorEnabled: true,
    twoFactorMethod: 'fido2',
    lastLogin: '2026-09-07 19:30:22 UTC',
    sessionToken: 'jwt_live_comp_78a014fe22',
    ipAddress: '64.233.160.10 (Secure Vault Access)',
    location: 'Zurich, Switzerland (Egress Node)',
    device: 'Linux Workstation • Firefox ESR 128 / Debian 12',
    permissions: [
      'AUDIT_LEDGER_FULL_READ',
      'MERKLE_CHAIN_VERIFY_EXECUTE',
      'HIPAA_LOG_TAMPER_AUDIT',
      'SOC2_EVIDENCE_PACKAGE_EXPORT',
      'SECURITY_INCIDENT_FLAG',
      'CATALOG_COMPOSITION_READ'
    ],
  },
  patient: {
    id: 'usr-pat-04',
    name: 'Jane Doe',
    email: 'jane.doe@caremail.org',
    role: 'patient',
    roleTitle: 'Verified Prescription Member',
    organization: 'MediWise Rx Advantage Program',
    avatarInitials: 'JD',
    chronicCondition: 'Hypercholesterolemia (Lipid Management)',
    preferredPharmacy: 'Apollo 24/7 Home Delivery',
    twoFactorEnabled: false,
    twoFactorMethod: 'sms',
    lastLogin: '2026-09-07 23:10:00 UTC',
    sessionToken: 'jwt_live_patient_4198cc7e',
    ipAddress: '73.162.204.18 (Residential Broadband)',
    location: 'Chicago, IL',
    device: 'iPhone 15 Pro • Mobile Safari / iOS 18.0',
    permissions: [
      'MEDICINE_PRICE_COMPARE',
      'DOCTOR_SLIP_DOWNLOAD',
      'MONTHLY_REFILL_MANAGE',
      'PARTNER_DISCOUNT_APPLY'
    ],
  },
};

export const ROLE_DETAILS: Record<UserRole, {
  label: string;
  badgeColor: string;
  tagline: string;
  recommendedView: 'overview' | 'catalog' | 'partners' | 'compliance' | 'patient';
}> = {
  cmio: {
    label: 'Chief Medical Systems Officer',
    badgeColor: 'border-cyan-500/40 bg-cyan-950/60 text-cyan-300',
    tagline: 'Clinical bioequivalence parity approvals, formula maps & cluster oversight',
    recommendedView: 'overview',
  },
  pharmacy_partner: {
    label: 'Pharmacy Network Admin',
    badgeColor: 'border-blue-500/40 bg-blue-950/60 text-blue-300',
    tagline: 'Inventory webhook ingestion, CPA commission escrow & live stock SLAs',
    recommendedView: 'partners',
  },
  compliance_officer: {
    label: 'Regulatory & Security Auditor',
    badgeColor: 'border-purple-500/40 bg-purple-950/60 text-purple-300',
    tagline: 'SOC2 Type II, HIPAA §164.312(b), and SHA-256 tamper-proof ledger auditing',
    recommendedView: 'compliance',
  },
  patient: {
    label: 'Patient / Healthcare Consumer',
    badgeColor: 'border-emerald-500/40 bg-emerald-950/60 text-emerald-300',
    tagline: 'Prescription price comparison, generic savings & doctor approval slips',
    recommendedView: 'patient',
  },
};
