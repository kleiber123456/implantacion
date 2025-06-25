// src/models/compraPorRepuestoModel.js
const db = require("../config/db")

const CompraPorRepuestoModel = {
  findByCompra: async (compraId) => {
    const [rows] = await db.query(
      `
      SELECT cpr.*, 
             r.nombre AS repuesto_nombre,
             r.descripcion AS repuesto_descripcion,
             cr.nombre AS categoria_nombre
      FROM compras_por_repuesto cpr
      JOIN repuesto r ON cpr.repuesto_id = r.id
      JOIN categoria_repuesto cr ON r.categoria_repuesto_id = cr.id
      WHERE cpr.compras_id = ?
    `,
      [compraId],
    )
    return rows
  },

  findById: async (id) => {
    const [rows] = await db.query(
      `
      SELECT cpr.*, 
             r.nombre AS repuesto_nombre,
             r.descripcion AS repuesto_descripcion,
             cr.nombre AS categoria_nombre
      FROM compras_por_repuesto cpr
      JOIN repuesto r ON cpr.repuesto_id = r.id
      JOIN categoria_repuesto cr ON r.categoria_repuesto_id = cr.id
      WHERE cpr.id = ?
    `,
      [id],
    )
    return rows[0]
  },

  create: async (data) => {
    const { compras_id, repuesto_id, cantidad, precio_compra, precio_venta, subtotal } = data
    const [result] = await db.query(
      "INSERT INTO compras_por_repuesto (compras_id, repuesto_id, cantidad, precio_compra, precio_venta, subtotal) VALUES (?, ?, ?, ?, ?, ?)",
      [compras_id, repuesto_id, cantidad, precio_compra || 0, precio_venta || 0, subtotal],
    )
    return result.insertId
  },

  update: async (id, data) => {
    const { cantidad, precio_compra, precio_venta, subtotal } = data
    await db.query(
      "UPDATE compras_por_repuesto SET cantidad = ?, precio_compra = ?, precio_venta = ?, subtotal = ? WHERE id = ?",
      [cantidad, precio_compra, precio_venta, subtotal, id],
    )
  },

  delete: async (id) => {
    await db.query("DELETE FROM compras_por_repuesto WHERE id = ?", [id])
  },

  deleteByCompra: async (compraId) => {
    await db.query("DELETE FROM compras_por_repuesto WHERE compras_id = ?", [compraId])
  },
}

module.exports = CompraPorRepuestoModel
