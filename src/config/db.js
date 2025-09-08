const { Pool } = require("pg")
require("dotenv").config()

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
})

// A small check to confirm the pool is ready
pool.on("connect", () => {
  console.log("Client connected to the database")
})

const connect = async () => {
  const client = await pool.connect()

  // Add PostgreSQL-compatible transaction methods
  client.beginTransaction = async () => {
    await client.query("BEGIN")
  }

  client.commit = async () => {
    await client.query("COMMIT")
  }

  client.rollback = async () => {
    await client.query("ROLLBACK")
  }

  return client
}

module.exports = { pool, connect }
