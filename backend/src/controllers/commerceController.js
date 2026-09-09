'use strict';

const EscrowPayout = require('../models/EscrowPayout');
const GSTInvoice   = require('../models/GSTInvoice');

// ─── helpers ────────────────────────────────────────────────────────────────

const normPayout = (doc) => {
  const out = { ...doc };
  out.id = doc.payoutId || doc.id;
  delete out._id; delete out.__v;
  return out;
};

const normInvoice = (doc) => {
  const out = { ...doc };
  out.id = doc.invoiceId || doc.id;
  delete out._id; delete out.__v;
  return out;
};

// ─── Escrow Payout controllers ──────────────────────────────────────────────

/** GET /api/commerce/escrow-payouts */
const getAllPayouts = async (req, res) => {
  const filter = {};
  if (req.query.status)    filter.status    = req.query.status;
  if (req.query.partnerId) filter.partnerId = req.query.partnerId;
  const payouts = await EscrowPayout.find(filter).sort({ createdAt: -1 }).lean({ virtuals: true });
  res.json(payouts.map(normPayout));
};

/** GET /api/commerce/escrow-payouts/:id */
const getPayoutById = async (req, res) => {
  const payout = await EscrowPayout.findOne({ payoutId: req.params.id }).lean({ virtuals: true });
  if (!payout) { const e = new Error('Payout not found'); e.statusCode = 404; throw e; }
  res.json(normPayout(payout));
};

/** POST /api/stripe/escrow-payout — trigger disbursement (matches existing server.ts endpoint) */
const disbursePayout = async (req, res) => {
  const { payoutId, partnerId, amount, currency = 'INR', cmioApproved, complianceApproved } = req.body;

  if (amount > 100000 && (!cmioApproved || !complianceApproved)) {
    return res.status(403).json({
      error: 'Dual-authorization required for escrow disbursements exceeding ₹1,00,000',
      requiresDualAuth: true,
      cmioApproved: Boolean(cmioApproved),
      complianceApproved: Boolean(complianceApproved),
    });
  }

  const transferId  = `tr_live_${Date.now().toString(16)}`;
  const disbursedAt = new Date().toISOString();

  const payout = await EscrowPayout.findOneAndUpdate(
    { payoutId },
    { status: 'disbursed', stripeTransferId: transferId, disbursedAt, cmioApproved: true, complianceApproved: true },
    { new: true }
  ).lean({ virtuals: true });

  res.json({
    status: 'disbursed',
    transferId,
    payoutId,
    disbursedAt,
    payout: payout ? normPayout(payout) : null,
  });
};

/** PATCH /api/commerce/escrow-payouts/:id — approve CMIO / Compliance sign-off */
const patchPayout = async (req, res) => {
  const payout = await EscrowPayout.findOneAndUpdate(
    { payoutId: req.params.id },
    { $set: req.body },
    { new: true, runValidators: true }
  ).lean({ virtuals: true });
  if (!payout) { const e = new Error('Payout not found'); e.statusCode = 404; throw e; }
  res.json(normPayout(payout));
};

// ─── GST Invoice controllers ─────────────────────────────────────────────────

/** GET /api/commerce/gst-invoices */
const getAllInvoices = async (req, res) => {
  const filter = {};
  if (req.query.status)    filter.status    = req.query.status;
  if (req.query.partnerId) filter.partnerId = req.query.partnerId;
  const invoices = await GSTInvoice.find(filter).sort({ createdAt: -1 }).lean({ virtuals: true });
  res.json(invoices.map(normInvoice));
};

/** GET /api/commerce/gst-invoices/:id */
const getInvoiceById = async (req, res) => {
  const inv = await GSTInvoice.findOne({ invoiceId: req.params.id }).lean({ virtuals: true });
  if (!inv) { const e = new Error('Invoice not found'); e.statusCode = 404; throw e; }
  res.json(normInvoice(inv));
};

/** PATCH /api/commerce/gst-invoices/:id — update status (generate IRN, file, etc.) */
const patchInvoice = async (req, res) => {
  const update = { ...req.body };

  // Auto-generate IRN hash when status transitions to 'generated'
  if (update.status === 'generated' && !update.irnHash) {
    update.irnHash = `SHA256:${require('crypto').randomBytes(9).toString('hex')}`;
  }

  const inv = await GSTInvoice.findOneAndUpdate(
    { invoiceId: req.params.id },
    { $set: update },
    { new: true, runValidators: true }
  ).lean({ virtuals: true });
  if (!inv) { const e = new Error('Invoice not found'); e.statusCode = 404; throw e; }
  res.json(normInvoice(inv));
};

module.exports = {
  getAllPayouts, getPayoutById, disbursePayout, patchPayout,
  getAllInvoices, getInvoiceById, patchInvoice,
};
