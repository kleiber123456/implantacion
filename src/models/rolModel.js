// src/models/rolModel.js
const db = require('../config/db');

const RolModel = {
  async findAll() {
    const [rows] = await db.query('SELECT * FROM rol');
    return rows;
  },

  async findById(id) {
    const [rows] = await db.query('SELECT * FROM rol WHERE id = ?', [id]);
    return rows[0];
  },

  async create(rol) {
    const { nombre, descripcion, estado } = rol;
    await db.query('INSERT INTO rol (nombre, descripcion, estado) VALUES (?, ?, ?)', [nombre, descripcion, estado]);
  },

  async update(id, rol) {
    const { nombre, descripcion, estado } = rol;
    await db.query('UPDATE rol SET nombre = ?, descripcion = ?, estado = ? WHERE id = ?', [nombre, descripcion, estado, id]);
  },

  async delete(id) {
    await db.query('DELETE FROM rol WHERE id = ?', [id]);
  },

  async cambiarEstado(id, estado) {
    await db.query('UPDATE rol SET estado = ? WHERE id = ?', [estado, id]);
  },
};

module.exports = RolModel;
