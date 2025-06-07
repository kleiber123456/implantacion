// src/models/estadoCitaModel.js
const db = require('../config/db');

const EstadoCitaModel = {
  findAll: async () => {
    const [rows] = await db.query('SELECT * FROM estado_cita ORDER BY nombre');
    return rows;
  },

  findById: async (id) => {
    const [rows] = await db.query('SELECT * FROM estado_cita WHERE id = ?', [id]);
    return rows[0];
  },

  create: async (data) => {
    const { nombre } = data;
    const [result] = await db.query(
      'INSERT INTO estado_cita (nombre) VALUES (?)',
      [nombre]
    );
    return result.insertId;
  },

  update: async (id, data) => {
    const { nombre } = data;
    await db.query(
      'UPDATE estado_cita SET nombre = ? WHERE id = ?',
      [nombre, id]
    );
  },

  delete: async (id) => {
    await db.query('DELETE FROM estado_cita WHERE id = ?', [id]);
  }
};

module.exports = EstadoCitaModel;
