// src/controllers/repuestoController.js
const RepuestoService = require('../services/repuestoService');

const RepuestoController = {
  async listar(req, res) {
    const repuestos = await RepuestoService.listar();
    res.json(repuestos);
  },

  async obtener(req, res) {
    const repuesto = await RepuestoService.obtener(req.params.id);
    res.json(repuesto);
  },

  async crear(req, res) {
    const id = await RepuestoService.crear(req.body);
    res.json({ message: 'Repuesto creado', id });
  },

  async actualizar(req, res) {
    await RepuestoService.actualizar(req.params.id, req.body);
    res.json({ message: 'Repuesto actualizado' });
  },

  async eliminar(req, res) {
    await RepuestoService.eliminar(req.params.id);
    res.json({ message: 'Repuesto eliminado' });
  }
};

module.exports = RepuestoController;