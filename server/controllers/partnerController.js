'use strict';

const Partner = require('../models/Partner');

const normalise = (doc) => {
  const out = { ...doc };
  out.id = doc.partnerId || doc.id;
  delete out._id;
  delete out.__v;
  return out;
};

/** GET /api/partners */
const getAllPartners = async (req, res) => {
  const filter = {};
  if (req.query.category) filter.category = req.query.category;
  if (req.query.feedStatus) filter.feedStatus = req.query.feedStatus;
  const partners = await Partner.find(filter).sort({ name: 1 }).lean({ virtuals: true });
  res.json(partners.map(normalise));
};

/** GET /api/partners/:id */
const getPartnerById = async (req, res) => {
  const partner = await Partner.findOne({ partnerId: req.params.id }).lean({ virtuals: true });
  if (!partner) {
    const err = new Error(`Partner '${req.params.id}' not found`);
    err.statusCode = 404;
    throw err;
  }
  res.json(normalise(partner));
};

/** POST /api/partners/:id/sync — trigger manual inventory sync */
const syncPartner = async (req, res) => {
  const partner = await Partner.findOneAndUpdate(
    { partnerId: req.params.id },
    { feedStatus: 'live', syncInfo: `Manual sync triggered at ${new Date().toISOString()}` },
    { new: true }
  ).lean({ virtuals: true });
  if (!partner) {
    const err = new Error(`Partner '${req.params.id}' not found`);
    err.statusCode = 404;
    throw err;
  }
  res.json({ success: true, partner: normalise(partner) });
};

/** GET /api/partners/commissions — export CPA commission summary */
const getCommissions = async (req, res) => {
  const partners = await Partner.find({}, 'partnerId name cpaTier cpaAccrued gmvAmount').lean({ virtuals: true });
  const total = partners.reduce((sum, p) => sum + (p.cpaAccrued || 0), 0);
  res.json({
    generatedAt: new Date().toISOString(),
    totalAccruedINR: total,
    partners: partners.map((p) => ({
      id: p.partnerId,
      name: p.name,
      cpaTier: p.cpaTier,
      cpaAccrued: p.cpaAccrued,
      gmvAmount: p.gmvAmount,
    })),
  });
};

/** PATCH /api/partners/:id — partial update (feedStatus, cpaAccrued, etc.) */
const patchPartner = async (req, res) => {
  const partner = await Partner.findOneAndUpdate(
    { partnerId: req.params.id },
    { $set: req.body },
    { new: true, runValidators: true }
  ).lean({ virtuals: true });
  if (!partner) {
    const err = new Error(`Partner '${req.params.id}' not found`);
    err.statusCode = 404;
    throw err;
  }
  res.json(normalise(partner));
};

module.exports = { getAllPartners, getPartnerById, syncPartner, getCommissions, patchPartner };
