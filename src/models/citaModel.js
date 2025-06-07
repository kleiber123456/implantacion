// src/models/citaModel.js
const db = require('../config/db');

const CitaModel = {
  findAll: async () => {
    const [rows] = await db.query(`
      SELECT c.*, 
             ec.nombre AS estado_nombre,
             v.placa AS vehiculo_placa,
             v.color AS vehiculo_color,
             v.tipo_vehiculo,
             r.nombre AS referencia_nombre,
             m.nombre AS marca_nombre,
             cl.nombre AS cliente_nombre,
             cl.apellido AS cliente_apellido,
             cl.telefono AS cliente_telefono,
             mec.nombre AS mecanico_nombre,
             mec.apellido AS mecanico_apellido
      FROM cita c
      JOIN estado_cita ec ON c.estado_cita_id = ec.id
      JOIN vehiculo v ON c.vehiculo_id = v.id
      JOIN referencia r ON v.referencia_id = r.id
      JOIN marca m ON r.marca_id = m.id
      JOIN cliente cl ON v.cliente_id = cl.id
      JOIN mecanico mec ON c.mecanico_id = mec.id
      ORDER BY c.fecha DESC, c.hora DESC
    `);
    return rows;
  },

  findById: async (id) => {
    const [rows] = await db.query(`
      SELECT c.*, 
             ec.nombre AS estado_nombre,
             v.placa AS vehiculo_placa,
             v.color AS vehiculo_color,
             v.tipo_vehiculo,
             r.nombre AS referencia_nombre,
             m.nombre AS marca_nombre,
             cl.nombre AS cliente_nombre,
             cl.apellido AS cliente_apellido,
             cl.telefono AS cliente_telefono,
             cl.correo AS cliente_correo,
             mec.nombre AS mecanico_nombre,
             mec.apellido AS mecanico_apellido,
             mec.telefono AS mecanico_telefono
      FROM cita c
      JOIN estado_cita ec ON c.estado_cita_id = ec.id
      JOIN vehiculo v ON c.vehiculo_id = v.id
      JOIN referencia r ON v.referencia_id = r.id
      JOIN marca m ON r.marca_id = m.id
      JOIN cliente cl ON v.cliente_id = cl.id
      JOIN mecanico mec ON c.mecanico_id = mec.id
      WHERE c.id = ?
    `, [id]);
    return rows[0];
  },

  findByCliente: async (clienteId) => {
    const [rows] = await db.query(`
      SELECT c.*, 
             ec.nombre AS estado_nombre,
             v.placa AS vehiculo_placa,
             mec.nombre AS mecanico_nombre,
             mec.apellido AS mecanico_apellido
      FROM cita c
      JOIN estado_cita ec ON c.estado_cita_id = ec.id
      JOIN vehiculo v ON c.vehiculo_id = v.id
      JOIN mecanico mec ON c.mecanico_id = mec.id
      WHERE v.cliente_id = ?
      ORDER BY c.fecha DESC, c.hora DESC
    `, [clienteId]);
    return rows;
  },

  findByMecanico: async (mecanicoId) => {
    const [rows] = await db.query(`
      SELECT c.*, 
             ec.nombre AS estado_nombre,
             v.placa AS vehiculo_placa,
             cl.nombre AS cliente_nombre,
             cl.apellido AS cliente_apellido
      FROM cita c
      JOIN estado_cita ec ON c.estado_cita_id = ec.id
      JOIN vehiculo v ON c.vehiculo_id = v.id
      JOIN cliente cl ON v.cliente_id = cl.id
      WHERE c.mecanico_id = ?
      ORDER BY c.fecha DESC, c.hora DESC
    `, [mecanicoId]);
    return rows;
  },

  findByFecha: async (fecha) => {
    const [rows] = await db.query(`
      SELECT c.*, 
             ec.nombre AS estado_nombre,
             v.placa AS vehiculo_placa,
             cl.nombre AS cliente_nombre,
             cl.apellido AS cliente_apellido,
             mec.nombre AS mecanico_nombre,
             mec.apellido AS mecanico_apellido
      FROM cita c
      JOIN estado_cita ec ON c.estado_cita_id = ec.id
      JOIN vehiculo v ON c.vehiculo_id = v.id
      JOIN cliente cl ON v.cliente_id = cl.id
      JOIN mecanico mec ON c.mecanico_id = mec.id
      WHERE c.fecha = ?
      ORDER BY c.hora
    `, [fecha]);
    return rows;
  },

  findByEstado: async (estadoId) => {
    const [rows] = await db.query(`
      SELECT c.*, 
             ec.nombre AS estado_nombre,
             v.placa AS vehiculo_placa,
             cl.nombre AS cliente_nombre,
             cl.apellido AS cliente_apellido,
             mec.nombre AS mecanico_nombre,
             mec.apellido AS mecanico_apellido
      FROM cita c
      JOIN estado_cita ec ON c.estado_cita_id = ec.id
      JOIN vehiculo v ON c.vehiculo_id = v.id
      JOIN cliente cl ON v.cliente_id = cl.id
      JOIN mecanico mec ON c.mecanico_id = mec.id
      WHERE c.estado_cita_id = ?
      ORDER BY c.fecha DESC, c.hora DESC
    `, [estadoId]);
    return rows;
  },

  // Verificar disponibilidad de mecánico
  checkMecanicoDisponibilidad: async (mecanicoId, fecha, hora) => {
    const [rows] = await db.query(`
      SELECT COUNT(*) as count
      FROM cita 
      WHERE mecanico_id = ? AND fecha = ? AND hora = ? AND estado_cita_id NOT IN (
        SELECT id FROM estado_cita WHERE nombre IN ('Cancelada', 'Completada')
      )
    `, [mecanicoId, fecha, hora]);
    return rows[0].count === 0;
  },

  create: async (data) => {
    const { fecha, hora, estado_cita_id, vehiculo_id, mecanico_id } = data;
    const [result] = await db.query(
      'INSERT INTO cita (fecha, hora, estado_cita_id, vehiculo_id, mecanico_id) VALUES (?, ?, ?, ?, ?)',
      [fecha, hora, estado_cita_id, vehiculo_id, mecanico_id]
    );
    return result.insertId;
  },

  update: async (id, data) => {
    const { fecha, hora, estado_cita_id, vehiculo_id, mecanico_id } = data;
    await db.query(
      'UPDATE cita SET fecha = ?, hora = ?, estado_cita_id = ?, vehiculo_id = ?, mecanico_id = ? WHERE id = ?',
      [fecha, hora, estado_cita_id, vehiculo_id, mecanico_id, id]
    );
  },

  delete: async (id) => {
    await db.query('DELETE FROM cita WHERE id = ?', [id]);
  },

  cambiarEstado: async (id, estadoId) => {
    await db.query('UPDATE cita SET estado_cita_id = ? WHERE id = ?', [estadoId, id]);
  }
};

module.exports = CitaModel;
