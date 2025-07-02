// src/controllers/dashboardController.js
const DashboardService = require("../services/dashboardService")

const DashboardController = {
  async getEstadisticas(req, res) {
    try {
      const estadisticas = await DashboardService.obtenerEstadisticas()
      res.json(estadisticas)
    } catch (error) {
      console.error("Error al obtener estadísticas:", error)
      res.status(500).json({ error: "Error al obtener las estadísticas del dashboard" })
    }
  },

  async getServiciosActivos(req, res) {
    try {
      const servicios = await DashboardService.obtenerServiciosActivos()
      res.json(servicios)
    } catch (error) {
      console.error("Error al obtener servicios activos:", error)
      res.status(500).json({ error: "Error al obtener los servicios activos" })
    }
  },

  async getRepuestosBajoStock(req, res) {
    try {
      const limite = Number.parseInt(req.query.limite) || 10
      const repuestos = await DashboardService.obtenerRepuestosBajoStock(limite)
      res.json(repuestos)
    } catch (error) {
      console.error("Error al obtener repuestos bajo stock:", error)
      res.status(500).json({ error: "Error al obtener los repuestos con bajo stock" })
    }
  },

  // ============ NUEVO: REPUESTOS CRÍTICOS ============
  async getRepuestosCriticos(req, res) {
    try {
      const repuestos = await DashboardService.obtenerRepuestosCriticos()
      res.json(repuestos)
    } catch (error) {
      console.error("Error al obtener repuestos críticos:", error)
      res.status(500).json({ error: "Error al obtener los repuestos críticos (stock = 0)" })
    }
  },

  async getComprasRecientes(req, res) {
    try {
      const limite = Number.parseInt(req.query.limite) || 5
      const compras = await DashboardService.obtenerComprasRecientes(limite)
      res.json(compras)
    } catch (error) {
      console.error("Error al obtener compras recientes:", error)
      res.status(500).json({ error: "Error al obtener las compras recientes" })
    }
  },

  async getVentasRecientes(req, res) {
    try {
      const limite = Number.parseInt(req.query.limite) || 5
      const ventas = await DashboardService.obtenerVentasRecientes(limite)
      res.json(ventas)
    } catch (error) {
      console.error("Error al obtener ventas recientes:", error)
      res.status(500).json({ error: "Error al obtener las ventas recientes" })
    }
  },

  async getCitasHoy(req, res) {
    try {
      const citas = await DashboardService.obtenerCitasHoy()
      res.json(citas)
    } catch (error) {
      console.error("Error al obtener citas de hoy:", error)
      res.status(500).json({ error: "Error al obtener las citas de hoy" })
    }
  },

  async getCitasProximasSemana(req, res) {
    try {
      const citas = await DashboardService.obtenerCitasProximasSemana()
      res.json(citas)
    } catch (error) {
      console.error("Error al obtener citas próximas:", error)
      res.status(500).json({ error: "Error al obtener las citas de la próxima semana" })
    }
  },

  async getTopServicios(req, res) {
    try {
      const limite = Number.parseInt(req.query.limite) || 5
      const servicios = await DashboardService.obtenerTopServicios(limite)
      res.json(servicios)
    } catch (error) {
      console.error("Error al obtener top servicios:", error)
      res.status(500).json({ error: "Error al obtener los servicios más vendidos" })
    }
  },

  async getTopRepuestos(req, res) {
    try {
      const limite = Number.parseInt(req.query.limite) || 5
      const repuestos = await DashboardService.obtenerTopRepuestos(limite)
      res.json(repuestos)
    } catch (error) {
      console.error("Error al obtener top repuestos:", error)
      res.status(500).json({ error: "Error al obtener los repuestos más vendidos" })
    }
  },

  async getMecanicosActivos(req, res) {
    try {
      const mecanicos = await DashboardService.obtenerMecanicosActivos()
      res.json(mecanicos)
    } catch (error) {
      console.error("Error al obtener mecánicos activos:", error)
      res.status(500).json({ error: "Error al obtener los mecánicos activos" })
    }
  },

  async getClientesFrecuentes(req, res) {
    try {
      const limite = Number.parseInt(req.query.limite) || 5
      const clientes = await DashboardService.obtenerClientesFrecuentes(limite)
      res.json(clientes)
    } catch (error) {
      console.error("Error al obtener clientes frecuentes:", error)
      res.status(500).json({ error: "Error al obtener los clientes más frecuentes" })
    }
  },

  async getTendenciasVentas(req, res) {
    try {
      const año = Number.parseInt(req.query.año) || new Date().getFullYear()
      const tendencias = await DashboardService.obtenerTendenciasVentas(año)
      res.json(tendencias)
    } catch (error) {
      console.error("Error al obtener tendencias de ventas:", error)
      res.status(500).json({ error: "Error al obtener las tendencias de ventas" })
    }
  },

  async getTendenciasCitas(req, res) {
    try {
      const año = Number.parseInt(req.query.año) || new Date().getFullYear()
      const tendencias = await DashboardService.obtenerTendenciasCitas(año)
      res.json(tendencias)
    } catch (error) {
      console.error("Error al obtener tendencias de citas:", error)
      res.status(500).json({ error: "Error al obtener las tendencias de citas" })
    }
  },

  async getTendenciasCompras(req, res) {
    try {
      const año = Number.parseInt(req.query.año) || new Date().getFullYear()
      const tendencias = await DashboardService.obtenerTendenciasCompras(año)
      res.json(tendencias)
    } catch (error) {
      console.error("Error al obtener tendencias de compras:", error)
      res.status(500).json({ error: "Error al obtener las tendencias de compras" })
    }
  },
}

module.exports = DashboardController