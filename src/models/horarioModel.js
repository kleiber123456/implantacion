// src/models/horarioModel.js
const db = require("../config/db")

const HorarioModel = {
  findAll: async () => {
    const [rows] = await db.query(`
      SELECT h.*, 
             m.nombre AS mecanico_nombre, 
             m.apellido AS mecanico_apellido
      FROM horario h
      JOIN mecanico m ON h.mecanico_id = m.id
      ORDER BY h.fecha DESC
    `)
    return rows
  },

  findById: async (id) => {
    const [rows] = await db.query(
      `
      SELECT h.*, 
             m.nombre AS mecanico_nombre, 
             m.apellido AS mecanico_apellido
      FROM horario h
      JOIN mecanico m ON h.mecanico_id = m.id
      WHERE h.id = ?
    `,
      [id],
    )
    return rows[0]
  },

  findByMecanico: async (mecanicoId) => {
    const [rows] = await db.query(
      `
      SELECT h.*
      FROM horario h
      WHERE h.mecanico_id = ?
      ORDER BY h.fecha DESC
    `,
      [mecanicoId],
    )
    return rows
  },

  findByFecha: async (fecha) => {
    const [rows] = await db.query(
      `
      SELECT h.*, 
             m.nombre AS mecanico_nombre, 
             m.apellido AS mecanico_apellido
      FROM horario h
      JOIN mecanico m ON h.mecanico_id = m.id
      WHERE h.fecha = ?
      ORDER BY h.mecanico_id
    `,
      [fecha],
    )
    return rows
  },

  findByDia: async (dia) => {
    const [rows] = await db.query(
      `
      SELECT h.*, 
             m.nombre AS mecanico_nombre, 
             m.apellido AS mecanico_apellido
      FROM horario h
      JOIN mecanico m ON h.mecanico_id = m.id
      WHERE h.dia = ?
      ORDER BY h.fecha DESC
    `,
      [dia],
    )
    return rows
  },

  create: async (data) => {
    const { fecha, dia, hora_inicio, hora_fin, motivo, tipo_novedad, mecanico_id } = data
    const [result] = await db.query(
      "INSERT INTO horario (fecha, dia, hora_inicio, hora_fin, motivo, tipo_novedad, mecanico_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [fecha, dia, hora_inicio, hora_fin, motivo, tipo_novedad, mecanico_id],
    )
    return result.insertId
  },

  update: async (id, data) => {
    const { fecha, dia, hora_inicio, hora_fin, motivo, tipo_novedad, mecanico_id } = data
    await db.query(
      "UPDATE horario SET fecha = ?, dia = ?, hora_inicio = ?, hora_fin = ?, motivo = ?, tipo_novedad = ?, mecanico_id = ? WHERE id = ?",
      [fecha, dia, hora_inicio, hora_fin, motivo, tipo_novedad, mecanico_id, id],
    )
  },

  delete: async (id) => {
    await db.query("DELETE FROM horario WHERE id = ?", [id])
  },

  // Verificar disponibilidad de mecánicos para una fecha y hora específicas
  verificarDisponibilidad: async (fecha, hora) => {
    // Convertir la fecha a día de la semana para verificar
    const fechaObj = new Date(fecha)
    const diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]
    const diaSemana = diasSemana[fechaObj.getDay()]

    // Si es domingo, no hay mecánicos disponibles
    if (diaSemana === "Domingo") {
      return []
    }

    // Obtener todos los mecánicos activos
    const [mecanicos] = await db.query(`
      SELECT id, nombre, apellido
      FROM mecanico
      WHERE estado = 'Activo'
    `)

    // Verificar novedades/excepciones para cada mecánico en esa fecha y hora
    const disponibles = []

    for (const mecanico of mecanicos) {
      // Buscar novedades para este mecánico en esta fecha
      const [novedades] = await db.query(
        `
        SELECT *
        FROM horario
        WHERE mecanico_id = ? AND fecha = ?
      `,
        [mecanico.id, fecha],
      )

      let disponible = true

      // Verificar si hay alguna novedad que afecte la disponibilidad
      for (const novedad of novedades) {
        // Si es una ausencia, no está disponible
        if (novedad.tipo_novedad === "Ausencia") {
          disponible = false
          break
        }

        // Si es llegada tarde y la hora solicitada es antes de la hora de inicio
        if (novedad.tipo_novedad === "Llegada Tarde" && hora < novedad.hora_inicio) {
          disponible = false
          break
        }

        // Si es salida temprana y la hora solicitada es después de la hora de fin
        if (novedad.tipo_novedad === "Salida Temprana" && hora > novedad.hora_fin) {
          disponible = false
          break
        }

        // Si es horario especial, verificar si la hora está dentro del rango
        if (novedad.tipo_novedad === "Horario Especial") {
          if (hora < novedad.hora_inicio || hora > novedad.hora_fin) {
            disponible = false
            break
          }
        }
      }

      // Verificar si ya tiene citas programadas en esa hora
      if (disponible) {
        const [citas] = await db.query(
          `
          SELECT COUNT(*) as total
          FROM cita
          WHERE mecanico_id = ? AND fecha = ? AND hora = ?
        `,
          [mecanico.id, fecha, hora],
        )

        if (citas[0].total > 0) {
          disponible = false
        }
      }

      if (disponible) {
        disponibles.push(mecanico)
      }
    }

    return disponibles
  },
}

module.exports = HorarioModel
