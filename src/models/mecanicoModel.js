// src/models/mecanicoModel.js
const db = require("../config/db")

const MecanicoModel = {
  findAll: async () => {
    const [rows] = await db.query("SELECT * FROM mecanico")
    return rows
  },

  findById: async (id) => {
    const [rows] = await db.query("SELECT * FROM mecanico WHERE id = ?", [id])
    return rows[0]
  },

  findByEstado: async (estado) => {
    const [rows] = await db.query("SELECT * FROM mecanico WHERE estado = ?", [estado])
    return rows
  },

  create: async (data) => {
    const { nombre, apellido, tipo_documento, documento, direccion, telefono, telefono_emergencia, estado } = data
    const [result] = await db.query(
      "INSERT INTO mecanico (nombre, apellido, tipo_documento, documento, direccion, telefono, telefono_emergencia, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [nombre, apellido, tipo_documento, documento, direccion, telefono, telefono_emergencia, estado || "Activo"],
    )
    return result.insertId
  },

  update: async (id, data) => {
    const { nombre, apellido, tipo_documento, documento, direccion, telefono, telefono_emergencia, estado } = data
    await db.query(
      "UPDATE mecanico SET nombre = ?, apellido = ?, tipo_documento = ?, documento = ?, direccion = ?, telefono = ?, telefono_emergencia = ?, estado = ? WHERE id = ?",
      [nombre, apellido, tipo_documento, documento, direccion, telefono, telefono_emergencia, estado, id],
    )
  },

  delete: async (id) => {
    await db.query("DELETE FROM mecanico WHERE id = ?", [id])
  },

  cambiarEstado: async (id, estado) => {
    await db.query("UPDATE mecanico SET estado = ? WHERE id = ?", [estado, id])
  },

  // Obtener las citas asignadas a un mecánico
  getCitasByMecanico: async (mecanicoId) => {
    const [rows] = await db.query(
      `
      SELECT c.*, 
             ec.nombre AS estado_nombre,
             v.placa AS vehiculo_placa,
             cl.nombre AS cliente_nombre,
             cl.apellido AS cliente_apellido
      FROM cita c
      JOIN estado_cita ec ON c.estado_cita_id = ec.id
      JOIN vehiculo v ON c.vehiculo_id = v.id
      JOIN cliente cl ON v.cliente_id = cl.id
      WHERE c.mecanico_id = ?
      ORDER BY c.fecha DESC, c.hora
    `,
      [mecanicoId],
    )
    return rows
  },

  // Obtener las novedades/excepciones de horario de un mecánico
  getNovedadesByMecanico: async (mecanicoId) => {
    const [rows] = await db.query(
      `
      SELECT *
      FROM horario
      WHERE mecanico_id = ?
      ORDER BY fecha DESC
    `,
      [mecanicoId],
    )
    return rows
  },
}

module.exports = MecanicoModel

