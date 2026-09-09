'use strict';

const Delivery = require('../models/Delivery');

const normalise = (doc) => {
  const out = { ...doc };
  out.id = doc.deliveryId || doc.id;
  delete out._id;
  delete out.__v;
  return out;
};

/** GET /api/deliveries — list all, optional ?status= filter */
const getAllDeliveries = async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.drugId) filter.drugId = req.query.drugId;
  const deliveries = await Delivery.find(filter).sort({ createdAt: -1 }).lean({ virtuals: true });
  res.json(deliveries.map(normalise));
};

/** GET /api/deliveries/:id — single delivery */
const getDeliveryById = async (req, res) => {
  const delivery = await Delivery.findOne({ deliveryId: req.params.id }).lean({ virtuals: true });
  if (!delivery) {
    const err = new Error(`Delivery '${req.params.id}' not found`);
    err.statusCode = 404;
    throw err;
  }
  res.json(normalise(delivery));
};

/** GET /api/deliveries/:id/track — returns timeline + courier + cold-chain */
const trackDelivery = async (req, res) => {
  const delivery = await Delivery.findOne(
    { deliveryId: req.params.id },
    'deliveryId orderNumber trackingNumber status statusLabel timeline courier coldChain expectedDeliveryDate expectedDeliveryTimeWindow'
  ).lean({ virtuals: true });
  if (!delivery) {
    const err = new Error(`Delivery '${req.params.id}' not found`);
    err.statusCode = 404;
    throw err;
  }
  res.json(normalise(delivery));
};

/** POST /api/deliveries — place new prescription fulfilment order */
const createDelivery = async (req, res) => {
  const body = req.body;
  const existing = await Delivery.findOne({ deliveryId: body.id || body.deliveryId });
  if (existing) {
    const err = new Error('Delivery order with this ID already exists');
    err.statusCode = 409;
    throw err;
  }
  const delivery = await Delivery.create({
    ...body,
    deliveryId: body.id || body.deliveryId,
  });
  res.status(201).json(normalise(delivery.toObject({ virtuals: true })));
};

/** PUT /api/deliveries/:id — full replace */
const updateDelivery = async (req, res) => {
  const delivery = await Delivery.findOneAndUpdate(
    { deliveryId: req.params.id },
    { ...req.body, deliveryId: req.params.id },
    { new: true, runValidators: true }
  ).lean({ virtuals: true });
  if (!delivery) {
    const err = new Error(`Delivery '${req.params.id}' not found`);
    err.statusCode = 404;
    throw err;
  }
  res.json(normalise(delivery));
};

/** PATCH /api/deliveries/:id/temp — ingest IoT cold-chain temperature heartbeat */
const updateColdChainTemp = async (req, res) => {
  const { tempCelsius, sensorStatus } = req.body;
  if (tempCelsius === undefined) {
    return res.status(400).json({ error: 'tempCelsius is required' });
  }
  const delivery = await Delivery.findOneAndUpdate(
    { deliveryId: req.params.id },
    { 'coldChain.currentTempCelsius': tempCelsius, 'coldChain.sensorStatus': sensorStatus || 'optimal' },
    { new: true }
  ).lean({ virtuals: true });
  if (!delivery) {
    const err = new Error(`Delivery '${req.params.id}' not found`);
    err.statusCode = 404;
    throw err;
  }
  res.json({
    success: true,
    orderId: req.params.id,
    currentTempCelsius: delivery.coldChain.currentTempCelsius,
    sensorStatus: delivery.coldChain.sensorStatus,
    updatedAt: new Date().toISOString(),
  });
};

/** DELETE /api/deliveries/:id */
const deleteDelivery = async (req, res) => {
  const delivery = await Delivery.findOneAndDelete({ deliveryId: req.params.id });
  if (!delivery) {
    const err = new Error(`Delivery '${req.params.id}' not found`);
    err.statusCode = 404;
    throw err;
  }
  res.json({ success: true, message: `Delivery '${req.params.id}' deleted` });
};

module.exports = {
  getAllDeliveries,
  getDeliveryById,
  trackDelivery,
  createDelivery,
  updateDelivery,
  updateColdChainTemp,
  deleteDelivery,
};
