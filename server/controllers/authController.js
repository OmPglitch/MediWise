'use strict';

const crypto = require('crypto');
const User   = require('../models/User');

/** Generate a simple session token (demo-grade; replace with JWT in production) */
const makeToken = () => crypto.randomBytes(32).toString('hex');

/** POST /api/auth/register */
const register = async (req, res) => {
  const {
    name, email, password, role, organization,
    licenseOrNpi, chronicCondition, preferredPharmacy,
    acceptedTerms, acceptedHipaaBaa,
  } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: 'name, email, password, and role are required' });
  }
  if (!acceptedTerms || !acceptedHipaaBaa) {
    return res.status(400).json({ error: 'You must accept Terms and HIPAA BAA to register' });
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    const err = new Error('An account with this email already exists');
    err.statusCode = 409;
    throw err;
  }

  const userId       = `usr-${role}-${Date.now()}`;
  const passwordHash = User.hashPassword(password);
  const sessionToken = makeToken();
  const initials     = name.split(' ').map((w) => w[0]).join('').toUpperCase().substring(0, 2);

  const roleMap = {
    cmio:                'Chief Medical Systems Officer (CMIO)',
    pharmacy_partner:    'Pharmacy Network Partner',
    compliance_officer:  'Clinical Compliance Officer',
    patient:             'Patient / End-User',
  };

  const user = await User.create({
    userId,
    name,
    email: email.toLowerCase(),
    passwordHash,
    role,
    roleTitle:    roleMap[role] || role,
    organization: organization || 'MediWise Platform',
    avatarInitials: initials,
    licenseNumber:  licenseOrNpi,
    npiNumber:      licenseOrNpi,
    chronicCondition,
    preferredPharmacy,
    authProvider:   'password',
    emailVerified:  false,
    twoFactorEnabled: false,
    twoFactorMethod:  'totp',
    lastLogin:    new Date().toISOString(),
    sessionToken,
    ipAddress:    req.ip || '127.0.0.1',
    location:     'Unknown',
    device:       req.headers['user-agent'] || 'Browser',
    permissions:  [],
  });

  const profile = user.toObject({ virtuals: true });
  res.status(201).json({ user: profile, sessionToken });
};

/** POST /api/auth/login */
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'email and password are required' });
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  // Demo users have no passwordHash — allow any password for them
  if (user.passwordHash && !user.verifyPassword(password)) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const sessionToken = makeToken();
  user.sessionToken = sessionToken;
  user.lastLogin    = new Date().toISOString();
  user.ipAddress    = req.ip || '127.0.0.1';
  user.device       = req.headers['user-agent'] || 'Browser';
  await user.save();

  const profile = user.toObject({ virtuals: true });
  res.json({ user: profile, sessionToken });
};

/** GET /api/auth/profile — return the current user's profile by sessionToken header */
const getProfile = async (req, res) => {
  const token = req.headers['x-session-token'] || req.query.token;
  if (!token) return res.status(401).json({ error: 'No session token provided' });

  const user = await User.findOne({ sessionToken: token });
  if (!user) return res.status(401).json({ error: 'Invalid or expired session' });

  res.json(user.toObject({ virtuals: true }));
};

/** GET /api/users — list all users (CMIO / admin use) */
const listUsers = async (req, res) => {
  const users = await User.find({}, '-passwordHash').lean({ virtuals: true });
  res.json(users);
};

module.exports = { register, login, getProfile, listUsers };
