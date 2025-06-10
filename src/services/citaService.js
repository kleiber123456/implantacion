// src/services/citaService.js
const CitaModel = require("../models/citaModel")
const MecanicoModel = require("../models/mecanicoModel")
const VehiculoModel = require("../models/vehiculoModel")

const CitaService = {
  listar: () => CitaModel.findAll(),

  obtener: (id) => CitaModel.findById(id),

  obtenerPorCliente: (clienteId) => CitaModel.findByCliente(clienteId),

  obtenerPorMecanico: (mecanicoId) => CitaModel.findByMecanico(mecanicoId),

  obtenerPorFecha: (fecha) => CitaModel.findByFecha(fecha),

  obtenerPorEstado: (estadoId) => CitaModel.findByEstado(estadoId),

  crear: async (data) => {
    const { fecha, hora, estado_cita_id, vehiculo_id, mecanico_id } = data

    // Validaciones básicas
    if (!fecha || !hora || !estado_cita_id || !vehiculo_id || !mecanico_id) {
      throw new Error("Fecha, hora, estado, vehículo y mecánico son requeridos")
    }

    // Validar que la fecha no sea anterior a hoy
    const hoy = new Date()
    const fechaCita = new Date(fecha)
    if (fechaCita < hoy.setHours(0, 0, 0, 0)) {
      throw new Error("No se puede crear una cita para una fecha pasada")
    }

    // Validar que sea un día de trabajo (Lunes a Sábado)
    const diaSemana = fechaCita.getDay()
    if (diaSemana === 0) {
      // Domingo
      throw new Error("No se pueden crear citas los domingos")
    }

    // Validar horario de trabajo (8:00 AM - 6:00 PM)
    const horaNum = Number.parseInt(hora.split(":")[0])
    if (horaNum < 8 || horaNum >= 18) {
      throw new Error("Las citas solo se pueden crear entre las 8:00 AM y las 6:00 PM")
    }

    // Verificar que el mecánico existe y está activo
    const mecanico = await MecanicoModel.findById(mecanico_id)
    if (!mecanico) {
      throw new Error("Mecánico no encontrado")
    }
    if (mecanico.estado !== "Activo") {
      throw new Error("El mecánico no está activo")
    }

    // Verificar que el vehículo existe y está activo
    const vehiculo = await VehiculoModel.findById(vehiculo_id)
    if (!vehiculo) {
      throw new Error("Vehículo no encontrado")
    }
    if (vehiculo.estado !== "Activo") {
      throw new Error("El vehículo no está activo")
    }

    // Verificar disponibilidad del mecánico
    const disponible = await CitaModel.checkMecanicoDisponibilidad(mecanico_id, fecha, hora)
    if (!disponible) {
      throw new Error("El mecánico no está disponible en esa fecha y hora")
    }

    return CitaModel.create(data)
  },

  actualizar: async (id, data) => {
    const cita = await CitaModel.findById(id)
    if (!cita) {
      throw new Error("Cita no encontrada")
    }

    const { fecha, hora, mecanico_id, vehiculo_id } = data

    // Si se cambia la fecha, hora o mecánico, verificar disponibilidad
    if (
      (fecha && fecha !== cita.fecha) ||
      (hora && hora !== cita.hora) ||
      (mecanico_id && mecanico_id !== cita.mecanico_id)
    ) {
      const mecanicoIdFinal = mecanico_id || cita.mecanico_id
      const fechaFinal = fecha || cita.fecha
      const horaFinal = hora || cita.hora

      // Validar día de trabajo si se cambia la fecha
      if (fecha && fecha !== cita.fecha) {
        const fechaCita = new Date(fecha)
        const diaSemana = fechaCita.getDay()
        if (diaSemana === 0) {
          throw new Error("No se pueden crear citas los domingos")
        }
      }

      // Validar horario de trabajo si se cambia la hora
      if (hora && hora !== cita.hora) {
        const horaNum = Number.parseInt(hora.split(":")[0])
        if (horaNum < 8 || horaNum >= 18) {
          throw new Error("Las citas solo se pueden crear entre las 8:00 AM y las 6:00 PM")
        }
      }

      // Verificar que el mecánico existe y está activo
      const mecanico = await MecanicoModel.findById(mecanicoIdFinal)
      if (!mecanico) {
        throw new Error("Mecánico no encontrado")
      }
      if (mecanico.estado !== "Activo") {
        throw new Error("El mecánico no está activo")
      }

      // Verificar disponibilidad del mecánico (excluyendo la cita actual)
      const disponible = await CitaModel.checkMecanicoDisponibilidad(mecanicoIdFinal, fechaFinal, horaFinal)
      if (!disponible) {
        // Verificar si la cita que ocupa ese horario es la misma que estamos editando
        const citasConflicto = await CitaModel.findByMecanico(mecanicoIdFinal)
        const conflicto = citasConflicto.find(
          (c) =>
            c.fecha === fechaFinal &&
            c.hora === horaFinal &&
            c.id !== Number.parseInt(id) &&
            !["Cancelada", "Completada"].includes(c.estado_nombre),
        )

        if (conflicto) {
          throw new Error("El mecánico no está disponible en esa fecha y hora")
        }
      }
    }

    // Verificar que el vehículo existe y está activo si se está cambiando
    if (vehiculo_id && vehiculo_id !== cita.vehiculo_id) {
      const vehiculo = await VehiculoModel.findById(vehiculo_id)
      if (!vehiculo) {
        throw new Error("Vehículo no encontrado")
      }
      if (vehiculo.estado !== "Activo") {
        throw new Error("El vehículo no está activo")
      }
    }

    return CitaModel.update(id, data)
  },

  eliminar: async (id) => {
    const cita = await CitaModel.findById(id)
    if (!cita) {
      throw new Error("Cita no encontrada")
    }
    return CitaModel.delete(id)
  },

  cambiarEstado: async (id, estadoId) => {
    const cita = await CitaModel.findById(id)
    if (!cita) {
      throw new Error("Cita no encontrada")
    }

    await CitaModel.cambiarEstado(id, estadoId)
    return estadoId
  },

  // Método adicional para obtener disponibilidad de mecánicos
  obtenerDisponibilidadMecanicos: async (fecha, hora) => {
    const mecanicosActivos = await MecanicoModel.findByEstado("Activo")
    const disponibilidad = []

    // Obtener el día de la semana de la fecha
    const fechaObj = new Date(fecha)
    const diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]
    const diaSemana = diasSemana[fechaObj.getDay()]

    // Verificar si es día de trabajo (Lunes a Sábado)
    const diasTrabajo = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]
    const esDiaTrabajo = diasTrabajo.includes(diaSemana)

    for (const mecanico of mecanicosActivos) {
      let disponible = false

      if (esDiaTrabajo) {
        // Verificar si la hora está dentro del horario de trabajo (8am - 6pm)
        const horaInicio = "08:00:00"
        const horaFin = "18:00:00"

        if (hora >= horaInicio && hora <= horaFin) {
          // Verificar si no tiene cita en esa fecha y hora
          disponible = await CitaModel.checkMecanicoDisponibilidad(mecanico.id, fecha, hora)
        }
      }

      disponibilidad.push({
        mecanico_id: mecanico.id,
        nombre: `${mecanico.nombre} ${mecanico.apellido}`,
        disponible,
        motivo: !esDiaTrabajo
          ? "No es día de trabajo"
          : hora < "08:00:00" || hora > "18:00:00"
            ? "Fuera del horario de trabajo"
            : disponible
              ? "Disponible"
              : "Ocupado",
      })
    }

    return disponibilidad
  },
}

module.exports = CitaService
