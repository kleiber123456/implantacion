// src/models/estadoVentaModel.js
const db = require('../config/db');

const EstadoVentaModel = {
  findAll: async () => {
    const [rows] = await db.query('SELECT * FROM estado_venta ORDER BY nombre');
    return rows;
  },

  findById: async (id) => {
    const [rows] = await db.query('SELECT * FROM estado_venta WHERE id = ?', [id]);
    return rows[0];
  },

  create: async (data) => {
    const { nombre } = data;
    const [result] = await db.query(
      'INSERT INTO estado_venta (nombre) VALUES (?)',
      [nombre]
    );
    return result.insertId;
  },

  update: async (id, data) => {
    const { nombre } = data;
    await db.query(
      'UPDATE estado_venta SET nombre = ? WHERE id = ?',
      [nombre, id]
    );
  },

  delete: async (id) => {
    await db.query('DELETE FROM estado_venta WHERE id = ?', [id]);
  }
};

module.exports = EstadoVentaModel;
