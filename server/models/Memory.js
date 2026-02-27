'use strict';

const mongoose = require('mongoose');

const memorySchema = new mongoose.Schema(
  {
    memoryId: {
      type: String,
      unique: true,
      sparse: true,  
    },

    entity: {
      type: String,
      required: [true, 'entity is required'],
      trim: true,
      index: true,
    },

    type: {
      type: String,
      required: [true, 'type is required'],
      enum: {
        values: ['episodic', 'semantic', 'procedural', 'working'],
        message: '{VALUE} is not a valid memory type',
      },
      index: true,
    },

    category: {
      type: String,
      default: '',
      trim: true,
    },

    title: {
      type: String,
      required: [true, 'title is required'],
      trim: true,
    },

    content: {
      type: String,
      required: [true, 'content is required'],
    },

    date: {
      type: String,   
      default: () => new Date().toISOString().split('T')[0],
    },

    daysAgo: {
      type: Number,
      default: 0,
      min: 0,
    },

    weight: {
      type: Number,
      default: 0.8,
      min: 0,
      max: 1,
    },

    staleness: {
      type: String,
      default: 'fresh',
      enum: {
        values: ['fresh', 'aging', 'stale', 'archived'],
        message: '{VALUE} is not a valid staleness state',
      },
      index: true,
    },

    impact: {
      type: String,
      default: 'medium',
      enum: {
        values: ['critical', 'high', 'medium', 'low'],
        message: '{VALUE} is not a valid impact level',
      },
      index: true,
    },

    emotionalFlag: {
      type: Boolean,
      default: false,
    },

    tags: {
      type: [String],
      default: [],
    },

    relatedIds: {
      type: [String],   
      default: [],
    },
  },
  {
    timestamps: true,           
    versionKey: false,
  }
);

memorySchema.index({ entity: 1, staleness: 1 });
memorySchema.index({ tags: 1 });
memorySchema.index(
  { title: 'text', content: 'text', entity: 'text' },
  { name: 'memory_text_search' }
);

memorySchema.methods.toClient = function () {
  const obj = this.toObject();
  return {
    id:            obj._id.toString(),
    memoryId:      obj.memoryId || obj._id.toString(),
    entity:        obj.entity,
    type:          obj.type,
    category:      obj.category,
    title:         obj.title,
    content:       obj.content,
    date:          obj.date,
    daysAgo:       obj.daysAgo,
    weight:        obj.weight,
    staleness:     obj.staleness,
    impact:        obj.impact,
    emotionalFlag: obj.emotionalFlag,
    tags:          obj.tags,
    relatedIds:    obj.relatedIds,
    createdAt:     obj.createdAt,
    updatedAt:     obj.updatedAt,
  };
};

const Memory = mongoose.model('Memory', memorySchema);

module.exports = Memory;
