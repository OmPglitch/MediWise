'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

const DeliveryAddressSchema = new Schema(
  {
    recipientName: { type: String, required: true },
    street:        { type: String, required: true },
    aptSuite:      { type: String },
    city:          { type: String, required: true },
    state:         { type: String, required: true },
    zipCode:       { type: String, required: true },
    phone:         { type: String, required: true },
    instructions:  { type: String, default: '' },
  },
  { _id: false }
);

const TimelineStepSchema = new Schema(
  {
    step:      { type: Number, required: true },
    label:     { type: String, required: true },
    timestamp: { type: String },
    location:  { type: String },
    completed: { type: Boolean, default: false },
    isCurrent: { type: Boolean, default: false },
    note:      { type: String },
  },
  { _id: false }
);

const ColdChainSchema = new Schema(
  {
    required:            { type: Boolean, default: false },
    currentTempCelsius:  { type: Number },
    targetRange:         { type: String, default: '2°C – 8°C' },
    sensorStatus: {
      type: String,
      enum: ['optimal', 'warning', 'critical'],
      default: 'optimal',
    },
    fipsSealNumber: { type: String },
  },
  { _id: false }
);

const CourierSchema = new Schema(
  {
    name:                { type: String, required: true },
    phone:               { type: String, required: true },
    vehicle:             { type: String },
    stopsAway:           { type: Number },
    currentLocationName: { type: String },
    rating:              { type: Number },
  },
  { _id: false }
);

const ProofOfDeliverySchema = new Schema(
  {
    deliveredAt:        { type: String, required: true },
    signedBy:           { type: String, required: true },
    photoUrl:           { type: String },
    verificationMethod: { type: String, required: true },
  },
  { _id: false }
);

const DeliverySchema = new Schema(
  {
    deliveryId:               { type: String, required: true, unique: true, index: true },
    orderNumber:              { type: String, required: true, unique: true },
    trackingNumber:           { type: String, required: true, unique: true },
    drugId:                   { type: String, required: true, index: true },
    drugName:                 { type: String, required: true },
    activeSalt:               { type: String },
    dosageForm:               { type: String },
    quantity:                 { type: Number, required: true, min: 1 },
    pharmacyPartner:          { type: String, required: true },
    carrier:                  { type: String, required: true },
    carrierLogo:              { type: String },
    deliverySpeed: {
      type: String,
      enum: ['same_day', 'next_day', 'standard', 'express_cold_chain', 'in_store_pickup'],
      required: true,
    },
    deliverySpeedLabel:        { type: String },
    status: {
      type: String,
      enum: ['order_placed', 'pharmacist_verified', 'in_transit', 'out_for_delivery', 'delivered', 'delayed'],
      default: 'order_placed',
      index: true,
    },
    statusLabel:               { type: String },
    orderDate:                 { type: String, required: true },
    expectedDeliveryDate:      { type: String },
    expectedDeliveryTimeWindow:{ type: String },
    deliveryCountdownText:     { type: String },
    deliveryAddress:           { type: DeliveryAddressSchema, required: true },
    unitPrice:                 { type: Number, required: true },
    totalPrice:                { type: Number, required: true },
    savingsAmount:             { type: Number, default: 0 },
    shippingFee:               { type: Number, default: 0 },
    coldChain:                 { type: ColdChainSchema, required: true },
    timeline:                  [TimelineStepSchema],
    courier:                   { type: CourierSchema },
    proofOfDelivery:           { type: ProofOfDeliverySchema },
  },
  {
    timestamps: true,
    toJSON:   { virtuals: true },
    toObject: { virtuals: true },
  }
);

DeliverySchema.virtual('id').get(function () {
  return this.deliveryId;
});

module.exports = mongoose.model('Delivery', DeliverySchema);
