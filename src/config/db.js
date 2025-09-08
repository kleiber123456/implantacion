const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// A small check to confirm the pool is ready
pool.on('connect', () => {
  console.log('Client connected to the database');
});

module.exports = pool;