'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

const PartnerOfferSchema = new Schema(
  {
    partnerName: { type: String, required: true },
    price:       { type: Number, required: true },
    savingsRate: { type: Number, required: true },
    delivery:    { type: String, required: true },
    status:      { type: String, enum: ['in_stock', 'low_stock'], default: 'in_stock' },
  },
  { _id: false }
);

const ClinicalSignOffSchema = new Schema(
  {
    doctor: { type: String, required: true },
    role:   { type: String, required: true },
    date:   { type: String, required: true },
    hash:   { type: String, required: true },
  },
  { _id: false }
);

const DrugSchema = new Schema(
  {
    // Use drugId as the stable string identifier exposed to the frontend (matches mock 'id')
    drugId:              { type: String, required: true, unique: true, index: true },
    brandName:           { type: String, required: true, index: true },
    brandManufacturer:   { type: String, required: true },
    brandNdc:            { type: String, required: true },
    brandPrice:          { type: Number, required: true },
    activeSalt:          { type: String, required: true, index: true },
    strength:            { type: String, required: true },
    dosageForm:          { type: String, required: true },
    atcCode:             { type: String, required: true },
    casNumber:           { type: String, required: true },
    genericPriceAvg:     { type: Number, required: true },
    savingsPercent:      { type: Number, required: true },
    savingsAmount:       { type: Number, required: true },
    parityPercent:       { type: Number, required: true },
    dissolutionStatus:   { type: String, required: true },
    cmaxParity:          { type: Number, required: true },
    aucParity:           { type: Number, required: true },
    genericsCount:       { type: Number, default: 0 },
    topGenerics:         [{ type: String }],
    clinicalSignOff:     { type: ClinicalSignOffSchema, required: true },
    molecularFormula:    { type: String },
    smiles:              { type: String },
    molecularWeight:     { type: String },
    bioavailability:     { type: String },
    category: {
      type: String,
      enum: ['Cardiology', 'Endocrinology', 'Gastroenterology', 'Anti-infective', 'Respiratory'],
      required: true,
      index: true,
    },
    partnerOffers: [PartnerOfferSchema],
  },
  {
    timestamps: true,
    toJSON:   { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual: expose _id as 'id' plus keep drugId for frontend compatibility
DrugSchema.virtual('id').get(function () {
  return this.drugId;
});

// Text index for full-text search across brand name and active salt
DrugSchema.index({ brandName: 'text', activeSalt: 'text', atcCode: 'text' });

module.exports = mongoose.model('Drug', DrugSchema);
