'use strict';

const express = require('express');
const { body, param, query } = require('express-validator');
const Memory  = require('../models/Memory');
const { validate } = require('../middleware/validate');

const router = express.Router();

const memoryRules = [
  body('entity').notEmpty().withMessage('entity is required').trim(),
  body('title').notEmpty().withMessage('title is required').trim(),
  body('content').notEmpty().withMessage('content is required'),
  body('type')
    .isIn(['episodic', 'semantic', 'procedural', 'working'])
    .withMessage('type must be one of: episodic, semantic, procedural, working'),
  body('impact').optional().isIn(['critical', 'high', 'medium', 'low']),
  body('staleness').optional().isIn(['fresh', 'aging', 'stale', 'archived']),
  body('weight').optional().isFloat({ min: 0, max: 1 }).withMessage('weight must be 0–1'),
];

router.get('/', async (req, res, next) => {
  try {
    const filter = {};
    const { entity, type, staleness, impact, search } = req.query;

    if (entity)    filter.entity    = entity;
    if (type)      filter.type      = type;
    if (staleness) filter.staleness = staleness;
    if (impact)    filter.impact    = impact;

    if (search) {
      filter.$text = { $search: search };
    }

    const memories = await Memory.find(filter).sort({ createdAt: -1 }).lean();

    res.json({
      success: true,
      count: memories.length,
      data: memories.map(m => formatMemory(m)),
    });
  } catch (err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const memory = await findMemory(req.params.id);
    if (!memory) return res.status(404).json({ success: false, message: 'Memory not found' });
    res.json({ success: true, data: formatMemory(memory) });
  } catch (err) { next(err); }
});

router.post('/', [...memoryRules, validate], async (req, res, next) => {
  try {
    const memory = await Memory.create({
      entity:        req.body.entity,
      type:          req.body.type,
      category:      req.body.category   || '',
      title:         req.body.title,
      content:       req.body.content,
      date:          req.body.date       || new Date().toISOString().split('T')[0],
      daysAgo:       Number(req.body.daysAgo)  || 0,
      weight:        Number(req.body.weight)   || 0.8,
      staleness:     req.body.staleness  || 'fresh',
      impact:        req.body.impact     || 'medium',
      emotionalFlag: Boolean(req.body.emotionalFlag),
      tags:          Array.isArray(req.body.tags)       ? req.body.tags       : [],
      relatedIds:    Array.isArray(req.body.relatedIds) ? req.body.relatedIds : [],
    });

    res.status(201).json({ success: true, data: formatMemory(memory.toObject()) });
  } catch (err) { next(err); }
});

router.put('/:id', [...memoryRules, validate], async (req, res, next) => {
  try {
    const existing = await findMemory(req.params.id);
    if (!existing) return res.status(404).json({ success: false, message: 'Memory not found' });

    const updates = {
      entity:        req.body.entity,
      type:          req.body.type,
      category:      req.body.category   || '',
      title:         req.body.title,
      content:       req.body.content,
      weight:        Number(req.body.weight)   || existing.weight,
      staleness:     req.body.staleness        || existing.staleness,
      impact:        req.body.impact           || existing.impact,
      emotionalFlag: req.body.emotionalFlag !== undefined
        ? Boolean(req.body.emotionalFlag) : existing.emotionalFlag,
      tags:       Array.isArray(req.body.tags)       ? req.body.tags       : existing.tags,
      relatedIds: Array.isArray(req.body.relatedIds) ? req.body.relatedIds : existing.relatedIds,
    };

    const updated = await Memory.findByIdAndUpdate(
      existing._id,
      updates,
      { new: true, runValidators: true }
    ).lean();

    res.json({ success: true, data: formatMemory(updated) });
  } catch (err) { next(err); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const existing = await findMemory(req.params.id);
    if (!existing) return res.status(404).json({ success: false, message: 'Memory not found' });

    await Memory.findByIdAndDelete(existing._id);
    res.json({ success: true, message: 'Memory deleted' });
  } catch (err) { next(err); }
});

async function findMemory(id) {
  let doc = await Memory.findOne({ memoryId: id }).lean();

  if (!doc && id.match(/^[a-f\d]{24}$/i)) {
    doc = await Memory.findById(id).lean();
  }
  return doc;
}

function formatMemory(m) {
  return {
    id:            m._id?.toString() || m.id,
    memoryId:      m.memoryId || m._id?.toString(),
    entity:        m.entity,
    type:          m.type,
    category:      m.category,
    title:         m.title,
    content:       m.content,
    date:          m.date,
    daysAgo:       m.daysAgo,
    weight:        m.weight,
    staleness:     m.staleness,
    impact:        m.impact,
    emotionalFlag: m.emotionalFlag,
    tags:          m.tags,
    relatedIds:    m.relatedIds,
    createdAt:     m.createdAt,
    updatedAt:     m.updatedAt,
  };
}

module.exports = router;
