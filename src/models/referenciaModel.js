// src/models/referenciaModel.js
const db = require("../config/db")

const ReferenciaModel = {
  findAll: async () => {
    const [rows] = await db.query(`
      SELECT r.*, m.nombre AS marca_nombre, r.tipo_vehiculo
      FROM referencia r 
      JOIN marca m ON r.marca_id = m.id 
      ORDER BY r.nombre
    `)
    return rows
  },

  findById: async (id) => {
    const [rows] = await db.query(
      `
      SELECT r.*, m.nombre AS marca_nombre, r.tipo_vehiculo
      FROM referencia r 
      JOIN marca m ON r.marca_id = m.id 
      WHERE r.id = ?
    `,
      [id],
    )
    return rows[0]
  },

  findByMarca: async (marcaId) => {
    const [rows] = await db.query(
      `
      SELECT r.*, m.nombre AS marca_nombre, r.tipo_vehiculo
      FROM referencia r 
      JOIN marca m ON r.marca_id = m.id 
      WHERE r.marca_id = ?
      ORDER BY r.nombre
    `,
      [marcaId],
    )
    return rows
  },

  create: async (data) => {
    const { nombre, descripcion, marca_id, tipo_vehiculo } = data
    const [result] = await db.query(
      "INSERT INTO referencia (nombre, descripcion, marca_id, tipo_vehiculo) VALUES (?, ?, ?, ?)",
      [nombre, descripcion, marca_id, tipo_vehiculo],
    )
    return result.insertId
  },

  update: async (id, data) => {
    const { nombre, descripcion, marca_id, tipo_vehiculo } = data
    await db.query("UPDATE referencia SET nombre = ?, descripcion = ?, marca_id = ?, tipo_vehiculo = ? WHERE id = ?", [
      nombre,
      descripcion,
      marca_id,
      tipo_vehiculo,
      id,
    ])
  },

  delete: async (id) => {
    await db.query("DELETE FROM referencia WHERE id = ?", [id])
  },
}

module.exports = ReferenciaModel
