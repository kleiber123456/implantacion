// src/models/repuestoModel.js
const db = require('../config/db');

const RepuestoModel = {
  findAll: async () => {
    const [rows] = await db.query(
      `SELECT r.*, c.nombre AS categoria_nombre 
       FROM repuesto r 
       JOIN categoria_repuesto c ON r.categoria_repuesto_id = c.id`
    );
    return rows;
  },

  findById: async (id) => {
    const [rows] = await db.query('SELECT * FROM repuesto WHERE id = ?', [id]);
    return rows[0];
  },

  create: async (data) => {
    const { nombre, cantidad, categoria_repuesto_id } = data;
    const [result] = await db.query(
      'INSERT INTO repuesto (nombre, cantidad, categoria_repuesto_id) VALUES (?, ?, ?)',
      [nombre, cantidad, categoria_repuesto_id]
    );
    return result.insertId;
  },

  update: async (id, data) => {
    const { nombre, cantidad, categoria_repuesto_id } = data;
    await db.query(
      'UPDATE repuesto SET nombre = ?, cantidad = ?, categoria_repuesto_id = ? WHERE id = ?',
      [nombre, cantidad, categoria_repuesto_id, id]
    );
  },

  delete: async (id) => {
    await db.query('DELETE FROM repuesto WHERE id = ?', [id]);
  }
};

module.exports = RepuestoModel;