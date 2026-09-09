'use strict';

const router = require('express').Router();
const { asyncHandler } = require('../middleware/errorHandler');
const {
  getAllPayouts, getPayoutById, disbursePayout, patchPayout,
  getAllInvoices, getInvoiceById, patchInvoice,
} = require('../controllers/commerceController');

// Escrow Payouts
router.get('/escrow-payouts',       asyncHandler(getAllPayouts));
router.get('/escrow-payouts/:id',   asyncHandler(getPayoutById));
router.patch('/escrow-payouts/:id', asyncHandler(patchPayout));

// GST Invoices
router.get('/gst-invoices',         asyncHandler(getAllInvoices));
router.get('/gst-invoices/:id',     asyncHandler(getInvoiceById));
router.patch('/gst-invoices/:id',   asyncHandler(patchInvoice));

// Stripe escrow payout disbursement (mirrors legacy server.ts endpoint path)
router.post('/stripe/escrow-payout', asyncHandler(disbursePayout));

module.exports = router;
