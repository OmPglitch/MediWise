import { FHIRMedicationRequest, ABHAProfile, UHIServiceProvider, CourierCoordinates } from '../types';

// ============================================
// SPRINT 3.1 — FHIR R4 MOCK DATA
// ============================================

export const MOCK_FHIR_REQUESTS: FHIRMedicationRequest[] = [
  {
    id: 'fhir-req-001',
    resourceType: 'MedicationRequest',
    status: 'active',
    intent: 'order',
    medicationCodeableConcept: {
      coding: [
        {
          system: 'http://www.nlm.nih.gov/research/umls/rxnorm',
          code: '617310',
          display: 'Atorvastatin 20 MG Oral Tablet',
        },
      ],
      text: 'Atorvastatin 20mg',
    },
    subject: {
      reference: 'Patient/ABDM-91-4412-8832-1090',
      display: 'Rajan Mehta (ABHA ID Verified)',
    },
    requester: {
      display: 'Dr. Priya Iyer, DM Cardiology, Apollo Chennai',
      identifier: { system: 'NMC', value: 'NMC-2014-007823' },
    },
    dosageInstruction: [
      { text: '20mg once daily at bedtime', timing: { code: { text: 'QHS' } } },
    ],
    authoredOn: '2026-09-07T10:45:00.000Z',
    mappedDrugId: 'drug-atorvastatin',
    complianceStatus: 'validated',
  },
  {
    id: 'fhir-req-002',
    resourceType: 'MedicationRequest',
    status: 'active',
    intent: 'order',
    medicationCodeableConcept: {
      coding: [
        {
          system: 'http://www.nlm.nih.gov/research/umls/rxnorm',
          code: '860975',
          display: 'Sitagliptin 100 MG Oral Tablet',
        },
      ],
      text: 'Januvia (Sitagliptin) 100mg',
    },
    subject: {
      reference: 'Patient/ABDM-91-5523-6641-0021',
      display: 'Amrita Desai (ABHA ID Pending)',
    },
    requester: {
      display: 'Dr. Sanjay Kulkarni, Endocrinology, Fortis',
      identifier: { system: 'NMC', value: 'NMC-2010-003441' },
    },
    dosageInstruction: [
      { text: '100mg once daily before breakfast', timing: { code: { text: 'QAM' } } },
    ],
    authoredOn: '2026-09-08T14:20:00.000Z',
    mappedDrugId: 'drug-januvia',
    complianceStatus: 'pending',
  },
  {
    id: 'fhir-req-003',
    resourceType: 'MedicationRequest',
    status: 'active',
    intent: 'order',
    medicationCodeableConcept: {
      coding: [
        {
          system: 'http://snomed.info/sct',
          code: '387207008',
          display: 'Ibuprofen 400 MG Oral Tablet',
        },
      ],
      text: 'Ibuprofen 400mg',
    },
    subject: {
      reference: 'Patient/ABDM-91-7710-3354-8812',
      display: 'Karan Nair (Walk-In)',
    },
    requester: {
      display: 'Dr. Lata Sharma, General Medicine, Max Hospital',
      identifier: { system: 'MCI', value: 'MCI-2018-091234' },
    },
    dosageInstruction: [
      { text: '400mg TDS after meals for 5 days', timing: { code: { text: 'TDS' } } },
    ],
    authoredOn: '2026-09-09T08:00:00.000Z',
    complianceStatus: 'rejected',
  },
  {
    id: 'fhir-req-004',
    resourceType: 'MedicationRequest',
    status: 'active',
    intent: 'order',
    medicationCodeableConcept: {
      coding: [
        {
          system: 'http://www.nlm.nih.gov/research/umls/rxnorm',
          code: '308460',
          display: 'Omeprazole 20 MG Delayed Release Capsule',
        },
      ],
      text: 'Nexium (Esomeprazole) 40mg',
    },
    subject: {
      reference: 'Patient/ABDM-91-2234-5567-9900',
      display: 'Sunita Verma (ABHA ID Verified)',
    },
    requester: {
      display: 'Dr. Vikram Rao, Gastroenterology, AIIMS Delhi',
      identifier: { system: 'NMC', value: 'NMC-2008-000112' },
    },
    dosageInstruction: [
      { text: '40mg once daily before breakfast for 8 weeks', timing: { code: { text: 'QAM' } } },
    ],
    authoredOn: '2026-09-09T11:30:00.000Z',
    mappedDrugId: 'drug-nexium',
    complianceStatus: 'pending',
  },
];

export const MOCK_EHR_ENDPOINTS = [
  {
    id: 'ehr-apollo',
    name: 'Apollo Hospitals EHR',
    baseUrl: 'https://fhir.apollohospitals.com/R4',
    version: 'FHIR R4',
    status: 'active' as const,
    lastSync: '2 min ago',
  },
  {
    id: 'ehr-fortis',
    name: 'Fortis Healthcare',
    baseUrl: 'https://hl7.fortishealthcare.com/fhir',
    version: 'FHIR R4',
    status: 'active' as const,
    lastSync: '8 min ago',
  },
  {
    id: 'ehr-aiims',
    name: 'AIIMS Delhi (ABDM)',
    baseUrl: 'https://abdm.aiims.edu/fhir/R4',
    version: 'FHIR R4 + ABDM',
    status: 'warning' as const,
    lastSync: '45 min ago',
  },
  {
    id: 'ehr-max',
    name: 'Max Healthcare Network',
    baseUrl: 'https://ehr-api.maxhealthcare.in/R4',
    version: 'FHIR R4',
    status: 'active' as const,
    lastSync: '1 min ago',
  },
];

// ============================================
// SPRINT 3.2 — ABDM / UHI MOCK DATA
// ============================================

export const MOCK_ABHA_PROFILES: ABHAProfile[] = [
  {
    abhaId: '91-4412-8832-1090',
    abhaAddress: 'rajan.mehta@abdm',
    fullName: 'Rajan Mehta',
    gender: 'M',
    dateOfBirth: '1978-03-15',
    mobileVerified: true,
    kycStatus: 'VERIFIED',
    linkedRecordsCount: 14,
  },
  {
    abhaId: '91-5523-6641-0021',
    abhaAddress: 'amrita.desai@abdm',
    fullName: 'Amrita Desai',
    gender: 'F',
    dateOfBirth: '1985-11-22',
    mobileVerified: true,
    kycStatus: 'PENDING',
    linkedRecordsCount: 7,
  },
  {
    abhaId: '91-8891-2203-5544',
    abhaAddress: 'om.patil@abdm',
    fullName: 'Om Patil',
    gender: 'M',
    dateOfBirth: '1990-06-08',
    mobileVerified: true,
    kycStatus: 'VERIFIED',
    linkedRecordsCount: 3,
  },
];

export const MOCK_UHI_PROVIDERS: UHIServiceProvider[] = [
  {
    providerId: 'uhi-apollo-pharmacy-001',
    providerName: 'Apollo Pharmacy — Connaught Place',
    serviceType: 'pharmacy',
    distanceKm: 0.8,
    availableStock: true,
    rating: 4.7,
    estimatedFulfillmentMins: 15,
  },
  {
    providerId: 'uhi-medplus-002',
    providerName: 'MedPlus Health — Lajpat Nagar',
    serviceType: 'pharmacy',
    distanceKm: 1.4,
    availableStock: true,
    rating: 4.5,
    estimatedFulfillmentMins: 22,
  },
  {
    providerId: 'uhi-1mg-003',
    providerName: 'Tata 1mg — Online Delivery',
    serviceType: 'pharmacy',
    distanceKm: 0,
    availableStock: true,
    rating: 4.8,
    estimatedFulfillmentMins: 90,
  },
  {
    providerId: 'uhi-diagnostic-004',
    providerName: 'SRL Diagnostics — Karol Bagh',
    serviceType: 'diagnostic',
    distanceKm: 2.1,
    availableStock: true,
    rating: 4.3,
    estimatedFulfillmentMins: 30,
  },
  {
    providerId: 'uhi-teleconsult-005',
    providerName: 'Apollo 247 Video Consult',
    serviceType: 'teleconsult',
    distanceKm: 0,
    availableStock: true,
    rating: 4.6,
    estimatedFulfillmentMins: 10,
  },
  {
    providerId: 'uhi-diagnostic-006',
    providerName: 'Metropolis Labs — Vasant Kunj',
    serviceType: 'diagnostic',
    distanceKm: 3.5,
    availableStock: false,
    rating: 4.2,
    estimatedFulfillmentMins: 45,
  },
];

// ============================================
// SPRINT 3.3 — COURIER GEOLOCATION MOCK DATA
// ============================================

export const MOCK_COURIER_COORDINATES: CourierCoordinates[] = [
  {
    orderId: 'del-ord-001',
    latitude: 28.6304,
    longitude: 77.2177,
    headingDegrees: 45,
    speedKmh: 28,
    batteryLevelPct: 84,
    timestamp: new Date().toISOString(),
  },
  {
    orderId: 'del-ord-002',
    latitude: 28.5045,
    longitude: 77.0969,
    headingDegrees: 120,
    speedKmh: 0,
    batteryLevelPct: 61,
    timestamp: new Date().toISOString(),
  },
];
