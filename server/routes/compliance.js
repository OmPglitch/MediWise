'use strict';

const router = require('express').Router();
const { asyncHandler } = require('../middleware/errorHandler');
const {
  getLedger, addAuditEvent, logOverride, logRollback,
} = require('../controllers/auditController');

router.get('/ledger',        asyncHandler(getLedger));
router.post('/ledger',       asyncHandler(addAuditEvent));
router.post('/override',     asyncHandler(logOverride));
router.post('/rollback',     asyncHandler(logRollback));

module.exports = router;
