import { StripeEscrowPayout, GSTInvoice, CurrencyRate } from '../types';

// ============================================
// SPRINT 4.1 — STRIPE ESCROW PAYOUTS MOCK DATA
// ============================================

export const MOCK_ESCROW_PAYOUTS: StripeEscrowPayout[] = [
  {
    id: 'payout-001',
    payoutNumber: 'MW-PAY-2026-0001',
    partnerId: 'partner-apollo',
    partnerName: 'Apollo 24/7',
    amount: 84320,
    currency: 'INR',
    status: 'disbursed',
    escrowReleaseCondition: 'Verified delivery completion + 48h hold',
    associatedOrderIds: ['del-ord-001', 'del-ord-003'],
    requiresDualAuth: false,
    cmioApproved: true,
    complianceApproved: true,
    disbursedAt: '2026-09-07T14:30:00.000Z',
    stripeTransferId: 'tr_live_9a3f12bc',
    createdAt: '2026-09-05T10:00:00.000Z',
  },
  {
    id: 'payout-002',
    payoutNumber: 'MW-PAY-2026-0002',
    partnerId: 'partner-1mg',
    partnerName: 'Tata 1mg',
    amount: 126450,
    currency: 'INR',
    status: 'dual_approval_required',
    escrowReleaseCondition: 'Dual CMIO + Compliance sign-off (>₹1,00,000)',
    associatedOrderIds: ['del-ord-002'],
    requiresDualAuth: true,
    cmioApproved: true,
    complianceApproved: false,
    createdAt: '2026-09-08T09:15:00.000Z',
  },
  {
    id: 'payout-003',
    payoutNumber: 'MW-PAY-2026-0003',
    partnerId: 'partner-netmeds',
    partnerName: 'Netmeds',
    amount: 41890,
    currency: 'INR',
    status: 'in_escrow',
    escrowReleaseCondition: 'Awaiting delivery confirmation (ETA Sep 10)',
    associatedOrderIds: [],
    requiresDualAuth: false,
    cmioApproved: false,
    complianceApproved: false,
    createdAt: '2026-09-09T07:00:00.000Z',
  },
  {
    id: 'payout-004',
    payoutNumber: 'MW-PAY-2026-0004',
    partnerId: 'partner-medplus',
    partnerName: 'MedPlus Health',
    amount: 18200,
    currency: 'INR',
    status: 'pending_fulfillment',
    escrowReleaseCondition: 'Order fulfillment in progress',
    associatedOrderIds: [],
    requiresDualAuth: false,
    cmioApproved: false,
    complianceApproved: false,
    createdAt: '2026-09-09T11:45:00.000Z',
  },
];

// ============================================
// SPRINT 4.2 — GST INVOICE MOCK DATA
// ============================================

export const MOCK_GST_INVOICES: GSTInvoice[] = [
  {
    id: 'inv-001',
    invoiceNumber: 'MW/2026-27/INV-00001',
    partnerId: 'partner-apollo',
    partnerGstin: '27AABCT1332L1ZT',
    buyerName: 'Apollo 24/7 Pharmacy Pvt Ltd',
    buyerAddress: '5th Floor, Apollo Tower, Jubilee Hills, Hyderabad – 500033',
    date: '2026-09-07',
    dueDate: '2026-10-07',
    hsnCode: '30049099',
    taxableAmount: 84320,
    cgstRatePct: 6,
    cgstAmount: 5059.2,
    sgstRatePct: 6,
    sgstAmount: 5059.2,
    igstRatePct: 0,
    igstAmount: 0,
    totalInvoiceValue: 94438.4,
    irnHash: 'SHA256:3f9a8c2e1d04b571af',
    status: 'filed',
  },
  {
    id: 'inv-002',
    invoiceNumber: 'MW/2026-27/INV-00002',
    partnerId: 'partner-1mg',
    partnerGstin: '07AABCT4823M1ZU',
    buyerName: 'Tata 1mg Technologies Pvt Ltd',
    buyerAddress: '19th Floor, One Horizon Centre, Golf Course Road, Gurgaon – 122002',
    date: '2026-09-08',
    dueDate: '2026-10-08',
    hsnCode: '30049099',
    taxableAmount: 126450,
    cgstRatePct: 0,
    cgstAmount: 0,
    sgstRatePct: 0,
    sgstAmount: 0,
    igstRatePct: 12,
    igstAmount: 15174,
    totalInvoiceValue: 141624,
    status: 'generated',
  },
  {
    id: 'inv-003',
    invoiceNumber: 'MW/2026-27/INV-00003',
    partnerId: 'partner-netmeds',
    partnerGstin: '33AAGCR2681N1Z5',
    buyerName: 'Netmeds Marketplace Ltd',
    buyerAddress: 'No.48, Whites Road, Chennai – 600014',
    date: '2026-09-09',
    dueDate: '2026-10-09',
    hsnCode: '30049099',
    taxableAmount: 41890,
    cgstRatePct: 6,
    cgstAmount: 2513.4,
    sgstRatePct: 6,
    sgstAmount: 2513.4,
    igstRatePct: 0,
    igstAmount: 0,
    totalInvoiceValue: 46916.8,
    status: 'draft',
  },
];

// ============================================
// SPRINT 4.3 — CURRENCY RATES MOCK DATA
// ============================================

export const CURRENCY_RATES: CurrencyRate[] = [
  { currency: 'INR', symbol: '₹', rateToInr: 1 },
  { currency: 'USD', symbol: '$', rateToInr: 86.5 },
  { currency: 'EUR', symbol: '€', rateToInr: 93.2 },
  { currency: 'GBP', symbol: '£', rateToInr: 109.8 },
  { currency: 'AED', symbol: 'د.إ', rateToInr: 23.6 },
];

export function convertFromINR(amountInr: number, rate: CurrencyRate): number {
  return amountInr / rate.rateToInr;
}

export function formatCurrency(amount: number, rate: CurrencyRate): string {
  const converted = convertFromINR(amount, rate);
  if (rate.currency === 'INR') {
    return `₹${converted.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  return `${rate.symbol}${converted.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
