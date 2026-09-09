'use strict';

const router = require('express').Router();
const { asyncHandler } = require('../middleware/errorHandler');
const {
  getAllDrugs, getDrugById, createDrug,
  updateDrug, deleteDrug, parityCheck,
} = require('../controllers/drugController');

// POST /api/drugs/parity-check — MUST be before /:id route
router.post('/parity-check', asyncHandler(parityCheck));

router.get('/',     asyncHandler(getAllDrugs));
router.get('/:id',  asyncHandler(getDrugById));
router.post('/',    asyncHandler(createDrug));
router.put('/:id',  asyncHandler(updateDrug));
router.delete('/:id', asyncHandler(deleteDrug));

module.exports = router;
