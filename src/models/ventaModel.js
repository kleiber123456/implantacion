// src/models/ventaModel.js
const db = require('../config/db');

const VentaModel = {
  findAll: async () => {
    const [rows] = await db.query(`
      SELECT v.*, 
             c.nombre AS cliente_nombre, 
             c.apellido AS cliente_apellido,
             c.documento AS cliente_documento,
             ev.nombre AS estado_nombre,
             m.nombre AS mecanico_nombre,
             m.apellido AS mecanico_apellido
      FROM venta v 
      JOIN cliente c ON v.cliente_id = c.id
      JOIN estado_venta ev ON v.estado_venta_id = ev.id
      LEFT JOIN mecanico m ON v.mecanico_id = m.id
      ORDER BY v.fecha DESC
    `);
    return rows;
  },

  findById: async (id) => {
    const [rows] = await db.query(`
      SELECT v.*, 
             c.nombre AS cliente_nombre, 
             c.apellido AS cliente_apellido,
             c.documento AS cliente_documento,
             c.correo AS cliente_correo,
             c.telefono AS cliente_telefono,
             ev.nombre AS estado_nombre,
             m.nombre AS mecanico_nombre,
             m.apellido AS mecanico_apellido
      FROM venta v 
      JOIN cliente c ON v.cliente_id = c.id
      JOIN estado_venta ev ON v.estado_venta_id = ev.id
      LEFT JOIN mecanico m ON v.mecanico_id = m.id
      WHERE v.id = ?
    `, [id]);
    return rows[0];
  },

  findByCliente: async (clienteId) => {
    const [rows] = await db.query(`
      SELECT v.*, 
             ev.nombre AS estado_nombre,
             m.nombre AS mecanico_nombre,
             m.apellido AS mecanico_apellido
      FROM venta v 
      JOIN estado_venta ev ON v.estado_venta_id = ev.id
      LEFT JOIN mecanico m ON v.mecanico_id = m.id
      WHERE v.cliente_id = ?
      ORDER BY v.fecha DESC
    `, [clienteId]);
    return rows;
  },

  findByEstado: async (estadoId) => {
    const [rows] = await db.query(`
      SELECT v.*, 
             c.nombre AS cliente_nombre, 
             c.apellido AS cliente_apellido,
             ev.nombre AS estado_nombre,
             m.nombre AS mecanico_nombre,
             m.apellido AS mecanico_apellido
      FROM venta v 
      JOIN cliente c ON v.cliente_id = c.id
      JOIN estado_venta ev ON v.estado_venta_id = ev.id
      LEFT JOIN mecanico m ON v.mecanico_id = m.id
      WHERE v.estado_venta_id = ?
      ORDER BY v.fecha DESC
    `, [estadoId]);
    return rows;
  },

  findByDateRange: async (fechaInicio, fechaFin) => {
    const [rows] = await db.query(`
      SELECT v.*, 
             c.nombre AS cliente_nombre, 
             c.apellido AS cliente_apellido,
             ev.nombre AS estado_nombre,
             m.nombre AS mecanico_nombre,
             m.apellido AS mecanico_apellido
      FROM venta v 
      JOIN cliente c ON v.cliente_id = c.id
      JOIN estado_venta ev ON v.estado_venta_id = ev.id
      LEFT JOIN mecanico m ON v.mecanico_id = m.id
      WHERE DATE(v.fecha) BETWEEN ? AND ?
      ORDER BY v.fecha DESC
    `, [fechaInicio, fechaFin]);
    return rows;
  },

  create: async (data) => {
    const { fecha, cliente_id, estado_venta_id, mecanico_id, total } = data;
    const [result] = await db.query(
      'INSERT INTO venta (fecha, cliente_id, estado_venta_id, mecanico_id, total) VALUES (?, ?, ?, ?, ?)',
      [fecha || new Date(), cliente_id, estado_venta_id, mecanico_id || null, total || 0]
    );
    return result.insertId;
  },

  update: async (id, data) => {
    const { fecha, cliente_id, estado_venta_id, mecanico_id, total } = data;
    await db.query(
      'UPDATE venta SET fecha = ?, cliente_id = ?, estado_venta_id = ?, mecanico_id = ?, total = ? WHERE id = ?',
      [fecha, cliente_id, estado_venta_id, mecanico_id || null, total, id]
    );
  },

  delete: async (id) => {
    await db.query('DELETE FROM venta WHERE id = ?', [id]);
  },

  cambiarEstado: async (id, estadoId) => {
    await db.query('UPDATE venta SET estado_venta_id = ? WHERE id = ?', [estadoId, id]);
  }
};

module.exports = VentaModel;