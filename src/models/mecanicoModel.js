// src/models/mecanicoModel.js
const db = require('../config/db');

const MecanicoModel = {
  findAll: async () => {
    const [rows] = await db.query(`
      SELECT m.*, h.fecha, h.hora_inicio, h.hora_fin
      FROM mecanico m 
      JOIN horario h ON m.horario_id = h.id
      ORDER BY m.nombre, m.apellido
    `);
    return rows;
  },

  findById: async (id) => {
    const [rows] = await db.query(`
      SELECT m.*, h.fecha, h.hora_inicio, h.hora_fin
      FROM mecanico m 
      JOIN horario h ON m.horario_id = h.id
      WHERE m.id = ?
    `, [id]);
    return rows[0];
  },

  findByEstado: async (estado) => {
    const [rows] = await db.query(`
      SELECT m.*, h.fecha, h.hora_inicio, h.hora_fin
      FROM mecanico m 
      JOIN horario h ON m.horario_id = h.id
      WHERE m.estado = ?
      ORDER BY m.nombre, m.apellido
    `, [estado]);
    return rows;
  },

  findByDocumento: async (documento) => {
    const [rows] = await db.query('SELECT * FROM mecanico WHERE documento = ?', [documento]);
    return rows[0];
  },

  create: async (data) => {
    const { 
      nombre, apellido, tipo_documento, documento, direccion, 
      telefono, telefono_emergencia, estado, horario_id 
    } = data;
    
    const [result] = await db.query(
      `INSERT INTO mecanico 
      (nombre, apellido, tipo_documento, documento, direccion, telefono, telefono_emergencia, estado, horario_id) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [nombre, apellido, tipo_documento, documento, direccion, telefono, telefono_emergencia, estado || 'Activo', horario_id]
    );
    return result.insertId;
  },

  update: async (id, data) => {
    const { 
      nombre, apellido, tipo_documento, documento, direccion, 
      telefono, telefono_emergencia, estado, horario_id 
    } = data;
    
    await db.query(
      `UPDATE mecanico 
       SET nombre = ?, apellido = ?, tipo_documento = ?, documento = ?, direccion = ?, 
           telefono = ?, telefono_emergencia = ?, estado = ?, horario_id = ?
       WHERE id = ?`,
      [nombre, apellido, tipo_documento, documento, direccion, telefono, telefono_emergencia, estado, horario_id, id]
    );
  },

  delete: async (id) => {
    await db.query('DELETE FROM mecanico WHERE id = ?', [id]);
  },

  cambiarEstado: async (id, estado) => {
    await db.query('UPDATE mecanico SET estado = ? WHERE id = ?', [estado, id]);
  }
};

module.exports = MecanicoModel;
