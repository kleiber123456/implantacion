// src/models/horarioModel.js
const db = require('../config/db');

const HorarioModel = {
  findAll: async () => {
    const [rows] = await db.query('SELECT * FROM horario ORDER BY fecha DESC, hora_inicio');
    return rows;
  },

  findById: async (id) => {
    const [rows] = await db.query('SELECT * FROM horario WHERE id = ?', [id]);
    return rows[0];
  },

  findByFecha: async (fecha) => {
    const [rows] = await db.query(
      'SELECT * FROM horario WHERE fecha = ? ORDER BY hora_inicio',
      [fecha]
    );
    return rows;
  },

  findByDateRange: async (fechaInicio, fechaFin) => {
    const [rows] = await db.query(
      'SELECT * FROM horario WHERE fecha BETWEEN ? AND ? ORDER BY fecha, hora_inicio',
      [fechaInicio, fechaFin]
    );
    return rows;
  },

  create: async (data) => {
    const { fecha, hora_inicio, hora_fin } = data;
    const [result] = await db.query(
      'INSERT INTO horario (fecha, hora_inicio, hora_fin) VALUES (?, ?, ?)',
      [fecha, hora_inicio, hora_fin]
    );
    return result.insertId;
  },

  update: async (id, data) => {
    const { fecha, hora_inicio, hora_fin } = data;
    await db.query(
      'UPDATE horario SET fecha = ?, hora_inicio = ?, hora_fin = ? WHERE id = ?',
      [fecha, hora_inicio, hora_fin, id]
    );
  },

  delete: async (id) => {
    await db.query('DELETE FROM horario WHERE id = ?', [id]);
  }
};

module.exports = HorarioModel;
