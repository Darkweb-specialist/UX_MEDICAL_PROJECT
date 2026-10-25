require('dotenv').config();
const express = require('express');
const cors = require('cors');
const medicineRoutes = require('./routes/medicineRoutes');
const diaryRoutes = require('./routes/diaryRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging for evaluation & debugging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Health-check endpoint for Docker & Kubernetes Readiness / Liveness Probes
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    service: 'MediCare-Backend-API',
    version: '1.0.0',
  });
});

// Mount Routes
app.use('/api/medicines', medicineRoutes);
app.use('/api/diary', diaryRoutes);

// Root Welcome Endpoint
app.get('/', (req, res) => {
  res.json({
    project: 'MediCare – Medicine Reminder & Health Diary API',
    endpoints: {
      health: '/api/health',
      medicines: '/api/medicines',
      doseLogs: '/api/medicines/doses/logs',
      diary: '/api/diary',
    },
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start Server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`===============================================`);
    console.log(` MediCare Backend API running on port ${PORT}`);
    console.log(` Healthcheck: http://localhost:${PORT}/api/health`);
    console.log(`===============================================`);
  });
}

module.exports = app;
