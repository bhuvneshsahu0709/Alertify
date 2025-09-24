const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const reminderScheduler = require('./services/ReminderScheduler');
require('dotenv').config();

const app = express();

// Connect Database
connectDB();

// Initialize Middlewares
const allowedOrigin = process.env.CORS_ORIGIN || '*';
app.use(cors({ origin: allowedOrigin }));
app.use(express.json({ extended: false }));

// Define Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/users', require('./routes/users'));
app.use('/api/analytics', require('./routes/analytics'));

// Start Reminder Scheduler
reminderScheduler.start();

const PORT = process.env.PORT || 5001;

// In production, serve frontend build
if (process.env.NODE_ENV === 'production') {
  const clientDist = path.resolve(__dirname, '..', 'frontend', 'dist');
  if (fs.existsSync(clientDist)) {
    app.use(express.static(clientDist));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(clientDist, 'index.html'));
    });
  } else {
    console.log('Frontend dist not found. Serving API only.');
  }
}

app.listen(PORT, () => console.log(`Server started on port ${PORT} ✅`));

// Seed Data (optional, controlled via SEED_ON_START=true)
if (process.env.SEED_ON_START === 'true') {
  const seed = require('./seed');
  seed();
}
