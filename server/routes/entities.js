'use strict';

const express = require('express');
const Memory  = require('../models/Memory');
const router  = express.Router();

/**
 * @route   GET /api/entities
 * @desc    List all unique entity names
 */
router.get('/', async (req, res, next) => {
  try {
    const entities = await Memory.distinct('entity');
    res.json({ success: true, count: entities.length, data: entities.sort() });
  } catch (err) { next(err); }
});

/**
 * @route   GET /api/entities/:name/memories
 * @desc    Get all memories for a specific entity
 */
router.get('/:name/memories', async (req, res, next) => {
  try {
    const memories = await Memory.find({ entity: req.params.name })
      .sort({ daysAgo: 1 })
      .lean();

    res.json({ success: true, count: memories.length, data: memories });
  } catch (err) { next(err); }
});

module.exports = router;
