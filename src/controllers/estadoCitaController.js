// src/controllers/estadoCitaController.js
const EstadoCitaService = require('../services/estadoCitaService');

const EstadoCitaController = {
  async listar(req, res) {
    try {
      const estados = await EstadoCitaService.listar();
      res.json(estados);
    } catch (error) {
      res.status(500).json({ error: 'Error al listar los estados de cita' });
    }
  },

  async obtener(req, res) {
    try {
      const estado = await EstadoCitaService.obtener(req.params.id);
      if (!estado) {
        return res.status(404).json({ error: 'Estado de cita no encontrado' });
      }
      res.json(estado);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el estado de cita' });
    }
  },

  async crear(req, res) {
    try {
      const id = await EstadoCitaService.crear(req.body);
      res.status(201).json({ message: 'Estado de cita creado', id });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async actualizar(req, res) {
    try {
      await EstadoCitaService.actualizar(req.params.id, req.body);
      res.json({ message: 'Estado de cita actualizado' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async eliminar(req, res) {
    try {
      await EstadoCitaService.eliminar(req.params.id);
      res.json({ message: 'Estado de cita eliminado' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};

module.exports = EstadoCitaController;
