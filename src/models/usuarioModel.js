// src/models/usuarioModel.js
const db = require('../config/db');

const UsuarioModel = {
  async findByEmail(correo) {
    const [rows] = await db.query('SELECT * FROM usuario WHERE correo = ?', [correo]);
    return rows[0];
  },

  async create(usuario) {
    const { nombre, apellido, correo, password, Rol_id, telefono, direccion } = usuario;
    await db.query(
      'INSERT INTO usuario (nombre, apellido, correo, password, Rol_id, telefono, direccion) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [nombre, apellido, correo, password, Rol_id, telefono, direccion]
    );
  },

  async updatePassword(id, password) {
    await db.query('UPDATE usuario SET password = ? WHERE id = ?', [password, id]);
  },

  async findById(id) {
    const [rows] = await db.query('SELECT * FROM usuario WHERE id = ?', [id]);
    return rows[0];
  }
};

module.exports = UsuarioModel;


