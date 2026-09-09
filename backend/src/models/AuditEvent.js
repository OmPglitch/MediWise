'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

const PayloadDiffSchema = new Schema(
  {
    removed:   [{ type: String }],
    added:     [{ type: String }],
    preserved: [{ type: String }],
  },
  { _id: false }
);

const AuditEventSchema = new Schema(
  {
    eventId: { type: String, required: true, unique: true, index: true },
    timestamp: { type: String, required: true },
    hash:      { type: String, required: true },
    actor:     { type: String, required: true, index: true },
    actorRole: {
      type: String,
      enum: ['CLINICAL_LEAD', 'SYSTEM_BOT', 'PHARMACY_WEBHOOK', 'SUPER_ADMIN', 'UNKNOWN_ACTOR'],
      required: true,
    },
    action:         { type: String, required: true },
    resource:       { type: String, required: true },
    complianceCode: { type: String },
    ip:             { type: String },
    status: {
      type: String,
      enum: ['Verified Pass', 'Action Required', 'Flagged WAF'],
      required: true,
    },
    statusType: {
      type: String,
      enum: ['success', 'warning', 'error'],
      required: true,
    },
    payloadDiff: { type: PayloadDiffSchema },
  },
  {
    timestamps: true,
    toJSON:   { virtuals: true },
    toObject: { virtuals: true },
  }
);

AuditEventSchema.virtual('id').get(function () {
  return this.eventId;
});

// Sort most recent first by default
AuditEventSchema.index({ timestamp: -1 });

module.exports = mongoose.model('AuditEvent', AuditEventSchema);
