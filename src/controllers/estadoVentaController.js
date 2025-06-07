// src/controllers/estadoVentaController.js
const EstadoVentaService = require('../services/estadoVentaService');

const EstadoVentaController = {
  async listar(req, res) {
    try {
      const estados = await EstadoVentaService.listar();
      res.json(estados);
    } catch (error) {
      res.status(500).json({ error: 'Error al listar los estados de venta' });
    }
  },

  async obtener(req, res) {
    try {
      const estado = await EstadoVentaService.obtener(req.params.id);
      if (!estado) {
        return res.status(404).json({ error: 'Estado de venta no encontrado' });
      }
      res.json(estado);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el estado de venta' });
    }
  },

  async crear(req, res) {
    try {
      const id = await EstadoVentaService.crear(req.body);
      res.status(201).json({ message: 'Estado de venta creado', id });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async actualizar(req, res) {
    try {
      await EstadoVentaService.actualizar(req.params.id, req.body);
      res.json({ message: 'Estado de venta actualizado' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async eliminar(req, res) {
    try {
      await EstadoVentaService.eliminar(req.params.id);
      res.json({ message: 'Estado de venta eliminado' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};

module.exports = EstadoVentaController;
