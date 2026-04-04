require('dotenv').config();
const express = require('express');
const pool = require('./config/db');

const usersRouter = require('./routes/users');
const listingsRouter = require('./routes/listings');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/api/users', usersRouter);
app.use('/api/listings', listingsRouter);

app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', db: 'connected' });
  } catch (err) {
    res.status(503).json({ status: 'error', db: 'disconnected', message: err.message });
  }
});

async function start() {
  try {
    await pool.query('SELECT 1');
    console.log('Database connected');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to connect to database:', err.message);
    process.exit(1);
  }
}

start();
