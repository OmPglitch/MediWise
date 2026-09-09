'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

const PartnerSchema = new Schema(
  {
    partnerId: { type: String, required: true, unique: true, index: true },
    name:      { type: String, required: true },
    code:      { type: String, required: true, unique: true },
    type: {
      type: String,
      enum: [
        'National E-Pharmacy',
        'Omnichannel Aggregator',
        'National Hub',
        'Regional Franchise',
        'Independent Chemist',
      ],
      required: true,
    },
    category: {
      type: String,
      enum: ['national', 'regional', 'local'],
      required: true,
      index: true,
    },
    outlets:  { type: String },
    protocol: {
      type: String,
      enum: [
        'REST Webhook / FHIR',
        'Kafka Event Stream',
        'REST Webhook / JSON',
        'Daily SFTP Batch',
        'Direct POS Connector',
      ],
      required: true,
    },
    feedStatus: {
      type: String,
      enum: ['live', 'active', 'synced', 'warning'],
      default: 'active',
    },
    syncInfo:         { type: String },
    referralClicks:   { type: Number, default: 0 },
    totalSharePercent:{ type: Number, default: 0 },
    cvrPercent:       { type: Number, default: 0 },
    gmvAmount:        { type: Number, default: 0 },
    cpaTier: {
      type: String,
      enum: ['Tier 1 (8.5%)', 'Tier 2 (7.0%)', 'Tier 3 (₹20)', 'Tier 3 ($0.25)'],
      required: true,
    },
    cpaAccrued:       { type: Number, default: 0 },
    complianceBadge:  { type: String },
    hasWarning:       { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON:   { virtuals: true },
    toObject: { virtuals: true },
  }
);

PartnerSchema.virtual('id').get(function () {
  return this.partnerId;
});

module.exports = mongoose.model('Partner', PartnerSchema);
