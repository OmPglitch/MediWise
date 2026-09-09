import { FLEETVehicleSensor, RegionalRegulatoryApproval, RegulatoryJurisdiction } from '../types';

// ============================================
// SPRINT 5.1 — FEDERATED DRUG CATALOG DATA
// ============================================

export interface FederatedDrugEntry {
  id: string;
  internationalName: string;     // INN
  activeSalt: string;
  atcCode: string;
  molecularFormula: string;
  therapeuticCategory: string;
  approvals: RegionalRegulatoryApproval[];
  bioequivalenceStudies: number; // Count across all jurisdictions
  crossRegionParityScore: number; // 0-100, harmonized score
  harmonizedPrice: {
    inrAvg: number;
    usdAvg: number;
    eurAvg: number;
  };
}

export const MOCK_FEDERATED_DRUGS: FederatedDrugEntry[] = [
  {
    id: 'fed-atorvastatin',
    internationalName: 'Atorvastatin',
    activeSalt: 'Atorvastatin Calcium',
    atcCode: 'C10AA05',
    molecularFormula: 'C₃₃H₃₅FN₂O₅',
    therapeuticCategory: 'Cardiology',
    approvals: [
      {
        jurisdiction: 'IN_CDSCO',
        badgeLabel: 'CDSCO Approved',
        applicationNumber: 'CDSCO/GEN/2018/001234',
        status: 'approved',
        registeredMoiety: 'Atorvastatin Calcium Trihydrate',
        validThrough: '2029-12-31',
      },
      {
        jurisdiction: 'US_FDA',
        badgeLabel: 'FDA ANDA',
        applicationNumber: 'ANDA #078912',
        status: 'approved',
        registeredMoiety: 'Atorvastatin Calcium',
        validThrough: '2031-06-30',
      },
      {
        jurisdiction: 'EU_EMA',
        badgeLabel: 'EMA Centralised',
        applicationNumber: 'EMA/H/C/004521',
        status: 'approved',
        registeredMoiety: 'Atorvastatinum',
        validThrough: '2030-03-15',
      },
    ],
    bioequivalenceStudies: 47,
    crossRegionParityScore: 99.4,
    harmonizedPrice: { inrAvg: 42.5, usdAvg: 0.49, eurAvg: 0.46 },
  },
  {
    id: 'fed-metformin',
    internationalName: 'Metformin',
    activeSalt: 'Metformin Hydrochloride',
    atcCode: 'A10BA02',
    molecularFormula: 'C₄H₁₁N₅·HCl',
    therapeuticCategory: 'Endocrinology',
    approvals: [
      {
        jurisdiction: 'IN_CDSCO',
        badgeLabel: 'CDSCO Approved',
        applicationNumber: 'CDSCO/GEN/2015/000781',
        status: 'approved',
        registeredMoiety: 'Metformin Hydrochloride',
        validThrough: '2028-09-30',
      },
      {
        jurisdiction: 'US_FDA',
        badgeLabel: 'FDA ANDA',
        applicationNumber: 'ANDA #040054',
        status: 'approved',
        registeredMoiety: 'Metformin HCl',
        validThrough: '2030-12-31',
      },
      {
        jurisdiction: 'EU_EMA',
        badgeLabel: 'EMA Centralised',
        applicationNumber: 'EMA/H/C/001230',
        status: 'approved',
        registeredMoiety: 'Metforminum',
        validThrough: '2029-07-01',
      },
    ],
    bioequivalenceStudies: 63,
    crossRegionParityScore: 99.8,
    harmonizedPrice: { inrAvg: 18.2, usdAvg: 0.21, eurAvg: 0.20 },
  },
  {
    id: 'fed-omeprazole',
    internationalName: 'Omeprazole',
    activeSalt: 'Omeprazole Magnesium',
    atcCode: 'A02BC01',
    molecularFormula: 'C₁₇H₁₉N₃O₃S',
    therapeuticCategory: 'Gastroenterology',
    approvals: [
      {
        jurisdiction: 'IN_CDSCO',
        badgeLabel: 'CDSCO Approved',
        applicationNumber: 'CDSCO/GEN/2016/002210',
        status: 'approved',
        registeredMoiety: 'Omeprazole Magnesium',
        validThrough: '2027-11-15',
      },
      {
        jurisdiction: 'US_FDA',
        badgeLabel: 'FDA ANDA',
        applicationNumber: 'ANDA #065153',
        status: 'approved',
        registeredMoiety: 'Omeprazole',
        validThrough: '2029-04-20',
      },
      {
        jurisdiction: 'EU_EMA',
        badgeLabel: 'EMA Centralised',
        applicationNumber: 'EMA/H/C/000700',
        status: 'approved',
        registeredMoiety: 'Omeprazolum',
        validThrough: '2028-08-01',
      },
    ],
    bioequivalenceStudies: 38,
    crossRegionParityScore: 98.9,
    harmonizedPrice: { inrAvg: 28.6, usdAvg: 0.33, eurAvg: 0.31 },
  },
  {
    id: 'fed-amoxicillin',
    internationalName: 'Amoxicillin',
    activeSalt: 'Amoxicillin Trihydrate',
    atcCode: 'J01CA04',
    molecularFormula: 'C₁₆H₁₉N₃O₅S·3H₂O',
    therapeuticCategory: 'Anti-infective',
    approvals: [
      {
        jurisdiction: 'IN_CDSCO',
        badgeLabel: 'CDSCO Approved',
        applicationNumber: 'CDSCO/GEN/2014/000445',
        status: 'approved',
        registeredMoiety: 'Amoxicillin Trihydrate',
        validThrough: '2030-01-31',
      },
      {
        jurisdiction: 'US_FDA',
        badgeLabel: 'FDA ANDA',
        applicationNumber: 'ANDA #062359',
        status: 'approved',
        registeredMoiety: 'Amoxicillin',
        validThrough: '2032-05-15',
      },
      {
        jurisdiction: 'EU_EMA',
        badgeLabel: 'EMA Centralised',
        applicationNumber: 'EMA/H/C/001889',
        status: 'under_evaluation',
        registeredMoiety: 'Amoxicillinum',
        validThrough: '2026-12-31',
      },
    ],
    bioequivalenceStudies: 55,
    crossRegionParityScore: 97.3,
    harmonizedPrice: { inrAvg: 12.4, usdAvg: 0.14, eurAvg: 0.13 },
  },
  {
    id: 'fed-salbutamol',
    internationalName: 'Salbutamol',
    activeSalt: 'Salbutamol Sulfate',
    atcCode: 'R03AC02',
    molecularFormula: 'C₁₃H₂₁NO₃·H₂SO₄',
    therapeuticCategory: 'Respiratory',
    approvals: [
      {
        jurisdiction: 'IN_CDSCO',
        badgeLabel: 'CDSCO Approved',
        applicationNumber: 'CDSCO/GEN/2012/000122',
        status: 'approved',
        registeredMoiety: 'Salbutamol Sulphate',
        validThrough: '2031-08-20',
      },
      {
        jurisdiction: 'US_FDA',
        badgeLabel: 'FDA ANDA',
        applicationNumber: 'ANDA #018517',
        status: 'approved',
        registeredMoiety: 'Albuterol Sulfate',
        validThrough: '2033-02-28',
      },
      {
        jurisdiction: 'EU_EMA',
        badgeLabel: 'EMA Centralised',
        applicationNumber: 'EMA/H/C/002211',
        status: 'clinical_trial',
        registeredMoiety: 'Salbutamolum',
        validThrough: '2027-06-30',
      },
    ],
    bioequivalenceStudies: 29,
    crossRegionParityScore: 96.8,
    harmonizedPrice: { inrAvg: 56.8, usdAvg: 0.66, eurAvg: 0.61 },
  },
];

// ============================================
// SPRINT 5.2 — BLE FLEET TELEMETRY DATA
// ============================================

export const MOCK_FLEET_VEHICLES: FLEETVehicleSensor[] = [
  {
    vehicleId: 'van-001',
    plateNumber: 'DL-01-AB-2234',
    driverName: 'Ramesh Kumar',
    routeSector: 'North Delhi — Zones A/B',
    bleBeaconId: 'BLE-MW-0041',
    ambientTempCelsius: 32.4,
    chillerTempCelsius: 4.2,
    chillerTargetMinCelsius: 2,
    chillerTargetMaxCelsius: 8,
    compressorState: 'active',
    predictedBreachMinutes: null,
    lastPingSecondsAgo: 8,
  },
  {
    vehicleId: 'van-002',
    plateNumber: 'MH-02-CD-5512',
    driverName: 'Suresh Patil',
    routeSector: 'Mumbai — Bandra / Andheri',
    bleBeaconId: 'BLE-MW-0042',
    ambientTempCelsius: 36.1,
    chillerTempCelsius: 7.8,
    chillerTargetMinCelsius: 2,
    chillerTargetMaxCelsius: 8,
    compressorState: 'warning',
    predictedBreachMinutes: 22,
    lastPingSecondsAgo: 15,
  },
  {
    vehicleId: 'van-003',
    plateNumber: 'KA-03-EF-8890',
    driverName: 'Vijay Nair',
    routeSector: 'Bengaluru — Indiranagar / Koramangala',
    bleBeaconId: 'BLE-MW-0043',
    ambientTempCelsius: 28.7,
    chillerTempCelsius: 3.5,
    chillerTargetMinCelsius: 2,
    chillerTargetMaxCelsius: 8,
    compressorState: 'active',
    predictedBreachMinutes: null,
    lastPingSecondsAgo: 5,
  },
  {
    vehicleId: 'van-004',
    plateNumber: 'TN-04-GH-1121',
    driverName: 'Arjun Rajan',
    routeSector: 'Chennai — T.Nagar / Velachery',
    bleBeaconId: 'BLE-MW-0044',
    ambientTempCelsius: 38.3,
    chillerTempCelsius: 5.1,
    chillerTargetMinCelsius: 2,
    chillerTargetMaxCelsius: 8,
    compressorState: 'idle',
    predictedBreachMinutes: null,
    lastPingSecondsAgo: 42,
  },
  {
    vehicleId: 'van-005',
    plateNumber: 'WB-05-IJ-3340',
    driverName: 'Debal Ghosh',
    routeSector: 'Kolkata — Salt Lake / New Town',
    bleBeaconId: 'BLE-MW-0045',
    ambientTempCelsius: 33.9,
    chillerTempCelsius: 9.2,
    chillerTargetMinCelsius: 2,
    chillerTargetMaxCelsius: 8,
    compressorState: 'warning',
    predictedBreachMinutes: 8,
    lastPingSecondsAgo: 11,
  },
];
