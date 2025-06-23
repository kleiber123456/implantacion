// src/models/historialCitaModel.js
const db = require("../config/db")

const HistorialCitaModel = {
  // Crear registro de historial de cita
  crear: async (data) => {
    const {
      cita_id,
      venta_id,
      cliente_id,
      vehiculo_id,
      mecanico_id,
      fecha_cita,
      hora_cita,
      estado_anterior,
      estado_nuevo,
      observaciones,
      usuario_modificacion,
    } = data

    const [result] = await db.query(
      `
      INSERT INTO historial_cita 
      (cita_id, venta_id, cliente_id, vehiculo_id, mecanico_id, fecha_cita, hora_cita,
       estado_anterior, estado_nuevo, observaciones, usuario_modificacion)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [
        cita_id,
        venta_id,
        cliente_id,
        vehiculo_id,
        mecanico_id,
        fecha_cita,
        hora_cita,
        estado_anterior,
        estado_nuevo,
        observaciones,
        usuario_modificacion,
      ],
    )

    return result.insertId
  },

  // Obtener historial completo de una cita
  obtenerPorCita: async (citaId) => {
    const [rows] = await db.query(
      `
      SELECT hc.*, 
             c.nombre as cliente_nombre, c.apellido as cliente_apellido,
             v.placa as vehiculo_placa,
             m.nombre as mecanico_nombre, m.apellido as mecanico_apellido,
             ve.total as total_venta
      FROM historial_cita hc
      JOIN cliente c ON hc.cliente_id = c.id
      JOIN vehiculo v ON hc.vehiculo_id = v.id
      JOIN mecanico m ON hc.mecanico_id = m.id
      LEFT JOIN venta ve ON hc.venta_id = ve.id
      WHERE hc.cita_id = ?
      ORDER BY hc.fecha_modificacion DESC
    `,
      [citaId],
    )
    return rows
  },

  // Obtener historial por cliente
  obtenerPorCliente: async (clienteId) => {
    const [rows] = await db.query(
      `
      SELECT hc.*, 
             v.placa as vehiculo_placa,
             m.nombre as mecanico_nombre, m.apellido as mecanico_apellido,
             ve.total as total_venta
      FROM historial_cita hc
      JOIN vehiculo v ON hc.vehiculo_id = v.id
      JOIN mecanico m ON hc.mecanico_id = m.id
      LEFT JOIN venta ve ON hc.venta_id = ve.id
      WHERE hc.cliente_id = ?
      ORDER BY hc.fecha_modificacion DESC
    `,
      [clienteId],
    )
    return rows
  },

  // Obtener historial por vehículo
  obtenerPorVehiculo: async (vehiculoId) => {
    const [rows] = await db.query(
      `
      SELECT hc.*, 
             c.nombre as cliente_nombre, c.apellido as cliente_apellido,
             m.nombre as mecanico_nombre, m.apellido as mecanico_apellido,
             ve.total as total_venta
      FROM historial_cita hc
      JOIN cliente c ON hc.cliente_id = c.id
      JOIN mecanico m ON hc.mecanico_id = m.id
      LEFT JOIN venta ve ON hc.venta_id = ve.id
      WHERE hc.vehiculo_id = ?
      ORDER BY hc.fecha_modificacion DESC
    `,
      [vehiculoId],
    )
    return rows
  },
}

module.exports = HistorialCitaModel
