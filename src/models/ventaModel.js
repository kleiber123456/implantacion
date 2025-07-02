// src/models/ventaModel.js
const db = require("../config/db")

const VentaModel = {
  findAll: async () => {
    const [rows] = await db.query(`
      SELECT v.*, 
             c.nombre AS cliente_nombre, 
             c.apellido AS cliente_apellido,
             c.documento AS cliente_documento,
             c.tipo_documento AS cliente_tipo_documento,
             ev.nombre AS estado_nombre,
             m.nombre AS mecanico_nombre,
             m.apellido AS mecanico_apellido,
             -- Información de la cita vinculada si existe
             ci.id AS cita_id,
             ci.fecha AS cita_fecha,
             ci.hora AS cita_hora,
             vh.placa AS vehiculo_placa,
             vh.color AS vehiculo_color,
             r.nombre AS referencia_nombre,
             ma.nombre AS marca_nombre
      FROM venta v 
      JOIN cliente c ON v.cliente_id = c.id
      JOIN estado_venta ev ON v.estado_venta_id = ev.id
      LEFT JOIN mecanico m ON v.mecanico_id = m.id
      LEFT JOIN venta_cita vc ON v.id = vc.venta_id
      LEFT JOIN cita ci ON vc.cita_id = ci.id
      LEFT JOIN vehiculo vh ON ci.vehiculo_id = vh.id
      LEFT JOIN referencia r ON vh.referencia_id = r.id
      LEFT JOIN marca ma ON r.marca_id = ma.id
      ORDER BY v.fecha DESC
    `)
    return rows
  },

  findById: async (id) => {
    const [rows] = await db.query(
      `
      SELECT v.*, 
             c.nombre AS cliente_nombre, 
             c.apellido AS cliente_apellido,
             c.documento AS cliente_documento,
             c.tipo_documento AS cliente_tipo_documento,
             c.correo AS cliente_correo,
             c.telefono AS cliente_telefono,
             ev.nombre AS estado_nombre,
             m.nombre AS mecanico_nombre,
             m.apellido AS mecanico_apellido,
             -- Información de la cita vinculada si existe
             ci.id AS cita_id,
             ci.fecha AS cita_fecha,
             ci.hora AS cita_hora,
             vh.placa AS vehiculo_placa,
             vh.color AS vehiculo_color,
             r.nombre AS referencia_nombre,
             ma.nombre AS marca_nombre
      FROM venta v 
      JOIN cliente c ON v.cliente_id = c.id
      JOIN estado_venta ev ON v.estado_venta_id = ev.id
      LEFT JOIN mecanico m ON v.mecanico_id = m.id
      LEFT JOIN venta_cita vc ON v.id = vc.venta_id
      LEFT JOIN cita ci ON vc.cita_id = ci.id
      LEFT JOIN vehiculo vh ON ci.vehiculo_id = vh.id
      LEFT JOIN referencia r ON vh.referencia_id = r.id
      LEFT JOIN marca ma ON r.marca_id = ma.id
      WHERE v.id = ?
    `,
      [id],
    )
    return rows[0]
  },

  findByCliente: async (clienteId) => {
    const [rows] = await db.query(
      `
      SELECT v.*, 
             ev.nombre AS estado_nombre,
             m.nombre AS mecanico_nombre,
             m.apellido AS mecanico_apellido,
             -- Información de la cita vinculada si existe
             ci.id AS cita_id,
             ci.fecha AS cita_fecha,
             ci.hora AS cita_hora,
             vh.placa AS vehiculo_placa,
             vh.color AS vehiculo_color,
             r.nombre AS referencia_nombre,
             ma.nombre AS marca_nombre
      FROM venta v 
      JOIN estado_venta ev ON v.estado_venta_id = ev.id
      LEFT JOIN mecanico m ON v.mecanico_id = m.id
      LEFT JOIN venta_cita vc ON v.id = vc.venta_id
      LEFT JOIN cita ci ON vc.cita_id = ci.id
      LEFT JOIN vehiculo vh ON ci.vehiculo_id = vh.id
      LEFT JOIN referencia r ON vh.referencia_id = r.id
      LEFT JOIN marca ma ON r.marca_id = ma.id
      WHERE v.cliente_id = ?
      ORDER BY v.fecha DESC
    `,
      [clienteId],
    )
    return rows
  },

  findByEstado: async (estadoId) => {
    const [rows] = await db.query(
      `
      SELECT v.*, 
             c.nombre AS cliente_nombre, 
             c.apellido AS cliente_apellido,
             c.documento AS cliente_documento,
             c.tipo_documento AS cliente_tipo_documento,
             ev.nombre AS estado_nombre,
             m.nombre AS mecanico_nombre,
             m.apellido AS mecanico_apellido,
             -- Información de la cita vinculada si existe
             ci.id AS cita_id,
             ci.fecha AS cita_fecha,
             ci.hora AS cita_hora,
             vh.placa AS vehiculo_placa,
             vh.color AS vehiculo_color,
             r.nombre AS referencia_nombre,
             ma.nombre AS marca_nombre
      FROM venta v 
      JOIN cliente c ON v.cliente_id = c.id
      JOIN estado_venta ev ON v.estado_venta_id = ev.id
      LEFT JOIN mecanico m ON v.mecanico_id = m.id
      LEFT JOIN venta_cita vc ON v.id = vc.venta_id
      LEFT JOIN cita ci ON vc.cita_id = ci.id
      LEFT JOIN vehiculo vh ON ci.vehiculo_id = vh.id
      LEFT JOIN referencia r ON vh.referencia_id = r.id
      LEFT JOIN marca ma ON r.marca_id = ma.id
      WHERE v.estado_venta_id = ?
      ORDER BY v.fecha DESC
    `,
      [estadoId],
    )
    return rows
  },

  findByDateRange: async (fechaInicio, fechaFin) => {
    const [rows] = await db.query(
      `
      SELECT v.*, 
             c.nombre AS cliente_nombre, 
             c.apellido AS cliente_apellido,
             c.documento AS cliente_documento,
             c.tipo_documento AS cliente_tipo_documento,
             ev.nombre AS estado_nombre,
             m.nombre AS mecanico_nombre,
             m.apellido AS mecanico_apellido,
             -- Información de la cita vinculada si existe
             ci.id AS cita_id,
             ci.fecha AS cita_fecha,
             ci.hora AS cita_hora,
             vh.placa AS vehiculo_placa,
             vh.color AS vehiculo_color,
             r.nombre AS referencia_nombre,
             ma.nombre AS marca_nombre
      FROM venta v 
      JOIN cliente c ON v.cliente_id = c.id
      JOIN estado_venta ev ON v.estado_venta_id = ev.id
      LEFT JOIN mecanico m ON v.mecanico_id = m.id
      LEFT JOIN venta_cita vc ON v.id = vc.venta_id
      LEFT JOIN cita ci ON vc.cita_id = ci.id
      LEFT JOIN vehiculo vh ON ci.vehiculo_id = vh.id
      LEFT JOIN referencia r ON vh.referencia_id = r.id
      LEFT JOIN marca ma ON r.marca_id = ma.id
      WHERE DATE(v.fecha) BETWEEN ? AND ?
      ORDER BY v.fecha DESC
    `,
      [fechaInicio, fechaFin],
    )
    return rows
  },

  create: async (data) => {
    const { fecha, cliente_id, estado_venta_id, mecanico_id, total } = data
    const [result] = await db.query(
      "INSERT INTO venta (fecha, cliente_id, estado_venta_id, mecanico_id, total) VALUES (?, ?, ?, ?, ?)",
      [fecha || new Date(), cliente_id, estado_venta_id, mecanico_id || null, total || 0],
    )
    return result.insertId
  },

  update: async (id, data) => {
    const { fecha, cliente_id, estado_venta_id, mecanico_id, total } = data
    await db.query(
      "UPDATE venta SET fecha = ?, cliente_id = ?, estado_venta_id = ?, mecanico_id = ?, total = ? WHERE id = ?",
      [fecha, cliente_id, estado_venta_id, mecanico_id || null, total, id],
    )
  },

  delete: async (id) => {
    await db.query("DELETE FROM venta WHERE id = ?", [id])
  },

  cambiarEstado: async (id, estadoId) => {
    await db.query("UPDATE venta SET estado_venta_id = ? WHERE id = ?", [estadoId, id])
  },
}

module.exports = VentaModel
