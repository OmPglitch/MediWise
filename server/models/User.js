'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;
const crypto = require('crypto');

const UserSchema = new Schema(
  {
    userId:        { type: String, required: true, unique: true, index: true },
    name:          { type: String, required: true },
    email:         { type: String, required: true, unique: true, lowercase: true, index: true },
    // passwordHash is only set for password-based auth accounts
    passwordHash:  { type: String },
    role: {
      type: String,
      enum: ['cmio', 'pharmacy_partner', 'compliance_officer', 'patient'],
      required: true,
      index: true,
    },
    roleTitle:       { type: String },
    organization:    { type: String },
    avatarInitials:  { type: String },
    licenseNumber:   { type: String },
    npiNumber:       { type: String },
    chronicCondition:  { type: String },
    preferredPharmacy: { type: String },
    authProvider: {
      type: String,
      enum: ['password', 'google', 'saml'],
      default: 'password',
    },
    emailVerified:   { type: Boolean, default: false },
    googleAccountId: { type: String },
    twoFactorEnabled:{ type: Boolean, default: false },
    twoFactorMethod: {
      type: String,
      enum: ['totp', 'fido2', 'sms'],
      default: 'totp',
    },
    lastLogin:    { type: String },
    sessionToken: { type: String },
    ipAddress:    { type: String },
    location:     { type: String },
    device:       { type: String },
    permissions:  [{ type: String }],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(_doc, ret) {
        // Never expose the password hash in API responses
        delete ret.passwordHash;
        return ret;
      },
    },
    toObject: { virtuals: true },
  }
);

UserSchema.virtual('id').get(function () {
  return this.userId;
});

/**
 * Hash a plain-text password using SHA-256 (demo-grade).
 * Replace with bcrypt in a production system.
 */
UserSchema.statics.hashPassword = function (plain) {
  return crypto.createHash('sha256').update(plain).digest('hex');
};

UserSchema.methods.verifyPassword = function (plain) {
  const hash = crypto.createHash('sha256').update(plain).digest('hex');
  return hash === this.passwordHash;
};

module.exports = mongoose.model('User', UserSchema);
