'use strict';

const router = require('express').Router();
const { asyncHandler } = require('../../backend/src/middleware/errorHandler');
const {
  getAllPartners, getPartnerById, syncPartner,
  getCommissions, patchPartner,
} = require('../controllers/partnerController');

// GET /api/partners/commissions — MUST be before /:id
router.get('/commissions', asyncHandler(getCommissions));

router.get('/',              asyncHandler(getAllPartners));
router.get('/:id',           asyncHandler(getPartnerById));
router.patch('/:id',         asyncHandler(patchPartner));
router.post('/:id/sync',     asyncHandler(syncPartner));

module.exports = router;
