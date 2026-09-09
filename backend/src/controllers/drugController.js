'use strict';

const Drug = require('../models/Drug');

/** GET /api/drugs — list all drugs, optional ?category= filter */
const getAllDrugs = async (req, res) => {
  const filter = {};
  if (req.query.category) filter.category = req.query.category;
  if (req.query.q) {
    filter.$text = { $search: req.query.q };
  }
  const drugs = await Drug.find(filter).sort({ brandName: 1 }).lean({ virtuals: true });
  // Map drugId → id for frontend compatibility
  res.json(drugs.map(normaliseDrug));
};

/** GET /api/drugs/:id — single drug by drugId */
const getDrugById = async (req, res) => {
  const drug = await Drug.findOne({ drugId: req.params.id }).lean({ virtuals: true });
  if (!drug) {
    const err = new Error(`Drug '${req.params.id}' not found`);
    err.statusCode = 404;
    throw err;
  }
  res.json(normaliseDrug(drug));
};

/** POST /api/drugs — create a new drug */
const createDrug = async (req, res) => {
  const body = req.body;
  const existing = await Drug.findOne({ drugId: body.id || body.drugId });
  if (existing) {
    const err = new Error(`Drug with id '${body.id || body.drugId}' already exists`);
    err.statusCode = 409;
    throw err;
  }
  const drug = await Drug.create({
    ...body,
    drugId: body.id || body.drugId,
  });
  res.status(201).json(normaliseDrug(drug.toObject({ virtuals: true })));
};

/** PUT /api/drugs/:id — full replace */
const updateDrug = async (req, res) => {
  const drug = await Drug.findOneAndUpdate(
    { drugId: req.params.id },
    { ...req.body, drugId: req.params.id },
    { new: true, runValidators: true }
  ).lean({ virtuals: true });
  if (!drug) {
    const err = new Error(`Drug '${req.params.id}' not found`);
    err.statusCode = 404;
    throw err;
  }
  res.json(normaliseDrug(drug));
};

/** DELETE /api/drugs/:id */
const deleteDrug = async (req, res) => {
  const drug = await Drug.findOneAndDelete({ drugId: req.params.id });
  if (!drug) {
    const err = new Error(`Drug '${req.params.id}' not found`);
    err.statusCode = 404;
    throw err;
  }
  res.json({ success: true, message: `Drug '${req.params.id}' deleted` });
};

/** POST /api/drugs/parity-check — calculate bioequivalence confidence */
const parityCheck = async (req, res) => {
  const { drugId, cmaxValue, aucValue } = req.body;
  if (!drugId) return res.status(400).json({ error: 'drugId is required' });
  const drug = await Drug.findOne({ drugId }).lean();
  if (!drug) return res.status(404).json({ error: `Drug '${drugId}' not found` });

  const cmaxScore = cmaxValue != null ? (100 - Math.abs(cmaxValue - drug.cmaxParity)).toFixed(2) : drug.cmaxParity;
  const aucScore  = aucValue  != null ? (100 - Math.abs(aucValue  - drug.aucParity)).toFixed(2)  : drug.aucParity;
  const composite = ((parseFloat(cmaxScore) + parseFloat(aucScore)) / 2).toFixed(2);

  res.json({
    drugId,
    brandName: drug.brandName,
    activeSalt: drug.activeSalt,
    cmaxParityScore: parseFloat(cmaxScore),
    aucParityScore: parseFloat(aucScore),
    compositeConfidence: parseFloat(composite),
    meetsThreshold: parseFloat(composite) >= (parseFloat(process.env.BIOEQ_FLOOR || '98.00')),
    dissolutionStatus: drug.dissolutionStatus,
  });
};

// ── helper ────────────────────────────────────────────────────────────────────
function normaliseDrug(doc) {
  const out = { ...doc };
  // Ensure frontend-expected 'id' field is always present
  out.id = doc.drugId || doc.id;
  delete out._id;
  delete out.__v;
  return out;
}

module.exports = { getAllDrugs, getDrugById, createDrug, updateDrug, deleteDrug, parityCheck };
