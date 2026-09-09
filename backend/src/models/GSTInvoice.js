'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

const GSTInvoiceSchema = new Schema(
  {
    invoiceId:         { type: String, required: true, unique: true, index: true },
    invoiceNumber:     { type: String, required: true, unique: true },
    partnerId:         { type: String, required: true, index: true },
    partnerGstin:      { type: String, required: true },
    buyerName:         { type: String, required: true },
    buyerAddress:      { type: String },
    date:              { type: String, required: true },
    dueDate:           { type: String },
    hsnCode:           { type: String, default: '30049099' },
    taxableAmount:     { type: Number, required: true },
    cgstRatePct:       { type: Number, default: 0 },
    cgstAmount:        { type: Number, default: 0 },
    sgstRatePct:       { type: Number, default: 0 },
    sgstAmount:        { type: Number, default: 0 },
    igstRatePct:       { type: Number, default: 0 },
    igstAmount:        { type: Number, default: 0 },
    totalInvoiceValue: { type: Number, required: true },
    irnHash:           { type: String },
    status: {
      type: String,
      enum: ['draft', 'generated', 'filed'],
      default: 'draft',
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON:   { virtuals: true },
    toObject: { virtuals: true },
  }
);

GSTInvoiceSchema.virtual('id').get(function () {
  return this.invoiceId;
});

module.exports = mongoose.model('GSTInvoice', GSTInvoiceSchema);
