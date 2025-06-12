// src/services/horarioService.js
const HorarioModel = require("../models/horarioModel")

const HorarioService = {
  listar: () => HorarioModel.findAll(),

  obtener: (id) => HorarioModel.findById(id),

  obtenerPorMecanico: (mecanicoId) => HorarioModel.findByMecanico(mecanicoId),

  obtenerPorFecha: (fecha) => HorarioModel.findByFecha(fecha),

  obtenerPorDia: (dia) => HorarioModel.findByDia(dia),

  crear: async (data) => {
    // Validar datos requeridos
    if (!data.fecha || !data.dia || !data.motivo || !data.tipo_novedad || !data.mecanico_id) {
      throw new Error("Fecha, día, motivo, tipo de novedad y mecánico son requeridos")
    }

    // Validar que el día de la semana coincida con la fecha
    const fechaObj = new Date(data.fecha)
    const diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]
    const diaSemanaCalculado = diasSemana[fechaObj.getDay()]

    if (diaSemanaCalculado !== data.dia) {
      throw new Error(`El día ${data.dia} no coincide con la fecha ${data.fecha} que es ${diaSemanaCalculado}`)
    }

    // Validar que el tipo de novedad sea válido
    const tiposValidos = ["Ausencia", "Llegada Tarde", "Salida Temprana", "Horario Especial"]
    if (!tiposValidos.includes(data.tipo_novedad)) {
      throw new Error("Tipo de novedad no válido")
    }

    // Validar horas según el tipo de novedad
    if (data.tipo_novedad !== "Ausencia") {
      if (!data.hora_inicio || !data.hora_fin) {
        throw new Error("Hora de inicio y fin son requeridas para este tipo de novedad")
      }

      // Validar que la hora de fin sea posterior a la hora de inicio
      if (data.hora_fin <= data.hora_inicio) {
        throw new Error("La hora de fin debe ser posterior a la hora de inicio")
      }
    }

    return HorarioModel.create(data)
  },

  actualizar: async (id, data) => {
    // Verificar que el horario exista
    const horario = await HorarioModel.findById(id)
    if (!horario) {
      throw new Error("Novedad de horario no encontrada")
    }

    // Validar datos requeridos
    if (!data.fecha || !data.dia || !data.motivo || !data.tipo_novedad || !data.mecanico_id) {
      throw new Error("Fecha, día, motivo, tipo de novedad y mecánico son requeridos")
    }

    // Validar que el día de la semana coincida con la fecha
    const fechaObj = new Date(data.fecha)
    const diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]
    const diaSemanaCalculado = diasSemana[fechaObj.getDay()]

    if (diaSemanaCalculado !== data.dia) {
      throw new Error(`El día ${data.dia} no coincide con la fecha ${data.fecha} que es ${diaSemanaCalculado}`)
    }

    // Validar que el tipo de novedad sea válido
    const tiposValidos = ["Ausencia", "Llegada Tarde", "Salida Temprana", "Horario Especial"]
    if (!tiposValidos.includes(data.tipo_novedad)) {
      throw new Error("Tipo de novedad no válido")
    }

    // Validar horas según el tipo de novedad
    if (data.tipo_novedad !== "Ausencia") {
      if (!data.hora_inicio || !data.hora_fin) {
        throw new Error("Hora de inicio y fin son requeridas para este tipo de novedad")
      }

      // Validar que la hora de fin sea posterior a la hora de inicio
      if (data.hora_fin <= data.hora_inicio) {
        throw new Error("La hora de fin debe ser posterior a la hora de inicio")
      }
    }

    return HorarioModel.update(id, data)
  },

  eliminar: (id) => HorarioModel.delete(id),

  verificarDisponibilidad: (fecha, hora) => HorarioModel.verificarDisponibilidad(fecha, hora),
}

module.exports = HorarioService
