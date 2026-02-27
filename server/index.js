'use strict';

require('dotenv').config();

const express = require('express');
const cors    = require('cors');
const morgan  = require('morgan');

const { connectDB } = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorHandler');

const memoriesRouter  = require('./routes/memories');
const decisionsRouter = require('./routes/decisions');
const analyticsRouter = require('./routes/analytics');
const entitiesRouter  = require('./routes/entities');

const PORT = process.env.PORT || 3001;
const app  = express();

app.use(cors({
  origin: [
    'http://localhost:5173',  
    'http://localhost:3000',  
  ],
}));
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (req, res) => {
  const mongoose = require('mongoose');
  res.json({
    status:    'ok',
    db:        mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/memories',  memoriesRouter);
app.use('/api/decisions', decisionsRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/entities',  entitiesRouter);

app.use(notFound);
app.use(errorHandler);

async function start() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`\n  ContextOS API  →  http://localhost:${PORT}`);
    console.log(`   GET  /api/health`);
    console.log(`   GET  /api/memories`);
    console.log(`   POST /api/memories`);
    console.log(`   POST /api/decisions/run`);
    console.log(`   GET  /api/analytics`);
    console.log(`   GET  /api/entities\n`);
  });
}

start();

process.on('SIGINT',  async () => {
  const mongoose = require('mongoose');
  await mongoose.disconnect();
  console.log('\n  MongoDB disconnected. Server stopped.');
  process.exit(0);
});
