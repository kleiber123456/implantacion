// src/models/historialVentaModel.js
const db = require("../config/db")

const HistorialVentaModel = {
  // Crear registro de historial de venta
  crear: async (data) => {
    const {
      venta_id,
      cita_id,
      cliente_id,
      vehiculo_id,
      mecanico_id,
      fecha_venta,
      estado_anterior,
      estado_nuevo,
      total_venta,
      observaciones,
      usuario_modificacion,
      servicios,
      repuestos,
    } = data

    const connection = await db.getConnection()
    await connection.beginTransaction()

    try {
      // Crear registro principal de historial
      const [result] = await connection.query(
        `
        INSERT INTO historial_venta 
        (venta_id, cita_id, cliente_id, vehiculo_id, mecanico_id, fecha_venta, 
         estado_anterior, estado_nuevo, total_venta, observaciones, usuario_modificacion)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
        [
          venta_id,
          cita_id,
          cliente_id,
          vehiculo_id,
          mecanico_id,
          fecha_venta,
          estado_anterior,
          estado_nuevo,
          total_venta,
          observaciones,
          usuario_modificacion,
        ],
      )

      const historialId = result.insertId

      // Guardar servicios en el historial
      if (servicios && servicios.length > 0) {
        for (const servicio of servicios) {
          await connection.query(
            `
            INSERT INTO historial_venta_servicio 
            (historial_venta_id, servicio_id, servicio_nombre, servicio_descripcion, precio_servicio, subtotal)
            VALUES (?, ?, ?, ?, ?, ?)
          `,
            [
              historialId,
              servicio.servicio_id,
              servicio.servicio_nombre,
              servicio.servicio_descripcion,
              servicio.precio_servicio,
              servicio.subtotal,
            ],
          )
        }
      }

      // Guardar repuestos en el historial
      if (repuestos && repuestos.length > 0) {
        for (const repuesto of repuestos) {
          await connection.query(
            `
            INSERT INTO historial_venta_repuesto 
            (historial_venta_id, repuesto_id, repuesto_nombre, repuesto_descripcion, 
             categoria_nombre, cantidad, precio_venta, subtotal)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `,
            [
              historialId,
              repuesto.repuesto_id,
              repuesto.repuesto_nombre,
              repuesto.repuesto_descripcion,
              repuesto.categoria_nombre,
              repuesto.cantidad,
              repuesto.precio_venta,
              repuesto.subtotal,
            ],
          )
        }
      }

      await connection.commit()
      return historialId
    } catch (error) {
      await connection.rollback()
      throw error
    } finally {
      connection.release()
    }
  },

  // Obtener historial completo de una venta
  obtenerPorVenta: async (ventaId) => {
    const [rows] = await db.query(
      `
      SELECT hv.*, 
             c.nombre as cliente_nombre, c.apellido as cliente_apellido,
             v.placa as vehiculo_placa,
             m.nombre as mecanico_nombre, m.apellido as mecanico_apellido,
             ci.fecha as fecha_cita, ci.hora as hora_cita
      FROM historial_venta hv
      JOIN cliente c ON hv.cliente_id = c.id
      LEFT JOIN vehiculo v ON hv.vehiculo_id = v.id
      LEFT JOIN mecanico m ON hv.mecanico_id = m.id
      LEFT JOIN cita ci ON hv.cita_id = ci.id
      WHERE hv.venta_id = ?
      ORDER BY hv.fecha_modificacion DESC
    `,
      [ventaId],
    )

    // Obtener servicios y repuestos para cada registro de historial
    for (const historial of rows) {
      const [servicios] = await db.query(
        `
        SELECT * FROM historial_venta_servicio WHERE historial_venta_id = ?
      `,
        [historial.id],
      )

      const [repuestos] = await db.query(
        `
        SELECT * FROM historial_venta_repuesto WHERE historial_venta_id = ?
      `,
        [historial.id],
      )

      historial.servicios = servicios
      historial.repuestos = repuestos
    }

    return rows
  },

  // Obtener historial por cliente
  obtenerPorCliente: async (clienteId) => {
    const [rows] = await db.query(
      `
      SELECT hv.*, 
             v.placa as vehiculo_placa,
             m.nombre as mecanico_nombre, m.apellido as mecanico_apellido,
             ci.fecha as fecha_cita, ci.hora as hora_cita
      FROM historial_venta hv
      LEFT JOIN vehiculo v ON hv.vehiculo_id = v.id
      LEFT JOIN mecanico m ON hv.mecanico_id = m.id
      LEFT JOIN cita ci ON hv.cita_id = ci.id
      WHERE hv.cliente_id = ?
      ORDER BY hv.fecha_modificacion DESC
    `,
      [clienteId],
    )
    return rows
  },

  // Obtener historial por vehículo
  obtenerPorVehiculo: async (vehiculoId) => {
    const [rows] = await db.query(
      `
      SELECT hv.*, 
             c.nombre as cliente_nombre, c.apellido as cliente_apellido,
             m.nombre as mecanico_nombre, m.apellido as mecanico_apellido,
             ci.fecha as fecha_cita, ci.hora as hora_cita
      FROM historial_venta hv
      JOIN cliente c ON hv.cliente_id = c.id
      LEFT JOIN mecanico m ON hv.mecanico_id = m.id
      LEFT JOIN cita ci ON hv.cita_id = ci.id
      WHERE hv.vehiculo_id = ?
      ORDER BY hv.fecha_modificacion DESC
    `,
      [vehiculoId],
    )
    return rows
  },

  // Obtener historial por rango de fechas
  obtenerPorRangoFechas: async (fechaInicio, fechaFin) => {
    const [rows] = await db.query(
      `
      SELECT hv.*, 
             c.nombre as cliente_nombre, c.apellido as cliente_apellido,
             v.placa as vehiculo_placa,
             m.nombre as mecanico_nombre, m.apellido as mecanico_apellido
      FROM historial_venta hv
      JOIN cliente c ON hv.cliente_id = c.id
      LEFT JOIN vehiculo v ON hv.vehiculo_id = v.id
      LEFT JOIN mecanico m ON hv.mecanico_id = m.id
      WHERE DATE(hv.fecha_venta) BETWEEN ? AND ?
      ORDER BY hv.fecha_modificacion DESC
    `,
      [fechaInicio, fechaFin],
    )
    return rows
  },
}

module.exports = HistorialVentaModel
