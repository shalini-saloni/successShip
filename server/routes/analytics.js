'use strict';

const express = require('express');
const Memory  = require('../models/Memory');
const router  = express.Router();

/**
 * @route   GET /api/analytics
 * @desc    Aggregated memory stats using MongoDB aggregation pipeline
 */
router.get('/', async (req, res, next) => {
  try {
    const [
      byType,
      byStaleness,
      byImpact,
      byEntity,
      totals,
    ] = await Promise.all([

      Memory.aggregate([
        { $group: { _id: '$type', count: { $sum: 1 } } },
        { $project: { type: '$_id', count: 1, _id: 0 } },
        { $sort: { count: -1 } },
      ]),

      Memory.aggregate([
        { $group: { _id: '$staleness', count: { $sum: 1 } } },
        { $project: { staleness: '$_id', count: 1, _id: 0 } },
      ]),

      Memory.aggregate([
        { $group: { _id: '$impact', count: { $sum: 1 } } },
        { $project: { impact: '$_id', count: 1, _id: 0 } },
      ]),

      Memory.aggregate([
        {
          $group: {
            _id:           '$entity',
            count:         { $sum: 1 },
            avgWeight:     { $avg: '$weight' },
            criticalCount: {
              $sum: { $cond: [{ $eq: ['$impact', 'critical'] }, 1, 0] },
            },
          },
        },
        { $project: { entity: '$_id', count: 1, avgWeight: { $round: ['$avgWeight', 3] }, criticalCount: 1, _id: 0 } },
        { $sort: { count: -1 } },
      ]),

      Memory.aggregate([
        {
          $group: {
            _id:            null,
            total:          { $sum: 1 },
            avgWeight:      { $avg: '$weight' },
            emotionalCount: { $sum: { $cond: ['$emotionalFlag', 1, 0] } },
            needsReview: {
              $sum: {
                $cond: [
                  { $in: ['$staleness', ['stale', 'archived']] }, 1, 0,
                ],
              },
            },
          },
        },
      ]),
    ]);

    const t = totals[0] || { total: 0, avgWeight: 0, emotionalCount: 0, needsReview: 0 };

    res.json({
      success: true,
      data: {
        total:          t.total,
        avgWeight:      Number((t.avgWeight || 0).toFixed(3)),
        emotionalCount: t.emotionalCount,
        needsReview:    t.needsReview,
        byType,
        byStaleness,
        byImpact,
        byEntity,
      },
    });
  } catch (err) { next(err); }
});

module.exports = router;
