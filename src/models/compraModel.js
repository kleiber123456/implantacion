// src/models/compraModel.js
const db = require("../config/db")

const CompraModel = {
  findAll: async () => {
    const [rows] = await db.query(`
      SELECT c.*, p.nombre AS proveedor_nombre, p.nombre_empresa
      FROM compras c 
      JOIN proveedor p ON c.proveedor_id = p.id
      ORDER BY c.fecha DESC
    `)
    return rows
  },

  findById: async (id) => {
    const [rows] = await db.query(
      `
      SELECT c.*, p.nombre AS proveedor_nombre, p.nombre_empresa
      FROM compras c 
      JOIN proveedor p ON c.proveedor_id = p.id
      WHERE c.id = ?
    `,
      [id],
    )
    return rows[0]
  },

  create: async (data) => {
    const { fecha, proveedor_id, total, estado } = data
    const [result] = await db.query("INSERT INTO compras (fecha, proveedor_id, total, estado) VALUES (?, ?, ?, ?)", [
      fecha || new Date(),
      proveedor_id,
      total || 0,
      estado || "Pendiente",
    ])
    return result.insertId
  },

  update: async (id, data) => {
    const { fecha, proveedor_id, total, estado } = data
    await db.query("UPDATE compras SET fecha = ?, proveedor_id = ?, total = ?, estado = ? WHERE id = ?", [
      fecha,
      proveedor_id,
      total,
      estado,
      id,
    ])
  },

  delete: async (id) => {
    await db.query("DELETE FROM compras WHERE id = ?", [id])
  },

  cambiarEstado: async (id, estado) => {
    await db.query("UPDATE compras SET estado = ? WHERE id = ?", [estado, id])
  },
}

module.exports = CompraModel
