// src/models/repuestoModel.js
const db = require("../config/db")

const RepuestoModel = {
  findAll: async () => {
    const [rows] = await db.query(
      `SELECT r.*, c.nombre AS categoria_nombre 
       FROM repuesto r 
       JOIN categoria_repuesto c ON r.categoria_repuesto_id = c.id`,
    )
    return rows
  },

  findById: async (id) => {
    const [rows] = await db.query("SELECT * FROM repuesto WHERE id = ?", [id])
    return rows[0]
  },

  create: async (data) => {
    const { nombre, descripcion, cantidad, precio_venta, precio_compra, total, categoria_repuesto_id, estado } = data

    const [result] = await db.query(
      `INSERT INTO repuesto 
      (nombre, descripcion, cantidad, precio_venta, precio_compra, total, categoria_repuesto_id, estado) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nombre,
        descripcion,
        cantidad,
        precio_venta,
        precio_compra || precio_venta,
        total,
        categoria_repuesto_id,
        estado,
      ],
    )

    return result.insertId
  },

  update: async (id, data) => {
    const { nombre, descripcion, cantidad, precio_venta, precio_compra, total, categoria_repuesto_id, estado } = data

    await db.query(
      `UPDATE repuesto 
       SET nombre = ?, descripcion = ?, cantidad = ?, precio_venta = ?, precio_compra = ?, total = ?, 
           categoria_repuesto_id = ?, estado = ?
       WHERE id = ?`,
      [nombre, descripcion, cantidad, precio_venta, precio_compra, total, categoria_repuesto_id, estado, id],
    )
  },

  cambiarEstado: async (id, nuevoEstado) => {
    const [result] = await db.query("UPDATE repuesto SET estado = ? WHERE id = ?", [nuevoEstado, id])
    return result
  },

  delete: async (id) => {
    await db.query("DELETE FROM repuesto WHERE id = ?", [id])
  },
}

module.exports = RepuestoModel
