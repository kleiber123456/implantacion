// src/models/categoriaRepuestoModel.js
const db = require('../config/db');

const CategoriaRepuestoModel = {
  findAll: async () => {
    const [rows] = await db.query('SELECT * FROM categoria_repuesto');
    return rows;
  },

  findById: async (id) => {
    const [rows] = await db.query('SELECT * FROM categoria_repuesto WHERE id = ?', [id]);
    return rows[0];
  },

  create: async (data) => {
    const { nombre, estado } = data;
    const [result] = await db.query(
      'INSERT INTO categoria_repuesto (nombre, estado) VALUES (?, ?)',
      [nombre, estado || 'Activo']
    );
    return result.insertId;
  },

  update: async (id, data) => {
    const { nombre, estado } = data;
    await db.query(
      'UPDATE categoria_repuesto SET nombre = ?, estado = ? WHERE id = ?',
      [nombre, estado, id]
    );
  },

  delete: async (id) => {
    await db.query('DELETE FROM categoria_repuesto WHERE id = ?', [id]);
  },

  cambiarEstado: async (id, estado) => {
    await db.query('UPDATE categoria_repuesto SET estado = ? WHERE id = ?', [estado, id]);
  }
};

module.exports = CategoriaRepuestoModel;
