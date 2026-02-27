'use strict';

const express     = require('express');
const { body }    = require('express-validator');
const Memory      = require('../models/Memory');
const DecisionLog = require('../models/DecisionLog');
const { validate } = require('../middleware/validate');

const router = express.Router();

const DECISIONS = {
  invoice: {
    verdict:    'HOLD — Quality Inspection Required',
    level:      'warning',
    confidence: 87,
    summary:    'Multiple signals point to elevated risk with Supplier XYZ. The recent quality incident combined with the approaching seasonal risk window justifies withholding fast-track payment until physical inspection is signed off.',
    reasoning: [
      { memoryId: 'm001', iconName: 'AlertTriangle', color: '#D97706', title: 'Recent Quality Incident — weight 0.92', body: '30% defect rate 134 days ago caused ₹50,000 direct loss. Within active monitoring window.' },
      { memoryId: 'm004', iconName: 'Sun',           color: '#B45309', title: 'Seasonal Risk Window Approaching — PROCEDURAL', body: 'Feb delivery sits on the cusp of Mar–May degradation period.' },
      { memoryId: 'm003', iconName: 'CreditCard',    color: '#7C3AED', title: 'Payment Dispute History — AGING (0.51 eff.)', body: 'Non-receipt dispute 251 days ago adds payment risk. Staged release recommended.' },
      { memoryId: 'm002', iconName: 'Truck',         color: '#9CA3AF', title: 'Logistics Memory Aging — low influence',        body: 'Warehouse road damage from July 2024 has decayed below threshold.' },
      { memoryId: 'm005', iconName: 'XCircle',       color: '#D1D5DB', title: 'Early Payment Discount — STALE (362d, excluded)', body: 'Exceeds 300-day reliability threshold. Excluded from scoring.' },
    ],
    conflict: { label: 'Conflicting Signal Detected', body: 'No incidents in the past 4 months hints at improvement trajectory. However, the evergreen seasonal pattern overrides this.' },
    actions: [
      { iconName: 'Package',     text: 'Raise formal quality inspection — attach PO and GRN for cross-verification' },
      { iconName: 'AlertCircle', text: 'Notify procurement of persistent pattern — flag for supplier risk review' },
      { iconName: 'CreditCard',  text: 'Hold full ₹2,50,000 — staged release after inspection sign-off' },
      { iconName: 'FileText',    text: 'Log decision in Supplier XYZ risk profile for future scoring calibration' },
      { iconName: 'Calendar',    text: 'Schedule post-inspection review — fast-track only if defect rate < 2%' },
    ],
  },
  support: {
    verdict:    'CRITICAL ESCALATION — P1 Within 30 Minutes',
    level:      'critical',
    confidence: 95,
    summary:    'TechCorp is a high-churn-risk account with deep platform dependency, prior frustration on record, and a technically-demanding CTO. All memory vectors converge on critical urgency.',
    reasoning: [
      { memoryId: 'm006', iconName: 'AlertTriangle', color: '#DC2626', title: 'Active Churn Signal — competitor mentioned 68d ago', body: 'Customer flagged competitors during ₹50L renewal. Any failure now amplifies churn probability.' },
      { memoryId: 'm008', iconName: 'TrendingUp',    color: '#16A34A', title: 'API Usage +300% — platform is mission-critical',  body: 'Rapid dependency growth means this failure directly impacts live operations.' },
      { memoryId: 'm007', iconName: 'Heart',         color: '#E11D48', title: 'Emotional Memory — prior frustration (190d)',     body: 'Customer already criticised 48h resolution time. Same issue recurring will compound frustration.' },
      { memoryId: 'm009', iconName: 'Users',         color: '#6366F1', title: 'Stakeholder Pref — CTO requires technical depth', body: 'Status emails will not satisfy this stakeholder. CTO expects RCA, system logs, and realistic ETA.' },
    ],
    conflict: { label: 'No Conflicting Signals', body: 'All four memory vectors converge on the same conclusion. Confidence floor elevated to 95% — execute without deliberation.' },
    actions: [
      { iconName: 'Zap',       text: 'Assign P1 immediately — senior engineer must acknowledge within 30 minutes' },
      { iconName: 'PhoneCall', text: 'CSM calls TechCorp contact within 1 hour — do not email first' },
      { iconName: 'FileText',  text: 'Prepare technical RCA for CTO — logs, root cause, fix plan, realistic ETA' },
      { iconName: 'Clock',     text: '2-hour mandatory progress check-in regardless of resolution status' },
      { iconName: 'Shield',    text: 'Brief retention team — prepare competitive counter-narrative if risk escalates' },
      { iconName: 'Star',      text: 'Post-resolution: offer proactive architecture review as goodwill gesture' },
    ],
  },
};

const SCENARIO_META = {
  invoice: { entity: 'Supplier XYZ',  memoryIds: ['m001','m002','m003','m004','m005'], query: 'Process invoice from Supplier XYZ for ₹2,50,000. Should this be fast-tracked for payment or held for quality inspection?' },
  support: { entity: 'TechCorp Inc.', memoryIds: ['m006','m007','m008','m009'],        query: 'TechCorp Inc. submitted a support ticket about critical integration failures. Should this be escalated? Who should be involved?' },
};

router.get('/', async (req, res, next) => {
  try {
    const logs = await DecisionLog.find()
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    res.json({
      success: true,
      count: logs.length,
      data: logs.map(l => ({ ...l, id: l._id.toString(), _id: undefined })),
    });
  } catch (err) { next(err); }
});

router.post('/run', [
  body('scenarioId')
    .isIn(['invoice', 'support'])
    .withMessage('scenarioId must be "invoice" or "support"'),
  validate,
], async (req, res, next) => {
  try {
    const { scenarioId } = req.body;
    const decision = DECISIONS[scenarioId];
    const meta     = SCENARIO_META[scenarioId];

    const memories = await Memory.find({
      memoryId: { $in: meta.memoryIds },
    }).lean();

    const logEntry = await DecisionLog.create({
      scenarioId,
      entity:     meta.entity,
      query:      meta.query,
      verdict:    decision.verdict,
      confidence: decision.confidence,
      level:      decision.level,
      memoryIds:  meta.memoryIds,
      result:     decision,
    });

    res.json({
      success: true,
      data: {
        ...decision,
        logId:             logEntry._id.toString(),
        retrievedMemories: memories,
        executedAt:        new Date().toISOString(),
      },
    });
  } catch (err) { next(err); }
});

module.exports = router;
