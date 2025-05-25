// src/models/proveedorModel.js
const db = require('../config/db');

const ProveedorModel = {
  findAll: async () => {
    const [rows] = await db.query('SELECT * FROM proveedor');
    return rows;
  },

  findById: async (id) => {
    const [rows] = await db.query('SELECT * FROM proveedor WHERE id = ?', [id]);
    return rows[0];
  },

  create: async (data) => {
    const { nombre, telefono, nombre_empresa, nit, direccion, estado, correo, telefono_empresa } = data;
    const [result] = await db.query(
      `INSERT INTO proveedor 
      (nombre, telefono, nombre_empresa, nit, direccion, estado, correo, telefono_empresa) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [nombre, telefono, nombre_empresa, nit, direccion, estado || 'Activo', correo, telefono_empresa]
    );
    return result.insertId;
  },

  update: async (id, data) => {
    const { nombre, telefono, nombre_empresa, nit, direccion, estado, correo, telefono_empresa } = data;
    await db.query(
      `UPDATE proveedor 
       SET nombre = ?, telefono = ?, nombre_empresa = ?, nit = ?, direccion = ?, estado = ?, correo = ?, telefono_empresa = ? 
       WHERE id = ?`,
      [nombre, telefono, nombre_empresa, nit, direccion, estado, correo, telefono_empresa, id]
    );
  },

  delete: async (id) => {
    await db.query('DELETE FROM proveedor WHERE id = ?', [id]);
  },

  async cambiarEstado(id, estado) {
    await db.query('UPDATE proveedor SET estado = ? WHERE id = ?', [estado, id]);
  }
};

module.exports = ProveedorModel;
