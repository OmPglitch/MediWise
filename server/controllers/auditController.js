'use strict';

const AuditEvent = require('../models/AuditEvent');

const normalise = (doc) => {
  const out = { ...doc };
  out.id = doc.eventId || doc.id;
  delete out._id;
  delete out.__v;
  return out;
};

/** GET /api/compliance/ledger — list audit events, newest first */
const getLedger = async (req, res) => {
  const filter = {};
  if (req.query.actorRole) filter.actorRole = req.query.actorRole;
  if (req.query.statusType) filter.statusType = req.query.statusType;

  const limit = Math.min(parseInt(req.query.limit) || 100, 500);
  const skip  = parseInt(req.query.skip) || 0;

  const [events, total] = await Promise.all([
    AuditEvent.find(filter).sort({ timestamp: -1 }).skip(skip).limit(limit).lean({ virtuals: true }),
    AuditEvent.countDocuments(filter),
  ]);

  res.json({ total, skip, limit, events: events.map(normalise) });
};

/** POST /api/compliance/ledger — append a new audit event */
const addAuditEvent = async (req, res) => {
  const body = req.body;
  if (!body.id && !body.eventId) {
    const err = new Error('id (eventId) is required');
    err.statusCode = 400;
    throw err;
  }
  const event = await AuditEvent.create({
    ...body,
    eventId: body.id || body.eventId,
  });
  res.status(201).json(normalise(event.toObject({ virtuals: true })));
};

/** POST /api/compliance/override — log a signed emergency override */
const logOverride = async (req, res) => {
  const { actor, reason, complianceCode, ip } = req.body;
  if (!reason) return res.status(400).json({ error: 'reason is required' });

  const ts = new Date().toISOString().replace('T', ' ').substring(0, 23);
  const hash = `0x${Buffer.from(ts + reason).toString('hex').substring(0, 8).toUpperCase()}...${Math.random().toString(16).substring(2, 6)}`;

  const event = await AuditEvent.create({
    eventId:        `audit-override-${Date.now()}`,
    timestamp:      ts,
    hash,
    actor:          actor || 'UNKNOWN',
    actorRole:      'SUPER_ADMIN',
    action:         `Emergency Override: ${reason}`,
    resource:       'ClusterSecurity: Elevated Privileges Granted',
    complianceCode: complianceCode || 'HIPAA Sec. 164.312',
    ip:             ip || '0.0.0.0',
    status:         'Action Required',
    statusType:     'warning',
  });

  res.status(201).json(normalise(event.toObject({ virtuals: true })));
};

/** POST /api/compliance/rollback — log a config rollback event */
const logRollback = async (req, res) => {
  const { actor, targetVersion, ip } = req.body;
  const ts = new Date().toISOString().replace('T', ' ').substring(0, 23);
  const hash = `0x${Buffer.from(ts + targetVersion).toString('hex').substring(0, 8).toUpperCase()}...rollback`;

  const event = await AuditEvent.create({
    eventId:        `audit-rollback-${Date.now()}`,
    timestamp:      ts,
    hash,
    actor:          actor || 'UNKNOWN',
    actorRole:      'SUPER_ADMIN',
    action:         `Emergency Production Reversion to ${targetVersion}`,
    resource:       `ClusterConfig: Reverted to ${targetVersion}`,
    complianceCode: '21 CFR Part 320',
    ip:             ip || '0.0.0.0',
    status:         'Action Required',
    statusType:     'warning',
  });

  res.status(201).json(normalise(event.toObject({ virtuals: true })));
};

module.exports = { getLedger, addAuditEvent, logOverride, logRollback };
