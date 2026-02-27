'use strict';

const mongoose = require('mongoose');

const decisionLogSchema = new mongoose.Schema(
  {
    scenarioId: {
      type: String,
      required: true,
      enum: ['invoice', 'support'],
      index: true,
    },

    entity: {
      type: String,
      required: true,
      index: true,
    },

    query: {
      type: String,
      required: true,
    },

    verdict: {
      type: String,
      required: true,
    },

    confidence: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    level: {
      type: String,
      enum: ['warning', 'critical'],
      default: 'warning',
    },

    // Memory IDs that were retrieved and used
    memoryIds: {
      type: [String],
      default: [],
    },

    // Full decision result snapshot
    result: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

decisionLogSchema.methods.toClient = function () {
  const obj = this.toObject();
  return {
    id:         obj._id.toString(),
    scenarioId: obj.scenarioId,
    entity:     obj.entity,
    query:      obj.query,
    verdict:    obj.verdict,
    confidence: obj.confidence,
    level:      obj.level,
    memoryIds:  obj.memoryIds,
    result:     obj.result,
    createdAt:  obj.createdAt,
  };
};

const DecisionLog = mongoose.model('DecisionLog', decisionLogSchema);

module.exports = DecisionLog;
