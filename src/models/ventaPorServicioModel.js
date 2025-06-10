// src/models/ventaPorServicioModel.js
const db = require("../config/db")

const VentaPorServicioModel = {
  findByVenta: async (ventaId) => {
    const [rows] = await db.query(
      `
      SELECT vps.*, 
             s.nombre AS servicio_nombre,
             s.descripcion AS servicio_descripcion,
             s.precio AS servicio_precio
      FROM venta_por_servicio vps
      JOIN servicio s ON vps.servicio_id = s.id
      WHERE vps.venta_id = ?
    `,
      [ventaId],
    )
    return rows
  },

  findById: async (id) => {
    const [rows] = await db.query(
      `
      SELECT vps.*, 
             s.nombre AS servicio_nombre,
             s.descripcion AS servicio_descripcion,
             s.precio AS servicio_precio
      FROM venta_por_servicio vps
      JOIN servicio s ON vps.servicio_id = s.id
      WHERE vps.id = ?
    `,
      [id],
    )
    return rows[0]
  },

  create: async (data) => {
    const { venta_id, servicio_id, subtotal } = data
    const [result] = await db.query(
      "INSERT INTO venta_por_servicio (venta_id, servicio_id, subtotal) VALUES (?, ?, ?)",
      [venta_id, servicio_id, subtotal],
    )
    return result.insertId
  },

  update: async (id, data) => {
    const { subtotal } = data
    await db.query("UPDATE venta_por_servicio SET subtotal = ? WHERE id = ?", [subtotal, id])
  },

  delete: async (id) => {
    await db.query("DELETE FROM venta_por_servicio WHERE id = ?", [id])
  },

  deleteByVenta: async (ventaId) => {
    await db.query("DELETE FROM venta_por_servicio WHERE venta_id = ?", [ventaId])
  },
}

module.exports = VentaPorServicioModel
