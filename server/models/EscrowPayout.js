'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

const EscrowPayoutSchema = new Schema(
  {
    payoutId:     { type: String, required: true, unique: true, index: true },
    payoutNumber: { type: String, required: true, unique: true },
    partnerId:    { type: String, required: true, index: true },
    partnerName:  { type: String, required: true },
    amount:       { type: Number, required: true },
    currency: {
      type: String,
      enum: ['INR', 'USD', 'EUR', 'GBP', 'AED'],
      default: 'INR',
    },
    status: {
      type: String,
      enum: ['pending_fulfillment', 'in_escrow', 'dual_approval_required', 'disbursed', 'failed'],
      default: 'pending_fulfillment',
      index: true,
    },
    escrowReleaseCondition: { type: String },
    associatedOrderIds:     [{ type: String }],
    requiresDualAuth:       { type: Boolean, default: false },
    cmioApproved:           { type: Boolean, default: false },
    complianceApproved:     { type: Boolean, default: false },
    disbursedAt:            { type: String },
    stripeTransferId:       { type: String },
    createdAt:              { type: String, required: true },
  },
  {
    timestamps: true,
    toJSON:   { virtuals: true },
    toObject: { virtuals: true },
  }
);

EscrowPayoutSchema.virtual('id').get(function () {
  return this.payoutId;
});

module.exports = mongoose.model('EscrowPayout', EscrowPayoutSchema);
