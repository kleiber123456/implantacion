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
    return rows[0];
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
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      const { nombre, apellido, tipo_documento, documento, correo, telefono, direccion, estado, rol_id } = usuario;
      const [userData] = await connection.query('SELECT rol_id FROM usuario WHERE id = ?', [id]);
      const rolActual = userData[0]?.rol_id;

      await connection.query(
        `UPDATE usuario SET nombre = ?, apellido = ?, tipo_documento = ?, documento = ?, correo = ?, telefono = ?, direccion = ?, estado = ?, rol_id = ? WHERE id = ?`,
        [nombre, apellido, tipo_documento, documento, correo, telefono, direccion, estado, rol_id, id]
      );

      if (rolActual === 2 && rol_id === 2) {
        await connection.query(
          `UPDATE cliente SET nombre = ?, apellido = ?, tipo_documento = ?, documento = ?, correo = ?, telefono = ?, direccion = ?, estado = ? WHERE id = ?`,
          [nombre, apellido, tipo_documento, documento, correo, telefono, direccion, estado, id]
        );
      } else if (rolActual === 3 && rol_id === 3) {
        await connection.query(
          `UPDATE mecanico SET nombre = ?, apellido = ?, tipo_documento = ?, documento = ?, telefono = ?, direccion = ?, estado = ? WHERE id = ?`,
          [nombre, apellido, tipo_documento, documento, telefono, direccion, estado, id]
        );
      } else if (rolActual !== rol_id) {
        if (rol_id === 2) {
          await connection.query(
            `INSERT INTO cliente (id, nombre, apellido, direccion, tipo_documento, documento, correo, telefono, estado) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE 
             nombre = VALUES(nombre), apellido = VALUES(apellido), direccion = VALUES(direccion),
             tipo_documento = VALUES(tipo_documento), documento = VALUES(documento), correo = VALUES(correo),
             telefono = VALUES(telefono), estado = VALUES(estado)`,
            [id, nombre, apellido, direccion, tipo_documento, documento, correo, telefono, estado]
          );
        }

        if (rol_id === 3) {
          const [horarioResult] = await connection.query(
            'INSERT INTO horario (fecha, hora_inicio, hora_fin) VALUES (CURDATE(), "08:00:00", "17:00:00")',
            []
          );
          const horarioId = horarioResult.insertId;

          await connection.query(
            `INSERT INTO mecanico (id, nombre, apellido, tipo_documento, documento, direccion, telefono, telefono_emergencia, estado, horario_id) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE 
             nombre = VALUES(nombre), apellido = VALUES(apellido), tipo_documento = VALUES(tipo_documento),
             documento = VALUES(documento), direccion = VALUES(direccion), telefono = VALUES(telefono),
             telefono_emergencia = VALUES(telefono_emergencia), estado = VALUES(estado)`,
            [id, nombre, apellido, tipo_documento, documento, direccion, telefono, telefono, estado, horarioId]
          );
        }
      }

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  async delete(id) {
    await db.query('DELETE FROM usuario WHERE id = ?', [id]);
  },

  async updatePassword(id, password) {
    await db.query('UPDATE usuario SET password = ? WHERE id = ?', [password, id]);
  },

  async cambiarEstado(id, estado) {
    await db.query('UPDATE usuario SET estado = ? WHERE id = ?', [estado, id]);
    await db.query('UPDATE cliente SET estado = ? WHERE id = ?', [estado, id]);
    await db.query('UPDATE mecanico SET estado = ? WHERE id = ?', [estado, id]);
  }
};

module.exports = UsuarioModel;
