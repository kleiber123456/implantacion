// src/models/usuarioModel.js
const db = require('../config/db');

const UsuarioModel = {
  async findAll() {
    const [rows] = await db.query(`
      SELECT u.*, r.nombre AS rol_nombre
      FROM usuario u
      JOIN rol r ON u.rol_id = r.id
    `);
    return rows;
  },

  async findById(id) {
    const [rows] = await db.query('SELECT * FROM usuario WHERE id = ?', [id]);
    return rows[0];
  },

  async findByEmail(correo) {
  const [rows] = await db.query(`
    SELECT u.*, r.nombre AS rol
    FROM usuario u
    JOIN rol r ON u.rol_id = r.id
    WHERE u.correo = ?
  `, [correo]);
  return rows[0];
  },

  async create(usuario) {
    const { nombre, apellido, tipo_documento, documento, correo, password, rol_id, telefono, direccion } = usuario;
    const [result] = await db.query(
      'INSERT INTO usuario (nombre, apellido, correo, tipo_documento, documento, password, rol_id, telefono, direccion) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [nombre, apellido, correo, tipo_documento, documento, password, rol_id, telefono, direccion]
    );
    return result.insertId;
  },

  async update(id, usuario) {
    const { nombre, apellido, tipo_documento, documento, correo, telefono, direccion, estado, rol_id } = usuario;
    await db.query(
      `UPDATE usuario SET nombre = ?, apellido = ?, tipo_documento = ?, documento = ?, correo = ?, telefono = ?, direccion = ?, estado = ?, rol_id = ? WHERE id = ?`,
      [nombre, apellido, tipo_documento, documento, correo, telefono, direccion, estado, rol_id, id]
    );
  },

  async delete(id) {
    await db.query('DELETE FROM usuario WHERE id = ?', [id]);
  },

  async updatePassword(id, password) {
    await db.query('UPDATE usuario SET password = ? WHERE id = ?', [password, id]);
  }
};

module.exports = UsuarioModel;