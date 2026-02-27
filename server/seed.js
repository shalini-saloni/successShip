'use strict';

require('dotenv').config({ path: __dirname + '/.env' });

const mongoose = require('mongoose');
const Memory   = require('./models/Memory');

const SEED_MEMORIES = [
  {
    memoryId: 'm001', entity: 'Supplier XYZ', type: 'episodic', category: 'quality',
    title: '30% broken products delivery',
    content: 'Delivered 30% broken products causing ₹50,000 replacement costs and a 2-week production delay.',
    date: '2024-10-15', daysAgo: 134, weight: 0.92, staleness: 'fresh',
    impact: 'high', emotionalFlag: false,
    tags: ['quality', 'damage', 'delay'], relatedIds: ['m003'],
  },
  {
    memoryId: 'm002', entity: 'Supplier XYZ', type: 'semantic', category: 'logistics',
    title: 'Monsoon warehouse road damage',
    content: 'Ship-To warehouse had severe road damage in July 2024. Delivery delays 9+ hours, ₹10,000 extra handling costs.',
    date: '2024-07-10', daysAgo: 231, weight: 0.74, staleness: 'aging',
    impact: 'medium', emotionalFlag: false,
    tags: ['logistics', 'seasonal', 'warehouse'], relatedIds: [],
  },
  {
    memoryId: 'm003', entity: 'Supplier XYZ', type: 'semantic', category: 'payment',
    title: 'Invoice dispute — claimed non-receipt',
    content: 'Supplier disputed an invoice 8 months ago claiming non-receipt. Required 3-week resolution process.',
    date: '2024-06-20', daysAgo: 251, weight: 0.68, staleness: 'aging',
    impact: 'medium', emotionalFlag: false,
    tags: ['payment', 'dispute', 'risk'], relatedIds: ['m001'],
  },
  {
    memoryId: 'm004', entity: 'Supplier XYZ', type: 'procedural', category: 'seasonal',
    title: 'Summer quality degradation pattern',
    content: 'Delivery quality consistently degrades March–May due to heat-sensitive packaging failures.',
    date: '2024-05-01', daysAgo: 301, weight: 0.85, staleness: 'fresh',
    impact: 'high', emotionalFlag: false,
    tags: ['seasonal', 'pattern', 'quality'], relatedIds: ['m001'],
  },
  {
    memoryId: 'm005', entity: 'Supplier XYZ', type: 'semantic', category: 'payment',
    title: 'Early payment 2% discount offer',
    content: 'Supplier offers 2% discount for payments within 7 days of invoice receipt.',
    date: '2024-03-01', daysAgo: 362, weight: 0.60, staleness: 'stale',
    impact: 'low', emotionalFlag: false,
    tags: ['discount', 'payment'], relatedIds: [],
  },
  {
    memoryId: 'm006', entity: 'TechCorp Inc.', type: 'episodic', category: 'relationship',
    title: 'Contract renewal ₹50L — competitor noted',
    content: 'Renewed ₹50 lakh annual contract 2 months ago. Customer explicitly mentioned evaluating competitors during negotiation.',
    date: '2025-12-20', daysAgo: 68, weight: 0.97, staleness: 'fresh',
    impact: 'critical', emotionalFlag: true,
    tags: ['contract', 'risk', 'churn'], relatedIds: ['m007', 'm008'],
  },
  {
    memoryId: 'm007', entity: 'TechCorp Inc.', type: 'episodic', category: 'support',
    title: 'Integration issue — frustrated, 48h fix',
    content: 'Similar integration issue 6 months ago. Resolved in 48 hours but customer expressed frustration about slow response time.',
    date: '2025-08-20', daysAgo: 190, weight: 0.88, staleness: 'fresh',
    impact: 'high', emotionalFlag: true,
    tags: ['support', 'frustration', 'integration'], relatedIds: ['m006'],
  },
  {
    memoryId: 'm008', entity: 'TechCorp Inc.', type: 'semantic', category: 'usage',
    title: 'API usage +300% — business critical',
    content: "Customer's API usage increased 300% in last quarter, indicating deep platform dependency for core operations.",
    date: '2026-01-01', daysAgo: 56, weight: 0.95, staleness: 'fresh',
    impact: 'high', emotionalFlag: false,
    tags: ['growth', 'dependency', 'api'], relatedIds: ['m006'],
  },
  {
    memoryId: 'm009', entity: 'TechCorp Inc.', type: 'semantic', category: 'stakeholder',
    title: 'CTO prefers technical deep-dives',
    content: 'CTO directly involved in prior escalation. Prefers detailed technical reports, not executive summaries.',
    date: '2025-08-22', daysAgo: 188, weight: 0.82, staleness: 'fresh',
    impact: 'medium', emotionalFlag: false,
    tags: ['stakeholder', 'communication', 'cto'], relatedIds: ['m007'],
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/contextos');
    console.log('Connected to MongoDB');

    // Clear existing memories
    const deleted = await Memory.deleteMany({});
    console.log(`Cleared ${deleted.deletedCount} existing memory records`);

    // Insert seed data
    const inserted = await Memory.insertMany(SEED_MEMORIES);
    console.log(`Inserted ${inserted.length} memory records:`);
    inserted.forEach(m => console.log(`[${m.memoryId}] ${m.title}`));

    console.log('\n Seed complete!');
  } catch (err) {
    console.error('Seed failed:', err.message);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
