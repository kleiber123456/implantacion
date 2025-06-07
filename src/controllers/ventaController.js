// src/controllers/ventaController.js
const VentaService = require('../services/ventaService');

const VentaController = {
  async listar(req, res) {
    try {
      const ventas = await VentaService.listar();
      res.json(ventas);
    } catch (error) {
      res.status(500).json({ error: 'Error al listar las ventas' });
    }
  },

  async obtener(req, res) {
    try {
      const venta = await VentaService.obtener(req.params.id);
      if (!venta) {
        return res.status(404).json({ error: 'Venta no encontrada' });
      }
      res.json(venta);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener la venta' });
    }
  },

  async obtenerPorCliente(req, res) {
    try {
      const ventas = await VentaService.obtenerPorCliente(req.params.clienteId);
      res.json(ventas);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener las ventas del cliente' });
    }
  },

  async obtenerPorEstado(req, res) {
    try {
      const ventas = await VentaService.obtenerPorEstado(req.params.estadoId);
      res.json(ventas);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener las ventas por estado' });
    }
  },

  async obtenerPorRangoFechas(req, res) {
    try {
      const { fechaInicio, fechaFin } = req.query;
      if (!fechaInicio || !fechaFin) {
        return res.status(400).json({ error: 'Fecha de inicio y fecha de fin son requeridas' });
      }
      const ventas = await VentaService.obtenerPorRangoFechas(fechaInicio, fechaFin);
      res.json(ventas);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener las ventas por rango de fechas' });
    }
  },

  async crear(req, res) {
    try {
      const id = await VentaService.crear(req.body);
      res.status(201).json({ message: 'Venta creada', id });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async actualizar(req, res) {
    try {
      await VentaService.actualizar(req.params.id, req.body);
      res.json({ message: 'Venta actualizada' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async eliminar(req, res) {
    try {
      await VentaService.eliminar(req.params.id);
      res.json({ message: 'Venta eliminada' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async cambiarEstado(req, res) {
    try {
      const nuevoEstado = await VentaService.cambiarEstado(req.params.id, req.body.estado_venta_id);
      res.json({ message: 'Estado de venta actualizado' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};

module.exports = VentaController;
