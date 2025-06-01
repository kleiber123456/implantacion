// src/models/marcaModel.js
const db = require("../config/db")

const MarcaModel = {
  findAll: async () => {
    const [rows] = await db.query("SELECT * FROM marca ORDER BY nombre")
    return rows
  },

  findById: async (id) => {
    const [rows] = await db.query("SELECT * FROM marca WHERE id = ?", [id])
    return rows[0]
  },

  create: async (data) => {
    const { nombre } = data
    const [result] = await db.query("INSERT INTO marca (nombre) VALUES (?)", [nombre])
    return result.insertId
  },

  update: async (id, data) => {
    const { nombre } = data
    await db.query("UPDATE marca SET nombre = ? WHERE id = ?", [nombre, id])
  },

  delete: async (id) => {
    await db.query("DELETE FROM marca WHERE id = ?", [id])
  },
}

module.exports = MarcaModel
