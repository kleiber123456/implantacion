// src/controllers/horarioController.js
const HorarioService = require("../services/horarioService")

const HorarioController = {
  async listar(req, res) {
    try {
      const horarios = await HorarioService.listar()
      res.json(horarios)
    } catch (error) {
      res.status(500).json({ error: "Error al listar los horarios" })
    }
  },

  async obtener(req, res) {
    try {
      const horario = await HorarioService.obtener(req.params.id)
      if (!horario) {
        return res.status(404).json({ error: "Horario no encontrado" })
      }
      res.json(horario)
    } catch (error) {
      res.status(500).json({ error: "Error al obtener el horario" })
    }
  },

  async obtenerPorMecanico(req, res) {
    try {
      const horarios = await HorarioService.obtenerPorMecanico(req.params.mecanicoId)
      res.json(horarios)
    } catch (error) {
      res.status(500).json({ error: "Error al obtener los horarios del mecánico" })
    }
  },

  async obtenerPorFecha(req, res) {
    try {
      const horarios = await HorarioService.obtenerPorFecha(req.params.fecha)
      res.json(horarios)
    } catch (error) {
      res.status(500).json({ error: "Error al obtener los horarios por fecha" })
    }
  },

  async obtenerPorDia(req, res) {
    try {
      const horarios = await HorarioService.obtenerPorDia(req.params.dia)
      res.json(horarios)
    } catch (error) {
      res.status(500).json({ error: "Error al obtener los horarios por día" })
    }
  },

  async crear(req, res) {
    try {
      const id = await HorarioService.crear(req.body)
      res.status(201).json({ message: "Novedad de horario creada", id })
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  },

  async actualizar(req, res) {
    try {
      await HorarioService.actualizar(req.params.id, req.body)
      res.json({ message: "Novedad de horario actualizada" })
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  },

  async eliminar(req, res) {
    try {
      await HorarioService.eliminar(req.params.id)
      res.json({ message: "Novedad de horario eliminada" })
    } catch (error) {
      res.status(500).json({ error: "Error al eliminar la novedad de horario" })
    }
  },

  async verificarDisponibilidad(req, res) {
    try {
      const { fecha, hora } = req.query
      if (!fecha || !hora) {
        return res.status(400).json({ error: "Fecha y hora son requeridas" })
      }

      const mecanicosDisponibles = await HorarioService.verificarDisponibilidad(fecha, hora)
      res.json(mecanicosDisponibles)
    } catch (error) {
      res.status(500).json({ error: "Error al verificar la disponibilidad de mecánicos" })
    }
  },
}

module.exports = HorarioController
