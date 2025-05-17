// src/controllers/servicioController.js
const ServicioService = require('../services/servicioService');

const ServicioController = {
  async listar(req, res) {
    const servicios = await ServicioService.listar();
    res.json(servicios);
  },

  async obtener(req, res) {
    const servicio = await ServicioService.obtener(req.params.id);
    res.json(servicio);
  },

  async crear(req, res) {
    const id = await ServicioService.crear(req.body);
    res.json({ message: 'Servicio creado', id });
  },

  async actualizar(req, res) {
    await ServicioService.actualizar(req.params.id, req.body);
    res.json({ message: 'Servicio actualizado' });
  },

  async eliminar(req, res) {
    await ServicioService.eliminar(req.params.id);
    res.json({ message: 'Servicio eliminado' });
  },

  async cambiarEstado(req, res) {
    try {
      const nuevoEstado = await ServicioService.cambiarEstado(req.params.id);
      res.json({ message: `Estado actualizado a ${nuevoEstado}` });
    } catch (error) {
      res.status(500).json({ error: 'Error al cambiar el estado del servicio' });
    }
  }
};

module.exports = ServicioController;