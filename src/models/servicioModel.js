// src/models/servicioModel.js
const db = require('../config/db');

const ServicioModel = {
  findAll: async () => {
    const [rows] = await db.query('SELECT * FROM servicio');
    return rows;
  },

  findById: async (id) => {
    const [rows] = await db.query('SELECT * FROM servicio WHERE id = ?', [id]);
    return rows[0];
  },

  create: async (data) => {
    const { nombre, descripcion, precio, estado } = data;
    const [result] = await db.query(
      'INSERT INTO servicio (nombre, descripcion, precio, estado) VALUES (?, ?, ?, ?)',
      [nombre, descripcion, precio, estado || 'Activo']
    );
    return result.insertId;
  },

  update: async (id, data) => {
    const { nombre, descripcion, precio, estado } = data;
    await db.query(
      'UPDATE servicio SET nombre = ?, descripcion = ?, precio = ?, estado = ? WHERE id = ?',
      [nombre, descripcion, precio, estado, id]
    );
  },

  delete: async (id) => {
    await db.query('DELETE FROM servicio WHERE id = ?', [id]);
  },

  cambiarEstado: async (id, estado) => {
    await db.query('UPDATE servicio SET estado = ? WHERE id = ?', [estado, id]);
  }
};

module.exports = ServicioModel;