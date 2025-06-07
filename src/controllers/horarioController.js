// src/controllers/horarioController.js
const HorarioService = require('../services/horarioService');

const HorarioController = {
  async listar(req, res) {
    try {
      const horarios = await HorarioService.listar();
      res.json(horarios);
    } catch (error) {
      res.status(500).json({ error: 'Error al listar los horarios' });
    }
  },

  async obtener(req, res) {
    try {
      const horario = await HorarioService.obtener(req.params.id);
      if (!horario) {
        return res.status(404).json({ error: 'Horario no encontrado' });
      }
      res.json(horario);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el horario' });
    }
  },

  async obtenerPorFecha(req, res) {
    try {
      const horarios = await HorarioService.obtenerPorFecha(req.params.fecha);
      res.json(horarios);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los horarios por fecha' });
    }
  },

  async obtenerPorRangoFechas(req, res) {
    try {
      const { fechaInicio, fechaFin } = req.query;
      if (!fechaInicio || !fechaFin) {
        return res.status(400).json({ error: 'Fecha de inicio y fecha de fin son requeridas' });
      }
      const horarios = await HorarioService.obtenerPorRangoFechas(fechaInicio, fechaFin);
      res.json(horarios);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los horarios por rango de fechas' });
    }
  },

  async crear(req, res) {
    try {
      const id = await HorarioService.crear(req.body);
      res.status(201).json({ message: 'Horario creado', id });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async actualizar(req, res) {
    try {
      await HorarioService.actualizar(req.params.id, req.body);
      res.json({ message: 'Horario actualizado' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async eliminar(req, res) {
    try {
      await HorarioService.eliminar(req.params.id);
      res.json({ message: 'Horario eliminado' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};

module.exports = HorarioController;
