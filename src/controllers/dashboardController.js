// src/controllers/dashboardController.js
const DashboardService = require('../services/dashboardService');

const DashboardController = {
  async getEstadisticas(req, res) {
    try {
      const estadisticas = await DashboardService.obtenerEstadisticas();
      res.json(estadisticas);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener las estadísticas del dashboard' });
    }
  },

  async getServiciosActivos(req, res) {
    try {
      const servicios = await DashboardService.obtenerServiciosActivos();
      res.json(servicios);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los servicios activos' });
    }
  },

  async getRepuestosBajoStock(req, res) {
    try {
      const limite = req.query.limite || 10; // cantidad mínima considerada como "bajo stock"
      const repuestos = await DashboardService.obtenerRepuestosBajoStock(limite);
      res.json(repuestos);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los repuestos con bajo stock' });
    }
  },

  async getComprasRecientes(req, res) {
    try {
      const limite = req.query.limite || 5; // últimas 5 compras
      const compras = await DashboardService.obtenerComprasRecientes(limite);
      res.json(compras);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener las compras recientes' });
    }
  }
};

module.exports = DashboardController;
