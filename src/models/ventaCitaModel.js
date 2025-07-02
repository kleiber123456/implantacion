// src/models/ventaCitaModel.js
const db = require("../config/db")

const VentaCitaModel = {
  // Vincular una venta con una cita
  vincular: async (ventaId, citaId, observaciones = null) => {
    const [result] = await db.query("INSERT INTO venta_cita (venta_id, cita_id, observaciones) VALUES (?, ?, ?)", [
      ventaId,
      citaId,
      observaciones,
    ])
    return result.insertId
  },

  // Obtener la cita vinculada a una venta
  obtenerCitaPorVenta: async (ventaId) => {
    const [rows] = await db.query(
      `
      SELECT vc.*, c.*, ec.nombre as estado_cita_nombre,
             v.placa as vehiculo_placa, 
             v.color as vehiculo_color,
             cl.nombre as cliente_nombre, 
             cl.apellido as cliente_apellido,
             cl.documento as cliente_documento,
             cl.tipo_documento as cliente_tipo_documento,
             m.nombre as mecanico_nombre, 
             m.apellido as mecanico_apellido,
             r.nombre as referencia_nombre,
             ma.nombre as marca_nombre
      FROM venta_cita vc
      JOIN cita c ON vc.cita_id = c.id
      JOIN estado_cita ec ON c.estado_cita_id = ec.id
      JOIN vehiculo v ON c.vehiculo_id = v.id
      JOIN cliente cl ON v.cliente_id = cl.id
      JOIN mecanico m ON c.mecanico_id = m.id
      JOIN referencia r ON v.referencia_id = r.id
      JOIN marca ma ON r.marca_id = ma.id
      WHERE vc.venta_id = ?
    `,
      [ventaId],
    )
    return rows[0]
  },

  // Obtener las ventas vinculadas a una cita
  obtenerVentasPorCita: async (citaId) => {
    const [rows] = await db.query(
      `
      SELECT vc.*, v.*, ev.nombre as estado_venta_nombre,
             cl.nombre as cliente_nombre, 
             cl.apellido as cliente_apellido,
             cl.documento as cliente_documento,
             cl.tipo_documento as cliente_tipo_documento
      FROM venta_cita vc
      JOIN venta v ON vc.venta_id = v.id
      JOIN estado_venta ev ON v.estado_venta_id = ev.id
      JOIN cliente cl ON v.cliente_id = cl.id
      WHERE vc.cita_id = ?
    `,
      [citaId],
    )
    return rows
  },

  // Desvincular venta y cita
  desvincular: async (ventaId, citaId) => {
    await db.query("DELETE FROM venta_cita WHERE venta_id = ? AND cita_id = ?", [ventaId, citaId])
  },

  // Verificar si una venta ya está vinculada a una cita
  estaVinculada: async (ventaId, citaId) => {
    const [rows] = await db.query("SELECT COUNT(*) as count FROM venta_cita WHERE venta_id = ? AND cita_id = ?", [
      ventaId,
      citaId,
    ])
    return rows[0].count > 0
  },
}

module.exports = VentaCitaModel
