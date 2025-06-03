// src/models/clienteModel.js
const db = require("../config/db")

const ClienteModel = {
  findAll: async () => {
    const [rows] = await db.query("SELECT * FROM cliente")
    return rows
  },

  findById: async (id) => {
    const [rows] = await db.query("SELECT * FROM cliente WHERE id = ?", [id])
    return rows[0]
  },

  findByDocumento: async (documento) => {
    const [rows] = await db.query("SELECT * FROM cliente WHERE documento = ?", [documento])
    return rows[0]
  },

  findByEmail: async (correo) => {
    const [rows] = await db.query("SELECT * FROM cliente WHERE correo = ?", [correo])
    return rows[0]
  },

  create: async (data) => {
    const { nombre, apellido, direccion, tipo_documento, documento, correo, telefono, estado } = data
    const [result] = await db.query(
      "INSERT INTO cliente (nombre, apellido, direccion, tipo_documento, documento, correo, telefono, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [nombre, apellido, direccion, tipo_documento, documento, correo, telefono, estado || "Activo"],
    )
    return result.insertId
  },

  update: async (id, data) => {
    const { nombre, apellido, direccion, tipo_documento, documento, correo, telefono, estado } = data
    await db.query(
      "UPDATE cliente SET nombre = ?, apellido = ?, direccion = ?, tipo_documento = ?, documento = ?, correo = ?, telefono = ?, estado = ? WHERE id = ?",
      [nombre, apellido, direccion, tipo_documento, documento, correo, telefono, estado, id],
    )
  },

  delete: async (id) => {
    await db.query("DELETE FROM cliente WHERE id = ?", [id])
  },

  cambiarEstado: async (id, estado) => {
    await db.query("UPDATE cliente SET estado = ? WHERE id = ?", [estado, id])
  },
}

module.exports = ClienteModel
